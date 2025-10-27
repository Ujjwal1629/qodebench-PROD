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
import { useToast } from '@/hooks/use-toast';
import { OAuthButtons } from '@/components/auth/oauth-buttons';
import { AlertCircle, Mail, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleResendConfirmation = async () => {
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: unconfirmedEmail,
      });

      if (error) throw error;

      toast({
        title: 'Email Sent',
        description: 'A new confirmation email has been sent. Please check your inbox.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to resend confirmation email',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (values: SignInFormValues) => {
    try {
      setEmailNotConfirmed(false);
      await signIn(values.email, values.password);
      toast({
        title: 'Success',
        description: 'Signed in successfully!',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';

      // Check if the error is due to unconfirmed email
      if (errorMessage.toLowerCase().includes('email not confirmed')) {
        setEmailNotConfirmed(true);
        setUnconfirmedEmail(values.email);
      } else {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }
  };

  return (
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
            {emailNotConfirmed && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-amber-900 mb-1">
                      Email Not Confirmed
                    </h4>
                    <p className="text-sm text-amber-800 mb-3">
                      Please check your email inbox and click the confirmation link we sent to{' '}
                      <span className="font-medium">{unconfirmedEmail}</span> to activate your account.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleResendConfirmation}
                        disabled={isResending}
                        className="bg-white hover:bg-amber-50 border-amber-300 text-amber-900"
                      >
                        {isResending ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            Resend Confirmation Email
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-amber-700 mt-2">
                      Don&apos;t see the email? Check your spam folder.
                    </p>
                  </div>
                </div>
              </div>
            )}
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
                    <Input
                      type="password"
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
  );
}
