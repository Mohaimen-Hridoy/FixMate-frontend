import { services, type Service } from "./data";
import type { RegisterValues } from "./validation";

export type SortKey =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "newest";

export type ServiceQuery = {
  q?: string;
  category?: string;
  location?: string;
  maxPrice?: number;
  minRating?: number;
  sort?: SortKey;
  page?: number;
  pageSize?: number;
};

export type ServiceQueryResult = {
  items: Service[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export const DEFAULT_PAGE_SIZE = 6;
export const DEFAULT_MAX_PRICE = 5000;
export const PRICE_FLOOR = 500;

/**
 * Pure, synchronous search/filter/sort/paginate.
 *
 * This is used only as a fallback when the real backend
 * is unavailable or returns invalid data.
 */
export function queryServices(query: ServiceQuery): ServiceQueryResult {
  const {
    q = "",
    category = "all",
    location = "all",
    maxPrice = DEFAULT_MAX_PRICE,
    minRating = 0,
    sort = "recommended",
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  } = query;

  const needle = q.trim().toLowerCase();

  let list = services.filter((service) => {
    const matchesQuery =
      needle === "" ||
      service.title.toLowerCase().includes(needle) ||
      service.provider.name.toLowerCase().includes(needle) ||
      service.shortDescription.toLowerCase().includes(needle) ||
      service.category.toLowerCase().includes(needle);

    const matchesCategory =
      category === "all" || service.category === category;

    const matchesLocation =
      location === "all" || service.location === location;

    const matchesPrice = service.price <= maxPrice;

    const matchesRating = service.rating >= minRating;

    return (
      matchesQuery &&
      matchesCategory &&
      matchesLocation &&
      matchesPrice &&
      matchesRating
    );
  });

  switch (sort) {
    case "price-asc":
      list = [...list].sort((a, b) => a.price - b.price);
      break;

    case "price-desc":
      list = [...list].sort((a, b) => b.price - a.price);
      break;

    case "rating":
      list = [...list].sort(
        (a, b) =>
          b.rating - a.rating ||
          b.reviewCount - a.reviewCount
      );
      break;

    case "newest":
      list = [...list].sort((a, b) =>
        a.id < b.id ? 1 : -1
      );
      break;

    default:
      // Recommended:
      // available services first, then higher-rated
      // and more-reviewed services.
      list = [...list].sort((a, b) => {
        if (a.available !== b.available) {
          return a.available ? -1 : 1;
        }

        return (
          b.rating * Math.log10(b.reviewCount + 1) -
          a.rating * Math.log10(a.reviewCount + 1)
        );
      });

      break;
  }

  const total = list.length;

  const totalPages = Math.max(
    1,
    Math.ceil(total / pageSize)
  );

  const safePage = Math.min(
    Math.max(1, page),
    totalPages
  );

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = safePage * pageSize;

  const items = list.slice(startIndex, endIndex);

  return {
    items,
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

/**
 * Backend API URL.
 *
 * Production:
 * NEXT_PUBLIC_API_URL=https://fix-mate-backend.vercel.app/api/v1
 *
 * Local:
 * NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
 */
const DEFAULT_BACKEND_URL =
  "http://localhost:5000/api/v1";

function getBackendUrl(): string {
  const configuredUrl =
    process.env.NEXT_PUBLIC_API_URL?.trim();

  const url = configuredUrl || DEFAULT_BACKEND_URL;

  // Remove trailing slash so that:
  // /api/v1 + /services
  // does not become
  // /api/v1//services
  return url.replace(/\/+$/, "");
}

/**
 * Fetch services from the real backend.
 *
 * Example:
 * GET https://fix-mate-backend.vercel.app/api/v1/services
 */
export async function fetchServices(
  query: ServiceQuery,
  signal?: AbortSignal
): Promise<ServiceQueryResult> {
  const backendUrl = getBackendUrl();

  try {
    const params = new URLSearchParams();

    if (query.q) {
      params.set("q", query.q);
    }

    if (query.category && query.category !== "all") {
      params.set("category", query.category);
    }

    if (query.location && query.location !== "all") {
      params.set("location", query.location);
    }

    if (query.maxPrice !== undefined) {
      params.set("maxPrice", String(query.maxPrice));
    }

    if (query.minRating !== undefined) {
      params.set("minRating", String(query.minRating));
    }

    if (query.sort) {
      params.set("sort", query.sort);
    }

    if (query.page !== undefined) {
      params.set("page", String(query.page));
    }

    if (query.pageSize !== undefined) {
      params.set("pageSize", String(query.pageSize));
    }

    const queryString = params.toString();

    const url = queryString
      ? `${backendUrl}/services?${queryString}`
      : `${backendUrl}/services`;

    const response = await fetch(url, {
      method: "GET",
      signal,
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Services API returned ${response.status}`
      );
    }

    const json = await response.json();

    if (
      json?.success &&
      json?.data &&
      Array.isArray(json.data.items)
    ) {
      return json.data;
    }

    throw new Error(
      "Invalid services API response"
    );
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      throw error;
    }

    console.error(
      "Failed to fetch services from backend:",
      error
    );

    // Fallback to local mock data.
    return queryServices(query);
  }
}

/**
 * Fetch a single service by slug from the real backend.
 */
export async function fetchServiceBySlug(
  slug: string,
  signal?: AbortSignal
): Promise<Service | undefined> {
  const backendUrl = getBackendUrl();

  try {
    const url =
      `${backendUrl}/services/` +
      encodeURIComponent(slug);

    const response = await fetch(url, {
      method: "GET",
      signal,
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Service API returned ${response.status}`
      );
    }

    const json = await response.json();

    if (
      json?.success &&
      json?.data?.service
    ) {
      return json.data.service;
    }

    return undefined;
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      throw error;
    }

    console.error(
      `Failed to fetch service "${slug}":`,
      error
    );

    return undefined;
  }
}

/**
 * Auth
 */

export type UserRole = "customer" | "provider" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};

const AUTH_STORAGE_KEY = "fixmate:auth:v1";

/**
 * Fired whenever the stored auth changes (login/logout), so already-mounted
 * components (like the navbar) can react immediately in the same tab.
 * The native "storage" event only fires in *other* tabs, which is why the
 * navbar used to keep showing "Log in / Sign up" after a successful login.
 */
export const AUTH_CHANGED_EVENT = "fixmate:auth-changed";

function notifyAuthChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

function storeAuth(auth: AuthResponse) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  } catch {
    // localStorage unavailable — session just won't persist.
  }
  notifyAuthChanged();
}

