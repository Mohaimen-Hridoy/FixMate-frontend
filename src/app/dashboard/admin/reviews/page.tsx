"use client";

import { useMemo, useState } from "react";
import { useReviews } from "@/lib/reviews-store";
import { services } from "@/lib/data";
import { Eyebrow, RatingStars, StatCard } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { ADMIN_TABS } from "@/components/admin-tabs";

export default function AdminReviewsPage() {
  const { allReviews } = useReviews();
  const [query, setQuery] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const serviceById = useMemo(() => new Map(services.map((s) => [s.id, s])), []);

  const visible = useMemo(
    () => allReviews.filter((r) => !hidden.has(r.id)),
    [allReviews, hidden]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return visible.filter((r) => {
      const service = serviceById.get(r.serviceId);
      const matchesQuery =
        !q ||
        r.customerName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        service?.title.toLowerCase().includes(q) ||
        service?.provider.name.toLowerCase().includes(q);
      const matchesRating = r.rating >= minRating;
      return matchesQuery && matchesRating;
    });
  }, [visible, query, minRating, serviceById]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  function hideReview(id: string) {
    setHidden((set) => new Set(set).add(id));
  }

  const avgRating = visible.length
    ? (visible.reduce((sum, r) => sum + r.rating, 0) / visible.length).toFixed(1)
    : "0.0";
  const lowRatingCount = visible.filter((r) => r.rating <= 2).length;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Eyebrow>Admin dashboard</Eyebrow>
      <h1 className="font-display text-3xl font-bold">Platform overview</h1>

      <DashboardTabs tabs={ADMIN_TABS} />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total reviews" value={String(visible.length)} />
        <StatCard label="Platform avg. rating" value={avgRating} />
        <StatCard label="2★ or lower" value={String(lowRatingCount)} />
        <StatCard label="Hidden by moderation" value={String(hidden.size)} />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Reviews ({filtered.length})</h2>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search customer, service, comment"
            className="w-64 rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          />
          <select
            value={minRating}
            onChange={(e) => {
              setMinRating(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          >
            <option value={0}>Any rating</option>
            <option value={4}>4★ and up</option>
            <option value={3}>3★ and up</option>
            <option value={1}>Flag 2★ and below</option>
          </select>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {paged.map((r) => {
          const service = serviceById.get(r.serviceId);
          return (
            <div key={r.id} className="ticket flex flex-wrap items-start justify-between gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{r.customerName}</p>
                  <RatingStars rating={r.rating} />
                  <span className="font-mono text-xs text-muted">{r.date}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{r.comment}</p>
                {service && (
                  <p className="mt-2 font-mono text-xs text-muted">
                    {service.title} · {service.provider.name}
                  </p>
                )}
              </div>
              <button
                onClick={() => hideReview(r.id)}
                className="shrink-0 text-xs font-semibold text-[#A3342A] hover:underline dark:text-[#ff9a8e]"
              >
                Hide
              </button>
            </div>
          );
        })}
        {paged.length === 0 && (
          <div className="ticket p-8 text-center text-sm text-muted">No reviews match this search.</div>
        )}
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
