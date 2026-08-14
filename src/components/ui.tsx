import type { BookingStatus } from "@/lib/data";

export function RatingStars({ rating, reviewCount }: { rating: number; reviewCount?: number }) {
  return (
    <span className="inline-flex items-center gap-1 font-mono text-xs">
      <span aria-hidden className="text-amber-ink dark:text-amber">★</span>
      <span className="font-semibold">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && <span className="text-muted">({reviewCount})</span>}
    </span>
  );
}

const statusStyles: Record<BookingStatus, string> = {
  Pending: "bg-[#FFF3D6] text-[#7A4A00] dark:bg-[#3a2c0f] dark:text-[#ffd479]",
  Accepted: "bg-[#DCEFEA] text-[#1F8A70] dark:bg-[#123028] dark:text-[#5fd6b8]",
  Rejected: "bg-[#F7DCDA] text-[#A3342A] dark:bg-[#3a1512] dark:text-[#ff9a8e]",
  "In Progress": "bg-[#DDE6FA] text-[#28438C] dark:bg-[#152241] dark:text-[#9fb8f5]",
  Completed: "bg-[#E1EFD9] text-[#3D6B27] dark:bg-[#182d10] dark:text-[#a5d98a]",
  Cancelled: "bg-[#EDEBE5] text-[#5B6472] dark:bg-[#22262f] dark:text-[#9aa1ad]",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-amber-ink dark:text-amber">
      {children}
    </p>
  );
}

export function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="ticket flex items-center gap-4 px-5 py-4">
      {icon && <span className="icon-badge text-xl">{icon}</span>}
      <div>
        <p className="font-display text-2xl font-bold text-ink dark:text-[#f1efe9]">{value}</p>
        <p className="mt-0.5 text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}

/** Simple page-number pagination for dashboard tables. Renders nothing for a single page. */
export function Pagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between gap-3 text-sm">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-full border border-line px-3 py-1.5 font-medium transition-colors hover:border-amber disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Prev
      </button>
      <span className="text-xs text-muted">
        Page {page} of {pageCount}
      </span>
      <button
        onClick={() => onPageChange(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        className="rounded-full border border-line px-3 py-1.5 font-medium transition-colors hover:border-amber disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next →
      </button>
    </div>
  );
}
