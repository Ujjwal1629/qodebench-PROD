import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Terms of Service | QodeBench',
  description: 'QodeBench Terms of Service - Rules and guidelines for using our platform',
};

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
        <p className="text-slate-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <Card className="mb-8">
          <CardContent className="p-8 prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 mt-0">1. Acceptance of Terms</h2>
            <p className="text-slate-600">
              By accessing and using QodeBench ("the Platform"), you accept and agree to be bound by
              these Terms of Service. If you do not agree to these terms, please do not use the Platform.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">2. User Accounts</h2>
            <h3 className="text-xl font-semibold text-slate-900">Account Creation</h3>
            <p className="text-slate-600">
              To use certain features, you must create an account. You agree to:
            </p>
            <ul className="text-slate-600">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be responsible for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6">Account Termination</h3>
            <p className="text-slate-600">
              We reserve the right to suspend or terminate your account if you violate these Terms or
              engage in conduct that we deem inappropriate or harmful to the Platform or other users.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">3. Use of the Platform</h2>
            <h3 className="text-xl font-semibold text-slate-900">Acceptable Use</h3>
            <p className="text-slate-600">You agree not to:</p>
            <ul className="text-slate-600">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Submit malicious code or attempt to compromise security</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Use automated tools to access or scrape the Platform</li>
              <li>Interfere with the proper functioning of the Platform</li>
              <li>Impersonate others or misrepresent your affiliation</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6">Content Submissions</h3>
            <p className="text-slate-600">
              When you submit code, solutions, or other content to the Platform, you grant us a
              non-exclusive, worldwide, royalty-free license to use, reproduce, and display that content
              for the purpose of providing and improving our services.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">4. Intellectual Property</h2>
            <p className="text-slate-600">
              All content, features, and functionality of the Platform, including but not limited to
              challenges, text, graphics, logos, and software, are owned by QodeBench or our licensors
              and are protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">5. AI-Powered Features & Platform Purpose</h2>
            <p className="text-slate-600">
              Our Platform includes AI-powered features for learning assistance, code validation, and
              interview preparation. By using these features, you acknowledge and agree that:
            </p>
            <ul className="text-slate-600">
              <li><strong>Learning & Testing Only:</strong> The platform is intended for learning, practice, and testing purposes only</li>
              <li><strong>No Production Use:</strong> Code, solutions, and content should not be used directly in production environments without thorough review</li>
              <li><strong>AI Limitations:</strong> AI-generated content may contain errors, inaccuracies, or incomplete information</li>
              <li><strong>No Liability for Errors:</strong> Qodebench is not responsible for any code errors, bugs, or output issues resulting from AI-generated content</li>
              <li><strong>Independent Verification:</strong> You are responsible for verifying and testing all code and solutions before use</li>
              <li><strong>Educational Purpose:</strong> All feedback, hints, and evaluations are provided for educational purposes only</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">6. Payment and Subscriptions</h2>
            <p className="text-slate-600">
              Some features may require payment. By purchasing a subscription or service:
            </p>
            <ul className="text-slate-600">
              <li>You agree to pay all applicable fees</li>
              <li>Refunds are subject to our <Link href="/refund-policy" className="text-brand-600 hover:text-brand-700">Refund & Cancellation Policy</Link></li>
              <li>Subscriptions do not automatically renew - you must manually renew after expiry</li>
              <li>You can cancel your subscription at any time from your account settings</li>
              <li>We may change pricing with 30 days notice to existing subscribers</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">7. Disclaimers and Limitations</h2>
            <h3 className="text-xl font-semibold text-slate-900">No Warranties</h3>
            <p className="text-slate-600">
              THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
              WE DO NOT GUARANTEE THAT THE PLATFORM WILL BE ERROR-FREE, SECURE, OR UNINTERRUPTED.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-6">Limitation of Liability</h3>
            <p className="text-slate-600">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, QODEBENCH SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">8. Privacy</h2>
            <p className="text-slate-600">
              Your use of the Platform is also governed by our <Link href="/privacy" className="text-brand-600 hover:text-brand-700">Privacy Policy</Link>,
              which explains how we collect, use, and protect your personal information.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">9. Modifications</h2>
            <p className="text-slate-600">
              We reserve the right to modify these Terms at any time. We will notify users of significant
              changes. Your continued use of the Platform after changes constitutes acceptance of the
              modified Terms.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">10. Governing Law</h2>
            <p className="text-slate-600">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction
              in which QodeBench operates, without regard to conflict of law principles.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">11. Contact Information</h2>
            <p className="text-slate-600">
              For questions about these Terms, please contact us at:
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
