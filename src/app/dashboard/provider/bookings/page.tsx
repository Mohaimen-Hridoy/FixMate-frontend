"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getBookingsForProvider, myProviderId, type BookingStatus } from "@/lib/data";
import { useBookings } from "@/lib/bookings-store";
import { Eyebrow, StatusBadge } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { BookingStatusActions } from "@/components/booking-status-actions";

const statusFilters: { value: BookingStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Pending", label: "Pending" },
  { value: "Accepted", label: "Accepted" },
  { value: "In Progress", label: "In progress" },
  { value: "Completed", label: "Completed" },
  { value: "Rejected", label: "Rejected" },
  { value: "Cancelled", label: "Cancelled" },
];

export default function ProviderBookingsPage() {
  const { bookings } = useBookings();
  const myBookings = getBookingsForProvider(bookings, myProviderId);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<BookingStatus | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...myBookings]
      .filter((b) => {
        const matchesStatus = status === "all" || b.status === status;
        const matchesQuery =
          !q || b.customerName.toLowerCase().includes(q) || b.serviceTitle.toLowerCase().includes(q);
        return matchesStatus && matchesQuery;
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [myBookings, query, status]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Eyebrow>Provider dashboard</Eyebrow>
      <h1 className="font-display text-3xl font-bold">Bookings</h1>

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

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">{filtered.length} booking{filtered.length === 1 ? "" : "s"}</h2>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customer or service"
            className="w-56 rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as BookingStatus | "all")}
            className="rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          >
            {statusFilters.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ticket mt-5 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted">
                  No bookings match this search.
                </td>
              </tr>
            )}
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium">{b.customerName}</td>
                <td className="px-4 py-3 text-muted">
                  <Link
                    href={`/dashboard/provider/bookings/${b.id}`}
                    className="hover:text-amber-ink hover:underline dark:hover:text-amber"
                  >
                    {b.serviceTitle}
                  </Link>
                  <p className="font-mono text-[11px] text-muted">{b.id}</p>
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
