'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { Play, Loader2, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Runs Python in the learner's own browser via Pyodide, so there is no server
// to pay for and no sandbox to secure: the code never leaves their machine.
//
// Pyodide is ~10MB on first load and then cached by the browser, so the wait
// only happens once. pytest is installed into the in-browser environment the
// first time a test run is requested.

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInstance>;
  }
}

interface PyodideInstance {
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackage: (names: string | string[]) => Promise<void>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
  FS: { writeFile: (path: string, data: string) => void };
}

const PYODIDE_VERSION = 'v0.26.4';
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;

type Status = 'idle' | 'booting' | 'ready' | 'running';

interface PythonRunnerProps {
  /** Starting code in the editor. */
  initialCode?: string;
  /** Run with pytest instead of plain python. Shows the pass/fail report. */
  pytest?: boolean;
  height?: string;
}

export function PythonRunner({
  initialCode = '',
  pytest = false,
  height = '320px',
}: PythonRunnerProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
  const [status, setStatus] = useState<Status>('idle');
  const [passed, setPassed] = useState<boolean | null>(null);
  const pyodideRef = useRef<PyodideInstance | null>(null);

  // Load Pyodide once, lazily — nobody pays the 10MB cost until they hit Run.
  const boot = useCallback(async (): Promise<PyodideInstance> => {
    if (pyodideRef.current) return pyodideRef.current;
    setStatus('booting');

    if (!window.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement('script');
        s.src = `${PYODIDE_URL}pyodide.js`;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Could not load Python. Check your connection.'));
        document.head.appendChild(s);
      });
    }

    const py = await window.loadPyodide!({ indexURL: PYODIDE_URL });
    if (pytest) {
      // micropip installs pure-Python wheels straight into the browser runtime.
      await py.loadPackage('micropip');
      await py.runPythonAsync(
        'import micropip\nawait micropip.install("pytest")'
      );
    }
    pyodideRef.current = py;
    return py;
  }, [pytest]);

  const run = async () => {
    setOutput('');
    setPassed(null);
    let buffer = '';
    try {
      const py = await boot();
      setStatus('running');

      py.setStdout({ batched: (s) => { buffer += s + '\n'; } });
      py.setStderr({ batched: (s) => { buffer += s + '\n'; } });

      if (pytest) {
        // Write the learner's code to a real file so pytest can collect it,
        // then run pytest in-process and capture its report.
        py.FS.writeFile('/test_practice.py', code);
        await py.runPythonAsync(
          'import pytest\npytest.main(["-v", "--no-header", "-p", "no:cacheprovider", "/test_practice.py"])'
        );
        setPassed(/(\d+) passed/.test(buffer) && !/failed|error/i.test(buffer));
      } else {
        await py.runPythonAsync(code);
      }

      setOutput(buffer.trim() || '(no output)');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setOutput((buffer + '\n' + msg).trim());
      setPassed(false);
    } finally {
      setStatus('ready');
    }
  };

  const reset = () => {
    setCode(initialCode);
    setOutput('');
    setPassed(null);
  };

  // Free the interpreter when the component goes away.
  useEffect(() => () => { pyodideRef.current = null; }, []);

  const busy = status === 'booting' || status === 'running';

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <CodeMirror
          value={code}
          height={height}
          theme={oneDark}
          extensions={[python()]}
          onChange={setCode}
          basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: true }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={run}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2 text-[0.8438rem] font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {status === 'booting'
            ? 'Starting Python...'
            : status === 'running'
              ? 'Running...'
              : pytest
                ? 'Run tests'
                : 'Run'}
        </button>

        {passed !== null && (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.7812rem] font-semibold',
              passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            )}
          >
            {passed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
            {passed ? 'All tests passed' : 'Tests failed'}
          </span>
        )}

        {(output || passed !== null) && (
          <button
            onClick={reset}
            className="ml-auto inline-flex items-center gap-1.5 text-[0.7812rem] font-medium text-brand-600 hover:text-brand-700"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        )}

        {status === 'booting' && (
          <span className="text-[0.75rem] text-slate-500">
            First run downloads Python (~10MB). It is cached after that.
          </span>
        )}
      </div>

      {output && (
        <pre className="max-h-72 overflow-auto rounded-xl border border-slate-200 bg-slate-900 px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-slate-100 whitespace-pre-wrap">
          {output}
        </pre>
      )}
    </div>
  );
}
