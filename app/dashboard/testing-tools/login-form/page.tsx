'use client';

import { useState } from 'react';
import { ToolLayout } from '../tool-layout';
import { PlaywrightRunner } from '@/components/testing-tools/playwright-runner';

const STARTER_CODE = `// Test: Login with valid credentials
await page.getByTestId('email-input').fill('admin@qodebench.com');
await page.getByTestId('password-input').fill('Test@1234');
await page.getByTestId('submit-button').click();

// Verify success
await expect(page.getByTestId('success-message')).toBeVisible();`;

export default function LoginFormTool() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState(false);

  const VALID_EMAIL = 'admin@qodebench.com';
  const VALID_PASSWORD = 'Test@1234';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email address';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStatus('loading');

    setTimeout(() => {
      if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    }, 500);
  };

  const handleReset = () => {
    setEmail('');
    setPassword('');
    setErrors({});
    setStatus('idle');
  };

  return (
    <ToolLayout
      title="Login Form"
      description="Practice form filling, validation handling, error messages, and authentication flows."
      difficulty="Beginner"
      scenarios={[
        'Fill in valid credentials (admin@qodebench.com / Test@1234) and verify success message.',
        'Submit empty form and verify both validation errors appear.',
        'Enter wrong credentials and verify error banner.',
        'Toggle password visibility and verify input type changes.',
      ]}
    >
      <div className="max-w-md mx-auto">
        {/* Success State */}
        {status === 'success' ? (
          <div className="text-center space-y-4" data-testid="success-message">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Welcome back!</h2>
            <p className="text-sm text-slate-600">You have successfully logged in.</p>
            <button
              onClick={handleReset}
              className="text-sm text-sky-600 hover:underline"
              data-testid="logout-button"
            >
              Log out and try again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" data-testid="login-form">
            <h2 className="text-xl font-bold text-slate-900 text-center mb-6">Sign In</h2>

            {/* Error Banner */}
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm" data-testid="error-banner">
                Invalid email or password. Please try again.
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                placeholder="Enter your email"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300'
                }`}
                data-testid="email-input"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600" data-testid="email-error">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                  placeholder="Enter your password"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 pr-10 ${
                    errors.password ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                  data-testid="password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  data-testid="toggle-password"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600" data-testid="password-error">{errors.password}</p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="rounded border-slate-300" data-testid="remember-checkbox" />
              <label htmlFor="remember" className="text-sm text-slate-600">Remember me</label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              data-testid="submit-button"
            >
              {status === 'loading' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" data-testid="loading-spinner" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Reset */}
            <div className="text-center">
              <button type="button" onClick={handleReset} className="text-xs text-slate-500 hover:underline" data-testid="reset-button">
                Reset form
              </button>
            </div>

            {/* Credentials hint */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500">
              <strong>Test Credentials:</strong> admin@qodebench.com / Test@1234
            </div>
          </form>
        )}
      </div>

      {/* Playwright Code Editor */}
      <PlaywrightRunner starterCode={STARTER_CODE} />
    </ToolLayout>
  );
}
