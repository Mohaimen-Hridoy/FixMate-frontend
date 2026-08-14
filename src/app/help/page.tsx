"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eyebrow } from "@/components/ui";

const articles = [
  {
    slug: "how-provider-verification-works",
    category: "Trust & Safety",
    title: "How provider verification works on FixMate",
    excerpt:
      "Every provider goes through an ID check and a review of past work before the verified badge appears on their profile. Here's what that process actually looks like.",
    readMins: 4,
  },
  {
    slug: "how-pricing-is-calculated",
    category: "Bookings",
    title: "How pricing is calculated for a booking",
    excerpt:
      "Per-job, per-hour, or per-visit — providers set their own rates, and any extra cost for parts is quoted separately before work starts. A walkthrough of what you'll actually pay.",
    readMins: 3,
  },
  {
    slug: "cancelling-or-rescheduling",
    category: "Bookings",
    title: "Cancelling or rescheduling a booking",
    excerpt:
      "You can cancel for free before a provider accepts. After that, cancellation terms depend on the provider's policy — here's how to check and what to expect.",
    readMins: 3,
  },
  {
    slug: "getting-your-first-jobs-as-a-provider",
    category: "For Providers",
    title: "Getting your first jobs as a new provider",
    excerpt:
      "New profiles start with zero reviews, which makes the first few bookings the hardest. A few practical steps that consistently help new providers get picked.",
    readMins: 5,
  },
  {
    slug: "writing-a-review-that-helps",
    category: "Reviews",
    title: "What makes a review actually useful",
    excerpt:
      "Reviews only unlock after a booking is marked completed, and each customer can only review a job once. Here's how to write one that helps the next customer decide.",
    readMins: 2,
  },
  {
    slug: "choosing-the-right-category",
    category: "Bookings",
    title: "Not sure which service category you need?",
    excerpt:
      "A quick guide to the difference between, say, an electrician and an appliance repair technician — and what to do if your problem spans more than one category.",
    readMins: 3,
  },
];

const faqSections = [
  {
    heading: "Bookings",
    items: [
      {
        q: "How does pricing work?",
        a: "Each listing shows a per-job, per-hour, or per-visit price set by the provider. Any extra cost for parts is quoted separately before work begins.",
      },
      {
        q: "What happens if I need to cancel a booking?",
        a: "You can cancel from your dashboard up until the provider accepts the job, free of charge. After that, check the provider's cancellation policy on their profile.",
      },
      {
        q: "Can I reschedule instead of cancelling?",
        a: "Yes — open the booking from My Bookings and message the provider to propose a new date and time before they mark the job in progress.",
      },
      {
        q: "What do the booking statuses mean?",
        a: "Pending means the provider hasn't responded yet. Accepted means they've confirmed. In Progress means the job is underway. Completed and Cancelled are final states.",
      },
    ],
  },
  {
    heading: "Trust & Safety",
    items: [
      {
        q: "How are providers vetted before joining FixMate?",
        a: "Every provider submits ID verification and past work references. Verified providers carry a badge on their profile.",
      },
      {
        q: "What if a provider doesn't show up?",
        a: "Report it from the booking details page. Our team follows up with the provider and can adjust their standing on the platform.",
      },
    ],
  },
  {
    heading: "Reviews",
    items: [
      {
        q: "When can I leave a review?",
        a: "Only after a booking has been marked Completed, and only once per booking — this keeps ratings tied to real, finished jobs.",
      },
      {
        q: "Can I edit or remove a review later?",
        a: "You can edit a review from My Reviews within a short window after posting. Removal requests go through Contact support.",
      },
    ],
  },
  {
    heading: "For Providers",
    items: [
      {
        q: "Can I become a provider on FixMate?",
        a: "Yes — register with a provider account, complete your profile and verification, then add your first service listing.",
      },
      {
        q: "How and when do I get paid?",
        a: "Earnings are tracked per completed booking on your Earnings page. Payout timing and methods are covered during provider onboarding.",
      },
      {
        q: "Can I set my own service area and availability?",
        a: "Yes — both are configurable per service from your provider dashboard, and you can update them any time.",
      },
    ],
  },
];

export default function HelpPage() {
  const [query, setQuery] = useState("");

  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }, [query]);

  const filteredFaqSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqSections;
    return faqSections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [query]);

  const noResults = filteredArticles.length === 0 && filteredFaqSections.length === 0;

  return (
    <div>
      <section className="border-b border-line bg-[#F4EEDF] dark:bg-[#171b22]">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <Eyebrow>Help center</Eyebrow>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">How can we help?</h1>
          <p className="mx-auto mt-3 max-w-lg text-muted">
            Guides on bookings, reviews, and provider tools — plus answers to the questions we hear most.
          </p>
          <div className="mx-auto mt-6 max-w-md">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help articles and FAQs"
              className="w-full rounded-full border border-line bg-paper px-5 py-3 text-sm outline-none focus-visible:border-amber dark:bg-[#101319]"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-14">
        {noResults && (
          <div className="ticket p-8 text-center">
            <p className="font-medium">No results for &ldquo;{query}&rdquo;</p>
            <p className="mt-2 text-sm text-muted">
              Try a different search, or{" "}
              <Link href="/contact" className="font-semibold text-amber-ink hover:underline dark:text-amber">
                contact support
              </Link>{" "}
              directly.
            </p>
          </div>
        )}

        {filteredArticles.length > 0 && (
          <>
            <h2 className="font-display text-xl font-semibold">Help articles</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((a) => (
                <article key={a.slug} className="ticket flex flex-col p-5">
                  <span className="w-fit rounded-full bg-amber/20 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-amber-ink dark:text-amber">
                    {a.category}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold leading-snug">{a.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{a.excerpt}</p>
                  <p className="mt-4 font-mono text-xs text-muted">{a.readMins} min read</p>
                </article>
              ))}
            </div>
          </>
        )}

        {filteredFaqSections.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-xl font-semibold">Frequently asked questions</h2>
            <div className="mt-5 space-y-8">
              {filteredFaqSections.map((section) => (
                <div key={section.heading}>
                  <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">{section.heading}</p>
                  <div className="space-y-3">
                    {section.items.map((item) => (
                      <details key={item.q} className="ticket group p-4">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                          {item.q}
                          <span className="shrink-0 text-muted transition-transform group-open:rotate-45">+</span>
                        </summary>
                        <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="hazard-rule my-12 opacity-70" />

        <div className="ticket flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="font-display text-lg font-semibold">Still stuck?</p>
            <p className="mt-1 text-sm text-muted">Our support team replies within a business day.</p>
          </div>
          <Link
            href="/contact"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 dark:bg-amber dark:text-ink"
          >
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
