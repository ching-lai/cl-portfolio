"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void } | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    // Swap the SVG favicon to match the manual theme toggle. The default dark SVG
    // is server-rendered into <head> via layout metadata (favicon.ico stays as the
    // legacy fallback). Safari only re-reads the tab icon when the <link> node is
    // *replaced* — mutating its href is ignored — so remove every existing SVG icon
    // link (the server-rendered one and any prior swap) and append a fresh node for
    // the current theme. Chrome/Firefox honour this too; it's the most Safari can do.
    const href = theme === "light" ? "/favicon-light.svg" : "/favicon-dark.svg";
    document
      .querySelectorAll('link[rel~="icon"][type="image/svg+xml"]')
      .forEach((l) => l.remove());
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = href;
    document.head.appendChild(link);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
