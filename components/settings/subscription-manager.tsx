'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Crown,
  Calendar,
  Clock,
  Zap,
  Sparkles,
  AlertCircle,
  Check,
  ArrowRight,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { UserSubscription } from '@/types/subscription';
import { SUBSCRIPTION_PLANS, FREE_TIER_LIMITS } from '@/types/subscription';

interface SubscriptionManagerProps {
  subscription: UserSubscription | null;
  userId: string;
}

export function SubscriptionManager({ subscription, userId }: SubscriptionManagerProps) {
  const router = useRouter();
  const [isCanceling, setIsCanceling] = useState(false);

  const isFreeTier = !subscription || subscription.tier === 'free';
  const currentTier = subscription?.tier || 'free';
  const status = subscription?.status || 'active';

  const handleCancelSubscription = async () => {
    setIsCanceling(true);

    try {
      const response = await fetch('/api/payments/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      toast.success('Subscription canceled', {
        description: 'You\'ll retain access until the end of your billing period',
      });

      router.refresh();
    } catch (error) {
      console.error('Cancel subscription error:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setIsCanceling(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = () => {
    if (status === 'active') {
      return <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" /> Active</Badge>;
    }
    if (status === 'trial') {
      return <Badge className="bg-blue-500"><Clock className="h-3 w-3 mr-1" /> Trial</Badge>;
    }
    if (status === 'cancelled') {
      return <Badge variant="secondary"><X className="h-3 w-3 mr-1" /> Canceled</Badge>;
    }
    if (status === 'expired') {
      return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Expired</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <Card className={isFreeTier ? '' : 'border-primary/30 bg-gradient-to-br from-background to-primary/5'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!isFreeTier && <Crown className="h-6 w-6 text-primary" />}
              <div>
                <CardTitle className="text-2xl">
                  {/* @ts-ignore - Check for legacy tiers */}
                  {isFreeTier ? 'Free Tier' : SUBSCRIPTION_PLANS[currentTier as keyof typeof SUBSCRIPTION_PLANS]?.name || 'Premium Plan'}
                </CardTitle>
                <CardDescription>Your current subscription plan</CardDescription>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Subscription Details */}
          <div className="grid md:grid-cols-2 gap-4">
            {subscription?.startDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(subscription.startDate)}
                  </p>
                </div>
              </div>
            )}

            {subscription?.endDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {status === 'cancelled' ? 'Access Until' : 'Renewal Date'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(subscription.endDate)}
                  </p>
                </div>
              </div>
            )}

            {subscription?.trialEndsAt && currentTier === 'launch_offer' && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Offer Ends</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(subscription.trialEndsAt)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Current Plan Features */}
          <div>
            <p className="font-medium mb-3">Plan Features:</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {isFreeTier ? (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>All beginner challenges</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>All learning modules</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{FREE_TIER_LIMITS.dailyAttempts} challenge attempts/day</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{FREE_TIER_LIMITS.dailyAIFeedback} AI feedbacks/day</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>All challenges (beginner to advanced)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Interview prep mode</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Unlimited challenge attempts</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Unlimited AI hints & feedback</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>System design discussions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Professional interview reports</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            {isFreeTier ? (
              <Button onClick={() => router.push('/pricing')} className="flex-1 gap-2" size="lg">
                <Crown className="h-4 w-4" />
                Upgrade to Premium
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => router.push('/pricing')}
                  className="flex-1"
                >
                  Change Plan
                </Button>
                {status !== 'cancelled' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={isCanceling}>
                        Cancel Subscription
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You'll retain access to premium features until{' '}
                          {formatDate(subscription?.endDate || null)}.
                          Your subscription won't renew after this date.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleCancelSubscription}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          {isCanceling ? 'Canceling...' : 'Yes, Cancel'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Limits (Free Tier Only) */}
      {isFreeTier && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Daily Usage
            </CardTitle>
            <CardDescription>Track your free tier usage limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Challenge Attempts</span>
                <span className="font-medium">
                  {subscription?.dailyAttemptsUsed || 0} / {FREE_TIER_LIMITS.dailyAttempts}
                </span>
              </div>
              <Progress
                value={
                  ((subscription?.dailyAttemptsUsed || 0) / FREE_TIER_LIMITS.dailyAttempts) *
                  100
                }
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>AI Feedback Requests</span>
                <span className="font-medium">
                  {subscription?.dailyAIFeedbackUsed || 0} / {FREE_TIER_LIMITS.dailyAIFeedback}
                </span>
              </div>
              <Progress
                value={
                  ((subscription?.dailyAIFeedbackUsed || 0) /
                    FREE_TIER_LIMITS.dailyAIFeedback) *
                  100
                }
                className="h-2"
              />
            </div>

            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                Upgrade to premium for unlimited attempts and AI feedback
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Expiration Warning */}
      {status === 'expired' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your subscription has expired. Upgrade now to regain access to premium features.
            <Button
              variant="link"
              className="ml-2 p-0 h-auto"
              onClick={() => router.push('/pricing')}
            >
              View Plans →
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Cancellation Notice */}
      {status === 'cancelled' && subscription?.endDate && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your subscription is canceled but you still have access until{' '}
            {formatDate(subscription.endDate)}. Resubscribe anytime to continue.
            <Button
              variant="link"
              className="ml-2 p-0 h-auto"
              onClick={() => router.push('/pricing')}
            >
              Resubscribe →
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
