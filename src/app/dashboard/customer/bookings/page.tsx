"use client";

import { useMemo, useState } from "react";
import { demoCustomerName, getBookingsForCustomer, type BookingStatus } from "@/lib/data";
import { useBookings } from "@/lib/bookings-store";
import { useAuth } from "@/lib/use-auth";
import { Eyebrow } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { BookingsTable } from "../bookings-table";

const statusFilters: { value: BookingStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Pending", label: "Pending" },
  { value: "Accepted", label: "Accepted" },
  { value: "In Progress", label: "In progress" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "Rejected", label: "Rejected" },
];

export default function CustomerBookingsPage() {
  const { bookings } = useBookings();
  const { user } = useAuth();
  const myBookings = getBookingsForCustomer(bookings, user?.name || demoCustomerName);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<BookingStatus | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...myBookings]
      .filter((b) => {
        const matchesStatus = status === "all" || b.status === status;
        const matchesQuery =
          !q || b.serviceTitle.toLowerCase().includes(q) || b.providerName.toLowerCase().includes(q);
        return matchesStatus && matchesQuery;
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [myBookings, query, status]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Eyebrow>Customer dashboard</Eyebrow>
      <h1 className="font-display text-3xl font-bold">My bookings</h1>

      <DashboardTabs
        tabs={[
          { href: "/dashboard/customer", label: "Overview" },
          { href: "/dashboard/customer/bookings", label: "My bookings" },
          { href: "/dashboard/customer/reviews", label: "My reviews" },
          { href: "/dashboard/customer/profile", label: "Profile" },
          { href: "/dashboard/customer/settings", label: "Settings" },
        ]}
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">{filtered.length} booking{filtered.length === 1 ? "" : "s"}</h2>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search service or provider"
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

      <BookingsTable bookings={filtered} linkToDetails />
    </div>
  );
}
