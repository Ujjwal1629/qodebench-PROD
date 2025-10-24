'use client';

import { ProfileSettingsForm } from './profile-settings-form';
import { AccountSettingsForm } from './account-settings-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock } from 'lucide-react';

interface SettingsClientProps {
  profile: {
    username: string;
    full_name: string | null;
    bio: string | null;
    avatar_url: string | null;
  };
  email: string;
}

export function SettingsClient({ profile, email }: SettingsClientProps) {
  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="account" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Account
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-6">
        <ProfileSettingsForm initialData={profile} />
      </TabsContent>

      <TabsContent value="account" className="space-y-6">
        <AccountSettingsForm currentEmail={email} username={profile.username} />
      </TabsContent>
    </Tabs>
  );
}
