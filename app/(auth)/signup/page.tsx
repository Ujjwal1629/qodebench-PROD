import { Suspense } from 'react';
import { SignUpForm } from '@/components/auth/signup-form';

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md mx-auto p-8">Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}
