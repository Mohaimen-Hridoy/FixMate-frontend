export type Category = {
  slug: string;
  name: string;
  icon: string;
  count: number;
};

export const categories: Category[] = [
  { slug: "ac-repair", name: "AC Repair", icon: "❄️", count: 128 },
  { slug: "electrical", name: "Electrical", icon: "🔌", count: 214 },
  { slug: "plumbing", name: "Plumbing", icon: "🔧", count: 176 },
  { slug: "pc-repair", name: "Laptop/PC Repair", icon: "💻", count: 92 },
  { slug: "cleaning", name: "Home Cleaning", icon: "🧽", count: 301 },
  { slug: "painting", name: "Painting", icon: "🎨", count: 87 },
  { slug: "cctv", name: "CCTV Install", icon: "📷", count: 54 },
  { slug: "appliance", name: "Appliance Repair", icon: "🧰", count: 143 },
  { slug: "moving", name: "Moving", icon: "📦", count: 66 },
];

export type Provider = {
  id: string;
  name: string;
  avatarInitial: string;
  category: string;
  rating: number;
  reviewCount: number;
  location: string;
  yearsActive: number;
  verified: boolean;
  bio: string;
  jobsCompleted: number;
  responseTime: string;
  serviceAreas: string[];
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  description: string;
  price: number;
  priceUnit: "job" | "hour" | "visit";
  location: string;
  rating: number;
  reviewCount: number;
  available: boolean;
  provider: Provider;
  features: string[];
};

const providers: Provider[] = [
  {
    id: "p1",
    name: "Karim Electricals",
    avatarInitial: "K",
    category: "electrical",
    rating: 4.8,
    reviewCount: 212,
    location: "Mirpur, Dhaka",
    yearsActive: 6,
    verified: true,
    bio: "Licensed electrical contractor covering residential wiring, breaker upgrades, and safety inspections across Dhaka. Every job comes with a written report and a follow-up check.",
    jobsCompleted: 486,
    responseTime: "Under 1 hour",
    serviceAreas: ["Mirpur", "Pallabi", "Kazipara", "Shewrapara"],
  },
  {
    id: "p2",
    name: "CoolFix AC Service",
    avatarInitial: "C",
    category: "ac-repair",
    rating: 4.7,
    reviewCount: 164,
    location: "Dhanmondi, Dhaka",
    yearsActive: 4,
    verified: true,
    bio: "AC installation, servicing, and gas refill specialists. We carry genuine parts on every visit so most repairs are finished in a single trip.",
    jobsCompleted: 351,
    responseTime: "Under 2 hours",
    serviceAreas: ["Dhanmondi", "Mohammadpur", "Jigatola", "Kalabagan"],
  },
  {
    id: "p3",
    name: "Rafiq Plumbing Co.",
    avatarInitial: "R",
    category: "plumbing",
    rating: 4.6,
    reviewCount: 98,
    location: "Uttara, Dhaka",
    yearsActive: 8,
    verified: true,
    bio: "Eight years fixing leaks, clogs, and low pressure across Uttara and nearby sectors. Camera diagnostics on every stubborn blockage before we quote a price.",
    jobsCompleted: 512,
    responseTime: "Same day",
    serviceAreas: ["Uttara", "Airport", "Turag", "Tongi"],
  },
  {
    id: "p4",
    name: "ByteWorks PC Care",
    avatarInitial: "B",
    category: "pc-repair",
    rating: 4.9,
    reviewCount: 71,
    location: "Banani, Dhaka",
    yearsActive: 3,
    verified: false,
    bio: "Laptop and desktop repair — screens, batteries, data recovery, and OS troubleshooting. Free diagnostics and same-day turnaround on most common models.",
    jobsCompleted: 143,
    responseTime: "Under 3 hours",
    serviceAreas: ["Banani", "Gulshan", "Niketon", "Baridhara"],
  },
  {
    id: "p5",
    name: "ShineHome Cleaning",
    avatarInitial: "S",
    category: "cleaning",
    rating: 4.5,
    reviewCount: 340,
    location: "Gulshan, Dhaka",
    yearsActive: 5,
    verified: true,
    bio: "Two- and three-person cleaning teams for full-home deep cleans and recurring housekeeping. Eco-friendly products used on every visit.",
    jobsCompleted: 728,
    responseTime: "Under 4 hours",
    serviceAreas: ["Gulshan", "Banani", "Baridhara", "Bashundhara"],
  },
  {
    id: "p6",
    name: "Momen Paint Studio",
    avatarInitial: "M",
    category: "painting",
    rating: 4.4,
    reviewCount: 58,
    location: "Mohammadpur, Dhaka",
    yearsActive: 7,
    verified: false,
    bio: "Interior and exterior painting with proper surface prep — crack filling, priming, and clean-edge masking on every room.",
    jobsCompleted: 189,
    responseTime: "Same day",
    serviceAreas: ["Mohammadpur", "Shyamoli", "Adabor", "Dhanmondi"],
  },
];

