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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { OAuthButtons } from '@/components/auth/oauth-buttons';
import { AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const { signIn } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    // Clear any previous messages
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await signIn(values.email, values.password);
      setSuccessMessage('Signed in successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign in';
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
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
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
                      onChange={(e) => {
                        field.onChange(e);
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
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/reset-password"
                      className="text-xs text-brand-500 hover:text-brand-600 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      placeholder="••••••••"
                      disabled={form.formState.isSubmitting}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-brand-500 hover:bg-brand-600"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
            <OAuthButtons />
            <p className="text-sm text-center text-slate-600">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-brand-500 hover:text-brand-600 font-medium">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
      </Card>
    </div>
  );
}
