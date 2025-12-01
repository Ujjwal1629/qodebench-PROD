'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Validation schemas
const profileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    ),
  full_name: z
    .string()
    .max(100, 'Full name must be at most 100 characters')
    .optional()
    .nullable(),
  bio: z
    .string()
    .max(500, 'Bio must be at most 500 characters')
    .optional()
    .nullable(),
});

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Get current user profile
export async function getCurrentUserProfile() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    return {
      success: true,
      data: {
        ...profile,
        email: user.email,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch profile',
    };
  }
}

// Check username availability
export async function checkUsernameAvailability(username: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    // Check if username is taken by another user
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', user.id)
      .maybeSingle();

    if (error) throw error;

    return {
      success: true,
      available: !data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to check username',
    };
  }
}

// Update profile
export async function updateProfile(formData: z.infer<typeof profileSchema>) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    // Validate form data
    const validated = profileSchema.parse(formData);

    // Check username availability if username is being changed
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    if (
      currentProfile &&
      validated.username !== currentProfile.username
    ) {
      const usernameCheck = await checkUsernameAvailability(validated.username);
      if (!usernameCheck.success || !usernameCheck.available) {
        throw new Error('Username is already taken');
      }
    }

    // Update profile
    const { error } = await supabase
      .from('profiles')
      .update({
        username: validated.username,
        full_name: validated.full_name,
        bio: validated.bio,
      })
      .eq('id', user.id);

    if (error) throw error;

    revalidatePath('/settings');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update profile',
    };
  }
}

// Upload avatar
export async function uploadAvatar(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    const file = formData.get('avatar') as File;
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG and PNG images are allowed');
    }

    // Delete old avatar if exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    if (profile?.avatar_url) {
      const oldPath = profile.avatar_url.split('/').pop();
      if (oldPath) {
        await supabase.storage.from('avatars').remove([`${user.id}/${oldPath}`]);
      }
    }

    // Upload new avatar
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath);

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) throw updateError;

    revalidatePath('/settings');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: { avatar_url: publicUrl },
      message: 'Avatar updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload avatar',
    };
  }
}

// Remove avatar
export async function removeAvatar() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    // Get current avatar
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    if (profile?.avatar_url) {
      const oldPath = profile.avatar_url.split('/').pop();
      if (oldPath) {
        await supabase.storage.from('avatars').remove([`${user.id}/${oldPath}`]);
      }
    }

    // Update profile to remove avatar
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', user.id);

    if (error) throw error;

    revalidatePath('/settings');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'Avatar removed successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove avatar',
    };
  }
}

// Update email
export async function updateEmail(data: z.infer<typeof emailSchema>) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    // Validate email
    const validated = emailSchema.parse(data);

    // Update email (Supabase will send verification email)
    const { error } = await supabase.auth.updateUser({
      email: validated.email,
    });

    if (error) throw error;

    return {
      success: true,
      message:
        'Verification email sent. Please check your inbox to confirm the change.',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update email',
    };
  }
}

// Update password
export async function updatePassword(
  data: z.infer<typeof passwordSchema>
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      throw new Error('Not authenticated');
    }

    // Validate password data
    const validated = passwordSchema.parse(data);

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: validated.currentPassword,
    });

    if (signInError) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    const { error } = await supabase.auth.updateUser({
      password: validated.newPassword,
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Password updated successfully',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update password',
    };
  }
}

// Delete account
export async function deleteAccount(confirmation: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    const userId = user.id;

    // Get username for confirmation
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', userId)
      .single();

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Verify confirmation
    if (confirmation !== profile.username) {
      throw new Error('Username confirmation does not match');
    }

    // Check for service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Account deletion is not configured. Please contact support.');
    }

    // Step 1: Delete avatar from storage if exists
    if (profile.avatar_url) {
      const oldPath = profile.avatar_url.split('/').pop();
      if (oldPath) {
        await supabase.storage
          .from('avatars')
          .remove([`${userId}/${oldPath}`]);
      }
    }

    // Step 2: Delete profile data (this will cascade delete related data via foreign keys)
    const { error: profileDeleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileDeleteError) {
      console.error('Error deleting profile:', profileDeleteError);
      // Continue anyway - we still want to delete the auth user
    }

    // Step 3: Create admin client and delete user from auth
    const adminClient = createAdminClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(
      userId
    );

    if (authDeleteError) {
      console.error('Error deleting auth user:', authDeleteError);
      throw new Error('Failed to delete user account from authentication system');
    }

    // Step 4: Sign out the user
    await supabase.auth.signOut();

    return {
      success: true,
      message: 'Account deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete account',
    };
  }
}
