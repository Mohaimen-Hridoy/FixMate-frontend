"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AUTH_CHANGED_EVENT,
  clearStoredAuth,
  getStoredAuth,
  type AuthUser,
} from "./api";

/**
 * Reads the logged-in user (if any) from localStorage and keeps itself in
 * sync with login/logout, both in this tab (via AUTH_CHANGED_EVENT) and in
 * other tabs (via the native "storage" event).
 *
 * `ready` is false until after the first client-side render, so callers can
 * avoid flashing "logged out" UI before we've had a chance to check.
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setUser(getStoredAuth()?.user ?? null);
  }, []);

  useEffect(() => {
    refresh();
    setReady(true);
    window.addEventListener(AUTH_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  const logout = useCallback(() => {
    clearStoredAuth();
  }, []);

  return { user, ready, logout };
}
