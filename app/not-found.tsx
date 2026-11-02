import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24 min-h-screen flex flex-col justify-center">
      <p className="font-mono text-sm text-[var(--accent)] mb-4">
        ~/error
      </p>
      <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.05]">
        404
      </h1>
      <p className="mt-6 text-lg text-[var(--muted)] leading-relaxed max-w-md">
        This page doesn&apos;t exist — or hasn&apos;t been built yet.
      </p>

      <div className="mt-8 font-mono text-sm">
        <Link
          href="/"
          className="text-[var(--ink)] underline decoration-[var(--line)] decoration-2 underline-offset-4 hover:decoration-[var(--accent)] transition-colors"
        >
          ← back home
        </Link>
      </div>
    </main>
  );
}