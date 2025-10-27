'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { OAuthButtons } from '@/components/auth/oauth-buttons';
import { PasswordStrengthIndicator } from '@/components/auth/password-strength-indicator';
import { checkUsernameAvailability, validateUsername } from '@/lib/auth';
import Link from 'next/link';

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
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const { signUp } = useAuth();
  const { toast } = useToast();

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

  const onSubmit = async (values: SignUpFormValues) => {
    try {
      await signUp(
        values.email,
        values.password,
        values.username
      );
      setRegisteredEmail(values.email);
      setIsSuccess(true);
      toast({
        title: 'Success',
        description: 'Account created successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to sign up',
        variant: 'destructive',
      });
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Registration Successful!</CardTitle>
          <CardDescription>
            Please verify your email to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
            <p className="font-semibold mb-2">Check your email</p>
            <p className="mb-2">
              We&apos;ve sent a confirmation email to <span className="font-medium">{registeredEmail}</span>
            </p>
            <p className="text-green-700">
              Please check your inbox and click the confirmation link to activate your account.
              Don&apos;t forget to check your spam folder if you don&apos;t see it within a few minutes.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center text-slate-600 w-full">
            Already confirmed?{' '}
            <Link href="/signin" className="text-brand-500 hover:text-brand-600 font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
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
            <PasswordStrengthIndicator password={password} />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
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
              {form.formState.isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
            <OAuthButtons />
            <p className="text-sm text-center text-slate-600">
              Already have an account?{' '}
              <Link href="/signin" className="text-brand-500 hover:text-brand-600 font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
