'use client';

import { ProfileSettingsForm } from './profile-settings-form';
import { AccountSettingsForm } from './account-settings-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Crown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface SettingsClientProps {
  profile: {
    username: string;
    full_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    subscription_tier?: string;
    subscription_status?: string;
    subscription_end_date?: string | null;
    trial_ends_at?: string | null;
  };
  email: string;
}

export function SettingsClient({ profile, email }: SettingsClientProps) {
  const router = useRouter();
  const subscriptionTier = profile.subscription_tier || 'free';
  const isPremium = subscriptionTier !== 'free';

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="account" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Account
        </TabsTrigger>
        <TabsTrigger value="subscription" className="flex items-center gap-2">
          <Crown className="h-4 w-4" />
          Subscription
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-6">
        <ProfileSettingsForm initialData={profile} />
      </TabsContent>

      <TabsContent value="account" className="space-y-6">
        <AccountSettingsForm currentEmail={email} username={profile.username} />
      </TabsContent>

      <TabsContent value="subscription" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {isPremium && <Crown className="h-5 w-5 text-primary" />}
                  Current Plan
                </CardTitle>
                <CardDescription>Your subscription details and billing information</CardDescription>
              </div>
              {isPremium && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Crown className="h-3 w-3 mr-1" />
                  {subscriptionTier === 'launch_offer' ? 'Launch' : 'Pro'}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-sm font-medium">Subscription Tier</span>
                <span className="text-sm text-muted-foreground capitalize">
                  {subscriptionTier === 'free' ? 'Free Tier' :
                   subscriptionTier === 'launch_offer' ? 'Launch Offer (₹199)' :
                   subscriptionTier === 'monthly' ? 'Monthly (₹999)' :
                   subscriptionTier === 'quarterly' ? 'Quarterly (₹1,999)' :
                   subscriptionTier === 'yearly' ? 'Yearly (₹4,999)' : 'Free Tier'}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-sm font-medium">Status</span>
                <Badge variant={profile.subscription_status === 'active' || profile.subscription_status === 'trial' ? 'default' : 'secondary'}>
                  {profile.subscription_status || 'active'}
                </Badge>
              </div>

              {profile.subscription_end_date && (
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-sm font-medium">
                    {subscriptionTier === 'launch_offer' ? 'Offer Expires' : 'Renews On'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(profile.subscription_end_date)}
                  </span>
                </div>
              )}

              {subscriptionTier === 'free' && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3">
                    Upgrade to premium to unlock:
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-primary" />
                      All challenges (beginner to advanced)
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-primary" />
                      Interview prep mode with AI evaluation
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-primary" />
                      Unlimited attempts and AI feedback
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => router.push('/dashboard/settings/subscription')}
                variant="outline"
                className="flex-1"
              >
                Manage Subscription
              </Button>
              {subscriptionTier === 'free' && (
                <Button
                  onClick={() => router.push('/pricing')}
                  className="flex-1"
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade Now
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
