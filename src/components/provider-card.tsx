import Link from "next/link";
import type { Provider } from "@/lib/data";
import { RatingStars } from "./ui";

export function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <Link
      href={`/providers/${provider.id}`}
      className="ticket group flex flex-col gap-4 p-5 transition-transform hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber font-display text-lg font-bold text-ink">
          {provider.avatarInitial}
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate font-display font-semibold">
            {provider.name}
            {provider.verified && (
              <span className="shrink-0 rounded-full bg-teal/15 px-1.5 py-0.5 text-[9px] font-semibold text-teal">
                Verified
              </span>
            )}
          </p>
          <p className="text-xs text-muted">{provider.location}</p>
        </div>
      </div>

      <p className="line-clamp-2 text-sm text-muted">{provider.bio}</p>

      <div className="mt-auto flex items-center justify-between border-t border-dashed border-line pt-3 text-xs">
        <RatingStars rating={provider.rating} reviewCount={provider.reviewCount} />
        <span className="text-muted">{provider.yearsActive} yrs active</span>
      </div>
    </Link>
  );
}
