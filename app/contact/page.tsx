import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MapPin, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | QodeBench',
  description: 'Get in touch with the QodeBench team',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-6 lg:px-8 py-4">
          <Link href="/" className="text-brand-600 hover:text-brand-700 font-semibold">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="container mx-auto px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Have questions, feedback, or need support? We'd love to hear from you.
            Choose the best way to reach us below.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="container mx-auto px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 text-center md:text-left">
          {/* Email */}
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-brand-100 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-brand-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Email</h2>
              </div>
              <p className="text-slate-600 mb-4">
                For all inquiries including support, feedback, partnerships, and careers
              </p>
              <a
                href="mailto:team@qodebench.com"
                className="text-brand-600 hover:text-brand-700 font-semibold text-lg break-all"
              >
                team@qodebench.com
              </a>
            </CardContent>
          </Card>

          {/* WhatsApp */}
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">WhatsApp Support</h2>
              </div>
              <p className="text-slate-600 mb-4">
                Quick support via WhatsApp
              </p>
              <a
                href="https://wa.me/919871462694"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 font-semibold text-lg"
              >
                +91-9871462694
              </a>
            </CardContent>
          </Card>

          {/* Phone */}
          {/* <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Phone</h2>
              </div>
              <p className="text-slate-600 mb-4">
                Call us during business hours
              </p>
              <a
                href="tel:+919871462694"
                className="text-brand-600 hover:text-brand-700 font-semibold text-lg"
              >
                +91-9871462694
              </a>
            </CardContent>
          </Card> */}

          {/* Office Address */}
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Registered Office</h2>
              </div>
              <p className="text-slate-700 mb-2 font-semibold">
                Qodebench Technologies Pvt. Ltd.
              </p>
              <p className="text-slate-600 text-base leading-relaxed">
                442 Faridabad,<br />
                Haryana 121002,<br />
                India
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Response Time */}
      <section className="container mx-auto px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-brand-50 border-brand-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Our Response Time
              </h3>
              <p className="text-slate-600">
                We typically respond to all inquiries within 24-48 hours during business days.
                For urgent support issues, please include "URGENT" in your email subject line.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
