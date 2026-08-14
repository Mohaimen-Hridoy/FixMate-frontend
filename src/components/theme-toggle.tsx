"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "fixmate-theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  // Mirrors whatever the inline boot script in layout.tsx already applied
  // to <html>, so this never causes a flash or a mismatched first paint.
  const [dark, setDark] = useState(true);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // localStorage unavailable — theme just won't persist across visits
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      className={`text-sm font-medium text-muted underline decoration-line decoration-2 underline-offset-4 transition-colors hover:text-amber-ink hover:decoration-amber dark:hover:text-amber ${className}`}
    >
      Switch to {dark ? "light" : "dark"} mode
    </button>
  );
}
