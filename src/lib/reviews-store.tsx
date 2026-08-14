"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  blendRating,
  getServicesByProvider,
  nextReviewId,
  reviews as seedReviews,
  type Review,
} from "./data";

const STORAGE_KEY = "fixmate:reviews:v1";

export type NewReviewInput = {
  bookingId: string;
  serviceId: string;
  providerId: string;
  customerName: string;
  rating: number;
  comment: string;
};

type ReviewsContextValue = {
  /** Reviews written through the app this session — the seed list in data.ts stays separate and untouched. */
  newReviews: Review[];
  /** Seed reviews + newReviews, newest first. */
  allReviews: Review[];
  addReview: (input: NewReviewInput) => Review;
  hasReviewedBooking: (bookingId: string) => boolean;
  getReviewsForService: (serviceId: string) => Review[];
  getReviewsForProvider: (providerId: string) => Review[];
  getLiveRating: (seedRating: number, seedCount: number, serviceId: string) => { rating: number; count: number };
  getLiveProviderRating: (
    seedRating: number,
    seedCount: number,
    providerId: string
  ) => { rating: number; count: number };
  resetDemoData: () => void;
};

const ReviewsContext = createContext<ReviewsContextValue | null>(null);

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [newReviews, setNewReviews] = useState<Review[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Review[];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(parsed)) setNewReviews(parsed);
      }
    } catch {
      // Corrupt or inaccessible storage — fall back to empty (seed-only) silently.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newReviews));
    } catch {
      // Storage full/unavailable — the session still works, it just won't persist.
    }
  }, [newReviews, hydrated]);

  const allReviews = useMemo(
    () => [...newReviews, ...seedReviews].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [newReviews]
  );

  const hasReviewedBooking = useCallback(
    (bookingId: string) => newReviews.some((r) => r.bookingId === bookingId),
    [newReviews]
  );

  const addReview = useCallback((input: NewReviewInput) => {
    let created!: Review;
    setNewReviews((list) => {
      if (list.some((r) => r.bookingId === input.bookingId)) {
        // Already reviewed — don't create a second review for the same booking.
        created = list.find((r) => r.bookingId === input.bookingId)!;
        return list;
      }
      const id = nextReviewId([...list, ...seedReviews]);
      created = {
        id,
        serviceId: input.serviceId,
        providerId: input.providerId,
        bookingId: input.bookingId,
        customerName: input.customerName,
        rating: input.rating,
        comment: input.comment,
        date: new Date().toISOString().slice(0, 10),
      };
      return [created, ...list];
    });
    return created!;
  }, []);

  const getReviewsForService = useCallback(
    (serviceId: string) => allReviews.filter((r) => r.serviceId === serviceId),
    [allReviews]
  );

  const getReviewsForProvider = useCallback(
    (providerId: string) => {
      const serviceIds = new Set(getServicesByProvider(providerId).map((s) => s.id));
      return allReviews.filter((r) => r.providerId === providerId || serviceIds.has(r.serviceId));
    },
    [allReviews]
  );

  const getLiveRating = useCallback(
    (seedRating: number, seedCount: number, serviceId: string) => {
      const added = newReviews.filter((r) => r.serviceId === serviceId);
      return blendRating(seedRating, seedCount, added);
    },
    [newReviews]
  );

  const getLiveProviderRating = useCallback(
    (seedRating: number, seedCount: number, providerId: string) => {
      const serviceIds = new Set(getServicesByProvider(providerId).map((s) => s.id));
      const added = newReviews.filter((r) => r.providerId === providerId || serviceIds.has(r.serviceId));
      return blendRating(seedRating, seedCount, added);
    },
    [newReviews]
  );

  const resetDemoData = useCallback(() => {
    setNewReviews([]);
  }, []);

  const value = useMemo(
    () => ({
      newReviews,
      allReviews,
      addReview,
      hasReviewedBooking,
      getReviewsForService,
      getReviewsForProvider,
      getLiveRating,
      getLiveProviderRating,
      resetDemoData,
    }),
    [
      newReviews,
      allReviews,
      addReview,
      hasReviewedBooking,
      getReviewsForService,
      getReviewsForProvider,
      getLiveRating,
      getLiveProviderRating,
      resetDemoData,
    ]
  );

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be used within a ReviewsProvider");
  return ctx;
}
