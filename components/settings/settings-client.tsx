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
    <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="profile" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          <User className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Profile</span>
          <span className="sm:hidden">Profile</span>
        </TabsTrigger>
        <TabsTrigger value="account" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Account</span>
          <span className="sm:hidden">Account</span>
        </TabsTrigger>
        <TabsTrigger value="subscription" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Subscription</span>
          <span className="sm:hidden">Sub</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-6">
        <ProfileSettingsForm initialData={profile} />
      </TabsContent>

      <TabsContent value="account" className="space-y-6">
        <AccountSettingsForm currentEmail={email} username={profile.username} />
      </TabsContent>

      <TabsContent value="subscription" className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  {isPremium && <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
                  Current Plan
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your subscription details and billing information</CardDescription>
              </div>
              {isPremium && (
                <Badge variant="secondary" className="bg-primary/10 text-primary text-xs flex-shrink-0">
                  <Crown className="h-3 w-3 mr-1" />
                  {subscriptionTier === 'launch_offer' ? 'Launch' : 'Pro'}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            <div className="grid gap-2 sm:gap-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 sm:py-3 border-b gap-1">
                <span className="text-xs sm:text-sm font-medium">Subscription Tier</span>
                <span className="text-xs sm:text-sm text-muted-foreground capitalize break-words">
                  {subscriptionTier === 'free' ? 'Free Tier' :
                   subscriptionTier === 'launch_offer' ? 'Launch Offer (₹199)' :
                   subscriptionTier === 'monthly' ? 'Monthly (₹999)' :
                   subscriptionTier === 'quarterly' ? 'Quarterly (₹1,999)' :
                   subscriptionTier === 'yearly' ? 'Yearly (₹4,999)' : 'Free Tier'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 sm:py-3 border-b gap-1">
                <span className="text-xs sm:text-sm font-medium">Status</span>
                <Badge variant={profile.subscription_status === 'active' || profile.subscription_status === 'trial' ? 'default' : 'secondary'} className="text-xs w-fit">
                  {profile.subscription_status || 'active'}
                </Badge>
              </div>

              {profile.subscription_end_date && (
                <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 sm:py-3 border-b gap-1">
                  <span className="text-xs sm:text-sm font-medium">
                    {subscriptionTier === 'launch_offer' ? 'Offer Expires' : 'Renews On'}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground break-words">
                    {formatDate(profile.subscription_end_date)}
                  </span>
                </div>
              )}

              {subscriptionTier === 'free' && (
                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                    Upgrade to premium to unlock:
                  </p>
                  <ul className="text-xs sm:text-sm space-y-1.5 sm:space-y-2">
                    <li className="flex items-center gap-2">
                      <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                      <span className="break-words">All challenges (beginner to advanced)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                      <span className="break-words">Interview prep mode with AI evaluation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                      <span className="break-words">Unlimited attempts and AI feedback</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                onClick={() => router.push('/dashboard/settings/subscription')}
                variant="outline"
                className="flex-1 text-xs sm:text-sm"
              >
                Manage Subscription
              </Button>
              {subscriptionTier === 'free' && (
                <Button
                  onClick={() => router.push('/pricing')}
                  className="flex-1 text-xs sm:text-sm"
                >
                  <Crown className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
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
