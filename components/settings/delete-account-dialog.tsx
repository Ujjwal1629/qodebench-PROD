'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { deleteAccount } from '@/app/actions/settings';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DeleteAccountDialogProps {
  username: string;
}

export function DeleteAccountDialog({ username }: DeleteAccountDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const formSchema = z.object({
    confirmation: z
      .string()
      .refine((val) => val === username, {
        message: `Please type "${username}" to confirm`,
      }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirmation: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await deleteAccount(values.confirmation);

      if (result.success) {
        toast({
          title: 'Account deleted',
          description: result.message || 'Your account has been deleted',
        });
        setOpen(false);
        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Failed to delete account',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-full bg-red-100 p-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle>Delete Account</DialogTitle>
          </div>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive" className="my-4">
          <AlertDescription className="space-y-2">
            <p className="font-semibold">You will lose:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>All your challenge submissions and solutions</li>
              <li>Your points, streak, and leaderboard rankings</li>
              <li>Mock interview history and evaluations</li>
              <li>Learning progress and achievements</li>
              <li>Profile information and settings</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Type <span className="font-mono font-bold">{username}</span>{' '}
                    to confirm
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={username}
                      disabled={form.formState.isSubmitting}
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This confirms you understand this action is permanent
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={
                  form.formState.isSubmitting ||
                  form.watch('confirmation') !== username
                }
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete My Account'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
