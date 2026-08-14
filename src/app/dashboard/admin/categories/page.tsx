"use client";

import { useState, type FormEvent } from "react";
import { categories as seedCategories, type Category } from "@/lib/data";
import { Eyebrow, StatCard } from "@/components/ui";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { ADMIN_TABS } from "@/components/admin-tabs";

function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(seedCategories);
  const [editing, setEditing] = useState<Category | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🛠️");
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<Category | null>(null);

  function openCreate() {
    setEditing(null);
    setName("");
    setIcon("🛠️");
    setError("");
    setFormOpen(true);
  }

  function openEdit(c: Category) {
    setEditing(c);
    setName(c.name);
    setIcon(c.icon);
    setError("");
    setFormOpen(true);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Category name is required.");
      return;
    }
    const slug = editing ? editing.slug : slugify(trimmed);
    const clash = categories.some((c) => c.slug === slug && c.slug !== editing?.slug);
    if (clash) {
      setError("A category with a similar name already exists.");
      return;
    }
    if (editing) {
      setCategories((list) => list.map((c) => (c.slug === editing.slug ? { ...c, name: trimmed, icon } : c)));
    } else {
      setCategories((list) => [...list, { slug, name: trimmed, icon, count: 0 }]);
    }
    setFormOpen(false);
  }

  function removeCategory() {
    if (!confirmDelete) return;
    setCategories((list) => list.filter((c) => c.slug !== confirmDelete.slug));
    setConfirmDelete(null);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Eyebrow>Admin dashboard</Eyebrow>
      <h1 className="font-display text-3xl font-bold">Platform overview</h1>

      <DashboardTabs tabs={ADMIN_TABS} />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Total categories" value={String(categories.length)} />
        <StatCard label="Total listed services" value={String(categories.reduce((sum, c) => sum + c.count, 0))} />
        <StatCard
          label="Largest category"
          value={categories.length ? [...categories].sort((a, b) => b.count - a.count)[0].name : "—"}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Categories ({categories.length})</h2>
        <button
          onClick={openCreate}
          className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 dark:bg-amber dark:text-ink"
        >
          + Add category
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <div key={c.slug} className="ticket flex items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden>
                {c.icon}
              </span>
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="font-mono text-xs text-muted">{c.count} services</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 text-xs font-semibold">
              <button onClick={() => openEdit(c)} className="text-amber-ink hover:underline dark:text-amber">
                Edit
              </button>
              <button
                onClick={() => setConfirmDelete(c)}
                className="text-[#A3342A] hover:underline dark:text-[#ff9a8e]"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-muted">No categories yet.</p>
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <form onSubmit={handleSubmit} className="ticket w-full max-w-sm space-y-4 p-6" noValidate>
            <p className="font-display text-lg font-semibold">{editing ? "Edit category" : "Add category"}</p>
            <div>
              <label htmlFor="cat-icon" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
                Icon (emoji)
              </label>
              <input
                id="cat-icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                maxLength={4}
                className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
              />
            </div>
            <div>
              <label htmlFor="cat-name" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
                Category name
              </label>
              <input
                id="cat-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-[#A3342A]">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper dark:bg-amber dark:text-ink"
              >
                {editing ? "Save changes" : "Add category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="ticket w-full max-w-sm p-6">
            <p className="font-display text-lg font-semibold">Delete this category?</p>
            <p className="mt-2 text-sm text-muted">
              &ldquo;{confirmDelete.name}&rdquo; will be removed. Existing services keep their category tag but it
              won&apos;t appear as a filter option.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-full border border-line px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={removeCategory}
                className="rounded-full bg-[#A3342A] px-4 py-2 text-sm font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
