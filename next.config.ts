import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Google's "Sign in with Google" button opens a popup window and talks
  // back to this page via window.postMessage. Without this header, some
  // browsers (Chrome in particular) silently block that popup from
  // communicating back — the user signs in on Google's side, the popup
  // closes, and the app just... does nothing, with no visible error.
  // This is the fix Google's own docs call out for popup mode:
  // https://www.npmjs.com/package/@react-oauth/google
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
