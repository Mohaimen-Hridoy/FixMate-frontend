import type { Metadata } from "next";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BookingsProvider } from "@/lib/bookings-store";
import { ReviewsProvider } from "@/lib/reviews-store";

export const metadata: Metadata = {
  title: "FixMate — Find a trusted pro for the job",
  description:
    "FixMate connects you with vetted local service providers for repairs, installs, and home jobs — book, track, and pay in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("fixmate-theme")!=="light"){document.documentElement.classList.add("dark");}}catch(e){document.documentElement.classList.add("dark");}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <BookingsProvider>
          <ReviewsProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ReviewsProvider>
        </BookingsProvider>
      </body>
    </html>
  );
}
