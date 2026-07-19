import { WebContainer } from '@webcontainer/api';

/**
 * Package.json configuration for Playwright sandbox
 */
export const PLAYWRIGHT_PACKAGE_JSON = JSON.stringify(
  {
    name: 'playwright-sandbox',
    version: '1.0.0',
    type: 'module',
    dependencies: {
      '@playwright/test': '^1.48.0',
    },
    devDependencies: {
      '@types/node': '^20.0.0'
    }
  },
  null,
  2
);

/**
 * Playwright configuration file content
 */
export const PLAYWRIGHT_CONFIG = `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  timeout: 30000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    navigationTimeout: 10000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
`;

/**
 * Default Playwright test template
 */
export const DEFAULT_PLAYWRIGHT_TEST = `import { test, expect } from '@playwright/test';

test('example test', async ({ page }) => {
  await page.goto('https://playwright.dev');

  // Check page title
  await expect(page).toHaveTitle(/Playwright/);

  // Find and verify heading
  const heading = page.getByRole('heading', { name: 'Playwright' });
  await expect(heading).toBeVisible();

  console.log('✅ Test passed!');
});
`;

/**
 * Initialize a WebContainer instance with Playwright pre-installed
 * This function boots the container and installs Playwright packages
 *
 * @returns Promise<WebContainer> - Initialized WebContainer instance
 */
export async function initializePlaywrightContainer(
  onProgress?: (message: string) => void
): Promise<WebContainer> {
  try {
    onProgress?.('Booting WebContainer...');
    const webcontainerInstance = await WebContainer.boot();

    onProgress?.('Mounting files...');
    // Mount package.json and playwright config
    await webcontainerInstance.mount({
      'package.json': {
        file: {
          contents: PLAYWRIGHT_PACKAGE_JSON,
        },
      },
      'playwright.config.ts': {
        file: {
          contents: PLAYWRIGHT_CONFIG,
        },
      },
    });

    onProgress?.('Installing Playwright (this may take 30-60 seconds)...');
    // Install Playwright
    const installProcess = await webcontainerInstance.spawn('npm', ['install']);

    // Stream installation output
    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          // Only log important messages
          if (data.includes('added') || data.includes('packages')) {
            onProgress?.(data.trim());
          }
        },
      })
    );

    const exitCode = await installProcess.exit;

    if (exitCode !== 0) {
      throw new Error('Failed to install Playwright packages');
    }

    onProgress?.('✅ Environment ready!');
    return webcontainerInstance;
  } catch (error) {
    console.error('Failed to initialize Playwright container:', error);
    throw error;
  }
}

/**
 * Run a Playwright test in the WebContainer
 *
 * @param webcontainer - WebContainer instance
 * @param testCode - Playwright test code to execute
 * @param onOutput - Callback for streaming output
 * @returns Promise<{ success: boolean; output: string[] }>
 */
export async function runPlaywrightTest(
  webcontainer: WebContainer,
  testCode: string,
  onOutput?: (line: string) => void
): Promise<{ success: boolean; output: string[]; executionTime: number }> {
  const output: string[] = [];
  const startTime = Date.now();

  try {
    // Mount the test file with proper extension
    await webcontainer.mount({
      'test.spec.ts': {
        file: {
          contents: testCode,
        },
      },
      'tsconfig.json': {
        file: {
          contents: JSON.stringify({
            compilerOptions: {
              module: 'ESNext',
              target: 'ES2020',
              moduleResolution: 'node',
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
              strict: false,
              skipLibCheck: true
            }
          }, null, 2)
        }
      }
    });

    // Run the test
    const testProcess = await webcontainer.spawn('npx', [
      'playwright',
      'test',
      'test.spec.ts',
      '--reporter=list',
    ]);

    // Stream output and strip ANSI escape codes
    testProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          // Strip ANSI escape codes (like [1G, [0K, etc.)
          // eslint-disable-next-line no-control-regex
          const cleanData = data.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '');
          const line = cleanData.trim();
          if (line) {
            output.push(line);
            onOutput?.(line);
          }
        },
      })
    );

    const exitCode = await testProcess.exit;
    const executionTime = Date.now() - startTime;

    return {
      success: exitCode === 0,
      output,
      executionTime,
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    output.push(`❌ Error: ${errorMessage}`);

    return {
      success: false,
      output,
      executionTime,
    };
  }
}

/**
 * Parse Playwright test output to extract meaningful information
 */
export function parseTestOutput(output: string[]): {
  passed: number;
  failed: number;
  tests: Array<{ name: string; status: 'passed' | 'failed'; duration?: string }>;
  errors: string[];
} {
  const result = {
    passed: 0,
    failed: 0,
    tests: [] as Array<{ name: string; status: 'passed' | 'failed'; duration?: string }>,
    errors: [] as string[],
  };

  for (const line of output) {
    // Match test results: "✓ test name (123ms)"
    const passMatch = line.match(/✓\s+(.+?)\s+\((\d+ms)\)/);
    if (passMatch) {
      result.passed++;
      result.tests.push({
        name: passMatch[1],
        status: 'passed',
        duration: passMatch[2],
      });
      continue;
    }

    // Match failed tests: "✗ test name"
    const failMatch = line.match(/✗\s+(.+)/);
    if (failMatch) {
      result.failed++;
      result.tests.push({
        name: failMatch[1],
        status: 'failed',
      });
      continue;
    }

    // Capture error messages
    if (line.includes('Error:') || line.includes('Expected')) {
      result.errors.push(line);
    }
  }

  return result;
}
