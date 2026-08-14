"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  type Booking,
  type BookingStatus,
  canCustomerCancel,
  nextBookingId,
  NEXT_STATUSES,
  seedBookings,
} from "./data";

const STORAGE_KEY = "fixmate:bookings:v1";

export type NewBookingInput = {
  serviceId: string;
  serviceSlug: string;
  serviceTitle: string;
  category: string;
  providerId: string;
  providerName: string;
  customerName: string;
  address: string;
  notes?: string;
  date: string;
  time: string;
  amount: number;
};

type BookingsContextValue = {
  bookings: Booking[];
  getBookingById: (id: string) => Booking | undefined;
  addBooking: (input: NewBookingInput) => Booking;
  updateStatus: (id: string, status: BookingStatus, note?: string) => void;
  cancelBooking: (id: string, reason?: string) => void;
  markReviewed: (id: string) => void;
  resetDemoData: () => void;
};

const BookingsContext = createContext<BookingsContextValue | null>(null);

function nowIso() {
  return new Date().toISOString();
}

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  // Seed data on both server and first client render so hydration matches —
  // localStorage is only consulted after mount, in the effect below.
  const [bookings, setBookings] = useState<Booking[]>(seedBookings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Booking[];
        // One-time hydration from localStorage after mount, deliberately kept
        // out of a lazy useState initializer so the first client render still
        // matches the server-rendered (seeded) markup and avoids a hydration
        // mismatch.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(parsed) && parsed.length > 0) setBookings(parsed);
      }
    } catch {
      // Corrupt or inaccessible storage — fall back to seed data silently.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      // Storage full/unavailable — the session still works, it just won't persist.
    }
  }, [bookings, hydrated]);

  const getBookingById = useCallback(
    (id: string) => bookings.find((b) => b.id === id),
    [bookings]
  );

  const addBooking = useCallback((input: NewBookingInput) => {
    let created!: Booking;
    setBookings((list) => {
      const id = nextBookingId(list);
      const at = nowIso();
      created = {
        id,
        ...input,
        status: "Pending",
        createdAt: at,
        history: [{ status: "Pending", at, note: "Booking submitted" }],
      };
      return [created, ...list];
    });
    return created!;
  }, []);

  const updateStatus = useCallback((id: string, status: BookingStatus, note?: string) => {
    setBookings((list) =>
      list.map((b) => {
        if (b.id !== id) return b;
        // Guard against illegal transitions even if a caller misbehaves —
        // this stands in for the backend validation the real API would do.
        const allowed = NEXT_STATUSES[b.status];
        if (!allowed.includes(status)) return b;
        return {
          ...b,
          status,
          history: [...b.history, { status, at: nowIso(), note }],
        };
      })
    );
  }, []);

  const cancelBooking = useCallback((id: string, reason?: string) => {
    setBookings((list) =>
      list.map((b) => {
        if (b.id !== id) return b;
        if (!canCustomerCancel(b.status)) return b;
        return {
          ...b,
          status: "Cancelled" as BookingStatus,
          history: [
            ...b.history,
            { status: "Cancelled" as BookingStatus, at: nowIso(), note: reason ?? "Cancelled by customer" },
          ],
        };
      })
    );
  }, []);

  const markReviewed = useCallback((id: string) => {
    setBookings((list) => list.map((b) => (b.id === id ? { ...b, reviewed: true } : b)));
  }, []);

  const resetDemoData = useCallback(() => {
    setBookings(seedBookings);
  }, []);

  const value = useMemo(
    () => ({ bookings, getBookingById, addBooking, updateStatus, cancelBooking, markReviewed, resetDemoData }),
    [bookings, getBookingById, addBooking, updateStatus, cancelBooking, markReviewed, resetDemoData]
  );

  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>;
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error("useBookings must be used within a BookingsProvider");
  return ctx;
}
