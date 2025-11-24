import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Debug endpoint to check if all required environment variables are set
 * IMPORTANT: Remove this endpoint before production or add authentication
 */
export async function GET() {
  try {
    // Check auth first (optional - for security)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Only allow in development or for admins
    if (process.env.NODE_ENV === 'production' && !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check all environment variables
    const envCheck = {
      razorpay: {
        keyId: !!process.env.RAZORPAY_KEY_ID,
        keyIdValue: process.env.RAZORPAY_KEY_ID?.slice(0, 15) + '...', // Show first 15 chars
        keySecret: !!process.env.RAZORPAY_KEY_SECRET,
        publicKeyId: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        publicKeyIdValue: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.slice(0, 15) + '...',
        webhookSecret: !!process.env.RAZORPAY_WEBHOOK_SECRET,
      },
      supabase: {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        serviceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
      app: {
        nodeEnv: process.env.NODE_ENV,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
      },
      allCriticalVariablesPresent:
        !!process.env.RAZORPAY_KEY_ID &&
        !!process.env.RAZORPAY_KEY_SECRET &&
        !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID &&
        !!process.env.RAZORPAY_WEBHOOK_SECRET &&
        !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    return NextResponse.json(envCheck);
  } catch (error) {
    console.error('Error checking environment:', error);
    return NextResponse.json(
      { error: 'Failed to check environment' },
      { status: 500 }
    );
  }
}
