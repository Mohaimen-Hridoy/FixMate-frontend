"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eyebrow } from "@/components/ui";
import { contactSchema, type ContactValues } from "@/lib/validation";

export default function ContactPage() {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  function onSubmit() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setSuccess(true);
        resolve();
      }, 900);
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <Eyebrow>Get in touch</Eyebrow>
      <h1 className="font-display text-3xl font-bold">Contact us</h1>
      <p className="mt-3 text-muted">Questions, feedback, or a partnership idea — send it over.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="ticket mt-8 space-y-4 p-6" noValidate>
        <div>
          <label htmlFor="name" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Name
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
          <label htmlFor="message" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            aria-invalid={!!errors.message}
            {...register("message")}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          />
          {errors.message && (
            <p role="alert" className="mt-1 text-xs text-[#A3342A]">
              {errors.message.message}
            </p>
          )}
        </div>

        {success && (
          <p role="status" className="text-sm text-teal">
            Thanks — we&apos;ll get back to you soon.
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-ink py-3 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-60 dark:bg-amber dark:text-ink"
        >
          {isSubmitting ? "Sending…" : "Send message"}
        </button>
      </form>
    </div>
  );
}
