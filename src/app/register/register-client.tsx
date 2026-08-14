"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eyebrow } from "@/components/ui";
import { registerSchema, type RegisterValues } from "@/lib/validation";
import { registerUser } from "@/lib/api";

export function RegisterClient() {
  const params = useSearchParams();
  const [role, setRole] = useState<"customer" | "provider">(
    params.get("role") === "provider" ? "provider" : "customer"
  );
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterValues) {
    try {
      setErrorMsg("");
      await registerUser({ ...data, role });
      setSuccess(true);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <Eyebrow>Join FixMate</Eyebrow>
      <h1 className="font-display text-3xl font-bold">Create your account</h1>

      <div className="mt-5 flex rounded-full border border-line p-1 text-sm font-medium">
        <button
          type="button"
          onClick={() => setRole("customer")}
          className={`flex-1 rounded-full py-2 transition-colors ${role === "customer" ? "bg-ink text-paper dark:bg-amber dark:text-ink" : ""}`}
        >
          I need a service
        </button>
        <button
          type="button"
          onClick={() => setRole("provider")}
          className={`flex-1 rounded-full py-2 transition-colors ${role === "provider" ? "bg-ink text-paper dark:bg-amber dark:text-ink" : ""}`}
        >
          I provide a service
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="ticket mt-6 space-y-4 p-6" noValidate>
        <div>
          <label htmlFor="name" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Full name
          </label>
          <input
            id="name"
            aria-invalid={!!errors.name}
            {...register("name")}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          />
          {errors.name && (
            <p role="alert" className="mt-1 text-xs text-[#A3342A]">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Email
          </label>
          <input
            id="email"
            type="email"
            aria-invalid={!!errors.email}
            {...register("email")}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          />
          {errors.email && (
            <p role="alert" className="mt-1 text-xs text-[#A3342A]">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Password
          </label>
          <input
            id="password"
            type="password"
            aria-invalid={!!errors.password}
            {...register("password")}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          />
          {errors.password && (
            <p role="alert" className="mt-1 text-xs text-[#A3342A]">
              {errors.password.message}
            </p>
          )}
        </div>
        {role === "provider" && (
          <div>
            <label htmlFor="category" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
              Primary service category
            </label>
            <input
              id="category"
              {...register("category")}
              placeholder="e.g. Electrical"
              className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
            />
          </div>
        )}

        {errorMsg && (
          <p role="alert" className="mt-2 text-sm font-medium text-[#A3342A]">
            {errorMsg}
          </p>
        )}

        {success && (
          <p role="status" className="mt-2 text-sm font-medium text-teal">
            Account created successfully! Redirecting…
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-ink py-3 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-60 dark:bg-amber dark:text-ink"
        >
          {isSubmitting ? "Creating account…" : `Create ${role} account`}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-ink underline decoration-amber decoration-2 underline-offset-4 dark:text-[#f1efe9]">
          Log in
        </Link>
      </p>
    </div>
  );
}