export function getStoredAuth(): AuthResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthResponse) : null;
  } catch {
    return null;
  }
}

export function clearStoredAuth() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
  notifyAuthChanged();
}

/**
 * Where a logged-in user's dashboard lives, based on their role.
 */
export const dashboardPathByRole: Record<UserRole, string> = {
  customer: "/dashboard/customer",
  provider: "/dashboard/provider",
  admin: "/dashboard/admin",
};

async function postAuth(
  path: string,
  body: Record<string, unknown>
): Promise<AuthResponse> {
  const backendUrl = getBackendUrl();

  let response: Response;
  try {
    response = await fetch(`${backendUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Could not reach the server. Please try again."
    );
  }

  let json: any = null;
  try {
    json = await response.json();
  } catch {
    // ignore body parse failure, handled below
  }

  if (!response.ok || !json?.success) {
    throw new Error(
      json?.message || `Request failed (${response.status})`
    );
  }

  const auth: AuthResponse = json.data;
  storeAuth(auth);
  return auth;
}

/**
 * Register a new customer or provider account.
 */
export async function registerUser(
  data: RegisterValues & { role: UserRole }
): Promise<AuthResponse> {
  return postAuth("/auth/register", data);
}

/**
 * Log in with email and password.
 */
export async function loginUser(
  data: { email: string; password: string }
): Promise<AuthResponse> {
  return postAuth("/auth/login", data);
}

/**
 * Log in (or sign up) with a Google credential token.
 */
export async function googleLogin(
  credential: string
): Promise<AuthResponse> {
  return postAuth("/auth/google", { idToken: credential });
}

/**
 * Fetch service locations from the backend.
 */
export async function fetchLocations(
  signal?: AbortSignal
): Promise<string[]> {
  const backendUrl = getBackendUrl();

  try {
    const url =
      `${backendUrl}/services/locations`;

    const response = await fetch(url, {
      method: "GET",
      signal,
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Locations API returned ${response.status}`
      );
    }

    const json = await response.json();

    if (
      json?.success &&
      json?.data &&
      Array.isArray(json.data.items)
    ) {
      return json.data.items;
    }

    return [];
  } catch (error) {
    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {
      throw error;
    }

    console.error(
      "Failed to fetch service locations:",
      error
    );

    return [];
  }
}