import { BOOKING_STATUS_FLOW, type Booking, type BookingStatus } from "@/lib/data";

const STEP_LABELS: Record<BookingStatus, string> = {
  Pending: "Requested",
  Accepted: "Confirmed",
  "In Progress": "In progress",
  Completed: "Completed",
  Rejected: "Rejected",
  Cancelled: "Cancelled",
};

/**
 * Horizontal progress stepper for the happy path (Pending → Accepted → In
 * Progress → Completed). If the booking exited onto Rejected/Cancelled, the
 * flow is shown as stopped at the last real step with a terminal marker.
 */
export function BookingStatusTracker({ booking }: { booking: Booking }) {
  const isTerminalExit = booking.status === "Rejected" || booking.status === "Cancelled";
  const currentIndex = isTerminalExit ? -1 : BOOKING_STATUS_FLOW.indexOf(booking.status);

  return (
    <div>
      <div className="flex items-center">
        {BOOKING_STATUS_FLOW.map((step, i) => {
          const reached = !isTerminalExit && i <= currentIndex;
          const isLast = i === BOOKING_STATUS_FLOW.length - 1;
          return (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    reached
                      ? "bg-teal text-white"
                      : "border border-line bg-transparent text-muted"
                  }`}
                  aria-hidden
                >
                  {reached ? "✓" : i + 1}
                </div>
                <span className={`text-center text-[11px] ${reached ? "font-medium text-ink dark:text-[#f1efe9]" : "text-muted"}`}>
                  {STEP_LABELS[step]}
                </span>
              </div>
              {!isLast && (
                <div className={`mx-1 h-0.5 flex-1 rounded ${reached && i < currentIndex ? "bg-teal" : "bg-line"}`} />
              )}
            </div>
          );
        })}
      </div>

      {isTerminalExit && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#F7DCDA] px-3 py-2 text-xs font-medium text-[#A3342A] dark:bg-[#3a1512] dark:text-[#ff9a8e]">
          <span aria-hidden>⨯</span>
          Booking was {STEP_LABELS[booking.status].toLowerCase()}
          {booking.history[booking.history.length - 1]?.note
            ? ` — ${booking.history[booking.history.length - 1].note}`
            : ""}
        </div>
      )}
    </div>
  );
}
