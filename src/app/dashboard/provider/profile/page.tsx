"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProviderById, myProviderId } from "@/lib/data";
import { Eyebrow } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { providerProfileSchema, type ProviderProfileValues } from "@/lib/validation";

export default function ProviderProfilePage() {
  const provider = getProviderById(myProviderId)!;
  const [success, setSuccess] = useState(false);
  const [areas, setAreas] = useState<string[]>(provider.serviceAreas);
  const [newArea, setNewArea] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProviderProfileValues>({
    resolver: zodResolver(providerProfileSchema),
    defaultValues: {
      name: provider.name,
      email: "demo.provider@fixmate.com",
      bio: provider.bio,
    },
  });

  function onSubmit() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setSuccess(true);
        resolve();
      }, 800);
    });
  }

  function addArea() {
    const v = newArea.trim();
    if (v && !areas.includes(v)) setAreas((a) => [...a, v]);
    setNewArea("");
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Eyebrow>Provider dashboard</Eyebrow>
      <h1 className="font-display text-3xl font-bold">{provider.name}</h1>

      <DashboardTabs
        tabs={[
          { href: "/dashboard/provider", label: "Overview" },
          { href: "/dashboard/provider/services", label: "My services" },
          { href: "/dashboard/provider/bookings", label: "Bookings" },
          { href: "/dashboard/provider/reviews", label: "Reviews" },
          { href: "/dashboard/provider/earnings", label: "Earnings" },
          { href: "/dashboard/provider/profile", label: "Profile" },
          { href: "/dashboard/provider/settings", label: "Settings" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="ticket mt-6 space-y-4 p-6" noValidate>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber font-display text-xl font-bold text-ink">
            {provider.avatarInitial}
          </div>
          <div>
            <p className="font-medium">
              {provider.name} {provider.verified && <span className="text-teal">✓ Verified</span>}
            </p>
            <p className="text-xs text-muted">
              {provider.yearsActive} years active · {provider.jobsCompleted} jobs completed
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
              Business name
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
              Contact email
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
        </div>

        <div>
          <label htmlFor="bio" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Bio
          </label>
          <textarea
            id="bio"
            rows={3}
            aria-invalid={!!errors.bio}
            {...register("bio")}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          />
          {errors.bio && (
            <p role="alert" className="mt-1 text-xs text-[#A3342A]">
              {errors.bio.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted">
            Service areas
          </label>
          <div className="mb-3 flex flex-wrap gap-2">
            {areas.map((a) => (
              <span
                key={a}
                className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs font-medium"
              >
                {a}
                <button
                  type="button"
                  onClick={() => setAreas((list) => list.filter((x) => x !== a))}
                  aria-label={`Remove ${a}`}
                  className="text-muted hover:text-[#A3342A]"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              placeholder="Add a service area"
              className="flex-1 rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
            />
            <button
              type="button"
              onClick={addArea}
              className="rounded-lg border border-line px-4 text-sm font-medium hover:border-amber"
            >
              Add
            </button>
          </div>
        </div>

        {success && (
          <p role="status" className="text-sm text-teal">
            Profile updated.
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-60 dark:bg-amber dark:text-ink"
        >
          {isSubmitting ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
