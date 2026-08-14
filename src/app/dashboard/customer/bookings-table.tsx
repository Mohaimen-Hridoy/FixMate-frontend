"use client";

import { useState } from "react";
import Link from "next/link";
import { type Booking, canCustomerCancel, demoCustomerName } from "@/lib/data";
import { useBookings } from "@/lib/bookings-store";
import { useAuth } from "@/lib/use-auth";
import { StatusBadge } from "@/components/ui";
import { ReviewModal } from "@/components/review-modal";
import { CancelBookingModal } from "@/components/cancel-booking-modal";

export function BookingsTable({
  bookings,
  linkToDetails = false,
}: {
  bookings: Booking[];
  /** When true, service titles link through to the booking details page. */
  linkToDetails?: boolean;
}) {
  const { markReviewed } = useBookings();
  const { user } = useAuth();
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);

  return (
    <>
      <div className="ticket mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Provider</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted">
                  No bookings to show.
                </td>
              </tr>
            )}
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium">
                  {linkToDetails ? (
                    <Link
                      href={`/dashboard/customer/bookings/${b.id}`}
                      className="hover:text-amber-ink hover:underline dark:hover:text-amber"
                    >
                      {b.serviceTitle}
                    </Link>
                  ) : (
                    b.serviceTitle
                  )}
                  <p className="font-mono text-[11px] font-normal text-muted">{b.id}</p>
                </td>
                <td className="px-4 py-3 text-muted">{b.providerName}</td>
                <td className="px-4 py-3 text-muted">
                  {b.date} · {b.time}
                </td>
                <td className="px-4 py-3 font-mono">৳{b.amount}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={b.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {b.status === "Completed" &&
                      (b.reviewed ? (
                        <span className="text-xs font-medium text-teal">✓ Reviewed</span>
                      ) : (
                        <button
                          onClick={() => setReviewTarget(b)}
                          className="rounded-full border border-line px-3 py-1 text-xs font-semibold transition-colors hover:border-amber"
                        >
                          Leave a review
                        </button>
                      ))}
                    {canCustomerCancel(b.status) && (
                      <button
                        onClick={() => setCancelTarget(b)}
                        className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-[#A3342A] transition-colors hover:border-[#A3342A] dark:text-[#ff9a8e]"
                      >
                        Cancel
                      </button>
                    )}
                    {!canCustomerCancel(b.status) && b.status !== "Completed" && (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReviewModal
        open={reviewTarget !== null}
        onClose={() => setReviewTarget(null)}
        bookingId={reviewTarget?.id ?? ""}
        serviceId={reviewTarget?.serviceId ?? ""}
        providerId={reviewTarget?.providerId ?? ""}
        serviceTitle={reviewTarget?.serviceTitle ?? ""}
        providerName={reviewTarget?.providerName ?? ""}
        customerName={user?.name || demoCustomerName}
        onSubmitted={() => {
          if (reviewTarget) markReviewed(reviewTarget.id);
        }}
      />

      <CancelBookingModal booking={cancelTarget} open={cancelTarget !== null} onClose={() => setCancelTarget(null)} />
    </>
  );
}
