"use client";

import { useMemo, useState } from "react";
import { categories, getAllProviders, type Provider } from "@/lib/data";
import { Eyebrow, RatingStars, StatCard } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { ADMIN_TABS } from "@/components/admin-tabs";

type SortKey = "rating-desc" | "jobs-desc" | "newest";

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>(getAllProviders());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortKey>("rating-desc");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = providers.filter((p) => {
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
      const matchesCategory = category === "all" || p.category === category;
      return matchesQuery && matchesCategory;
    });
    list = [...list].sort((a, b) => {
      if (sort === "rating-desc") return b.rating - a.rating;
      if (sort === "jobs-desc") return b.jobsCompleted - a.jobsCompleted;
      return b.yearsActive - a.yearsActive;
    });
    return list;
  }, [providers, query, category, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  function toggleVerified(id: string) {
    setProviders((list) => list.map((p) => (p.id === id ? { ...p, verified: !p.verified } : p)));
  }

  const verifiedCount = providers.filter((p) => p.verified).length;
  const avgRating = providers.length
    ? (providers.reduce((sum, p) => sum + p.rating, 0) / providers.length).toFixed(1)
    : "0.0";

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Eyebrow>Admin dashboard</Eyebrow>
      <h1 className="font-display text-3xl font-bold">Platform overview</h1>

      <DashboardTabs tabs={ADMIN_TABS} />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total providers" value={String(providers.length)} />
        <StatCard label="Verified" value={String(verifiedCount)} />
        <StatCard label="Avg. rating" value={avgRating} />
        <StatCard label="Categories covered" value={String(new Set(providers.map((p) => p.category)).size)} />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Providers ({filtered.length})</h2>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search name or location"
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
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          >
            <option value="rating-desc">Highest rated</option>
            <option value="jobs-desc">Most jobs completed</option>
            <option value="newest">Most years active</option>
          </select>
        </div>
      </div>

      <div className="ticket mt-5 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Provider</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Jobs done</th>
              <th className="px-4 py-3 font-medium">Verified</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 capitalize text-muted">{p.category.replace("-", " ")}</td>
                <td className="px-4 py-3 text-muted">{p.location}</td>
                <td className="px-4 py-3">
                  <RatingStars rating={p.rating} reviewCount={p.reviewCount} />
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{p.jobsCompleted}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      p.verified
                        ? "bg-teal/15 text-teal"
                        : "bg-[#FFF3D6] text-[#7A4A00] dark:bg-[#3a2c0f] dark:text-[#ffd479]"
                    }`}
                  >
                    {p.verified ? "Verified" : "Unverified"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleVerified(p.id)}
                    className="text-xs font-semibold text-amber-ink hover:underline dark:text-amber"
                  >
                    {p.verified ? "Unverify" : "Verify"}
                  </button>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted">
                  No providers match this search.
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
