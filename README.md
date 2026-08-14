# FixMate — Frontend Scaffold

A Next.js (App Router) + TypeScript + Tailwind CSS frontend for **FixMate**, a local
service marketplace. This is a **frontend-only MVP** built with mock data — it is
meant as a strong starting point, not the full 20+ page spec, so it stays realistic
to build well and extend.

## What's included

- **Design system**: custom "job-ticket" visual identity — ink/paper/amber/teal
  palette, Space Grotesk (display) + IBM Plex Sans (body) + IBM Plex Mono (data),
  notched "ticket" cards, hazard-stripe divider, light/dark mode.
- **Pages**:
  - `/` — Home (hero + search, categories, featured services, **featured
    providers**, how it works, why FixMate, testimonials, FAQ, CTA)
  - `/explore` — Search, category/price/rating filters, sorting, pagination
  - `/services/[slug]` — Service details with booking panel, related services,
    and a link through to the provider's public profile
  - `/providers/[id]` — **Public provider profile**: bio, verification status,
    stats (services listed, jobs completed, years active, response time),
    service areas, full list of the provider's services, and their aggregated
    reviews across all services
  - `/login`, `/register` — Forms with client-side validation, loading/success/error
    states, and demo-login buttons (role toggle on register)
  - `/about`, `/contact` — Static + validated contact form
  - `/help` — **Blog/Help center**: searchable help articles + categorized,
    searchable FAQ accordion, contact-support CTA
  - **Customer dashboard**: Overview, My bookings (list + detail, cancel,
    review), **My reviews**, **Profile**, **Settings**
  - **Provider dashboard**: Overview, My services (add/edit/delete), Bookings
    (list + detail, accept/reject/update status), **Reviews** (rating
    breakdown + filter), **Earnings** (monthly chart, per-service breakdown,
    recent payouts), **Profile**, **Settings** (availability, auto-accept,
    password)
  - **Admin dashboard**: Overview (provider approval queue), Users
    (search/filter/suspend), **Providers** (verify/unverify, search, filter,
    sort, pagination), **Services** (search/filter/sort/pagination,
    availability toggle, delete with confirm), **Categories** (add/edit/delete),
    **Bookings** (platform-wide table — search, status filter, sort,
    pagination, force-cancel), **Reviews** (search, rating filter, hide/moderate),
    **Analytics** (monthly bookings/revenue/user-growth bar charts, booking
    status distribution, popular categories — all driven by real store/seed
    data, no hardcoded chart numbers), **Settings** (commission rate,
    maintenance mode, auto-approve toggles)
- **Reusable components**: `Navbar`, `Footer`, `ServiceCard`, `ProviderCard`,
  `RatingStars`, `StatusBadge`, `StatCard`, `Pagination`, `Eyebrow`,
  `ThemeToggle`, `ReviewModal`, `RatingInput`
- **Forms run on React Hook Form + Zod**: all 8 forms named in the spec —
  Login, Registration, Contact, Create Service, Edit Service, Profile Update
  (customer + provider), Booking, Review — use `useForm` + `zodResolver`
  with schemas centralized in `src/lib/validation.ts`. Each field shows its
  own inline error, submit buttons disable via `formState.isSubmitting`, and
  the booking form's "date must be today or later" check is a schema
  `.refine()` instead of inline JS.
- **Reviews are now real, not mocked**: `src/lib/reviews-store.tsx` persists
  reviews written through the app (localStorage), guards one review per
  completed booking, and blends new ratings into each service/provider's
  seed average via `blendRating()` in `src/lib/data.ts` — the same pattern
  `bookings-store.tsx` uses for bookings.
- Mock data lives in `src/lib/data.ts` — swap this for real API calls once the
  backend (Express + Prisma + PostgreSQL, per the original spec) is ready.

## Not included yet (by design — see project notes)

- Real authentication (JWT/Google OAuth), RBAC, and API integration
- Backend (Node/Express/Prisma/PostgreSQL)
- "Describe Your Problem" AI matching feature (deliberately deferred — see spec)

Every page in the original spec's public/customer/provider/admin page list is
now built on mock data. The next logical phase is wiring this up to a real
Express + Prisma + PostgreSQL backend.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
npm run start
```
