export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4 pt-24 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Qode<span className="text-brand-500">Bench</span>
          </h1>
          <p className="text-slate-600 mt-2">Master Real-World Coding Skills</p>
        </div>
        {children}
      </div>
    </div>
  );
}
