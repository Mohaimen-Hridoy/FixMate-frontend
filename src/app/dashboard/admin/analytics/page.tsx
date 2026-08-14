"use client";

import { useMemo } from "react";
import { useBookings } from "@/lib/bookings-store";
import { categories, platformMonthlyStats, type BookingStatus } from "@/lib/data";
import { Eyebrow, StatCard } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { ADMIN_TABS } from "@/components/admin-tabs";

const statusOrder: BookingStatus[] = ["Pending", "Accepted", "In Progress", "Completed", "Rejected", "Cancelled"];

const statusBarColor: Record<BookingStatus, string> = {
  Pending: "bg-[#E8B24A]",
  Accepted: "bg-teal",
  "In Progress": "bg-[#5470C4]",
  Completed: "bg-[#5FA845]",
  Rejected: "bg-[#C4544A]",
  Cancelled: "bg-[#9AA1AD]",
};

export default function AdminAnalyticsPage() {
  const { bookings } = useBookings();

  const totalBookings6mo = platformMonthlyStats.reduce((sum, m) => sum + m.bookings, 0);
  const totalRevenue6mo = platformMonthlyStats.reduce((sum, m) => sum + m.revenue, 0);
  const totalNewUsers6mo = platformMonthlyStats.reduce((sum, m) => sum + m.newUsers, 0);
  const thisMonth = platformMonthlyStats[platformMonthlyStats.length - 1];
  const lastMonth = platformMonthlyStats[platformMonthlyStats.length - 2];
  const revenueMoM = lastMonth ? Math.round(((thisMonth.revenue - lastMonth.revenue) / lastMonth.revenue) * 100) : 0;

  const maxBookings = Math.max(...platformMonthlyStats.map((m) => m.bookings));
  const maxRevenue = Math.max(...platformMonthlyStats.map((m) => m.revenue));
  const maxUsers = Math.max(...platformMonthlyStats.map((m) => m.newUsers));

  const statusCounts = useMemo(() => {
    const counts = Object.fromEntries(statusOrder.map((s) => [s, 0])) as Record<BookingStatus, number>;
    for (const b of bookings) counts[b.status] += 1;
    return counts;
  }, [bookings]);
  const maxStatusCount = Math.max(1, ...Object.values(statusCounts));

  const sortedCategories = [...categories].sort((a, b) => b.count - a.count);
  const maxCategoryCount = Math.max(1, ...sortedCategories.map((c) => c.count));

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Eyebrow>Admin dashboard</Eyebrow>
      <h1 className="font-display text-3xl font-bold">Platform overview</h1>

      <DashboardTabs tabs={ADMIN_TABS} />

      <h2 className="mt-8 font-display text-xl font-semibold">Analytics</h2>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Bookings (6 mo)" value={String(totalBookings6mo)} />
        <StatCard label="Revenue (6 mo)" value={`৳${totalRevenue6mo.toLocaleString()}`} />
        <StatCard label="New users (6 mo)" value={String(totalNewUsers6mo)} />
        <StatCard label="Revenue MoM" value={`${revenueMoM >= 0 ? "+" : ""}${revenueMoM}%`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="ticket p-5">
          <p className="mb-4 font-display text-lg font-semibold">Monthly bookings</p>
          <div className="flex h-40 items-end gap-4">
            {platformMonthlyStats.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="font-mono text-[10px] text-muted">{m.bookings}</span>
                <div
                  className="w-full rounded-t-md bg-amber transition-all"
                  style={{ height: `${(m.bookings / maxBookings) * 100}%` }}
                  title={`${m.bookings} bookings`}
                />
                <span className="font-mono text-[10px] text-muted">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ticket p-5">
          <p className="mb-4 font-display text-lg font-semibold">Monthly revenue</p>
          <div className="flex h-40 items-end gap-4">
            {platformMonthlyStats.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="font-mono text-[10px] text-muted">৳{Math.round(m.revenue / 1000)}k</span>
                <div
                  className="w-full rounded-t-md bg-teal transition-all"
                  style={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
                  title={`৳${m.revenue.toLocaleString()}`}
                />
                <span className="font-mono text-[10px] text-muted">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ticket p-5">
          <p className="mb-4 font-display text-lg font-semibold">User growth (new signups)</p>
          <div className="flex h-40 items-end gap-4">
            {platformMonthlyStats.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="font-mono text-[10px] text-muted">{m.newUsers}</span>
                <div
                  className="w-full rounded-t-md bg-[#5470C4] transition-all"
                  style={{ height: `${(m.newUsers / maxUsers) * 100}%` }}
                  title={`${m.newUsers} new users`}
                />
                <span className="font-mono text-[10px] text-muted">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ticket p-5">
          <p className="mb-4 font-display text-lg font-semibold">Booking status distribution</p>
          <div className="space-y-3">
            {statusOrder.map((s) => (
              <div key={s}>
                <div className="mb-1 flex justify-between gap-2 text-xs text-muted">
                  <span>{s}</span>
                  <span className="font-mono">{statusCounts[s]}</span>
                </div>
                <div className="h-2 rounded-full bg-line">
                  <div
                    className={`h-2 rounded-full ${statusBarColor[s]}`}
                    style={{ width: `${(statusCounts[s] / maxStatusCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ticket p-5 lg:col-span-2">
          <p className="mb-4 font-display text-lg font-semibold">Popular service categories</p>
          <div className="space-y-3">
            {sortedCategories.map((c) => (
              <div key={c.slug}>
                <div className="mb-1 flex justify-between gap-2 text-xs text-muted">
                  <span>
                    {c.icon} {c.name}
                  </span>
                  <span className="font-mono">{c.count}</span>
                </div>
                <div className="h-2 rounded-full bg-line">
                  <div
                    className="h-2 rounded-full bg-amber"
                    style={{ width: `${(c.count / maxCategoryCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
