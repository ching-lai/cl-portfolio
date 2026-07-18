"use client";

import { useEffect, useRef } from "react";
import { ClLogo } from "./icons/ClLogo";
import { Mail } from "./icons/Mail";
import { Sun } from "./icons/Sun";
import { Moon } from "./icons/Moon";
import { EMAIL } from "@/lib/social-links";
import { useTheme } from "@/lib/theme";
import styles from "./Header.module.css";

// How far (in px) before the first project bar's lock point the fade starts.
const FADE_DISTANCE = 80;

// The header's scrolled-in fill is --background at `progress` alpha. Built from the
// live custom property (not a snapshot of its RGB) so a theme toggle fades it in
// lockstep with --background's own 0.6s transition (globals.css) — matching the page
// and the project bars — instead of snapping. `progress` is baked in as a literal
// alpha via a transparent color-mix, so scrolling still repaints instantly (nothing
// on the element transitions; only the custom property animates on a theme change).
function headerBackground(progress: number): string {
  const transparentPct = Math.round((1 - progress) * 100);
  return `color-mix(in srgb, transparent ${transparentPct}%, var(--background))`;
}

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const applyFade = () => {
      const firstProjectSection = document.getElementById("uber-visa-card");
      if (!firstProjectSection) return;
      // .header's height scales past 1440px (see --scale-1440 in globals.css), so
      // it's measured live rather than assumed to be a fixed 60.
      const headerHeight = header.getBoundingClientRect().height;
      // Distance from the section's current top to where it will "lock" under the
      // header (i.e. where the sticky ProjectBar inside it engages). 0 = locked,
      // positive = still approaching, negative = already scrolled past.
      const distanceToLock = firstProjectSection.getBoundingClientRect().top - headerHeight;
      const progress = Math.min(1, Math.max(0, (FADE_DISTANCE - distanceToLock) / FADE_DISTANCE));
      header.style.backgroundColor = headerBackground(progress);
    };

    applyFade();
    window.addEventListener("scroll", applyFade, { passive: true });
    window.addEventListener("resize", applyFade);
    return () => {
      window.removeEventListener("scroll", applyFade);
      window.removeEventListener("resize", applyFade);
    };
  }, [theme]);

  const scrollHome = () => {
    document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header ref={headerRef} className={`inset ${styles.header}`}>
      <button
        type="button"
        onClick={scrollHome}
        className={styles.logo}
        aria-label="Scroll to top"
      >
        <ClLogo size={28} />
      </button>
      <div className={styles.icons}>
        <button
          type="button"
          onClick={toggleTheme}
          className={styles.themeToggle}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <Sun size={24} className={styles.icon} aria-hidden="true" />
          ) : (
            <Moon size={24} className={`${styles.icon} ${styles.moon}`} aria-hidden="true" />
          )}
        </button>
        <a
          href={`mailto:${EMAIL}`}
          className={styles.iconLink}
          aria-label="Email Ching Lai"
        >
          <Mail size={24} />
        </a>
      </div>
    </header>
  );
}
