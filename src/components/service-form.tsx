"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categories } from "@/lib/data";
import { serviceSchema, type ServiceFormValues } from "@/lib/validation";

export type { ServiceFormValues };

const emptyValues: ServiceFormValues = {
  title: "",
  category: categories[0].slug,
  shortDescription: "",
  description: "",
  price: 0,
  priceUnit: "job",
  location: "",
  available: true,
};

export function ServiceForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: ServiceFormValues;
}) {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initial ?? emptyValues,
  });

  function onSubmit() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setSuccess(true);
        resolve();
        setTimeout(() => router.push("/dashboard/provider/services"), 900);
      }, 700);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="ticket mt-6 space-y-4 p-6" noValidate>
      <div>
        <label htmlFor="title" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
          Service title
        </label>
        <input
          id="title"
          aria-invalid={!!errors.title}
          {...register("title")}
          className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
        />
        {errors.title && (
          <p role="alert" className="mt-1 text-xs text-[#A3342A]">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Category
          </label>
          <select
            id="category"
            {...register("category")}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="location" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Location
          </label>
          <input
            id="location"
            aria-invalid={!!errors.location}
            {...register("location")}
            placeholder="e.g. Dhanmondi, Dhaka"
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          />
          {errors.location && (
            <p role="alert" className="mt-1 text-xs text-[#A3342A]">
              {errors.location.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="shortDescription" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
          Short description
        </label>
        <input
          id="shortDescription"
          aria-invalid={!!errors.shortDescription}
          {...register("shortDescription")}
          placeholder="One line shown on service cards"
          className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
        />
        {errors.shortDescription && (
          <p role="alert" className="mt-1 text-xs text-[#A3342A]">
            {errors.shortDescription.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
          Full description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register("description")}
          className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Price (৳)
          </label>
          <input
            id="price"
            type="number"
            min="0"
            aria-invalid={!!errors.price}
            {...register("price", { valueAsNumber: true })}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          />
          {errors.price && (
            <p role="alert" className="mt-1 text-xs text-[#A3342A]">
              {errors.price.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="priceUnit" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Billed per
          </label>
          <select
            id="priceUnit"
            {...register("priceUnit")}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          >
            <option value="job">job</option>
            <option value="hour">hour</option>
            <option value="visit">visit</option>
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          {...register("available")}
          className="h-4 w-4 rounded border-line accent-[color:var(--amber)]"
        />
        Available for new bookings
      </label>

      {success && (
        <p role="status" className="text-sm text-teal">
          {mode === "create" ? "Service created" : "Service updated"} — back to your list…
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={() => router.push("/dashboard/provider/services")}
          className="rounded-lg border border-line px-5 py-2.5 text-sm font-medium transition-colors hover:border-amber"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || success}
          className="rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-60 dark:bg-amber dark:text-ink"
        >
          {isSubmitting ? "Saving…" : mode === "create" ? "Create service" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
