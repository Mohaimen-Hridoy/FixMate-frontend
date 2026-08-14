"use client";

import { useState, type FormEvent } from "react";
import { Eyebrow } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { ADMIN_TABS } from "@/components/admin-tabs";

export default function AdminSettingsPage() {
  const [commissionRate, setCommissionRate] = useState(12);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoApproveProviders, setAutoApproveProviders] = useState(false);
  const [requireReviewApproval, setRequireReviewApproval] = useState(false);
  const [generalStatus, setGeneralStatus] = useState<"idle" | "loading" | "success">("idle");

  function handleGeneralSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGeneralStatus("loading");
    setTimeout(() => setGeneralStatus("success"), 700);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Eyebrow>Admin dashboard</Eyebrow>
      <h1 className="font-display text-3xl font-bold">Platform overview</h1>

      <DashboardTabs tabs={ADMIN_TABS} />

      <form onSubmit={handleGeneralSubmit} className="ticket mt-6 space-y-4 p-6" noValidate>
        <p className="font-display text-lg font-semibold">Platform details</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="platform-name" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
              Platform name
            </label>
            <input
              id="platform-name"
              defaultValue="FixMate"
              className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
            />
          </div>
          <div>
            <label htmlFor="support-email" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
              Support email
            </label>
            <input
              id="support-email"
              type="email"
              defaultValue="support@fixmate.com"
              className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
            />
          </div>
        </div>
        <div>
          <label htmlFor="commission" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Platform commission rate: {commissionRate}%
          </label>
          <input
            id="commission"
            type="range"
            min={0}
            max={30}
            value={commissionRate}
            onChange={(e) => setCommissionRate(Number(e.target.value))}
            className="w-full accent-amber"
          />
          <p className="mt-1 text-xs text-muted">Applied to each completed booking before provider payout.</p>
        </div>
        {generalStatus === "success" && (
          <p role="status" className="text-sm text-teal">
            Settings saved.
          </p>
        )}
        <button
          type="submit"
          disabled={generalStatus === "loading"}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-60 dark:bg-amber dark:text-ink"
        >
          {generalStatus === "loading" ? "Saving…" : "Save settings"}
        </button>
      </form>

      <div className="ticket mt-6 p-6">
        <p className="font-display text-lg font-semibold">Platform controls</p>
        <div className="mt-4 space-y-3">
          <label className="flex items-center justify-between gap-4 text-sm">
            <span>
              Maintenance mode
              <span className="block text-xs text-muted">Show a maintenance banner and block new bookings</span>
            </span>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="h-5 w-5 accent-amber"
            />
          </label>
          <label className="flex items-center justify-between gap-4 text-sm">
            <span>
              Auto-approve new providers
              <span className="block text-xs text-muted">Skip the manual approval queue for new signups</span>
            </span>
            <input
              type="checkbox"
              checked={autoApproveProviders}
              onChange={(e) => setAutoApproveProviders(e.target.checked)}
              className="h-5 w-5 accent-amber"
            />
          </label>
          <label className="flex items-center justify-between gap-4 text-sm">
            <span>
              Require review approval
              <span className="block text-xs text-muted">New reviews stay hidden until an admin approves them</span>
            </span>
            <input
              type="checkbox"
              checked={requireReviewApproval}
              onChange={(e) => setRequireReviewApproval(e.target.checked)}
              className="h-5 w-5 accent-amber"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
