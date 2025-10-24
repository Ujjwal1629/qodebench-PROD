'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { updateProfile, checkUsernameAvailability } from '@/app/actions/settings';
import { AvatarUpload } from './avatar-upload';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
    .or(z.literal('')),
  bio: z
    .string()
    .max(500, 'Bio must be at most 500 characters')
    .optional()
    .or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileSettingsFormProps {
  initialData: {
    username: string;
    full_name: string | null;
    bio: string | null;
    avatar_url: string | null;
  };
}

export function ProfileSettingsForm({ initialData }: ProfileSettingsFormProps) {
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialData.avatar_url);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: initialData.username,
      full_name: initialData.full_name || '',
      bio: initialData.bio || '',
    },
  });

  const username = form.watch('username');

  // Check username availability with debouncing
  useEffect(() => {
    if (username === initialData.username) {
      setUsernameAvailable(null);
      return;
    }

    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsCheckingUsername(true);
      const result = await checkUsernameAvailability(username);
      setIsCheckingUsername(false);

      if (result.success) {
        setUsernameAvailable(result.available || false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username, initialData.username]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const result = await updateProfile({
        username: values.username,
        full_name: values.full_name || null,
        bio: values.bio || null,
      });

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message || 'Profile updated successfully',
        });
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Update failed',
        description:
          error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const isFormChanged =
    username !== initialData.username ||
    (form.watch('full_name') || '') !== (initialData.full_name || '') ||
    (form.watch('bio') || '') !== (initialData.bio || '');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your profile information and photo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Upload */}
            <div>
              <label className="text-sm font-medium mb-4 block">
                Profile Photo
              </label>
              <AvatarUpload
                currentAvatarUrl={avatarUrl}
                username={username}
                onAvatarChange={setAvatarUrl}
              />
            </div>

            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="johndoe"
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                      {username !== initialData.username && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {isCheckingUsername ? (
                            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                          ) : usernameAvailable === true ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : usernameAvailable === false ? (
                            <XCircle className="h-4 w-4 text-red-600" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Your unique username. Can only contain letters, numbers, and underscores.
                  </FormDescription>
                  {usernameAvailable === false && (
                    <p className="text-sm text-red-600">
                      This username is already taken
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Full Name */}
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your full name (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself..."
                      className="min-h-[100px] resize-none"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Brief description about yourself (max 500 characters)
                  </FormDescription>
                  <div className="flex justify-between items-center">
                    <FormMessage />
                    <span className="text-xs text-slate-500">
                      {(field.value?.length || 0)}/500
                    </span>
                  </div>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={form.formState.isSubmitting || !isFormChanged}
                onClick={() => form.reset()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  !isFormChanged ||
                  usernameAvailable === false
                }
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