export function getAllProviders() {
  return providers;
}

export const services: Service[] = [
  {
    id: "s1",
    slug: "split-ac-full-service",
    title: "Split AC Full Service & Gas Refill",
    category: "ac-repair",
    shortDescription: "Deep clean, gas check, and cooling diagnostics for split ACs.",
    description:
      "A complete service visit covering filter and coil cleaning, drainage check, gas pressure diagnostics, and a cooling performance test. Ideal before summer or if your unit is running but not cooling well.",
    price: 1200,
    priceUnit: "visit",
    location: "Dhanmondi, Dhaka",
    rating: 4.7,
    reviewCount: 164,
    available: true,
    provider: providers[1],
    features: [
      "Filter & coil deep cleaning",
      "Gas pressure diagnostics",
      "Drainage line check",
      "30-day service warranty",
    ],
  },
  {
    id: "s2",
    slug: "home-wiring-inspection",
    title: "Home Wiring Safety Inspection",
    category: "electrical",
    shortDescription: "Full circuit inspection with a written safety report.",
    description:
      "A certified electrician inspects your home's wiring, breaker load, and earthing, then hands you a written report flagging any fire or shock risks before they become expensive problems.",
    price: 900,
    priceUnit: "visit",
    location: "Mirpur, Dhaka",
    rating: 4.8,
    reviewCount: 212,
    available: true,
    provider: providers[0],
    features: [
      "Full circuit & breaker check",
      "Earthing verification",
      "Written safety report",
      "Same-day minor fixes",
    ],
  },
  {
    id: "s3",
    slug: "blocked-drain-fix",
    title: "Blocked Drain & Pipe Leak Fix",
    category: "plumbing",
    shortDescription: "Same-day fix for clogs, leaks, and low water pressure.",
    description:
      "Rafiq Plumbing diagnoses and clears blocked drains, patches leaking joints, and restores normal water pressure — most jobs completed within a single visit.",
    price: 700,
    priceUnit: "visit",
    location: "Uttara, Dhaka",
    rating: 4.6,
    reviewCount: 98,
    available: true,
    provider: providers[2],
    features: [
      "Drain camera diagnostics",
      "Leak sealing & pipe patching",
      "Pressure restoration",
      "Parts under separate quote",
    ],
  },
  {
    id: "s4",
    slug: "laptop-screen-replacement",
    title: "Laptop Screen & Battery Replacement",
    category: "pc-repair",
    shortDescription: "Genuine-part replacement with a 6-month warranty.",
    description:
      "ByteWorks replaces cracked laptop screens and worn-out batteries using genuine or OEM-equivalent parts, with same-day turnaround for most models.",
    price: 3500,
    priceUnit: "job",
    location: "Banani, Dhaka",
    rating: 4.9,
    reviewCount: 71,
    available: false,
    provider: providers[3],
    features: [
      "Genuine / OEM parts",
      "Same-day turnaround",
      "Free diagnostics",
      "6-month warranty",
    ],
  },
  {
    id: "s5",
    slug: "deep-home-cleaning",
    title: "Deep Home Cleaning (2BR/2BA)",
    category: "cleaning",
    shortDescription: "Kitchen, bathrooms, floors, and window tracks — all covered.",
    description:
      "A thorough top-to-bottom clean for a 2-bedroom, 2-bath home, including kitchen degreasing, bathroom sanitation, floor scrubbing, and window track cleaning. Team of 2, eco-friendly products.",
    price: 2400,
    priceUnit: "job",
    location: "Gulshan, Dhaka",
    rating: 4.5,
    reviewCount: 340,
    available: true,
    provider: providers[4],
    features: [
      "2-person cleaning team",
      "Eco-friendly products",
      "Kitchen deep degreasing",
      "Window track cleaning",
    ],
  },
  {
    id: "s6",
    slug: "interior-wall-painting",
    title: "Interior Wall Painting (Per Room)",
    category: "painting",
    shortDescription: "Prep, prime, and two coats — clean-edge finish guaranteed.",
    description:
      "Full interior painting service per room: surface prep, crack filling, priming, and two coats of your chosen finish, with masking for clean edges around trim.",
    price: 4500,
    priceUnit: "job",
    location: "Mohammadpur, Dhaka",
    rating: 4.4,
    reviewCount: 58,
    available: true,
    provider: providers[5],
    features: [
      "Crack filling & surface prep",
      "Primer + 2 coats",
      "Clean-edge masking",
      "Paint sourcing on request",
    ],
  },
];

