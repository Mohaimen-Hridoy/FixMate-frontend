"use client";

import { useState } from "react";
import {
  appUsers,
  monthlyEarnings,
  pendingProviders as initialPending,
  services,
  type PendingProvider,
} from "@/lib/data";
import { useBookings } from "@/lib/bookings-store";
import { Eyebrow, StatCard } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { ADMIN_TABS } from "@/components/admin-tabs";

export default function AdminDashboard() {
  const { bookings } = useBookings();
  const [pending, setPending] = useState<PendingProvider[]>(initialPending);
  const [handled, setHandled] = useState<Record<string, "approved" | "rejected">>({});

  const totalUsers = appUsers.length;
  const totalProviders = appUsers.filter((u) => u.role === "provider").length;
  const totalRevenue = monthlyEarnings.reduce((sum, m) => sum + m.value, 0);

  function decide(p: PendingProvider, decision: "approved" | "rejected") {
    setHandled((h) => ({ ...h, [p.id]: decision }));
    setTimeout(() => {
      setPending((list) => list.filter((x) => x.id !== p.id));
    }, 900);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Eyebrow>Admin dashboard</Eyebrow>
      <h1 className="font-display text-3xl font-bold">Platform overview</h1>

      <DashboardTabs tabs={ADMIN_TABS} />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total users" value={String(totalUsers)} />
        <StatCard label="Active providers" value={String(totalProviders)} />
        <StatCard label="Listed services" value={String(services.length)} />
        <StatCard label="Total bookings" value={String(bookings.length)} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <StatCard label="Platform revenue (6 mo, sample provider)" value={`৳${totalRevenue.toLocaleString()}`} />
        <StatCard label="Pending provider approvals" value={String(pending.length)} />
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold">Provider approval queue</h2>
      {pending.length === 0 ? (
        <div className="ticket mt-4 p-8 text-center">
          <p className="font-display text-lg font-semibold">All caught up</p>
          <p className="mt-1 text-sm text-muted">No pending provider applications right now.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {pending.map((p) => {
            const decision = handled[p.id];
            return (
              <div key={p.id} className="ticket flex flex-wrap items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-muted">
                    {p.category.replace("-", " ")} · {p.location} · applied {p.appliedDate}
                  </p>
                  <p className="font-mono text-xs text-muted">{p.email}</p>
                </div>
                {decision ? (
                  <span className={`text-sm font-semibold ${decision === "approved" ? "text-teal" : "text-[#A3342A]"}`}>
                    {decision === "approved" ? "Approved ✓" : "Rejected ✕"}
                  </span>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => decide(p, "approved")}
                      className="rounded-full bg-teal/15 px-3 py-1.5 text-xs font-semibold text-teal"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => decide(p, "rejected")}
                      className="rounded-full bg-[#F7DCDA] px-3 py-1.5 text-xs font-semibold text-[#A3342A] dark:bg-[#3a1512] dark:text-[#ff9a8e]"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
