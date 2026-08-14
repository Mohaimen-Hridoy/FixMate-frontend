"use client";

import Link from "next/link";
import { demoCustomerName, getBookingsForCustomer, type Booking } from "@/lib/data";
import { useBookings } from "@/lib/bookings-store";
import { useReviews } from "@/lib/reviews-store";
import { useAuth } from "@/lib/use-auth";
import { Eyebrow } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";

export default function CustomerReviewsPage() {
  const { bookings } = useBookings();
  const { newReviews } = useReviews();
  const { user } = useAuth();

  const customerName = user?.name || demoCustomerName;
  const myBookings = getBookingsForCustomer(bookings, customerName);
  const bookingById = new Map<string, Booking>(myBookings.map((b) => [b.id, b]));

  const myReviews = newReviews
    .filter((r) => r.customerName === customerName && bookingById.has(r.bookingId ?? ""))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const eligibleForReview = myBookings.filter(
    (b) => b.status === "Completed" && !b.reviewed
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <Eyebrow>Customer dashboard</Eyebrow>
      <h1 className="font-display text-3xl font-bold">My reviews</h1>

      <DashboardTabs
        tabs={[
          { href: "/dashboard/customer", label: "Overview" },
          { href: "/dashboard/customer/bookings", label: "My bookings" },
          { href: "/dashboard/customer/reviews", label: "My reviews" },
          { href: "/dashboard/customer/profile", label: "Profile" },
          { href: "/dashboard/customer/settings", label: "Settings" },
        ]}
      />

      {eligibleForReview.length > 0 && (
        <div className="ticket mt-6 flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-sm">
            You have <span className="font-semibold">{eligibleForReview.length}</span> completed{" "}
            {eligibleForReview.length === 1 ? "job" : "jobs"} waiting for a review.
          </p>
          <Link
            href="/dashboard/customer/bookings"
            className="rounded-full bg-amber px-4 py-2 text-xs font-semibold text-ink transition-transform hover:-translate-y-0.5"
          >
            Leave a review →
          </Link>
        </div>
      )}

      <h2 className="mt-8 font-display text-xl font-semibold">
        {myReviews.length} review{myReviews.length === 1 ? "" : "s"} submitted
      </h2>

      {myReviews.length === 0 ? (
        <div className="ticket mt-4 p-8 text-center">
          <p className="font-display text-lg font-semibold">No reviews yet</p>
          <p className="mt-1 text-sm text-muted">
            Once a booking is marked complete, you can rate and review the provider from your bookings list.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {myReviews.map((r) => {
            const booking = bookingById.get(r.bookingId ?? "");
            return (
              <div key={r.id} className="ticket p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{booking?.serviceTitle ?? "Service"}</p>
                    <p className="text-xs text-muted">
                      {booking?.providerName ?? ""} · {r.date}
                    </p>
                  </div>
                  <span className="font-mono text-sm font-semibold text-amber-ink dark:text-amber">
                    {"★".repeat(r.rating)}
                    <span className="text-line dark:text-muted">{"★".repeat(5 - r.rating)}</span>
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed">{r.comment}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
