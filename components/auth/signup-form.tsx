'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { OAuthButtons } from '@/components/auth/oauth-buttons';
import { PasswordStrengthIndicator } from '@/components/auth/password-strength-indicator';
import { checkUsernameAvailability, validateUsername } from '@/lib/auth';
import Link from 'next/link';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const signUpSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be no more than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = form.watch('password');

  const handleUsernameBlur = async () => {
    const username = form.getValues('username');
    const validation = validateUsername(username);

    if (!validation.valid) {
      return;
    }

    setIsCheckingUsername(true);
    const isAvailable = await checkUsernameAvailability(username);
    setIsCheckingUsername(false);

    if (!isAvailable) {
      form.setError('username', {
        type: 'manual',
        message: 'Username is already taken',
      });
    }
  };

  const handleEmailBlur = async () => {
    const email = form.getValues('email');

    // Clear previous error
    setErrorMessage(null);

    // Just validate email format - we'll check existence during signup
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return;
    }
  };

  const onSubmit = async (values: SignUpFormValues) => {
    // Clear any previous messages
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await signUp(
        values.email,
        values.password,
        values.username
      );
      setSuccessMessage('Welcome to QodeBench! Your account has been created successfully.');
      // Redirect to dashboard or custom redirect after successful registration
      const destination = redirect || '/dashboard';
      setTimeout(() => router.push(destination), 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign up';
      setErrorMessage(message);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Error Message Banner */}
      {errorMessage && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex items-center justify-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div className="text-center">
              <h4 className="text-sm font-semibold text-red-900 mb-1">Error</h4>
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message Banner */}
      {successMessage && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div className="text-center">
              <h4 className="text-sm font-semibold text-green-900 mb-1">Success</h4>
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Enter your information to get started with QodeBench
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="johndoe"
                      disabled={form.formState.isSubmitting || isCheckingUsername}
                      {...field}
                      onBlur={(e) => {
                        field.onBlur();
                        handleUsernameBlur();
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    3-20 characters, letters, numbers, and underscores only
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      disabled={form.formState.isSubmitting}
                      {...field}
                      onBlur={(e) => {
                        field.onBlur();
                        handleEmailBlur();
                      }}
                      onChange={(e) => {
                        field.onChange(e);
                        // Clear messages when user starts typing
                        if (errorMessage || successMessage) {
                          setErrorMessage(null);
                          setSuccessMessage(null);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="••••••••"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <PasswordStrengthIndicator password={password} />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="••••••••"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-brand-500 hover:bg-brand-600"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
            <OAuthButtons />
            <p className="text-sm text-center text-slate-600">
              Already have an account?{' '}
              <Link
                href={redirect ? `/signin?redirect=${encodeURIComponent(redirect)}` : '/signin'}
                className="text-brand-500 hover:text-brand-600 font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
      </Card>
    </div>
  );
}
