"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "./modal";
import { RatingInput } from "./rating-input";
import { useReviews } from "@/lib/reviews-store";
import { reviewSchema, type ReviewFormValues } from "@/lib/validation";

export function ReviewModal({
  open,
  onClose,
  bookingId,
  serviceId,
  providerId,
  serviceTitle,
  providerName,
  customerName,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  serviceId: string;
  providerId: string;
  serviceTitle: string;
  providerName: string;
  customerName: string;
  onSubmitted: () => void;
}) {
  const { addReview, hasReviewedBooking } = useReviews();
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });
  const rating = useWatch({ control, name: "rating" });

  function handleClose() {
    reset({ rating: 0, comment: "" });
    setSuccess(false);
    onClose();
  }

  function onSubmit(values: ReviewFormValues) {
    // Backend-style guard: one review per completed booking, even if the
    // modal somehow gets submitted twice.
    if (hasReviewedBooking(bookingId)) {
      setSuccess(true);
      setTimeout(() => {
        onSubmitted();
        handleClose();
      }, 400);
      return;
    }
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        addReview({
          bookingId,
          serviceId,
          providerId,
          customerName,
          rating: values.rating,
          comment: values.comment.trim(),
        });
        setSuccess(true);
        resolve();
        setTimeout(() => {
          onSubmitted();
          handleClose();
        }, 900);
      }, 700);
    });
  }

  return (
    <Modal open={open} onClose={handleClose} title="Leave a review">
      <p className="mb-4 text-sm text-muted">
        {serviceTitle} · {providerName}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted">
            Your rating
          </label>
          <RatingInput value={rating} onChange={(v) => setValue("rating", v, { shouldValidate: true })} />
          {errors.rating && (
            <p role="alert" className="mt-1 text-xs text-[#A3342A]">
              {errors.rating.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="comment" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Your review
          </label>
          <textarea
            id="comment"
            rows={4}
            aria-invalid={!!errors.comment}
            {...register("comment")}
            placeholder="How did the job go?"
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          />
          {errors.comment && (
            <p role="alert" className="mt-1 text-xs text-[#A3342A]">
              {errors.comment.message}
            </p>
          )}
        </div>

        {success && (
          <p role="status" className="text-sm text-teal">
            Thanks — your review has been posted.
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 rounded-lg border border-line py-2.5 text-sm font-medium transition-colors hover:border-amber"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || success}
            className="flex-1 rounded-lg bg-ink py-2.5 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-60 dark:bg-amber dark:text-ink"
          >
            {isSubmitting ? "Posting…" : "Submit review"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
