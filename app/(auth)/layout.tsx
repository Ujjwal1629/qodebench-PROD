import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 p-4 pt-24 pb-12 relative">
      {/* Back to Home - Top Left Corner */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-brand-600 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Home</span>
      </Link>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="group mb-3">
              <div className="h-16 w-auto group-hover:scale-105 transition-transform">
                <Image
                  src="/qodeb.png"
                  alt="QodeBench"
                  width={240}
                  height={64}
                  className="object-contain h-16 w-auto"
                  priority
                />
              </div>
            </Link>
            <p className="text-slate-600 text-sm">Master Real-World Coding Skills</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
