import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { Navbar } from "@/components/landing/navbar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "QodeBench - Master Real-World Coding Skills",
  description: "Master real-world coding skills with QodeBench. Practice, learn, and excel in software development.",
  keywords: ["coding", "programming", "learning", "skills", "development"],
  authors: [{ name: "QodeBench" }],
  creator: "QodeBench",
  publisher: "QodeBench",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "QodeBench - Master Real-World Coding Skills",
    description: "Master real-world coding skills with QodeBench. Practice, learn, and excel in software development.",
    siteName: "QodeBench",
  },
  twitter: {
    card: "summary_large_image",
    title: "QodeBench - Master Real-World Coding Skills",
    description: "Master real-world coding skills with QodeBench. Practice, learn, and excel in software development.",
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
