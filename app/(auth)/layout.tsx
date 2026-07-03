export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh bg-museum-obsidian flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Museum brand mark */}
        <div className="text-center mb-10">
          <p className="text-label mb-3">Memory Museum</p>
          <h1 className="text-display text-4xl text-museum-marble">
            Your story lives here
          </h1>
        </div>
        {children}
      </div>
    </main>
  );
}
