"use client";

import { useState } from "react";
import { type Booking } from "@/lib/data";
import { useBookings } from "@/lib/bookings-store";

/**
 * Provider-side accept / reject / start / complete controls. Renders nothing
 * once the booking has reached a terminal status. Each action has its own
 * button-scoped loading state so acting on one row doesn't lock the table.
 */
export function BookingStatusActions({ booking }: { booking: Booking }) {
  const { updateStatus } = useBookings();
  const [pending, setPending] = useState<string | null>(null);

  function run(next: Parameters<typeof updateStatus>[1], note: string, key: string) {
    setPending(key);
    setTimeout(() => {
      updateStatus(booking.id, next, note);
      setPending(null);
    }, 500);
  }

  const btnBase = "rounded-full px-3 py-1 text-xs font-semibold transition-opacity disabled:cursor-wait disabled:opacity-50";

  if (booking.status === "Pending") {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => run("Accepted", "Confirmed by provider", "accept")}
          className={`${btnBase} bg-teal/15 text-teal`}
        >
          {pending === "accept" ? "Accepting…" : "Accept"}
        </button>
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => run("Rejected", "Declined by provider", "reject")}
          className={`${btnBase} bg-[#F7DCDA] text-[#A3342A] dark:bg-[#3a1512] dark:text-[#ff9a8e]`}
        >
          {pending === "reject" ? "Rejecting…" : "Reject"}
        </button>
      </div>
    );
  }

  if (booking.status === "Accepted") {
    return (
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => run("In Progress", "Technician on site", "start")}
        className={`${btnBase} bg-[#DDE6FA] text-[#28438C] dark:bg-[#152241] dark:text-[#9fb8f5]`}
      >
        {pending === "start" ? "Starting…" : "Start job"}
      </button>
    );
  }

  if (booking.status === "In Progress") {
    return (
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => run("Completed", "Job marked complete", "complete")}
        className={`${btnBase} bg-[#E1EFD9] text-[#3D6B27] dark:bg-[#182d10] dark:text-[#a5d98a]`}
      >
        {pending === "complete" ? "Completing…" : "Mark completed"}
      </button>
    );
  }

  return <span className="text-xs text-muted">—</span>;
}
