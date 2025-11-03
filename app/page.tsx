export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="text-center px-4 space-y-6 max-w-2xl">
        {/* Logo or Title */}
        <div className="space-y-2">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-[#0ea5e9] to-[#a855f7] bg-clip-text text-transparent">
            QodeBench
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-[#0ea5e9] to-[#a855f7] rounded-full" />
        </div>

        {/* Coming Soon Message */}
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-200">
          Coming Soon
        </h2>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          We're working on something amazing. Stay tuned for the launch!
        </p>

        {/* Optional: Email signup or social links can go here */}
        <div className="pt-8">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Building the future of coding excellence
          </p>
        </div>
      </div>
    </div>
  );
}