export type BookingStatus =
  | "Pending"
  | "Accepted"
  | "Rejected"
  | "In Progress"
  | "Completed"
  | "Cancelled";

/** The ordered "happy path" a booking moves through. Rejected/Cancelled are terminal side-exits. */
export const BOOKING_STATUS_FLOW: BookingStatus[] = [
  "Pending",
  "Accepted",
  "In Progress",
  "Completed",
];

/** Terminal statuses — nothing can transition out of these. */
export const TERMINAL_STATUSES: BookingStatus[] = ["Completed", "Rejected", "Cancelled"];

export type BookingHistoryEntry = {
  status: BookingStatus;
  at: string; // ISO timestamp
  note?: string;
};

export type Booking = {
  id: string;
  serviceId: string;
  serviceSlug: string;
  serviceTitle: string;
  category: string;
  providerId: string;
  providerName: string;
  customerName: string;
  address: string;
  notes?: string;
  date: string; // YYYY-MM-DD
  time: string; // display string, e.g. "10:00 AM"
  amount: number;
  status: BookingStatus;
  createdAt: string; // ISO timestamp
  reviewed?: boolean;
  history: BookingHistoryEntry[];
};

function h(status: BookingStatus, at: string, note?: string): BookingHistoryEntry {
  return { status, at, note };
}

/**
 * Seed bookings — one unified list. The demo customer is "You" and the demo
 * provider is CoolFix AC Service (p2, `myProviderId`), so this set mixes
 * bookings the demo customer made with other providers, and bookings other
 * customers made with the demo provider — exactly like a real marketplace,
 * where a single bookings table is filtered per-role rather than kept as two
 * disconnected lists.
 */
