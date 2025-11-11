import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Privacy Policy | QodeBench',
  description: 'QodeBench Privacy Policy - How we collect, use, and protect your data',
};

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-slate-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <Card className="mb-8">
          <CardContent className="p-8 prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 mt-0">Introduction</h2>
            <p className="text-slate-600">
              At QodeBench, we take your privacy seriously. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our platform. Please read this
              privacy policy carefully. If you do not agree with the terms of this privacy policy, please
              do not access the platform.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">Information We Collect</h2>
            <h3 className="text-xl font-semibold text-slate-900">Personal Information</h3>
            <p className="text-slate-600">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="text-slate-600">
              <li>Name and username</li>
              <li>Email address</li>
              <li>Profile information (avatar, bio, experience level)</li>
              <li>Authentication data (passwords, OAuth tokens)</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6">Usage Information</h3>
            <p className="text-slate-600">
              We automatically collect certain information when you use our platform:
            </p>
            <ul className="text-slate-600">
              <li>Challenge attempts and submissions</li>
              <li>Progress and performance data</li>
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Cookies and similar technologies</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">How We Use Your Information</h2>
            <p className="text-slate-600">We use the information we collect to:</p>
            <ul className="text-slate-600">
              <li>Provide, maintain, and improve our services</li>
              <li>Create and manage your account</li>
              <li>Track your progress and provide personalized learning experiences</li>
              <li>Communicate with you about updates, features, and support</li>
              <li>Analyze usage patterns and improve our platform</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">Data Sharing and Disclosure</h2>
            <p className="text-slate-600">
              <strong>We do not sell or share your personal information with third parties for marketing purposes.</strong> Your data is used solely for providing and improving our services. We may share your information only in the following limited circumstances:
            </p>
            <ul className="text-slate-600">
              <li><strong>Service Providers:</strong> With trusted third-party vendors who perform services on our behalf (e.g., authentication, hosting, analytics) under strict confidentiality agreements</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">Data Security</h2>
            <p className="text-slate-600">
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction. However,
              no method of transmission over the Internet is 100% secure.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">Your Rights</h2>
            <p className="text-slate-600">You have the right to:</p>
            <ul className="text-slate-600">
              <li>Access and receive a copy of your personal data</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict certain processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">Cookies and Tracking</h2>
            <p className="text-slate-600">
              We use cookies and similar tracking technologies to track activity on our platform and
              store certain information. You can instruct your browser to refuse all cookies or to
              indicate when a cookie is being sent. See our <Link href="/cookies" className="text-brand-600 hover:text-brand-700">Cookie Policy</Link> for more details.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">Children's Privacy</h2>
            <p className="text-slate-600">
              Our platform is not intended for children under 13 years of age. We do not knowingly
              collect personal information from children under 13. If you are a parent or guardian and
              believe we have collected information from your child, please contact us.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">Changes to This Policy</h2>
            <p className="text-slate-600">
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">Contact Us</h2>
            <p className="text-slate-600">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-slate-600">
              Email: <a href="mailto:team@qodebench.com" className="text-brand-600 hover:text-brand-700">team@qodebench.com</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
