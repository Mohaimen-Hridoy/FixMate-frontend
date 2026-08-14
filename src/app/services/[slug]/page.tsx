import Link from "next/link";
import { notFound } from "next/navigation";
import { getRelatedServices, getReviewsByService, getServiceBySlug, services } from "@/lib/data";
import { fetchServiceBySlug } from "@/lib/api";
import { ServiceCard } from "@/components/service-card";
import { Eyebrow, RatingStars } from "@/components/ui";
import { BookingPanel } from "./booking-panel";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = (await fetchServiceBySlug(slug)) || getServiceBySlug(slug);
  if (!service) notFound();

  const related = getRelatedServices(service.category, service.id);
  const serviceReviews = getReviewsByService(service.id);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link href="/explore" className="text-sm text-muted hover:text-amber-ink dark:hover:text-amber">
        ← Back to services
      </Link>

      <div className="mt-4 grid gap-10 md:grid-cols-[1fr_340px]">
        <div>
          <div className="flex h-56 items-center justify-center rounded-2xl bg-ink text-5xl text-amber sm:h-72">
            🛠️
          </div>

          <Eyebrow>{service.category.replace("-", " ")}</Eyebrow>
          <h1 className="font-display text-3xl font-bold">{service.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
            <RatingStars rating={service.rating} reviewCount={service.reviewCount} />
            <span>·</span>
            <span>{service.location}</span>
            <span>·</span>
            <span className={service.available ? "text-teal" : "text-muted"}>
              {service.available ? "Available this week" : "Fully booked"}
            </span>
          </div>

          <p className="mt-6 max-w-2xl leading-relaxed text-ink/90 dark:text-[#f1efe9]/90">
            {service.description}
          </p>

          <h2 className="mt-8 font-display text-lg font-semibold">What&apos;s included</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {service.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 text-teal" aria-hidden>✓</span>
                {f}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 font-display text-lg font-semibold">About the provider</h2>
          <Link
            href={`/providers/${service.provider.id}`}
            className="ticket mt-3 flex items-center justify-between gap-4 p-4 transition-colors hover:border-amber"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber font-display text-lg font-bold text-ink">
                {service.provider.avatarInitial}
              </div>
              <div>
                <p className="font-medium">
                  {service.provider.name}
                  {service.provider.verified && (
                    <span className="ml-2 rounded-full bg-teal/15 px-2 py-0.5 text-[10px] font-semibold text-teal">
                      Verified
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted">
                  {service.provider.yearsActive} yrs active · {service.provider.location}
                </p>
              </div>
            </div>
            <span className="hidden shrink-0 text-sm font-medium text-amber-ink underline decoration-amber decoration-2 underline-offset-4 dark:text-amber sm:block">
              View profile →
            </span>
          </Link>
        </div>

        {/* Booking CTA card */}
        <BookingPanel service={service} />
      </div>

      <div className="mt-14 max-w-2xl">
        <h2 className="font-display text-lg font-semibold">
          Reviews {serviceReviews.length > 0 && `(${serviceReviews.length})`}
        </h2>
        {serviceReviews.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No reviews yet — be the first to book and leave one.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {serviceReviews.map((r) => (
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

      {related.length > 0 && (
        <div className="mt-16">
          <Eyebrow>You might also need</Eyebrow>
          <h2 className="font-display text-xl font-semibold">Related services</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
