"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eyebrow } from "@/components/ui";
import { loginSchema, type LoginValues } from "@/lib/validation";
import { loginUser, googleLogin, dashboardPathByRole } from "@/lib/api";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

// Google's client is only real when NEXT_PUBLIC_GOOGLE_CLIENT_ID is set (e.g. in Vercel's
// Environment Variables). Without it we fall back to "placeholder", which Google rejects —
// that's what made the button look broken and do nothing on click.
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();

export function LoginPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginValues) {
    setErrorMsg("");
    try {
      const response = await loginUser(data);
      const userRole = response.user?.role?.toLowerCase() || "customer";
      setSuccess(true);
      setTimeout(() => router.push(dashboardPathByRole[userRole as keyof typeof dashboardPathByRole] || dashboardPathByRole.customer), 700);
    } catch (err: any) {
      setErrorMsg(err.message || "Login failed");
    }
  }

  async function onGoogleSuccess(credentialResponse: any) {
    setErrorMsg("");
    try {
      const response = await googleLogin(credentialResponse.credential);
      const userRole = response.user?.role?.toLowerCase() || "customer";
      setSuccess(true);
      setTimeout(() => router.push(dashboardPathByRole[userRole as keyof typeof dashboardPathByRole] || dashboardPathByRole.customer), 700);
    } catch (err: any) {
      setErrorMsg(err.message || "Google login failed");
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <Eyebrow>Welcome back</Eyebrow>
      <h1 className="font-display text-3xl font-bold">Log in to FixMate</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="ticket mt-6 space-y-4 p-6" noValidate>
        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Email
          </label>
          <input
            id="email"
            type="email"
            aria-invalid={!!errors.email}
            {...register("email")}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          />
          {errors.email && (
            <p role="alert" className="mt-1 text-xs text-[#A3342A]">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
            Password
          </label>
          <input
            id="password"
            type="password"
            aria-invalid={!!errors.password}
            {...register("password")}
            className="w-full rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-amber"
          />
          {errors.password && (
            <p role="alert" className="mt-1 text-xs text-[#A3342A]">
              {errors.password.message}
            </p>
          )}
        </div>

        {errorMsg && (
          <p role="alert" className="text-sm text-[#A3342A]">
            {errorMsg}
          </p>
        )}

        {success && (
          <p role="status" className="text-sm text-teal">
            Logged in — redirecting to your dashboard…
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-ink py-3 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-60 dark:bg-amber dark:text-ink"
        >
          {isSubmitting ? "Logging in…" : "Log in"}
        </button>

        {googleClientId ? (
          <GoogleSignInSection onSuccess={onGoogleSuccess} onError={() => setErrorMsg("Google Login Failed")} />
        ) : (
          <p className="rounded-lg border border-dashed border-line px-3 py-2 text-center text-xs text-muted">
            Google sign-in isn&apos;t configured yet.
          </p>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        New to FixMate?{" "}
        <Link href="/register" className="font-medium text-ink underline decoration-amber decoration-2 underline-offset-4 dark:text-[#f1efe9]">
          Create an account
        </Link>
      </p>
    </div>
  );
}

/**
 * The "continue with Google" area: a proper divider so it doesn't look like
 * a stray floating button, a theme that matches light/dark mode, and a
 * fallback message if Google's script fails to load (e.g. blocked by an ad
 * blocker or a network/firewall issue) — that's what used to make the
 * button do absolutely nothing when clicked, with no feedback at all.
 */
function GoogleSignInSection({
  onSuccess,
  onError,
}: {
  onSuccess: (res: any) => void;
  onError: () => void;
}) {
  const [dark, setDark] = useState(true);
  const [scriptStatus, setScriptStatus] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  return (
    <div>
      <div className="my-4 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <GoogleOAuthProvider
        clientId={googleClientId as string}
        onScriptLoadSuccess={() => setScriptStatus("ready")}
        onScriptLoadError={() => setScriptStatus("failed")}
      >
        {scriptStatus === "failed" ? (
          <p role="alert" className="rounded-lg border border-dashed border-line px-3 py-2 text-center text-xs text-muted">
            Couldn&apos;t reach Google sign-in. Check your connection (an ad blocker or
            firewall may be blocking it), or log in with email and password above.
          </p>
        ) : (
          <div className="flex w-full justify-center">
            <GoogleLogin
              key={dark ? "dark" : "light"}
              onSuccess={onSuccess}
              onError={onError}
              theme={dark ? "filled_black" : "outline"}
              shape="pill"
              size="large"
              text="continue_with"
              logo_alignment="center"
              locale="en"
              width={368}
            />
          </div>
        )}
      </GoogleOAuthProvider>
    </div>
  );
}

export default function LoginPageWrapper() {
  return <LoginPage />;
}
