"use client";

import Link from "next/link";
import { getBookingsForProvider, getServicesByProvider, monthlyEarnings, myProviderId } from "@/lib/data";
import { useBookings } from "@/lib/bookings-store";
import { Eyebrow, StatCard, StatusBadge } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { BookingStatusActions } from "@/components/booking-status-actions";

export default function ProviderDashboard() {
  const { bookings } = useBookings();
  const providerBookings = getBookingsForProvider(bookings, myProviderId);

  const totalServices = getServicesByProvider(myProviderId).length;
  const totalBookings = providerBookings.length;
  const completedJobs = providerBookings.filter((b) => b.status === "Completed").length;
  const totalEarnings = monthlyEarnings.reduce((sum, m) => sum + m.value, 0);
  const maxEarning = Math.max(...monthlyEarnings.map((m) => m.value));

  const recentBookings = [...providerBookings].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 5);

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
        <StatCard label="Active services" value={String(totalServices)} />
        <StatCard label="Total bookings" value={String(totalBookings)} />
        <StatCard label="Completed jobs" value={String(completedJobs)} />
        <StatCard label="Total earnings" value={`৳${totalEarnings.toLocaleString()}`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="ticket p-5">
          <p className="mb-4 font-display text-lg font-semibold">Monthly earnings</p>
          <div className="flex h-40 items-end gap-4">
            {monthlyEarnings.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
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
          <p className="mb-4 font-display text-lg font-semibold">Booking status mix</p>
          <div className="space-y-3">
            {(["Pending", "Accepted", "In Progress", "Completed"] as const).map((status) => {
              const count = providerBookings.filter((b) => b.status === status).length;
              const pct = totalBookings ? (count / totalBookings) * 100 : 0;
              return (
                <div key={status}>
                  <div className="mb-1 flex justify-between text-xs text-muted">
                    <span>{status}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-line">
                    <div className="h-2 rounded-full bg-teal" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Booking requests</h2>
        <Link
          href="/dashboard/provider/bookings"
          className="text-sm font-medium text-amber-ink underline decoration-amber decoration-2 underline-offset-4 dark:text-amber"
        >
          View all →
        </Link>
      </div>
      <div className="ticket mt-4 overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted">
                  No bookings yet.
                </td>
              </tr>
            )}
            {recentBookings.map((b) => (
              <tr key={b.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/dashboard/provider/bookings/${b.id}`}
                    className="hover:text-amber-ink hover:underline dark:hover:text-amber"
                  >
                    {b.customerName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">
                  {b.date} · {b.time}
                </td>
                <td className="px-4 py-3 font-mono">৳{b.amount}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={b.status} />
                </td>
                <td className="px-4 py-3">
                  <BookingStatusActions booking={b} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
