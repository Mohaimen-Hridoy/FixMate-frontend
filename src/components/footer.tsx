import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-raised">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber text-white">
                🔧
              </span>
              Fix<span className="text-amber">Mate</span>
            </div>
            <p className="mt-3 max-w-[22ch] text-sm text-muted">
              Vetted local pros for the jobs around your home.
            </p>
          </div>

          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">Explore</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/explore" className="hover:text-amber-ink dark:hover:text-amber">Browse services</Link></li>
              <li><Link href="/register?role=provider" className="hover:text-amber-ink dark:hover:text-amber">Become a provider</Link></li>
              <li><Link href="/about" className="hover:text-amber-ink dark:hover:text-amber">About FixMate</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">Support</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-amber-ink dark:hover:text-amber">Contact us</Link></li>
              <li><Link href="/help" className="hover:text-amber-ink dark:hover:text-amber">Help / FAQ</Link></li>
            </ul>
          </div>

        </div>

        <div className="hazard-rule my-8 opacity-70" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted">© 2026 FixMate. Built as a portfolio / academic project — not a live commercial service.</p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
