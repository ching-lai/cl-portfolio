import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ching Lai",
  // Emit the SVG favicon into the initial HTML (defaulting to dark, since the
  // theme toggle always starts on dark). Safari reads the tab icon from the
  // server-rendered <head> and won't pick up a link that JS injects after load,
  // so without this it falls back to the raster favicon.ico — which is what
  // showed the anti-aliased white fringe. ThemeProvider swaps this SVG on toggle.
  // favicon.ico is still auto-emitted from app/ as the legacy fallback.
  icons: {
    icon: { url: "/favicon-dark.svg", type: "image/svg+xml" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
