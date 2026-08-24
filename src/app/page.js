import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <header className="flex justify-between items-center p-6 lg:px-12 z-10">
        <div className="brand">
          <div className="brand-mark">
            <BookOpen size={16} />
          </div>
          KIMI NO
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--ink)] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="button button-dark !min-h-[36px] text-sm"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center page-section -mt-20">
        <div className="max-w-3xl space-y-8">
          <div className="inline-block eyebrow mb-4 bg-[var(--ochre)] text-[var(--ink)] px-3 py-1 rounded-full bg-opacity-40">
            Educational Class Management Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-serif text-[var(--primary)] leading-tight">
            Search your <br />
            <span className="text-[var(--ink)]">Mitsuha</span>
          </h1>

          <p className="text-xl text-[var(--muted-foreground)] max-w-xl mx-auto">
            Connect students and teachers through organized learning. Upload
            notes, let AI organize them, and discover topics instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link
              href="/dashboard"
              className="button button-dark w-full sm:w-auto px-8 py-3 text-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="button button-light w-full sm:w-auto px-8 py-3 text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
