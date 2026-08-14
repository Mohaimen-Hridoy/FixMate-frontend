"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Service, demoCustomerName } from "@/lib/data";
import { useBookings } from "@/lib/bookings-store";
import { bookingSchema, type BookingFormValues } from "@/lib/validation";
import { useAuth } from "@/lib/use-auth";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function BookingPanel({ service }: { service: Service }) {
  const { addBooking } = useBookings();
  const { user } = useAuth();
  const [confirmedId, setConfirmedId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { date: "", time: "", address: service.location, notes: "" },
  });

  function onSubmit(values: BookingFormValues) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const booking = addBooking({
          serviceId: service.id,
          serviceSlug: service.slug,
          serviceTitle: service.title,
          category: service.category,
          providerId: service.provider.id,
          providerName: service.provider.name,
          customerName: user?.name || demoCustomerName,
          address: values.address.trim(),
          notes: values.notes?.trim() || undefined,
          date: values.date,
          time: values.time,
          amount: service.price,
        });
        setConfirmedId(booking.id);
        resolve();
      }, 700);
    });
  }

  if (confirmedId) {
    return (
      <aside className="ticket h-fit space-y-4 border-teal/40 p-5">
        <p className="font-display text-lg font-semibold text-teal">Booking requested ✓</p>
        <p className="text-sm text-muted">
          {service.provider.name} will confirm <span className="font-mono">{confirmedId}</span> shortly. You&apos;ll see it
          in your bookings as soon as they respond.
        </p>
        <Link
          href={`/dashboard/customer/bookings/${confirmedId}`}
          className="block w-full rounded-lg bg-amber py-3 text-center text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
        >
          View booking
        </Link>
        <Link
          href="/dashboard/customer/bookings"
          className="block w-full rounded-lg border border-line py-3 text-center text-sm font-medium transition-colors hover:border-amber"
        >
          My bookings
        </Link>
      </aside>
    );
  }

  return (
    <aside className="ticket h-fit space-y-4 p-5">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-2xl font-semibold">৳{service.price}</span>
        <span className="text-sm text-muted">/{service.priceUnit}</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="date" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Date
          </label>
          <input
            id="date"
            type="date"
            min={todayIso()}
            disabled={!service.available}
            aria-invalid={!!errors.date}
            {...register("date")}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber disabled:opacity-50"
          />
          {errors.date && (
            <p role="alert" className="mt-1 text-xs text-[#A3342A]">
              {errors.date.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="time" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Time
          </label>
          <input
            id="time"
            type="time"
            disabled={!service.available}
            aria-invalid={!!errors.time}
            {...register("time")}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber disabled:opacity-50"
          />
          {errors.time && (
            <p role="alert" className="mt-1 text-xs text-[#A3342A]">
              {errors.time.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="address" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Service address
          </label>
          <input
            id="address"
            type="text"
            disabled={!service.available}
            aria-invalid={!!errors.address}
            {...register("address")}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber disabled:opacity-50"
          />
          {errors.address && (
            <p role="alert" className="mt-1 text-xs text-[#A3342A]">
              {errors.address.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="notes" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Notes for the provider <span className="normal-case text-muted/70">(optional)</span>
          </label>
          <textarea
            id="notes"
            rows={2}
            disabled={!service.available}
            {...register("notes")}
            placeholder="Anything they should know before arriving?"
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={!service.available || isSubmitting}
          className="w-full rounded-lg bg-amber py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {!service.available ? "Currently unavailable" : isSubmitting ? "Sending request…" : "Book this service"}
        </button>
      </form>
      <p className="text-center text-xs text-muted">You won&apos;t be charged yet.</p>
    </aside>
  );
}
