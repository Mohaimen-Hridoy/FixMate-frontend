"use client";

import { use } from "react";
import Link from "next/link";
import { myProviderId } from "@/lib/data";
import { useBookings } from "@/lib/bookings-store";
import { Eyebrow, StatusBadge } from "@/components/ui";
import { BookingStatusTracker } from "@/components/booking-status-tracker";
import { BookingStatusActions } from "@/components/booking-status-actions";

export default function ProviderBookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getBookingById } = useBookings();
  const booking = getBookingById(id);

  if (!booking || booking.providerId !== myProviderId) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        <p className="font-display text-xl font-semibold">Booking not found</p>
        <p className="mt-2 text-sm text-muted">It may not belong to this provider account, or the link is out of date.</p>
        <Link
          href="/dashboard/provider/bookings"
          className="mt-5 inline-block rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-amber"
        >
          Back to bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/dashboard/provider/bookings" className="text-sm text-muted hover:text-amber-ink dark:hover:text-amber">
        ← Back to bookings
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <Eyebrow>Booking {booking.id}</Eyebrow>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{booking.serviceTitle}</h1>
          <p className="mt-1 text-sm text-muted">Customer: {booking.customerName}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="ticket mt-6 p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted">Progress</p>
        <BookingStatusTracker booking={booking} />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="ticket p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Job details</p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Date</dt>
              <dd className="font-medium">{booking.date}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Time</dt>
              <dd className="font-medium">{booking.time}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Address</dt>
              <dd className="text-right font-medium">{booking.address}</dd>
            </div>
          </dl>
        </div>

        <div className="ticket p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Payout</p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Job price</dt>
              <dd className="font-mono font-medium">৳{booking.amount}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Booking ID</dt>
              <dd className="font-mono text-xs">{booking.id}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Requested</dt>
              <dd className="text-xs">{new Date(booking.createdAt).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      </div>

      {booking.notes && (
        <div className="ticket mt-6 p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Notes from the customer</p>
          <p className="text-sm leading-relaxed">{booking.notes}</p>
        </div>
      )}

      <div className="ticket mt-6 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Status history</p>
        <ol className="space-y-3 border-l border-line pl-4">
          {booking.history.map((h, i) => (
            <li key={i} className="relative text-sm">
              <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-amber" aria-hidden />
              <p className="font-medium">{h.status}</p>
              <p className="text-xs text-muted">{new Date(h.at).toLocaleString()}</p>
              {h.note && <p className="mt-0.5 text-xs text-muted">{h.note}</p>}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6">
        <BookingStatusActions booking={booking} />
      </div>
    </div>
  );
}
