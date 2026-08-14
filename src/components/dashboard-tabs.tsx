"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardTabs({ tabs }: { tabs: { href: string; label: string }[] }) {
  const pathname = usePathname();

  return (
    <nav className="mt-5 flex gap-1 overflow-x-auto border-b border-line text-sm font-medium">
      {tabs.map((t) => {
        const active = t.href === pathname;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`-mb-px shrink-0 whitespace-nowrap border-b-2 px-3 py-2.5 transition-colors ${
              active
                ? "border-amber text-ink dark:text-[#f1efe9]"
                : "border-transparent text-muted hover:text-ink dark:hover:text-[#f1efe9]"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
