"use client";

import { useState, type FormEvent } from "react";
import { Eyebrow } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { useBookings } from "@/lib/bookings-store";
import { useReviews } from "@/lib/reviews-store";

export default function CustomerSettingsPage() {
  const { resetDemoData: resetBookings } = useBookings();
  const { resetDemoData: resetReviews } = useReviews();

  const [notifyBookings, setNotifyBookings] = useState(true);
  const [notifyPromos, setNotifyPromos] = useState(false);
  const [pwStatus, setPwStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function handlePasswordSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const next = String(form.get("newPassword") ?? "");
    if (String(form.get("currentPassword") ?? "").length < 4 || next.length < 8) {
      setPwStatus("error");
      return;
    }
    setPwStatus("loading");
    setTimeout(() => setPwStatus("success"), 800);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Eyebrow>Customer dashboard</Eyebrow>
      <h1 className="font-display text-3xl font-bold">Settings</h1>

      <DashboardTabs
        tabs={[
          { href: "/dashboard/customer", label: "Overview" },
          { href: "/dashboard/customer/bookings", label: "My bookings" },
          { href: "/dashboard/customer/reviews", label: "My reviews" },
          { href: "/dashboard/customer/profile", label: "Profile" },
          { href: "/dashboard/customer/settings", label: "Settings" },
        ]}
      />

      <div className="ticket mt-6 p-6">
        <p className="font-display text-lg font-semibold">Notifications</p>
        <div className="mt-4 space-y-3">
          <label className="flex items-center justify-between gap-4 text-sm">
            <span>
              Booking updates
              <span className="block text-xs text-muted">Status changes on your bookings</span>
            </span>
            <input
              type="checkbox"
              checked={notifyBookings}
              onChange={(e) => setNotifyBookings(e.target.checked)}
              className="h-5 w-5 accent-amber"
            />
          </label>
          <label className="flex items-center justify-between gap-4 text-sm">
            <span>
              Offers &amp; promotions
              <span className="block text-xs text-muted">Occasional deals from FixMate</span>
            </span>
            <input
              type="checkbox"
              checked={notifyPromos}
              onChange={(e) => setNotifyPromos(e.target.checked)}
              className="h-5 w-5 accent-amber"
            />
          </label>
        </div>
      </div>

      <form onSubmit={handlePasswordSubmit} className="ticket mt-6 space-y-4 p-6" noValidate>
        <p className="font-display text-lg font-semibold">Change password</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="currentPassword" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
              Current password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
              New password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
            />
          </div>
        </div>
        {pwStatus === "error" && (
          <p role="alert" className="text-sm text-[#A3342A]">
            Enter your current password and a new password of at least 8 characters.
          </p>
        )}
        {pwStatus === "success" && (
          <p role="status" className="text-sm text-teal">
            Password updated.
          </p>
        )}
        <button
          type="submit"
          disabled={pwStatus === "loading"}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-60 dark:bg-amber dark:text-ink"
        >
          {pwStatus === "loading" ? "Updating…" : "Update password"}
        </button>
      </form>

      <div className="ticket mt-6 p-6">
        <p className="font-display text-lg font-semibold">Demo data</p>
        <p className="mt-1 text-sm text-muted">
          Reset the bookings and reviews you&apos;ve created in this demo session back to the seed data.
        </p>
        <button
          onClick={() => {
            resetBookings();
            resetReviews();
          }}
          className="mt-4 rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-amber"
        >
          Reset demo data
        </button>
      </div>
    </div>
  );
}
