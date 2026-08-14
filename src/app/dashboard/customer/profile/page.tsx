"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { demoCustomerName } from "@/lib/data";
import { Eyebrow } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { useAuth } from "@/lib/use-auth";
import { customerProfileSchema, type CustomerProfileValues } from "@/lib/validation";

export default function CustomerProfilePage() {
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const customerName = user?.name || demoCustomerName;
  const customerEmail = user?.email || "demo.user@fixmate.com";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerProfileValues>({
    resolver: zodResolver(customerProfileSchema),
    defaultValues: {
      name: customerName,
      phone: "01xxxxxxxxx",
      email: customerEmail,
      address: "House 14, Road 7, Dhanmondi, Dhaka",
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

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Eyebrow>Customer dashboard</Eyebrow>
      <h1 className="font-display text-3xl font-bold">Profile</h1>

      <DashboardTabs
        tabs={[
          { href: "/dashboard/customer", label: "Overview" },
          { href: "/dashboard/customer/bookings", label: "My bookings" },
          { href: "/dashboard/customer/reviews", label: "My reviews" },
          { href: "/dashboard/customer/profile", label: "Profile" },
          { href: "/dashboard/customer/settings", label: "Settings" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="ticket mt-6 space-y-4 p-6" noValidate>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber font-display text-xl font-bold text-ink">
            {customerName.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{customerName}</p>
            <p className="text-xs text-muted">Customer since Feb 2026</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
            <label htmlFor="phone" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
              Phone
            </label>
            <input
              id="phone"
              aria-invalid={!!errors.phone}
              {...register("phone")}
              className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
            />
            {errors.phone && (
              <p role="alert" className="mt-1 text-xs text-[#A3342A]">
                {errors.phone.message}
              </p>
            )}
          </div>
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
          <label htmlFor="address" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Default address
          </label>
          <textarea
            id="address"
            rows={2}
            {...register("address")}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          />
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
