"use client";

import Link from "next/link";
import { demoCustomerName, getBookingsForCustomer } from "@/lib/data";
import { useBookings } from "@/lib/bookings-store";
import { useAuth } from "@/lib/use-auth";
import { Eyebrow, StatCard, StatusBadge } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { BookingsTable } from "./bookings-table";

export default function CustomerDashboard() {
  const { bookings } = useBookings();
  const { user } = useAuth();
  const myBookings = getBookingsForCustomer(bookings, user?.name || demoCustomerName);

  const total = myBookings.length;
  const pending = myBookings.filter((b) => b.status === "Pending" || b.status === "Accepted").length;
  const completed = myBookings.filter((b) => b.status === "Completed").length;
  const cancelled = myBookings.filter((b) => b.status === "Cancelled" || b.status === "Rejected").length;
  const upcoming = [...myBookings]
    .filter((b) => b.status === "Accepted" || b.status === "Pending")
    .sort((a, b) => (a.date < b.date ? -1 : 1))[0];
  const recent = [...myBookings].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Eyebrow>Customer dashboard</Eyebrow>
      <h1 className="font-display text-3xl font-bold">Welcome back</h1>

      <DashboardTabs
        tabs={[
          { href: "/dashboard/customer", label: "Overview" },
          { href: "/dashboard/customer/bookings", label: "My bookings" },
          { href: "/dashboard/customer/reviews", label: "My reviews" },
          { href: "/dashboard/customer/profile", label: "Profile" },
          { href: "/dashboard/customer/settings", label: "Settings" },
        ]}
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total bookings" value={String(total)} />
        <StatCard label="Pending / accepted" value={String(pending)} />
        <StatCard label="Completed" value={String(completed)} />
        <StatCard label="Cancelled / rejected" value={String(cancelled)} />
      </div>

      {upcoming && (
        <Link
          href={`/dashboard/customer/bookings/${upcoming.id}`}
          className="ticket mt-8 flex flex-wrap items-center justify-between gap-3 border-teal/40 p-5 transition-colors hover:border-teal"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal">Upcoming booking</p>
            <p className="mt-1 font-display text-lg font-semibold">{upcoming.serviceTitle}</p>
            <p className="text-sm text-muted">
              {upcoming.providerName} · {upcoming.date} at {upcoming.time}
            </p>
          </div>
          <StatusBadge status={upcoming.status} />
        </Link>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">Recent bookings</h2>
          <p className="mt-1 text-sm text-muted">Completed jobs can be reviewed right from this table.</p>
        </div>
        <Link
          href="/dashboard/customer/bookings"
          className="text-sm font-medium text-amber-ink underline decoration-amber decoration-2 underline-offset-4 dark:text-amber"
        >
          View all →
        </Link>
      </div>
      <BookingsTable bookings={recent} linkToDetails />
    </div>
  );
}
