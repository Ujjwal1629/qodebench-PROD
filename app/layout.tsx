import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
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
  title: "Qodebench – Real Developer Simulator for Full-Stack Coders",
  description: "Learn, debug, deploy, and face mock interviews — Qodebench simulates real developer life to help you become job-ready.",
  keywords: ["Qodebench", "developer simulator", "coding challenges", "AI mock interview", "full-stack learning", "Code Fridays", "production bugs", "mock interviews", "real-world coding", "job-ready developer"],
  authors: [{ name: "Qodebench Technologies Pvt. Ltd." }],
  creator: "Qodebench Technologies Pvt. Ltd.",
  publisher: "Qodebench Technologies Pvt. Ltd.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Qodebench – Real Developer Simulator for Full-Stack Coders",
    description: "Learn, debug, deploy, and face mock interviews — Qodebench simulates real developer life to help you become job-ready.",
    siteName: "Qodebench",
  },
  twitter: {
    card: "summary_large_image",
    title: "Qodebench – Real Developer Simulator for Full-Stack Coders",
    description: "Learn, debug, deploy, and face mock interviews — Qodebench simulates real developer life to help you become job-ready.",
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
        <QueryProvider>
          <Navbar />
          {children}
          <Toaster />
          <SonnerToaster position="top-center" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
