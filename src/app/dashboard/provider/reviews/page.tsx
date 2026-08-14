"use client";

import { useMemo, useState } from "react";
import { getFeaturedProviders, getProviderById, myProviderId } from "@/lib/data";
import { useReviews } from "@/lib/reviews-store";
import { Eyebrow, Pagination, StatCard } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";

const PAGE_SIZE = 6;

const ratingFilters: { value: number | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: 5, label: "5 stars" },
  { value: 4, label: "4 stars" },
  { value: 3, label: "3 stars" },
  { value: 2, label: "2 stars & below" },
];

export default function ProviderReviewsPage() {
  const provider = getProviderById(myProviderId) ?? getFeaturedProviders(1)[0];
  const { getReviewsForProvider, getLiveProviderRating } = useReviews();

  const [minRating, setMinRating] = useState<number | "all">("all");
  const [page, setPage] = useState(1);

  const allReviews = getReviewsForProvider(myProviderId);
  const live = getLiveProviderRating(provider.rating, provider.reviewCount, myProviderId);

  const filtered = useMemo(() => {
    return allReviews.filter((r) => {
      if (minRating === "all") return true;
      if (minRating === 2) return r.rating <= 2;
      return r.rating === minRating;
    });
  }, [allReviews, minRating]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: allReviews.filter((r) => r.rating === star).length,
  }));
  const maxBucket = Math.max(1, ...distribution.map((d) => d.count));

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

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Average rating" value={live.rating.toFixed(1)} />
        <StatCard label="Total reviews" value={String(live.count)} />
        <StatCard
          label="5-star share"
          value={`${allReviews.length ? Math.round((distribution[0].count / allReviews.length) * 100) : 0}%`}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <div className="ticket p-5">
          <p className="mb-4 font-display text-lg font-semibold">Rating breakdown</p>
          <div className="space-y-3">
            {distribution.map((d) => (
              <div key={d.star}>
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span>{d.star} star</span>
                  <span>{d.count}</span>
                </div>
                <div className="h-2 rounded-full bg-line">
                  <div className="h-2 rounded-full bg-amber" style={{ width: `${(d.count / maxBucket) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold">
              {filtered.length} review{filtered.length === 1 ? "" : "s"}
            </h2>
            <div className="flex rounded-full border border-line p-1 text-xs font-medium">
              {ratingFilters.map((f) => (
                <button
                  key={String(f.value)}
                  onClick={() => {
                    setMinRating(f.value);
                    setPage(1);
                  }}
                  className={`rounded-full px-3 py-1.5 transition-colors ${
                    minRating === f.value ? "bg-ink text-paper dark:bg-amber dark:text-ink" : ""
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {pageItems.length === 0 ? (
            <div className="ticket mt-4 p-8 text-center">
              <p className="font-display text-lg font-semibold">No reviews yet</p>
              <p className="mt-1 text-sm text-muted">Reviews from completed jobs will show up here.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {pageItems.map((r) => (
                <div key={r.id} className="ticket p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-medium">{r.customerName}</p>
                    <span className="font-mono text-sm font-semibold text-amber-ink dark:text-amber">
                      {"★".repeat(r.rating)}
                      <span className="text-line dark:text-muted">{"★".repeat(5 - r.rating)}</span>
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted">{r.date}</p>
                  <p className="mt-3 text-sm leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          )}

          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
