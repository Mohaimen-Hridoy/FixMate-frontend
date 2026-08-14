"use client";

import { useState } from "react";
import { Modal } from "./modal";
import { useBookings } from "@/lib/bookings-store";
import { type Booking } from "@/lib/data";

export function CancelBookingModal({
  booking,
  open,
  onClose,
  onCancelled,
}: {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
  onCancelled?: () => void;
}) {
  const { cancelBooking } = useBookings();
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  function handleClose() {
    setStatus("idle");
    onClose();
  }

  function handleConfirm() {
    if (!booking) return;
    setStatus("loading");
    setTimeout(() => {
      cancelBooking(booking.id, "Cancelled by customer");
      setStatus("idle");
      onCancelled?.();
      onClose();
    }, 500);
  }

  return (
    <Modal open={open} onClose={handleClose} title="Cancel this booking?">
      <p className="text-sm text-muted">
        {booking?.serviceTitle} with {booking?.providerName} on {booking?.date} at {booking?.time}. This can&apos;t be
        undone — you&apos;ll need to make a new booking if you change your mind.
      </p>
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={handleClose}
          className="flex-1 rounded-lg border border-line py-2.5 text-sm font-medium transition-colors hover:border-amber"
        >
          Keep booking
        </button>
        <button
          type="button"
          disabled={status === "loading"}
          onClick={handleConfirm}
          className="flex-1 rounded-lg bg-[#A3342A] py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {status === "loading" ? "Cancelling…" : "Yes, cancel it"}
        </button>
      </div>
    </Modal>
  );
}
