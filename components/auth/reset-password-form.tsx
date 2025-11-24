'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { resetPassword } = useAuth();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    // Clear previous messages
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await resetPassword(values.email);
      setSuccessMessage("We've sent a password reset link to your email address. Please check your inbox and follow the instructions.");
      form.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send reset link';
      setErrorMessage(message);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Error Message Banner */}
      {errorMessage && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex items-center justify-center gap-3">
            {errorMessage.toLowerCase().includes('security purposes') ||
             errorMessage.toLowerCase().includes('12 seconds') ? (
              <Clock className="h-5 w-5 text-red-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            )}
            <div className="text-center">
              <h4 className="text-sm font-semibold text-red-900 mb-1">
                {errorMessage.toLowerCase().includes('security purposes') ||
                 errorMessage.toLowerCase().includes('12 seconds')
                  ? 'Please Wait'
                  : 'Error'}
              </h4>
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
              <h4 className="text-sm font-semibold text-green-900 mb-1">Check Your Email</h4>
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset your password
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
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-brand-500 hover:bg-brand-600"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <p className="text-sm text-center text-slate-600">
                Remember your password?{' '}
                <Link href="/signin" className="text-brand-500 hover:text-brand-600 font-medium">
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
