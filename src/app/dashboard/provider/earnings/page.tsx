"use client";

import { getBookingsForProvider, monthlyEarnings, myProviderId } from "@/lib/data";
import { useBookings } from "@/lib/bookings-store";
import { Eyebrow, StatCard, StatusBadge } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";

export default function ProviderEarningsPage() {
  const { bookings } = useBookings();
  const providerBookings = getBookingsForProvider(bookings, myProviderId);
  const completed = providerBookings.filter((b) => b.status === "Completed");

  const totalEarnings = monthlyEarnings.reduce((sum, m) => sum + m.value, 0);
  const maxEarning = Math.max(...monthlyEarnings.map((m) => m.value));
  const avgJobValue = completed.length ? Math.round(totalEarnings / completed.length) : 0;
  const thisMonth = monthlyEarnings[monthlyEarnings.length - 1];
  const lastMonth = monthlyEarnings[monthlyEarnings.length - 2];
  const momChange = lastMonth ? Math.round(((thisMonth.value - lastMonth.value) / lastMonth.value) * 100) : 0;

  const byService = Object.values(
    completed.reduce<Record<string, { title: string; total: number; jobs: number }>>((acc, b) => {
      acc[b.serviceTitle] ??= { title: b.serviceTitle, total: 0, jobs: 0 };
      acc[b.serviceTitle].total += b.amount;
      acc[b.serviceTitle].jobs += 1;
      return acc;
    }, {})
  ).sort((a, b) => b.total - a.total);
  const maxService = Math.max(1, ...byService.map((s) => s.total));

  const recentPayouts = [...completed].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 8);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Eyebrow>Provider dashboard</Eyebrow>
      <h1 className="font-display text-3xl font-bold">CoolFix AC Service</h1>

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

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total earnings (6 mo)" value={`৳${totalEarnings.toLocaleString()}`} />
        <StatCard label="This month" value={`৳${thisMonth.value.toLocaleString()}`} />
        <StatCard
          label="Month over month"
          value={`${momChange >= 0 ? "+" : ""}${momChange}%`}
        />
        <StatCard label="Avg. job value" value={`৳${avgJobValue.toLocaleString()}`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="ticket p-5">
          <p className="mb-4 font-display text-lg font-semibold">Monthly earnings</p>
          <div className="flex h-44 items-end gap-4">
            {monthlyEarnings.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="font-mono text-[10px] text-muted">৳{m.value.toLocaleString()}</span>
                <div
                  className="w-full rounded-t-md bg-amber transition-all"
                  style={{ height: `${(m.value / maxEarning) * 100}%` }}
                  title={`৳${m.value}`}
                />
                <span className="font-mono text-[10px] text-muted">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ticket p-5">
          <p className="mb-4 font-display text-lg font-semibold">Earnings by service</p>
          {byService.length === 0 ? (
            <p className="text-sm text-muted">No completed jobs yet.</p>
          ) : (
            <div className="space-y-3">
              {byService.map((s) => (
                <div key={s.title}>
                  <div className="mb-1 flex justify-between gap-2 text-xs text-muted">
                    <span className="truncate">{s.title}</span>
                    <span className="shrink-0 font-mono">৳{s.total.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full bg-line">
                    <div className="h-2 rounded-full bg-teal" style={{ width: `${(s.total / maxService) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold">Recent completed jobs</h2>
      <div className="ticket mt-4 overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Booking</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Completed</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentPayouts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted">
                  No completed jobs yet.
                </td>
              </tr>
            )}
            {recentPayouts.map((b) => (
              <tr key={b.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{b.serviceTitle}</p>
                  <p className="font-mono text-[11px] text-muted">{b.id}</p>
                </td>
                <td className="px-4 py-3 text-muted">{b.customerName}</td>
                <td className="px-4 py-3 text-muted">{b.date}</td>
                <td className="px-4 py-3 font-mono">৳{b.amount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={b.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
