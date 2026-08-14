"use client";

import { useMemo, useState } from "react";
import { categories, services as seedServices, type Service } from "@/lib/data";
import { Eyebrow, RatingStars, StatCard } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { ADMIN_TABS } from "@/components/admin-tabs";

type SortKey = "newest" | "price-asc" | "price-desc" | "rating-desc";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>(seedServices);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState<"all" | "available" | "unavailable">("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<Service | null>(null);
  const pageSize = 6;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = services.filter((s) => {
      const matchesQuery =
        !q || s.title.toLowerCase().includes(q) || s.provider.name.toLowerCase().includes(q);
      const matchesCategory = category === "all" || s.category === category;
      const matchesAvailability =
        availability === "all" ||
        (availability === "available" ? s.available : !s.available);
      return matchesQuery && matchesCategory && matchesAvailability;
    });
    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating-desc") return b.rating - a.rating;
      return 0;
    });
    return list;
  }, [services, query, category, availability, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  function toggleAvailability(id: string) {
    setServices((list) => list.map((s) => (s.id === id ? { ...s, available: !s.available } : s)));
  }

  function removeService() {
    if (!confirmDelete) return;
    setServices((list) => list.filter((s) => s.id !== confirmDelete.id));
    setConfirmDelete(null);
  }

  const availableCount = services.filter((s) => s.available).length;
  const avgPrice = services.length
    ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length)
    : 0;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Eyebrow>Admin dashboard</Eyebrow>
      <h1 className="font-display text-3xl font-bold">Platform overview</h1>

      <DashboardTabs tabs={ADMIN_TABS} />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total services" value={String(services.length)} />
        <StatCard label="Available" value={String(availableCount)} />
        <StatCard label="Categories" value={String(categories.length)} />
        <StatCard label="Avg. price" value={`৳${avgPrice.toLocaleString()}`} />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Services ({filtered.length})</h2>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search title or provider"
            className="w-52 rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={availability}
            onChange={(e) => {
              setAvailability(e.target.value as typeof availability);
              setPage(1);
            }}
            className="rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          >
            <option value="all">Any availability</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating-desc">Highest rated</option>
          </select>
        </div>
      </div>

      <div className="ticket mt-5 overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Provider</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((s) => (
              <tr key={s.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium">
                  {s.title}
                  <p className="font-mono text-[11px] font-normal text-muted">{s.category.replace("-", " ")}</p>
                </td>
                <td className="px-4 py-3 text-muted">{s.provider.name}</td>
                <td className="px-4 py-3 font-mono">
                  ৳{s.price.toLocaleString()}/{s.priceUnit}
                </td>
                <td className="px-4 py-3">
                  <RatingStars rating={s.rating} reviewCount={s.reviewCount} />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      s.available
                        ? "bg-teal/15 text-teal"
                        : "bg-[#EDEBE5] text-[#5B6472] dark:bg-[#22262f] dark:text-[#9aa1ad]"
                    }`}
                  >
                    {s.available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => toggleAvailability(s.id)}
                      className="text-xs font-semibold text-amber-ink hover:underline dark:text-amber"
                    >
                      {s.available ? "Mark unavailable" : "Mark available"}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(s)}
                      className="text-xs font-semibold text-[#A3342A] hover:underline dark:text-[#ff9a8e]"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted">
                  No services match this search.
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

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="ticket w-full max-w-sm p-6">
            <p className="font-display text-lg font-semibold">Delete this service?</p>
            <p className="mt-2 text-sm text-muted">
              &ldquo;{confirmDelete.title}&rdquo; will be removed from the platform. This can&apos;t be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={removeService}
                className="rounded-full bg-[#A3342A] px-4 py-2 text-sm font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
