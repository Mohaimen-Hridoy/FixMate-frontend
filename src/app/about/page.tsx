import { Eyebrow } from "@/components/ui";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <Eyebrow>About FixMate</Eyebrow>
      <h1 className="font-display text-3xl font-bold">
        Booking a repair shouldn&apos;t feel like a gamble.
      </h1>
      <p className="mt-5 leading-relaxed text-muted">
        FixMate started from a simple frustration: finding a reliable electrician,
        plumber, or AC technician usually means asking around, hoping for the best,
        and often paying more than you should. We built FixMate to put ratings,
        transparent pricing, and verified profiles in front of every booking —
        so you know who&apos;s coming and what it&apos;ll cost before you commit.
      </p>
      <p className="mt-4 leading-relaxed text-muted">
        On the other side, service providers get a steady stream of real bookings
        instead of chasing leads, along with simple tools to manage their schedule,
        track earnings, and build a reputation that speaks for itself.
      </p>

      <div className="hazard-rule my-10 opacity-70" />

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold text-amber-ink dark:text-amber">1,240+</p>
          <p className="text-sm text-muted">Verified providers</p>
        </div>
        <div>
          <p className="font-display text-2xl font-bold text-amber-ink dark:text-amber">18,900+</p>
          <p className="text-sm text-muted">Jobs completed</p>
        </div>
        <div>
          <p className="font-display text-2xl font-bold text-amber-ink dark:text-amber">6</p>
          <p className="text-sm text-muted">Cities covered</p>
        </div>
      </div>
    </div>
  );
}
