import { Suspense } from 'react';
import { SignInForm } from '@/components/auth/signin-form';

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md mx-auto p-8">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