export const seedBookings: Booking[] = [
  {
    id: "BK-1042",
    serviceId: "s1",
    serviceSlug: "split-ac-full-service",
    serviceTitle: "Split AC Full Service & Gas Refill",
    category: "ac-repair",
    providerId: "p2",
    providerName: "CoolFix AC Service",
    customerName: "You",
    address: "House 14, Road 7, Dhanmondi, Dhaka",
    date: "2026-08-14",
    time: "10:00 AM",
    amount: 1200,
    status: "Accepted",
    createdAt: "2026-08-06T09:12:00.000Z",
    history: [
      h("Pending", "2026-08-06T09:12:00.000Z", "Booking submitted"),
      h("Accepted", "2026-08-06T13:40:00.000Z", "Confirmed by provider"),
    ],
  },
  {
    id: "BK-1039",
    serviceId: "s2",
    serviceSlug: "home-wiring-inspection",
    serviceTitle: "Home Wiring Safety Inspection",
    category: "electrical",
    providerId: "p1",
    providerName: "Karim Electricals",
    customerName: "You",
    address: "House 22, Road 3, Mirpur, Dhaka",
    date: "2026-08-02",
    time: "3:30 PM",
    amount: 900,
    status: "Completed",
    createdAt: "2026-07-28T07:05:00.000Z",
    reviewed: true,
    history: [
      h("Pending", "2026-07-28T07:05:00.000Z", "Booking submitted"),
      h("Accepted", "2026-07-28T10:15:00.000Z", "Confirmed by provider"),
      h("In Progress", "2026-08-02T15:32:00.000Z", "Technician on site"),
      h("Completed", "2026-08-02T17:10:00.000Z", "Job marked complete"),
    ],
  },
  {
    id: "BK-1031",
    serviceId: "s5",
    serviceSlug: "deep-home-cleaning",
    serviceTitle: "Deep Home Cleaning (2BR/2BA)",
    category: "cleaning",
    providerId: "p5",
    providerName: "ShineHome Cleaning",
    customerName: "You",
    address: "Apt 4B, Road 11, Gulshan, Dhaka",
    date: "2026-07-21",
    time: "9:00 AM",
    amount: 2400,
    status: "Completed",
    createdAt: "2026-07-16T11:00:00.000Z",
    reviewed: false,
    history: [
      h("Pending", "2026-07-16T11:00:00.000Z", "Booking submitted"),
      h("Accepted", "2026-07-16T14:22:00.000Z", "Confirmed by provider"),
      h("In Progress", "2026-07-21T09:05:00.000Z", "Cleaning team on site"),
      h("Completed", "2026-07-21T12:40:00.000Z", "Job marked complete"),
    ],
  },
  {
    id: "BK-1028",
    serviceId: "s3",
    serviceSlug: "blocked-drain-fix",
    serviceTitle: "Blocked Drain & Pipe Leak Fix",
    category: "plumbing",
    providerId: "p3",
    providerName: "Rafiq Plumbing Co.",
    customerName: "You",
    address: "House 9, Sector 4, Uttara, Dhaka",
    date: "2026-07-10",
    time: "1:00 PM",
    amount: 700,
    status: "Cancelled",
    createdAt: "2026-07-06T08:30:00.000Z",
    history: [
      h("Pending", "2026-07-06T08:30:00.000Z", "Booking submitted"),
      h("Cancelled", "2026-07-08T10:00:00.000Z", "Cancelled by customer — schedule conflict"),
    ],
  },
  {
    id: "BK-1040",
    serviceId: "s1",
    serviceSlug: "split-ac-full-service",
    serviceTitle: "Split AC Full Service & Gas Refill",
    category: "ac-repair",
    providerId: "p2",
    providerName: "CoolFix AC Service",
    customerName: "Tanvir A.",
    address: "House 5, Road 27, Dhanmondi, Dhaka",
    date: "2026-08-09",
    time: "2:00 PM",
    amount: 1200,
    status: "Pending",
    createdAt: "2026-08-07T06:50:00.000Z",
    history: [h("Pending", "2026-08-07T06:50:00.000Z", "Booking submitted")],
  },
  {
    id: "BK-1033",
    serviceId: "s1",
    serviceSlug: "split-ac-full-service",
    serviceTitle: "Split AC Full Service & Gas Refill",
    category: "ac-repair",
    providerId: "p2",
    providerName: "CoolFix AC Service",
    customerName: "Mehjabin R.",
    address: "House 31, Road 8A, Dhanmondi, Dhaka",
    date: "2026-07-28",
    time: "11:00 AM",
    amount: 1200,
    status: "In Progress",
    createdAt: "2026-07-24T09:00:00.000Z",
    history: [
      h("Pending", "2026-07-24T09:00:00.000Z", "Booking submitted"),
      h("Accepted", "2026-07-24T12:10:00.000Z", "Confirmed by provider"),
      h("In Progress", "2026-07-28T11:05:00.000Z", "Technician on site"),
    ],
  },
  {
    id: "BK-1020",
    serviceId: "s1",
    serviceSlug: "split-ac-full-service",
    serviceTitle: "Split AC Full Service & Gas Refill",
    category: "ac-repair",
    providerId: "p2",
    providerName: "CoolFix AC Service",
    customerName: "Omar F.",
    address: "House 2, Road 5, Mohammadpur, Dhaka",
    date: "2026-07-15",
    time: "4:00 PM",
    amount: 1200,
    status: "Completed",
    createdAt: "2026-07-10T05:40:00.000Z",
    reviewed: true,
    history: [
      h("Pending", "2026-07-10T05:40:00.000Z", "Booking submitted"),
      h("Accepted", "2026-07-10T09:00:00.000Z", "Confirmed by provider"),
      h("In Progress", "2026-07-15T16:10:00.000Z", "Technician on site"),
      h("Completed", "2026-07-15T18:00:00.000Z", "Job marked complete"),
    ],
  },
  {
    id: "BK-1018",
    serviceId: "s1",
    serviceSlug: "split-ac-full-service",
    serviceTitle: "Split AC Full Service & Gas Refill",
    category: "ac-repair",
    providerId: "p2",
    providerName: "CoolFix AC Service",
    customerName: "Farhan K.",
    address: "House 18, Road 2, Jigatola, Dhaka",
    date: "2026-07-05",
    time: "10:30 AM",
    amount: 1200,
    status: "Rejected",
    createdAt: "2026-07-02T04:20:00.000Z",
    history: [
      h("Pending", "2026-07-02T04:20:00.000Z", "Booking submitted"),
      h("Rejected", "2026-07-02T08:00:00.000Z", "Outside current service area"),
    ],
  },
];

/** Demo identities the (auth-less) dashboard pages render as. */
export const demoCustomerName = "You";

