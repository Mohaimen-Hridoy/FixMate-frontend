import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categories,
  getAllProviders,
  getProviderById,
  getReviewsByProvider,
  getServicesByProvider,
} from "@/lib/data";
import { ServiceCard } from "@/components/service-card";
import { Eyebrow, RatingStars, StatCard } from "@/components/ui";

export function generateStaticParams() {
  return getAllProviders().map((p) => ({ id: p.id }));
}

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const provider = getProviderById(id);
  if (!provider) notFound();

  const providerServices = getServicesByProvider(provider.id);
  const providerReviews = getReviewsByProvider(provider.id);
  const category = categories.find((c) => c.slug === provider.category);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link href="/explore" className="text-sm text-muted hover:text-amber-ink dark:hover:text-amber">
        ← Back to services
      </Link>

      {/* Header */}
      <div className="ticket mt-4 flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-amber font-display text-2xl font-bold text-ink">
            {provider.avatarInitial}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-bold">{provider.name}</h1>
              {provider.verified && (
                <span className="rounded-full bg-teal/15 px-2 py-0.5 text-[10px] font-semibold text-teal">
                  Verified
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
              <RatingStars rating={provider.rating} reviewCount={provider.reviewCount} />
              <span>·</span>
              <span>{provider.location}</span>
              {category && (
                <>
                  <span>·</span>
                  <span>
                    {category.icon} {category.name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <a
          href="#services"
          className="shrink-0 rounded-full bg-amber px-6 py-3 text-center text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
        >
          View services
        </a>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Services listed" value={String(providerServices.length)} />
        <StatCard label="Jobs completed" value={`${provider.jobsCompleted}+`} />
        <StatCard label="Years active" value={String(provider.yearsActive)} />
        <StatCard label="Typical response" value={provider.responseTime} />
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_300px]">
        <div>
          <h2 className="font-display text-lg font-semibold">About</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink/90 dark:text-[#f1efe9]/90">{provider.bio}</p>

          {/* Services */}
          <div id="services" className="mt-10 scroll-mt-20">
            <Eyebrow>{providerServices.length} listed</Eyebrow>
            <h2 className="font-display text-lg font-semibold">Services by {provider.name}</h2>
            {providerServices.length === 0 ? (
              <p className="mt-3 text-sm text-muted">This provider hasn&apos;t listed any services yet.</p>
            ) : (
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {providerServices.map((s) => (
                  <ServiceCard key={s.id} service={s} />
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="mt-12 max-w-2xl">
            <h2 className="font-display text-lg font-semibold">
              Reviews {providerReviews.length > 0 && `(${providerReviews.length})`}
            </h2>
            {providerReviews.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No reviews yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {providerReviews.map((r) => (
                  <div key={r.id} className="border-t border-dashed border-line pt-4 first:border-0 first:pt-0">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{r.customerName}</p>
                      <RatingStars rating={r.rating} />
                    </div>
                    <p className="mt-1 text-xs text-muted">{r.date}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink/90 dark:text-[#f1efe9]/90">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Side panel */}
        <aside className="ticket h-fit space-y-5 p-5">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Service areas</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {provider.serviceAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-line px-2.5 py-1 text-xs text-muted"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-dashed border-line pt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Verification</h3>
            <p className="mt-2 text-sm">
              {provider.verified
                ? "ID-verified with confirmed work references."
                : "Verification pending — proceed with your own discretion."}
            </p>
          </div>

          <a
            href="#services"
            className="block w-full rounded-lg bg-ink py-3 text-center text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 dark:bg-amber dark:text-ink"
          >
            Book a service
          </a>
        </aside>
      </div>
    </div>
  );
}
