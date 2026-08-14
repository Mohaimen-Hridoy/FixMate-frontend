"use client";

import Link from "next/link";
import { useState } from "react";
import { getServicesByProvider, myProviderId, type Service } from "@/lib/data";
import { Eyebrow } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";

export default function MyServicesPage() {
  const [items, setItems] = useState<Service[]>(getServicesByProvider(myProviderId));

  function toggleAvailable(id: string) {
    setItems((list) => list.map((s) => (s.id === id ? { ...s, available: !s.available } : s)));
  }

  function remove(id: string) {
    if (!confirm("Delete this service? This can't be undone.")) return;
    setItems((list) => list.filter((s) => s.id !== id));
  }

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

      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">My services ({items.length})</h2>
        <Link
          href="/dashboard/provider/services/new"
          className="rounded-full bg-amber px-4 py-2 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
        >
          + Add service
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="ticket mt-6 p-8 text-center">
          <p className="font-display text-lg font-semibold">No services yet</p>
          <p className="mt-1 text-sm text-muted">Add your first service so customers can find and book you.</p>
        </div>
      ) : (
        <div className="ticket mt-6 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium">{s.title}</td>
                  <td className="px-4 py-3 text-muted capitalize">{s.category.replace("-", " ")}</td>
                  <td className="px-4 py-3 font-mono">
                    ৳{s.price}
                    <span className="text-muted">/{s.priceUnit}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleAvailable(s.id)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        s.available
                          ? "bg-teal/15 text-teal"
                          : "bg-[#EDEBE5] text-muted dark:bg-[#22262f]"
                      }`}
                    >
                      {s.available ? "Available" : "Paused"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3 text-xs font-semibold">
                      <Link href={`/dashboard/provider/services/${s.id}/edit`} className="text-amber-ink hover:underline dark:text-amber">
                        Edit
                      </Link>
                      <button onClick={() => remove(s.id)} className="text-[#A3342A] hover:underline dark:text-[#ff9a8e]">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
