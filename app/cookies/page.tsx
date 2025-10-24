import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Cookie Policy | QodeBench',
  description: 'QodeBench Cookie Policy - How we use cookies and tracking technologies',
};

export default function CookiesPage() {
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
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Cookie Policy</h1>
        <p className="text-slate-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <Card className="mb-8">
          <CardContent className="p-8 prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 mt-0">What Are Cookies?</h2>
            <p className="text-slate-600">
              Cookies are small text files that are placed on your device when you visit our Platform.
              They help us provide you with a better experience by remembering your preferences and
              understanding how you use our services.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">Types of Cookies We Use</h2>

            <h3 className="text-xl font-semibold text-slate-900">Essential Cookies</h3>
            <p className="text-slate-600">
              These cookies are necessary for the Platform to function properly. They enable core
              functionality such as:
            </p>
            <ul className="text-slate-600">
              <li>User authentication and security</li>
              <li>Remembering your login status</li>
              <li>Maintaining your session</li>
              <li>Enabling core features of the Platform</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6">Analytics Cookies</h3>
            <p className="text-slate-600">
              These cookies help us understand how visitors use our Platform by collecting anonymous
              information about:
            </p>
            <ul className="text-slate-600">
              <li>Pages visited and time spent</li>
              <li>Navigation patterns</li>
              <li>Error messages encountered</li>
              <li>Device and browser information</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6">Functional Cookies</h3>
            <p className="text-slate-600">
              These cookies enable personalized features and remember your preferences:
            </p>
            <ul className="text-slate-600">
              <li>Language preferences</li>
              <li>Theme settings (dark mode, etc.)</li>
              <li>Display preferences</li>
              <li>Previously completed challenges</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6">Performance Cookies</h3>
            <p className="text-slate-600">
              These cookies help us improve the performance and functionality of our Platform:
            </p>
            <ul className="text-slate-600">
              <li>Load time measurements</li>
              <li>Error tracking</li>
              <li>A/B testing for new features</li>
              <li>Usage analytics</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">Third-Party Cookies</h2>
            <p className="text-slate-600">
              We may use third-party services that set cookies on your device. These include:
            </p>
            <ul className="text-slate-600">
              <li><strong>Analytics Services:</strong> Google Analytics, for understanding usage patterns</li>
              <li><strong>Authentication Providers:</strong> OAuth providers like Google and GitHub</li>
              <li><strong>Performance Monitoring:</strong> Services that help us identify and fix issues</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">Managing Cookies</h2>
            <h3 className="text-xl font-semibold text-slate-900">Browser Settings</h3>
            <p className="text-slate-600">
              You can control and manage cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul className="text-slate-600">
              <li>View what cookies are stored</li>
              <li>Delete some or all cookies</li>
              <li>Block cookies from specific sites</li>
              <li>Block all third-party cookies</li>
              <li>Clear cookies when you close your browser</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6">Impact of Disabling Cookies</h3>
            <p className="text-slate-600">
              Please note that disabling certain cookies may impact your experience on our Platform.
              Essential cookies are necessary for the Platform to function, and disabling them may prevent
              you from using core features.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">Cookie Duration</h2>
            <p className="text-slate-600">Cookies may be:</p>
            <ul className="text-slate-600">
              <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Cookies that remain on your device for a specified period or until you delete them</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">Updates to This Policy</h2>
            <p className="text-slate-600">
              We may update this Cookie Policy from time to time to reflect changes in our practices or
              for other operational, legal, or regulatory reasons. We will notify you of any material
              changes by posting the updated policy on this page.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">Contact Us</h2>
            <p className="text-slate-600">
              If you have questions about our use of cookies, please contact us at:
            </p>
            <p className="text-slate-600">
              Email: <a href="mailto:support@qodebench.com" className="text-brand-600 hover:text-brand-700">support@qodebench.com</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
