import { Suspense } from "react";
import { RegisterClient } from "./register-client";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-5 py-16 text-muted">Loading…</div>}>
      <RegisterClient />
    </Suspense>
  );
}
