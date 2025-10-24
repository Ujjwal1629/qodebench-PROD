import { createClient } from '@/lib/supabase/client';
import type { ExperienceLevel } from '@/types/supabase';

/**
 * Calculate password strength score and provide feedback
 */
export function calculatePasswordStrength(password: string): {
  score: number;
  level: 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];

  if (!password) {
    return { score: 0, level: 'weak', feedback: [] };
  }

  // Length check
  if (password.length >= 8) {
    score += 25;
  } else {
    feedback.push('Use at least 8 characters');
  }

  if (password.length >= 12) {
    score += 10;
  }

  // Character variety checks
  if (/[a-z]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Add lowercase letters');
  }

  if (/[A-Z]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Add uppercase letters');
  }

  if (/[0-9]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Add numbers');
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 20;
  } else {
    feedback.push('Add special characters (!@#$%^&*)');
  }

  // Determine strength level
  let level: 'weak' | 'fair' | 'good' | 'strong';
  if (score < 40) {
    level = 'weak';
  } else if (score < 60) {
    level = 'fair';
  } else if (score < 80) {
    level = 'good';
  } else {
    level = 'strong';
  }

  return { score, level, feedback };
}

/**
 * Check if username is available
 */
export async function checkUsernameAvailability(username: string): Promise<boolean> {
  if (!username || username.length < 3) {
    return false;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single();

  // If no data found, username is available
  return !data && error?.code === 'PGRST116';
}

/**
 * Create user profile after signup
 */
export async function createUserProfile(
  userId: string,
  username: string,
  experienceLevel: ExperienceLevel
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.from('profiles').insert({
    id: userId,
    username,
    experience_level: experienceLevel,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Get user profile by user ID
 */
export async function getUserProfile(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: { username?: string; experience_level?: ExperienceLevel }
) {
  const supabase = createClient();

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Validate username format
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username) {
    return { valid: false, error: 'Username is required' };
  }

  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (username.length > 20) {
    return { valid: false, error: 'Username must be no more than 20 characters' };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }

  return { valid: true };
}
