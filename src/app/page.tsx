import Link from "next/link";
import { categories, getFeaturedProviders, services } from "@/lib/data";
import { ServiceCard } from "@/components/service-card";
import { ProviderCard } from "@/components/provider-card";
import { HeroIllustration } from "@/components/hero-illustration";
import { Eyebrow, RatingStars, StatCard } from "@/components/ui";

const stats = [
  { icon: "🧰", value: "1,240+", label: "Active providers" },
  { icon: "✅", value: "18,900+", label: "Jobs completed" },
  { icon: "⭐", value: "4.7 / 5", label: "Avg. rating" },
  { icon: "📍", value: "6", label: "Cities covered" },
];

const steps = [
  {
    n: "01",
    title: "Describe the problem",
    body: "Tell us what's wrong — a leaking pipe, a warm fridge, a flickering light.",
  },
  {
    n: "02",
    title: "Compare vetted pros",
    body: "See ratings, pricing, and availability from providers near you.",
  },
  {
    n: "03",
    title: "Book a time slot",
    body: "Pick a date and time that works — get instant confirmation.",
  },
  {
    n: "04",
    title: "Get it fixed & rate it",
    body: "Track the job to completion, then rate your provider.",
  },
];

const testimonials = [
  {
    quote:
      "The electrician showed up on time and actually explained what was wrong with our wiring instead of just fixing it silently.",
    name: "Nusrat J.",
    context: "Home Wiring Inspection · Mirpur",
  },
  {
    quote:
      "Booked an AC service the same evening it started acting up. Cooling properly again within a day.",
    name: "Tanvir A.",
    context: "AC Full Service · Dhanmondi",
  },
  {
    quote:
      "Being able to see real reviews and prices before booking made the whole thing feel a lot less like a gamble.",
    name: "Mehjabin R.",
    context: "Deep Home Cleaning · Gulshan",
  },
];

const faqs = [
  {
    q: "How are providers vetted before joining FixMate?",
    a: "Every provider submits ID verification and past work references. Verified providers carry a badge on their profile.",
  },
  {
    q: "What happens if I need to cancel a booking?",
    a: "You can cancel from your dashboard up until the provider accepts the job, free of charge. After that, check the provider's cancellation policy on their profile.",
  },
  {
    q: "How does pricing work?",
    a: "Each listing shows a per-job, per-hour, or per-visit price set by the provider. Any extra cost for parts is quoted separately before work begins.",
  },
  {
    q: "Can I become a provider on FixMate?",
    a: "Yes — tap 'Become a Provider', complete your profile and verification, then start listing your services.",
  },
];

const featuredProviders = getFeaturedProviders(3);

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-[1.05fr_0.95fr] md:py-20">
          <div>
            <Eyebrow>Local service marketplace</Eyebrow>
            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl">
              Bangladesh&apos;s <span className="text-amber">#1</span> Home
              <br />
              Repair &amp; Service Platform.
            </h1>
            <p className="mt-5 max-w-md text-muted">
              AC acting up? Pipe leaking? Laptop screen cracked? FixMate connects you with
              rated, local service providers — book in minutes, track until it&apos;s done.
            </p>

            <form
              action="/explore"
              className="mt-8 flex flex-col gap-2 rounded-full border border-line bg-paper-raised p-2 shadow-sm sm:flex-row sm:items-center"
            >
              <input
                name="q"
                type="text"
                placeholder="e.g. &ldquo;AC not cooling properly&rdquo;"
                className="flex-1 rounded-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted"
              />
              <button
                type="submit"
                className="rounded-full bg-amber px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Find a Service
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link href="/explore" className="font-medium underline decoration-amber decoration-2 underline-offset-4">
                Browse all services
              </Link>
              <span className="text-line">·</span>
              <Link href="/register?role=provider" className="font-medium underline decoration-amber decoration-2 underline-offset-4">
                Become a Provider
              </Link>
            </div>
          </div>

          <HeroIllustration />
        </div>

        {/* Stat strip */}
        <div className="mx-auto max-w-6xl px-5 pb-14">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <StatCard key={s.label} icon={s.icon} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories — toolbox tray */}
      <section className="border-t border-line bg-paper-raised/60">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <Eyebrow>What do you need fixed?</Eyebrow>
          <h2 className="font-display text-2xl font-semibold">Popular categories</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/explore?category=${c.slug}`}
                className="ticket flex flex-col items-center gap-2 p-4 text-center transition-transform hover:-translate-y-1 hover:border-amber"
              >
                <span className="icon-badge text-xl" aria-hidden>{c.icon}</span>
                <span className="text-xs font-medium">{c.name}</span>
                <span className="font-mono text-[10px] text-muted">{c.count} pros</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular services */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="flex items-end justify-between">
            <div>
              <Eyebrow>Ready to book</Eyebrow>
              <h2 className="font-display text-2xl font-semibold">Featured services near you</h2>
            </div>
            <Link href="/explore" className="hidden text-sm font-medium underline decoration-amber decoration-2 underline-offset-4 sm:block">
              View all →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured providers */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex items-end justify-between">
          <div>
            <Eyebrow>Top-rated on FixMate</Eyebrow>
            <h2 className="font-display text-2xl font-semibold">Featured service providers</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProviders.map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <Eyebrow>The process</Eyebrow>
        <h2 className="font-display text-2xl font-semibold">How FixMate works</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <span className="font-mono text-3xl font-semibold text-amber/40">{s.n}</span>
              <h3 className="mt-2 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="border-y border-line bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Eyebrow>Why FixMate</Eyebrow>
          <h2 className="font-display text-2xl font-semibold">Built so nothing gets lost in a phone call</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div>
              <h3 className="font-display font-semibold text-amber">Verified providers</h3>
              <p className="mt-2 text-sm text-paper/70">ID-checked professionals with visible track records, not anonymous listings.</p>
            </div>
            <div>
              <h3 className="font-display font-semibold text-amber">Transparent pricing</h3>
              <p className="mt-2 text-sm text-paper/70">See the price before you book — no surprise call-out fees.</p>
            </div>
            <div>
              <h3 className="font-display font-semibold text-amber">Tracked from start to finish</h3>
              <p className="mt-2 text-sm text-paper/70">Every booking has a status, so you always know what&apos;s happening.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <Eyebrow>Customers say</Eyebrow>
        <h2 className="font-display text-2xl font-semibold">Real jobs, real feedback</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="ticket p-5">
              <RatingStars rating={5} />
              <blockquote className="mt-3 text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-xs text-muted">
                <span className="font-semibold text-ink dark:text-[#f1efe9]">{t.name}</span> · {t.context}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-paper-raised/40">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <Eyebrow>Questions</Eyebrow>
          <h2 className="font-display text-2xl font-semibold">Frequently asked</h2>
          <div className="mt-6 divide-y divide-line">
            {faqs.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                  {f.q}
                  <span className="ml-4 text-amber-ink transition-transform group-open:rotate-45 dark:text-amber">+</span>
                </summary>
                <p className="mt-2 text-sm text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="ticket flex flex-col items-start gap-4 bg-ink p-8 text-paper md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">Got something that needs fixing?</h2>
            <p className="mt-1 text-sm text-paper/70">Post it, compare pros, and get it booked in minutes.</p>
          </div>
          <Link href="/explore" className="shrink-0 rounded-full bg-amber px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
            Find a Service
          </Link>
        </div>
      </section>
    </div>
  );
}
