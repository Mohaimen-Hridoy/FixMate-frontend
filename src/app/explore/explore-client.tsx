"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { categories, locations } from "@/lib/data";
import {
  DEFAULT_MAX_PRICE,
  PRICE_FLOOR,
  fetchServices,
  type ServiceQueryResult,
  type SortKey,
} from "@/lib/api";
import { ServiceCard, ServiceCardSkeleton } from "@/components/service-card";
import { Eyebrow } from "@/components/ui";
import { Modal } from "@/components/modal";

const SEARCH_DEBOUNCE_MS = 350;
const FIELD_CLASS =
  "w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber";

type Committed = {
  q: string;
  category: string;
  location: string;
  maxPrice: number;
  minRating: number;
  sort: SortKey;
  page: number;
};

type CommitKey = "q" | "category" | "location" | "maxPrice" | "minRating" | "sort";

export function ExploreClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const committed: Committed = useMemo(
    () => ({
      q: searchParams.get("q") ?? "",
      category: searchParams.get("category") ?? "all",
      location: searchParams.get("location") ?? "all",
      maxPrice: Number(searchParams.get("maxPrice") ?? DEFAULT_MAX_PRICE),
      minRating: Number(searchParams.get("minRating") ?? 0),
      sort: (searchParams.get("sort") as SortKey) ?? "recommended",
      page: Number(searchParams.get("page") ?? 1),
    }),
    [searchParams]
  );

  const [searchDraft, setSearchDraft] = useState(committed.q);
  const isTypingRef = useRef(false);
  // Pairing the result with the exact `committed` object it was fetched for
  // lets us derive `loading` (via reference equality) instead of toggling a
  // separate boolean from inside an effect.
  const [resultState, setResultState] = useState<{ query: Committed; data: ServiceQueryResult } | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const loading = resultState === null || resultState.query !== committed;

  // If the URL's `q` changes from somewhere other than this component's own
  // debounce commit (back/forward nav, a link that resets search, etc.),
  // resync the visible input without fighting an in-progress keystroke.
  useEffect(() => {
    if (!isTypingRef.current) setSearchDraft(committed.q);
  }, [committed.q]);

  function commit(updates: Partial<Record<CommitKey, string | number | undefined>>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      const isDefault =
        value === undefined ||
        value === "" ||
        value === "all" ||
        (key === "maxPrice" && Number(value) >= DEFAULT_MAX_PRICE) ||
        (key === "minRating" && Number(value) === 0) ||
        (key === "sort" && value === "recommended");
      if (isDefault) params.delete(key);
      else params.set(key, String(value));
    }
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function goToPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (p <= 1) params.delete("page");
    else params.set("page", String(p));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearAll() {
    setSearchDraft("");
    router.replace(pathname, { scroll: false });
  }

  // Debounce the search box before it hits the URL / query.
  useEffect(() => {
    if (searchDraft === committed.q) return;
    isTypingRef.current = true;
    const timer = setTimeout(() => {
      commit({ q: searchDraft || undefined });
      isTypingRef.current = false;
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft]);

  // Fetch whenever the committed query changes. `fetchServices` is a
  // network-shaped async boundary (see src/lib/api.ts) so this becomes a
  // real API call later without touching this component.
  useEffect(() => {
    const controller = new AbortController();
    fetchServices(committed, controller.signal)
      .then((res) => setResultState({ query: committed, data: res }))
      .catch((err: { name?: string }) => {
        if (err?.name === "AbortError") return;
        // Fall through: keep showing the last good result rather than
        // wiping the list on a transient failure.
      });
    return () => controller.abort();
  }, [committed]);

  const activeChips = useMemo(() => {
    const chips: { key: CommitKey; label: string }[] = [];
    if (committed.q) chips.push({ key: "q", label: `"${committed.q}"` });
    if (committed.category !== "all") {
      const c = categories.find((c) => c.slug === committed.category);
      chips.push({ key: "category", label: c?.name ?? committed.category });
    }
    if (committed.location !== "all") chips.push({ key: "location", label: committed.location });
    if (committed.maxPrice < DEFAULT_MAX_PRICE) chips.push({ key: "maxPrice", label: `Under ৳${committed.maxPrice}` });
    if (committed.minRating > 0) chips.push({ key: "minRating", label: `${committed.minRating}+ rating` });
    return chips;
  }, [committed]);

  const result = resultState?.data ?? null;
  const total = result?.total ?? 0;
  const items = result?.items ?? [];
  const totalPages = result?.totalPages ?? 1;
  const page = result?.page ?? committed.page;
  const pageSize = result?.pageSize ?? 6;
  const rangeStart = items.length ? (page - 1) * pageSize + 1 : 0;
  const rangeEnd = (page - 1) * pageSize + items.length;

  const filterFields = (
    <>
      <div>
        <label htmlFor="q" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
          Search
        </label>
        <input
          id="q"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="Service, provider, keyword"
          className={FIELD_CLASS}
        />
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Category</p>
        <select value={committed.category} onChange={(e) => commit({ category: e.target.value })} className={FIELD_CLASS}>
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Location</p>
        <select value={committed.location} onChange={(e) => commit({ location: e.target.value })} className={FIELD_CLASS}>
          <option value="all">All locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="price" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
          Max price: ৳{committed.maxPrice}
        </label>
        <input
          id="price"
          type="range"
          min={PRICE_FLOOR}
          max={DEFAULT_MAX_PRICE}
          step={100}
          value={committed.maxPrice}
          onChange={(e) => commit({ maxPrice: Number(e.target.value) })}
          className="w-full accent-amber"
        />
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Minimum rating</p>
        <div className="flex gap-2">
          {[0, 4, 4.5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => commit({ minRating: r })}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                committed.minRating === r ? "border-ink bg-ink text-paper dark:border-amber dark:bg-amber dark:text-ink" : "border-line"
              }`}
            >
              {r === 0 ? "Any" : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      {activeChips.length > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="w-full rounded-lg border border-line py-2 text-xs font-semibold text-muted transition-colors hover:border-ink hover:text-ink dark:hover:text-[#f1efe9]"
        >
          Clear all filters
        </button>
      )}
    </>
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Eyebrow>{loading ? "Searching…" : `${total} service${total === 1 ? "" : "s"} found`}</Eyebrow>
      <h1 className="font-display text-3xl font-bold">Explore services</h1>

      {activeChips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => {
                if (chip.key === "q") setSearchDraft("");
                commit({ [chip.key]: undefined });
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-raised px-3 py-1 text-xs font-medium transition-colors hover:border-ink"
            >
              {chip.label}
              <span aria-hidden className="text-muted">✕</span>
            </button>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-medium text-muted underline decoration-dotted underline-offset-4 hover:text-ink dark:hover:text-[#f1efe9]"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-8 md:grid-cols-[240px_1fr]">
        <aside className="ticket hidden h-fit space-y-6 p-5 md:block">{filterFields}</aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="ticket flex items-center gap-2 px-3 py-2 text-sm font-medium md:hidden"
              >
                <span aria-hidden>⚙️</span> Filters
                {activeChips.length > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber text-[10px] font-bold text-ink">
                    {activeChips.length}
                  </span>
                )}
              </button>
              <p className="text-sm text-muted">
                {loading ? "Loading results…" : `Showing ${rangeStart}–${rangeEnd} of ${total}`}
              </p>
            </div>
            <select
              value={committed.sort}
              onChange={(e) => commit({ sort: e.target.value })}
              className="rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
            >
              <option value="recommended">Recommended</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="ticket p-10 text-center text-muted">
              No services match those filters. Try widening your search.
              {activeChips.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-4 block w-full font-medium text-ink underline decoration-amber decoration-2 underline-offset-4 dark:text-[#f1efe9]"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => goToPage(page - 1)}
                aria-label="Previous page"
                className="h-8 w-8 rounded-full border border-line text-sm disabled:opacity-30"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => goToPage(p)}
                  aria-current={p === page ? "page" : undefined}
                  className={`h-8 w-8 rounded-full text-sm font-medium ${
                    p === page ? "bg-ink text-paper dark:bg-amber dark:text-ink" : "border border-line"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => goToPage(page + 1)}
                aria-label="Next page"
                className="h-8 w-8 rounded-full border border-line text-sm disabled:opacity-30"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        <div className="space-y-6">
          {filterFields}
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="w-full rounded-lg bg-ink py-2.5 text-sm font-semibold text-paper dark:bg-amber dark:text-ink"
          >
            Show {loading ? "results" : `${total} result${total === 1 ? "" : "s"}`}
          </button>
        </div>
      </Modal>
    </div>
  );
}
