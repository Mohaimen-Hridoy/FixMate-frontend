import Link from "next/link";
import type { Service } from "@/lib/data";
import { RatingStars } from "./ui";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="ticket group flex flex-col overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-32 items-center justify-center bg-ink text-3xl text-amber">
        <span aria-hidden>🛠️</span>
      </div>

      <div className="ticket-perf flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-snug">{service.title}</h3>
          {!service.available && (
            <span className="shrink-0 rounded-full bg-[#EDEBE5] px-2 py-0.5 text-[10px] font-semibold text-muted dark:bg-[#22262f]">
              Booked out
            </span>
          )}
        </div>

        <p className="text-sm text-muted line-clamp-2">{service.shortDescription}</p>

        <div className="mt-1 flex items-center justify-between text-xs text-muted">
          <span>{service.provider.name}</span>
          <RatingStars rating={service.rating} reviewCount={service.reviewCount} />
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-dashed border-line pt-3">
          <span className="text-xs text-muted">{service.location}</span>
          <span className="font-mono text-sm font-semibold">
            ৳{service.price}
            <span className="text-muted">/{service.priceUnit}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Skeleton placeholder matching ServiceCard's layout, shown while results load. */
export function ServiceCardSkeleton() {
  return (
    <div className="ticket flex animate-pulse flex-col overflow-hidden" aria-hidden>
      <div className="h-32 bg-[#EDEBE5] dark:bg-[#22262f]" />
      <div className="ticket-perf flex flex-1 flex-col gap-3 p-4">
        <div className="h-4 w-3/4 rounded bg-[#EDEBE5] dark:bg-[#22262f]" />
        <div className="h-3 w-full rounded bg-[#EDEBE5] dark:bg-[#22262f]" />
        <div className="h-3 w-2/3 rounded bg-[#EDEBE5] dark:bg-[#22262f]" />
        <div className="mt-2 flex items-center justify-between border-t border-dashed border-line pt-3">
          <div className="h-3 w-16 rounded bg-[#EDEBE5] dark:bg-[#22262f]" />
          <div className="h-3 w-12 rounded bg-[#EDEBE5] dark:bg-[#22262f]" />
        </div>
      </div>
    </div>
  );
}
