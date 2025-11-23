import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Qodebench',
  description: 'Qodebench Refund and Cancellation Policy - How to request refunds and cancel subscriptions',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-6 lg:px-8 py-4">
          <Link href="/" className="text-brand-600 hover:text-brand-700 font-semibold">
            ← Back to Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Refund & Cancellation Policy</h1>
        <p className="text-slate-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <Card className="mb-8">
          <CardContent className="p-8 prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 mt-0">Refund Policy</h2>
            <p className="text-slate-600">
              At Qodebench Technologies Pvt. Ltd., we want you to be satisfied with your subscription.
              Our refund policy is designed to be fair and transparent.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-6">7-Day Money-Back Guarantee</h3>
            <p className="text-slate-600">
              Users can request a full refund within <strong>7 days of subscription purchase</strong> if they are
              unsatisfied with the platform for any reason. To be eligible:
            </p>
            <ul className="text-slate-600">
              <li>The refund request must be made within 7 days of the original payment date</li>
              <li>No questions asked - we respect your decision</li>
              <li>Refunds are processed to the original payment method within 5-7 business days</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6">Course/Challenge Access Limitation</h3>
            <p className="text-slate-600">
              <strong>No refund will be issued if you have accessed more than 20% of the paid courses or challenges.</strong> This includes:
            </p>
            <ul className="text-slate-600">
              <li>Completing challenges beyond the beginner tier</li>
              <li>Taking mock interviews</li>
              <li>Using AI feedback or hints beyond the free tier limits</li>
              <li>Accessing premium learning modules</li>
            </ul>
            <p className="text-slate-600">
              This policy ensures fairness while preventing abuse of our content.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-6">How to Request a Refund</h3>
            <p className="text-slate-600">
              To request a refund, please:
            </p>
            <ol className="text-slate-600">
              <li>Contact our support team at <a href="mailto:team@qodebench.com" className="text-brand-600 hover:text-brand-700">team@qodebench.com</a></li>
              <li>Include your account email, order ID, and reason for refund (optional)</li>
              <li>Allow 2-3 business days for refund approval</li>
              <li>Receive your refund within 5-7 business days after approval</li>
            </ol>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">Cancellation Policy</h2>
            <p className="text-slate-600">
              You can cancel your Qodebench subscription at any time. Here's how cancellations work:
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-6">How to Cancel</h3>
            <ul className="text-slate-600">
              <li>Go to your <strong>Dashboard → Settings → Subscription</strong></li>
              <li>Click on <strong>"Cancel Subscription"</strong></li>
              <li>Confirm your cancellation</li>
              <li>You will retain access until the end of your current billing period</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6">What Happens After Cancellation?</h3>
            <ul className="text-slate-600">
              <li><strong>Immediate Effect:</strong> No future charges will be made</li>
              <li><strong>Access Retention:</strong> You keep full access until your subscription end date</li>
              <li><strong>After Expiry:</strong> Your account reverts to the free tier with limited access</li>
              <li><strong>Data Preservation:</strong> All your progress, submissions, and data are retained</li>
              <li><strong>Reactivation:</strong> You can reactivate your subscription anytime</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6">Beta Trial Cancellation</h3>
            <p className="text-slate-600">
              The 21-day Beta Trial (₹199) can be cancelled at any time. If cancelled within 7 days and
              usage is under 20%, a full refund will be issued. After 7 days, no refund is available,
              but you retain access until the 21-day period ends.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-6">Premium Plan Cancellation</h3>
            <p className="text-slate-600">
              For 3-month (₹1,999) and 6-month (₹4,999) plans:
            </p>
            <ul className="text-slate-600">
              <li>Cancel anytime without penalty</li>
              <li>Retain access until the subscription period ends</li>
              <li>No pro-rated refunds after the 7-day window</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">Non-Refundable Circumstances</h2>
            <p className="text-slate-600">
              Refunds will <strong>not</strong> be issued in the following cases:
            </p>
            <ul className="text-slate-600">
              <li>Subscription purchase was made more than 7 days ago</li>
              <li>More than 20% of paid content has been accessed</li>
              <li>Account has been suspended or terminated due to Terms of Service violations</li>
              <li>Change of mind after the 7-day refund window</li>
              <li>Technical issues caused by user's device or internet connection</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">Payment Failures and Billing Issues</h2>
            <p className="text-slate-600">
              If a payment fails or there is a billing error:
            </p>
            <ul className="text-slate-600">
              <li>We will notify you via email</li>
              <li>You will have 48 hours to update payment information</li>
              <li>After 48 hours, your subscription will be automatically cancelled</li>
              <li>No refund is issued for partial subscription periods</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">Contact Us</h2>
            <p className="text-slate-600">
              If you have any questions about refunds or cancellations, please contact us:
            </p>
            <p className="text-slate-600">
              Email: <a href="mailto:team@qodebench.com" className="text-brand-600 hover:text-brand-700">team@qodebench.com</a>
              <br />
              Company: Qodebench Technologies Pvt. Ltd.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
