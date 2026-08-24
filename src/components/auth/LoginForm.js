"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(data);
      // router.push("/dashboard") is handled inside AuthContext
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-[var(--error)] bg-opacity-10 text-[var(--error)] p-3 rounded-md text-sm border border-[var(--error)]">
          {error}
        </div>
      )}

      <label>
        <span className="font-serif text-[14px]">Email</span>
        <input
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className={errors.email ? "border-[var(--error)]" : ""}
        />
        {errors.email && (
          <span className="text-[var(--error)] text-xs mt-1">
            {errors.email.message}
          </span>
        )}
      </label>

      <label>
        <span className="font-serif text-[14px]">Password</span>
        <input
          type="password"
          placeholder="••••••••"
          {...register("password")}
          className={errors.password ? "border-[var(--error)]" : ""}
        />
        {errors.password && (
          <span className="text-[var(--error)] text-xs mt-1">
            {errors.password.message}
          </span>
        )}
      </label>

      <div className="text-right mt-1 mb-4">
        <Link
          href="#"
          className="text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="button button-dark !w-full !min-h-[44px] text-base disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
