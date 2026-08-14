"use client";

import { useState, type FormEvent } from "react";
import { Eyebrow } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";

export default function ProviderSettingsPage() {
  const [autoAccept, setAutoAccept] = useState(false);
  const [notifyBookings, setNotifyBookings] = useState(true);
  const [availability, setAvailability] = useState({
    days: ["Sat", "Sun", "Mon", "Tue", "Wed"],
    start: "09:00",
    end: "18:00",
  });
  const [pwStatus, setPwStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const allDays = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  function toggleDay(day: string) {
    setAvailability((a) => ({
      ...a,
      days: a.days.includes(day) ? a.days.filter((d) => d !== day) : [...a.days, day],
    }));
  }

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
      <Eyebrow>Provider dashboard</Eyebrow>
      <h1 className="font-display text-3xl font-bold">Settings</h1>

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

      <div className="ticket mt-6 p-6">
        <p className="font-display text-lg font-semibold">Availability</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {allDays.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => toggleDay(d)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                availability.days.includes(d)
                  ? "border-amber bg-amber text-ink"
                  : "border-line text-muted hover:border-amber"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="start" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
              Available from
            </label>
            <input
              id="start"
              type="time"
              value={availability.start}
              onChange={(e) => setAvailability((a) => ({ ...a, start: e.target.value }))}
              className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
            />
          </div>
          <div>
            <label htmlFor="end" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
              Available until
            </label>
            <input
              id="end"
              type="time"
              value={availability.end}
              onChange={(e) => setAvailability((a) => ({ ...a, end: e.target.value }))}
              className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
            />
          </div>
        </div>
      </div>

      <div className="ticket mt-6 p-6">
        <p className="font-display text-lg font-semibold">Booking preferences</p>
        <div className="mt-4 space-y-3">
          <label className="flex items-center justify-between gap-4 text-sm">
            <span>
              Auto-accept new bookings
              <span className="block text-xs text-muted">Skip manual approval for requests in your available hours</span>
            </span>
            <input
              type="checkbox"
              checked={autoAccept}
              onChange={(e) => setAutoAccept(e.target.checked)}
              className="h-5 w-5 accent-amber"
            />
          </label>
          <label className="flex items-center justify-between gap-4 text-sm">
            <span>
              Booking notifications
              <span className="block text-xs text-muted">New requests and status changes</span>
            </span>
            <input
              type="checkbox"
              checked={notifyBookings}
              onChange={(e) => setNotifyBookings(e.target.checked)}
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
    </div>
  );
}
