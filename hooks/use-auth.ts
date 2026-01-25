'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth-store';
import { createUserProfile } from '@/lib/auth';
import type { Provider } from '@supabase/supabase-js';

export function useAuth() {
  const router = useRouter();
  const { user, loading, setUser, setLoading, clearAuth } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase, setUser]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      // Provide more user-friendly error messages
      if (error.message.toLowerCase().includes('invalid login credentials')) {
        throw new Error('Invalid email or password. If you don\'t have an account, please sign up.');
      }
      if (error.message.toLowerCase().includes('email not confirmed')) {
        throw new Error('Please verify your email address before signing in. Check your inbox for the verification link.');
      }
      throw error;
    }

    // Use hard navigation instead of client-side router.push() to ensure cookies are fully set
    // This prevents race conditions where middleware doesn't see the session on subsequent navigations
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    } else {
      router.push('/dashboard');
    }
  };

  const signUp = async (
    email: string,
    password: string,
    username?: string
  ) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          full_name: '',
        }
      }
    });

    if (error) {
      setLoading(false);
      // Provide more user-friendly error messages
      if (error.message.toLowerCase().includes('user already registered')) {
        throw new Error('This email is already registered. Please sign in or use password reset.');
      }
      throw error;
    }

    // Check if user already exists (Supabase doesn't always throw error for existing users)
    if (data?.user?.identities && data.user.identities.length === 0) {
      setLoading(false);
      throw new Error('This email is already registered. Please sign in or use password reset.');
    }

    // Profile is created automatically by the handle_new_user() trigger
    // No need to create it manually anymore!

    // No redirect here - the signup form component handles navigation
    setLoading(false);
  };

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          // Force account selection for Google
          // For GitHub, this helps clear cached sessions
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });

    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    // Sign out from Supabase (scope: 'local' clears current session only)
    await supabase.auth.signOut({ scope: 'local' });
    clearAuth();

    // Clear any cached data and force reload
    if (typeof window !== 'undefined') {
      // Clear browser history to prevent back button issues
      window.history.replaceState(null, '', '/signin');
      // Force a hard navigation to sign-in page
      window.location.href = '/signin';
    } else {
      router.push('/signin');
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithOAuth,
    resetPassword,
    signOut,
  };
}
