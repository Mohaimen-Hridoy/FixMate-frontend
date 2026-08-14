import { Suspense } from "react";
import { ExploreClient } from "./explore-client";

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-5 py-10 text-muted">Loading services…</div>}>
      <ExploreClient />
    </Suspense>
  );
}
