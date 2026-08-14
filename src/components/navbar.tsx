"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { dashboardPathByRole } from "@/lib/api";
import { useAuth } from "@/lib/use-auth";

const links = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/help", label: "Help" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper-raised/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber text-white">
            🔧
          </span>
          Fix<span className="text-amber">Mate</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-ink/80 transition-colors hover:text-amber-ink dark:text-[#f1efe9]/80 dark:hover:text-amber">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href={dashboardPathByRole[user.role]}
                className="flex items-center gap-2 rounded-full border-2 border-line px-4 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-amber hover:text-amber-ink dark:text-[#f1efe9]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber text-xs font-bold text-white">
                  {user.name.trim().charAt(0).toUpperCase() || "U"}
                </span>
                {user.name.split(" ")[0]}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-amber px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border-2 border-amber px-5 py-1.5 text-sm font-semibold text-amber-ink transition-colors hover:bg-amber hover:text-white dark:text-amber"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-amber px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-md border border-line md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-line px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-4 text-sm font-medium">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href={dashboardPathByRole[user.role]}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-full border-2 border-line px-4 py-1.5 text-ink dark:text-[#f1efe9]"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber text-xs font-bold text-white">
                    {user.name.trim().charAt(0).toUpperCase() || "U"}
                  </span>
                  {user.name}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-amber px-4 py-2 text-center font-semibold text-white"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between pt-2">
                  <Link href="/login" onClick={() => setOpen(false)} className="rounded-full border-2 border-amber px-4 py-1.5 text-amber-ink dark:text-amber">
                    Log in
                  </Link>
                </div>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-amber px-4 py-2 text-center font-semibold text-white"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
