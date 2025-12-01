'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function submitQuizResults(
  score: number,
  experienceLevel: 'intern' | 'junior' | 'mid' | 'senior' | null
) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Authentication required' };
    }

    // Update profile with quiz results
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        quiz_score: score,
        experience_level: experienceLevel,
        onboarding_completed: true,
        quiz_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      return { error: 'Failed to save quiz results' };
    }

    // Clear profile cache and revalidate paths for faster navigation
    const cookieStore = await cookies();
    cookieStore.delete('__profile_cache');

    // Revalidate dashboard and onboarding paths
    revalidatePath('/dashboard');
    revalidatePath('/onboarding/quiz');

    return { success: true };
  } catch (error) {
    console.error('Unexpected error in submitQuizResults:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function skipOnboarding() {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Authentication required' };
    }

    // Mark onboarding as completed without quiz score
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      return { error: 'Failed to skip onboarding' };
    }

    // Clear profile cache and revalidate paths for faster navigation
    const cookieStore = await cookies();
    cookieStore.delete('__profile_cache');

    // Revalidate dashboard and onboarding paths
    revalidatePath('/dashboard');
    revalidatePath('/onboarding/quiz');

    return { success: true };
  } catch (error) {
    console.error('Unexpected error in skipOnboarding:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function checkOnboardingStatus() {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { onboardingCompleted: false, error: 'Not authenticated' };
    }

    // Check if user has completed onboarding
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('onboarding_completed, quiz_score, experience_level')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return { onboardingCompleted: false, error: 'Failed to fetch profile' };
    }

    return {
      onboardingCompleted: profile?.onboarding_completed ?? false,
      quizScore: profile?.quiz_score ?? null,
      experienceLevel: profile?.experience_level ?? null,
    };
  } catch (error) {
    console.error('Unexpected error in checkOnboardingStatus:', error);
    return { onboardingCompleted: false, error: 'An unexpected error occurred' };
  }
}