/** Every allowed forward transition, keyed by the booking's current status. */
export const NEXT_STATUSES: Record<BookingStatus, BookingStatus[]> = {
  Pending: ["Accepted", "Rejected"],
  Accepted: ["In Progress", "Cancelled"],
  "In Progress": ["Completed"],
  Completed: [],
  Rejected: [],
  Cancelled: [],
};

/** A customer may only back out while the provider hasn't started the job yet. */
export function canCustomerCancel(status: BookingStatus) {
  return status === "Pending" || status === "Accepted";
}

export const monthlyEarnings = [
  { month: "Mar", value: 18200 },
  { month: "Apr", value: 21400 },
  { month: "May", value: 19800 },
  { month: "Jun", value: 26100 },
  { month: "Jul", value: 24300 },
  { month: "Aug", value: 15600 },
];

/** Platform-wide monthly trend used by the admin analytics page (bookings, revenue, new users). */
export const platformMonthlyStats = [
  { month: "Mar", bookings: 142, revenue: 186400, newUsers: 38 },
  { month: "Apr", bookings: 168, revenue: 214900, newUsers: 45 },
  { month: "May", bookings: 155, revenue: 198200, newUsers: 41 },
  { month: "Jun", bookings: 201, revenue: 261800, newUsers: 57 },
  { month: "Jul", bookings: 189, revenue: 243500, newUsers: 52 },
  { month: "Aug", bookings: 97, revenue: 128300, newUsers: 24 },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(category: string, excludeId: string) {
  return services.filter((s) => s.category === category && s.id !== excludeId);
}

/* ---------- Provider's own services (for the CRUD dashboard) ---------- */

// The logged-in demo provider is CoolFix AC Service (p2).
export const myProviderId = "p2";

const extraProviderServices: Service[] = [
  {
    id: "s7",
    slug: "ac-installation-new-unit",
    title: "AC Installation (New Unit)",
    category: "ac-repair",
    shortDescription: "Wall bracket, piping, and full setup for a new split unit.",
    description:
      "End-to-end installation for a newly purchased split AC — wall bracket mounting, copper piping, drainage routing, and a post-install cooling test.",
    price: 2200,
    priceUnit: "job",
    location: "Dhanmondi, Dhaka",
    rating: 4.6,
    reviewCount: 39,
    available: true,
    provider: providers[1],
    features: ["Bracket & piping setup", "Drainage routing", "Post-install test", "15-day workmanship warranty"],
  },
  {
    id: "s8",
    slug: "ac-duct-cleaning",
    title: "AC Duct & Filter Cleaning",
    category: "ac-repair",
    shortDescription: "Quick refresh for weak airflow and dusty vents.",
    description:
      "A focused visit to clean ducts, vents, and filters when cooling feels weak but the unit doesn't need a full service — restores airflow and cuts down on dust.",
    price: 600,
    priceUnit: "visit",
    location: "Dhanmondi, Dhaka",
    rating: 4.5,
    reviewCount: 22,
    available: false,
    provider: providers[1],
    features: ["Duct & vent cleaning", "Filter wash/replace", "Airflow check"],
  },
];

services.push(...extraProviderServices);

/** Unique service areas, derived from the data set — powers the Explore location filter. */
export const locations = Array.from(new Set(services.map((s) => s.location))).sort();

export function getServicesByProvider(providerId: string) {
  return services.filter((s) => s.provider.id === providerId);
}

/* ---------- Reviews ---------- */

export type Review = {
  id: string;
  serviceId: string;
  providerId?: string;
  bookingId?: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
};

export const reviews: Review[] = [
  {
    id: "rv1",
    serviceId: "s1",
    customerName: "Omar F.",
    rating: 5,
    comment: "Cooling was noticeably better the same evening. Technician explained everything clearly.",
    date: "2026-07-18",
  },
  {
    id: "rv2",
    serviceId: "s1",
    customerName: "Mehjabin R.",
    rating: 4,
    comment: "Good service overall, arrived about 20 minutes late but did thorough work.",
    date: "2026-07-02",
  },
  {
    id: "rv3",
    serviceId: "s2",
    customerName: "Tanvir A.",
    rating: 5,
    comment: "Very detailed safety report — found a loose breaker connection we didn't know about.",
    date: "2026-06-20",
  },
  {
    id: "rv4",
    serviceId: "s5",
    customerName: "Nusrat J.",
    rating: 4,
    comment: "Kitchen and bathrooms looked brand new. Would book again.",
    date: "2026-07-25",
  },
];

export function getReviewsByService(serviceId: string) {
  return reviews.filter((r) => r.serviceId === serviceId);
}

/* ---------- Provider public profile ---------- */

export function getProviderById(id: string) {
  return providers.find((p) => p.id === id);
}

export function getReviewsByProvider(providerId: string) {
  const serviceIds = new Set(getServicesByProvider(providerId).map((s) => s.id));
  return reviews
    .filter((r) => serviceIds.has(r.serviceId))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getFeaturedProviders(limit = 3) {
  return [...providers].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export function hasReviewForBooking(bookingId: string, existingIds: string[]) {
  return existingIds.includes(bookingId);
}

export function nextReviewId(existing: Review[]) {
  const max = existing.reduce((m, r) => {
    const n = Number(r.id.replace("rv", ""));
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return `rv${max + 1}`;
}

/**
 * A service/provider's seed `rating`/`reviewCount` stands in for a large
 * history of past reviews we don't store individually. New reviews written
 * through the app are blended into that seed average rather than replacing
 * it, so one new 3-star review doesn't swing a 200-review average to 3.0.
 */
export function blendRating(seedRating: number, seedCount: number, newReviews: Review[]) {
  const newCount = newReviews.length;
  const totalCount = seedCount + newCount;
  if (totalCount === 0) return { rating: 0, count: 0 };
  const newSum = newReviews.reduce((sum, r) => sum + r.rating, 0);
  const blended = (seedRating * seedCount + newSum) / totalCount;
  return { rating: Math.round(blended * 10) / 10, count: totalCount };
}

/* ---------- Bookings: shared helpers ---------- */

export function nextBookingId(existing: Booking[]) {
  const max = existing.reduce((m, b) => {
    const n = Number(b.id.replace("BK-", ""));
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 1000);
  return `BK-${max + 1}`;
}

export function getBookingsForCustomer(bookings: Booking[], customerName: string) {
  return bookings.filter((b) => b.customerName === customerName);
}

export function getBookingsForProvider(bookings: Booking[], providerId: string) {
  return bookings.filter((b) => b.providerId === providerId);
}

/* ---------- Admin: users & provider approvals ---------- */

export type UserRole = "customer" | "provider" | "admin";
export type UserStatus = "Active" | "Suspended";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
};

export const appUsers: AppUser[] = [
  { id: "u1", name: "Nusrat Jahan", email: "nusrat.j@example.com", role: "customer", status: "Active", joinedDate: "2026-02-11" },
  { id: "u2", name: "Tanvir Ahmed", email: "tanvir.a@example.com", role: "customer", status: "Active", joinedDate: "2026-03-04" },
  { id: "u3", name: "Karim Electricals", email: "karim.elec@example.com", role: "provider", status: "Active", joinedDate: "2025-11-02" },
  { id: "u4", name: "CoolFix AC Service", email: "coolfix.ac@example.com", role: "provider", status: "Active", joinedDate: "2025-12-19" },
  { id: "u5", name: "Rafiq Plumbing Co.", email: "rafiq.plumb@example.com", role: "provider", status: "Active", joinedDate: "2025-10-27" },
  { id: "u6", name: "Mehjabin Rahman", email: "mehjabin.r@example.com", role: "customer", status: "Active", joinedDate: "2026-04-15" },
  { id: "u7", name: "Omar Faruk", email: "omar.f@example.com", role: "customer", status: "Suspended", joinedDate: "2026-01-08" },
  { id: "u8", name: "ByteWorks PC Care", email: "byteworks.pc@example.com", role: "provider", status: "Active", joinedDate: "2026-02-28" },
  { id: "u9", name: "Admin — Sadia Islam", email: "sadia.admin@fixmate.com", role: "admin", status: "Active", joinedDate: "2025-09-01" },
];

export type PendingProvider = {
  id: string;
  name: string;
  category: string;
  location: string;
  email: string;
  appliedDate: string;
};

export const pendingProviders: PendingProvider[] = [
  { id: "pp1", name: "Hasan CCTV Solutions", category: "cctv", location: "Bashundhara, Dhaka", email: "hasan.cctv@example.com", appliedDate: "2026-08-05" },
  { id: "pp2", name: "QuickMove Packers", category: "moving", location: "Rampura, Dhaka", email: "quickmove@example.com", appliedDate: "2026-08-06" },
  { id: "pp3", name: "Nabila Home Painters", category: "painting", location: "Wari, Dhaka", email: "nabila.paint@example.com", appliedDate: "2026-08-08" },
];
