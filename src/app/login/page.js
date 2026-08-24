import Link from "next/link";
import { BookOpen } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import PublicRoute from "@/components/auth/PublicRoute";

export default function LoginPage() {
  return (
    <PublicRoute>
      <div className="auth-page bg-[var(--background)]">
        <div className="auth-card">
          <Link href="/" className="brand flex justify-center mb-12">
            <div className="brand-mark">
              <BookOpen size={16} />
            </div>
            KIMI NO
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-[var(--primary)] mb-2">
              Welcome back
            </h1>
            <p className="text-[var(--muted-foreground)]">
              Sign in to continue
            </p>
          </div>

          <LoginForm />

          <div className="auth-foot mt-6">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-[var(--primary)] hover:underline"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}
