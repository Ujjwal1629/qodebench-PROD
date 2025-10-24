import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SettingsClient } from '@/components/settings/settings-client';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings } from 'lucide-react';

export const metadata = {
  title: 'Settings | QodeBench',
  description: 'Manage your account settings and preferences',
};

export default async function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-brand-100 p-2">
          <Settings className="h-6 w-6 text-brand-600" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsContent />
      </Suspense>
    </div>
  );
}

async function SettingsContent() {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  // Fetch user profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('username, full_name, bio, avatar_url')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-600">Failed to load settings. Please try again.</p>
      </div>
    );
  }

  return (
    <SettingsClient
      profile={profile}
      email={user.email || ''}
    />
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}
