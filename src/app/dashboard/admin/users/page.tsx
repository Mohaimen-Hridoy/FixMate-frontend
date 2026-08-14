"use client";

import { useMemo, useState } from "react";
import { appUsers, type AppUser, type UserRole } from "@/lib/data";
import { Eyebrow } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { ADMIN_TABS } from "@/components/admin-tabs";

const roleFilters: { value: UserRole | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "customer", label: "Customers" },
  { value: "provider", label: "Providers" },
  { value: "admin", label: "Admins" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>(appUsers);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<UserRole | "all">("all");

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = role === "all" || u.role === role;
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      return matchesRole && matchesQuery;
    });
  }, [users, query, role]);

  function toggleStatus(id: string) {
    setUsers((list) =>
      list.map((u) => (u.id === id ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u))
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Eyebrow>Admin dashboard</Eyebrow>
      <h1 className="font-display text-3xl font-bold">Platform overview</h1>

      <DashboardTabs tabs={ADMIN_TABS} />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Users ({filtered.length})</h2>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email"
            className="w-56 rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          />
          <div className="flex rounded-full border border-line p-1 text-xs font-medium">
            {roleFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setRole(f.value)}
                className={`rounded-full px-3 py-1.5 transition-colors ${
                  role === f.value ? "bg-ink text-paper dark:bg-amber dark:text-ink" : ""
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="ticket mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{u.email}</td>
                <td className="px-4 py-3 capitalize text-muted">{u.role}</td>
                <td className="px-4 py-3 text-muted">{u.joinedDate}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      u.status === "Active"
                        ? "bg-teal/15 text-teal"
                        : "bg-[#F7DCDA] text-[#A3342A] dark:bg-[#3a1512] dark:text-[#ff9a8e]"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {u.role !== "admin" && (
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className="text-xs font-semibold text-amber-ink hover:underline dark:text-amber"
                    >
                      {u.status === "Active" ? "Suspend" : "Reactivate"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted">
                  No users match this search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
