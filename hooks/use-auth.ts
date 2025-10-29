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
      throw error;
    }

    router.push('/dashboard');
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

    // Don't redirect to dashboard - user needs to confirm email first
    // The signup form will show a success message
    setLoading(false);
  };

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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
    await supabase.auth.signOut();
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
