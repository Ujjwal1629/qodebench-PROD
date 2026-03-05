import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { PageTrackingProvider } from "@/components/providers/page-tracking-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { Navbar } from "@/components/landing/navbar";

import NextTopLoader from "nextjs-toploader";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Qodebench – Real QA Simulator for Software Testers",
  description: "Write test cases, automate testing, and master QA workflows — Qodebench simulates real QA engineer life to help you become job-ready.",
  keywords: ["Qodebench", "QA simulator", "testing scenarios", "AI mock interview", "test automation learning", "Selenium", "Cypress", "Playwright", "API testing", "performance testing", "real-world testing", "job-ready QA engineer"],
  authors: [{ name: "Qodebench Technologies Pvt. Ltd." }],
  creator: "Qodebench Technologies Pvt. Ltd.",
  publisher: "Qodebench Technologies Pvt. Ltd.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Qodebench – Real QA Simulator for Software Testers",
    description: "Write test cases, automate testing, and master QA workflows — Qodebench simulates real QA engineer life to help you become job-ready.",
    siteName: "Qodebench",
  },
  twitter: {
    card: "summary_large_image",
    title: "Qodebench – Real QA Simulator for Software Testers",
    description: "Write test cases, automate testing, and master QA workflows — Qodebench simulates real QA engineer life to help you become job-ready.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextTopLoader
          color="#0ea5e9"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #0ea5e9,0 0 5px #0ea5e9"
        />
        <PageTrackingProvider>
          <QueryProvider>
            <Navbar />
            {children}
            <Toaster />
            <SonnerToaster position="top-center" richColors />
            <SpeedInsights />

          </QueryProvider>
        </PageTrackingProvider>
      </body>
    </html>
  );
}
