import { z } from "zod";

/** Login form (`/login`) */
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});
export type LoginValues = z.infer<typeof loginSchema>;

/** Registration form (`/register`) */
export const registerSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number"),
  category: z.string().optional(),
});
export type RegisterValues = z.infer<typeof registerSchema>;

/** Contact form (`/contact`) */
export const contactSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});
export type ContactValues = z.infer<typeof contactSchema>;

/** Create/Edit service form (provider dashboard) */
export const serviceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.string().min(1, "Choose a category"),
  shortDescription: z
    .string()
    .min(10, "Short description must be at least 10 characters")
    .max(120, "Keep it under 120 characters"),
  description: z.string().optional(),
  price: z
    .number({ invalid_type_error: "Enter a valid price" })
    .positive("Price must be greater than 0"),
  priceUnit: z.enum(["job", "hour", "visit"]),
  location: z.string().min(2, "Location is required"),
  available: z.boolean(),
});
export type ServiceFormValues = z.infer<typeof serviceSchema>;

/** Customer profile update form */
export const customerProfileSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  phone: z
    .string()
    .min(6, "Enter a valid phone number")
    .regex(/^[0-9+\-\s]+$/, "Use digits only"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  address: z.string().optional(),
});
export type CustomerProfileValues = z.infer<typeof customerProfileSchema>;

/** Provider profile update form */
export const providerProfileSchema = z.object({
  name: z.string().min(2, "Enter a business name"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  bio: z.string().min(10, "Bio should be at least 10 characters"),
});
export type ProviderProfileValues = z.infer<typeof providerProfileSchema>;

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

/** Booking form (service details booking panel) */
export const bookingSchema = z
  .object({
    date: z.string().min(1, "Pick a date for the visit"),
    time: z.string().min(1, "Pick a time for the visit"),
    address: z.string().min(3, "Add the address where the job will happen"),
    notes: z.string().optional(),
  })
  .refine((data) => data.date >= todayIso(), {
    message: "Choose a date today or later.",
    path: ["date"],
  });
export type BookingFormValues = z.infer<typeof bookingSchema>;

/** Review form */
export const reviewSchema = z.object({
  rating: z.number().min(1, "Pick a star rating").max(5),
  comment: z.string().min(5, "Write at least a few words"),
});
export type ReviewFormValues = z.infer<typeof reviewSchema>;
