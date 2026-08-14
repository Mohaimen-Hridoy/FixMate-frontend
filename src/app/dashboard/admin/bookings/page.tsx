"use client";

import { useMemo, useState } from "react";
import { useBookings } from "@/lib/bookings-store";
import type { BookingStatus } from "@/lib/data";
import { Eyebrow, StatCard, StatusBadge } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { ADMIN_TABS } from "@/components/admin-tabs";

type SortKey = "newest" | "amount-desc" | "amount-asc";

const statusFilters: { value: BookingStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Pending", label: "Pending" },
  { value: "Accepted", label: "Accepted" },
  { value: "In Progress", label: "In progress" },
  { value: "Completed", label: "Completed" },
  { value: "Rejected", label: "Rejected" },
  { value: "Cancelled", label: "Cancelled" },
];

export default function AdminBookingsPage() {
  const { bookings, cancelBooking } = useBookings();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = bookings.filter((b) => {
      const matchesQuery =
        !q ||
        b.customerName.toLowerCase().includes(q) ||
        b.providerName.toLowerCase().includes(q) ||
        b.serviceTitle.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q);
      const matchesStatus = status === "all" || b.status === status;
      return matchesQuery && matchesStatus;
    });
    list = [...list].sort((a, b) => {
      if (sort === "amount-desc") return b.amount - a.amount;
      if (sort === "amount-asc") return a.amount - b.amount;
      return a.createdAt < b.createdAt ? 1 : -1;
    });
    return list;
  }, [bookings, query, status, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const totalRevenue = bookings
    .filter((b) => b.status === "Completed")
    .reduce((sum, b) => sum + b.amount, 0);
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;
  const disputeEligible = bookings.filter((b) => b.status === "Accepted" || b.status === "In Progress").length;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Eyebrow>Admin dashboard</Eyebrow>
      <h1 className="font-display text-3xl font-bold">Platform overview</h1>

      <DashboardTabs tabs={ADMIN_TABS} />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total bookings" value={String(bookings.length)} />
        <StatCard label="Pending" value={String(pendingCount)} />
        <StatCard label="In progress / accepted" value={String(disputeEligible)} />
        <StatCard label="Completed revenue" value={`৳${totalRevenue.toLocaleString()}`} />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Bookings ({filtered.length})</h2>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search customer, provider, ID"
            className="w-56 rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as BookingStatus | "all");
              setPage(1);
            }}
            className="rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          >
            {statusFilters.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          >
            <option value="newest">Newest</option>
            <option value="amount-desc">Amount: High → Low</option>
            <option value="amount-asc">Amount: Low → High</option>
          </select>
        </div>
      </div>

      <div className="ticket mt-5 overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Booking</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Provider</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((b) => (
              <tr key={b.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{b.serviceTitle}</p>
                  <p className="font-mono text-[11px] text-muted">{b.id}</p>
                </td>
                <td className="px-4 py-3 text-muted">{b.customerName}</td>
                <td className="px-4 py-3 text-muted">{b.providerName}</td>
                <td className="px-4 py-3 text-muted">
                  {b.date} · {b.time}
                </td>
                <td className="px-4 py-3 font-mono">৳{b.amount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={b.status} />
                </td>
                <td className="px-4 py-3">
                  {(b.status === "Pending" || b.status === "Accepted") ? (
                    <button
                      onClick={() => cancelBooking(b.id, "Cancelled by admin — platform intervention")}
                      className="text-xs font-semibold text-[#A3342A] hover:underline dark:text-[#ff9a8e]"
                    >
                      Force cancel
                    </button>
                  ) : (
                    <span className="text-xs text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted">
                  No bookings match this search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="mt-4 flex items-center justify-between gap-3 text-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-full border border-line px-3 py-1.5 font-medium transition-colors hover:border-amber disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-xs text-muted">
            Page {page} of {pageCount}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
            className="rounded-full border border-line px-3 py-1.5 font-medium transition-colors hover:border-amber disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
