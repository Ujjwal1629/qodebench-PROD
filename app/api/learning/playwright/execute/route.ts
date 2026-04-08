import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, mkdir, symlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import { existsSync } from 'fs';

const execAsync = promisify(exec);

/**
 * POST /api/learning/playwright/execute
 *
 * Execute Playwright test code on the server
 * Returns test results and optional screenshots
 */
export async function POST(request: NextRequest) {
  try {
    const { code, captureScreenshot = false } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Invalid code provided' },
        { status: 400 }
      );
    }

    // Get project root (where node_modules exists)
    const projectRoot = process.cwd();
    const projectNodeModules = join(projectRoot, 'node_modules');

    if (!existsSync(projectNodeModules)) {
      return NextResponse.json(
        {
          error: 'Playwright not installed',
          details: 'Please install @playwright/test in the project'
        },
        { status: 500 }
      );
    }

    // Create temporary directory for this execution
    const executionId = randomUUID();
    const tempDir = join(tmpdir(), `playwright-${executionId}`);
    await mkdir(tempDir, { recursive: true });

    const testFilePath = join(tempDir, 'test.spec.ts');
    const screenshotPath = join(tempDir, 'screenshot.png');

    // Add screenshot capture if requested
    let codeWithScreenshot = code;
    if (captureScreenshot && !code.includes('screenshot(')) {
      // Inject screenshot before test completes
      codeWithScreenshot = code.replace(
        /}\);[\s]*$/,
        `  await page.screenshot({ path: '${screenshotPath}' });\n});`
      );
    }

    // Write test file
    await writeFile(testFilePath, codeWithScreenshot);

    // Create symlink to project's node_modules
    const tempNodeModules = join(tempDir, 'node_modules');
    try {
      await symlink(projectNodeModules, tempNodeModules, 'dir');
    } catch (e) {
      // Symlink might fail on some systems, that's okay
      console.warn('Symlink creation failed, continuing anyway');
    }

    // Create minimal package.json
    const packageJson = {
      type: 'module',
      dependencies: {
        '@playwright/test': '^1.48.0'
      }
    };
    await writeFile(
      join(tempDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Create tsconfig.json
    const tsConfig = {
      compilerOptions: {
        module: 'ESNext',
        target: 'ES2020',
        moduleResolution: 'node',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: false,
        skipLibCheck: true
      }
    };
    await writeFile(
      join(tempDir, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );

    const startTime = Date.now();

    try {
      // Execute Playwright test with NODE_PATH pointing to project node_modules
      const { stdout, stderr } = await execAsync(
        `cd "${tempDir}" && NODE_PATH="${projectNodeModules}" npx playwright test --reporter=list --timeout=30000`,
        {
          timeout: 35000, // 35 second timeout
          maxBuffer: 1024 * 1024 * 10, // 10MB buffer
          env: {
            ...process.env,
            NODE_PATH: projectNodeModules,
          }
        }
      );

      const executionTime = Date.now() - startTime;

      // Parse output
      const output = stdout + stderr;

      // Clean ANSI escape codes
      // eslint-disable-next-line no-control-regex
      const cleanOutput = output.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '');

      // Parse test results
      const passedMatch = cleanOutput.match(/(\d+) passed/);
      const failedMatch = cleanOutput.match(/(\d+) failed/);
      const passed = passedMatch ? parseInt(passedMatch[1]) : 0;
      const failed = failedMatch ? parseInt(failedMatch[1]) : 0;

      // Extract console logs
      const consoleLines = cleanOutput
        .split('\n')
        .filter(line => !line.includes('Running') && !line.includes('passed') && line.trim());

      // Read screenshot if it exists
      let screenshotBase64 = null;
      if (captureScreenshot) {
        try {
          const { readFile } = await import('fs/promises');
          const screenshotBuffer = await readFile(screenshotPath);
          screenshotBase64 = screenshotBuffer.toString('base64');
        } catch (e) {
          // Screenshot not created, that's okay
        }
      }

      // Cleanup
      await cleanup(tempDir);

      return NextResponse.json({
        success: failed === 0,
        output: consoleLines,
        results: {
          passed,
          failed,
          executionTime,
        },
        screenshot: screenshotBase64,
      });

    } catch (execError: unknown) {
      const executionTime = Date.now() - startTime;

      // Handle execution errors (test failures, timeouts, etc.)
      const error = execError as { stdout?: string; stderr?: string; message?: string };
      const errorOutput = error.stdout || error.stderr || error.message || 'Unknown error';

      // Clean ANSI codes from error
      // eslint-disable-next-line no-control-regex
      const cleanError = errorOutput.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '');

      // Parse even failed test output
      const failedMatch = cleanError.match(/(\d+) failed/);
      const passedMatch = cleanError.match(/(\d+) passed/);
      const failed = failedMatch ? parseInt(failedMatch[1]) : 1;
      const passed = passedMatch ? parseInt(passedMatch[1]) : 0;

      // Extract error lines
      const errorLines = cleanError
        .split('\n')
        .filter(line => line.trim())
        .slice(0, 20); // Limit error output

      // Cleanup
      await cleanup(tempDir);

      return NextResponse.json({
        success: false,
        output: errorLines,
        results: {
          passed,
          failed,
          executionTime,
        },
        screenshot: null,
      });
    }

  } catch (error) {
    console.error('Playwright execution error:', error);
    return NextResponse.json(
      {
        error: 'Failed to execute Playwright test',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Cleanup temporary directory
 */
async function cleanup(tempDir: string) {
  try {
    const { rm } = await import('fs/promises');
    await rm(tempDir, { recursive: true, force: true });
  } catch (e) {
    console.error('Failed to cleanup temp directory:', e);
  }
}
