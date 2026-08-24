"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validations";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterForm() {
  const { register: authRegister } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await authRegister(data);
      // router.push("/dashboard") is handled inside AuthContext
    } catch (err) {
      setError(err.message || "An error occurred during registration");
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

      <div className="flex flex-col sm:flex-row gap-4">
        <label className="flex-1">
          <span className="font-serif text-[14px]">First Name</span>
          <input
            type="text"
            placeholder="John"
            {...register("firstName")}
            className={errors.firstName ? "border-[var(--error)]" : ""}
          />
          {errors.firstName && (
            <span className="text-[var(--error)] text-xs mt-1">
              {errors.firstName.message}
            </span>
          )}
        </label>
        <label className="flex-1">
          <span className="font-serif text-[14px]">Last Name</span>
          <input
            type="text"
            placeholder="Smith"
            {...register("lastName")}
            className={errors.lastName ? "border-[var(--error)]" : ""}
          />
          {errors.lastName && (
            <span className="text-[var(--error)] text-xs mt-1">
              {errors.lastName.message}
            </span>
          )}
        </label>
      </div>

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

      <div className="flex flex-col gap-1 mt-4">
        <div className="flex items-start gap-2 text-xs text-[var(--muted-foreground)]">
          <input
            type="checkbox"
            className={`mt-1 ${errors.terms ? "border-[var(--error)]" : ""}`}
            {...register("terms")}
          />
          <span>I agree to the Terms of Service and Privacy Policy.</span>
        </div>
        {errors.terms && (
          <span className="text-[var(--error)] text-xs">
            {errors.terms.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="button button-dark !w-full !min-h-[44px] text-base mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
