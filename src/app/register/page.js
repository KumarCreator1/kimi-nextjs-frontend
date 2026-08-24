import Link from "next/link";
import { BookOpen } from "lucide-react";
import RegisterForm from "@/components/auth/RegisterForm";
import PublicRoute from "@/components/auth/PublicRoute";

export default function RegisterPage() {
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
              Join KIMI NO
            </h1>
            <p className="text-[var(--muted-foreground)]">
              Create your account
            </p>
          </div>

          <RegisterForm />

          <div className="auth-foot mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--primary)] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}
