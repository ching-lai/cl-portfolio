"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Scroll-LINKED header hide/reveal — EXPERIMENTAL, trivially reversible.
//
// The header tracks the scroll 1:1 (direct manipulation, NOT an eased animation
// that plays at its own speed): scrolling down slides the fixed Header up off-screen
// by exactly the distance you scroll, and the locked ProjectBar rises to take its
// place; scrolling up pulls the Header back down by exactly the distance you scroll.
// A full header-height of scroll is what fully hides or reveals it — so it only comes
// all the way back when you deliberately pull it all the way out. When you stop mid-
// way, it settles to the nearest committed edge (see SNAP_POINT). The Header and every
// ProjectBar subscribe to the single 0→1 `shift` value here so they move in lockstep.
//
// TO DISABLE and restore the original always-visible header: flip HEADER_AUTO_HIDE
// to false — that alone fully reverts the behavior at runtime (getHeaderShift()
// returns 0 forever, no scroll listener is installed, and both consumers collapse
// to their original math). To remove entirely: delete this file plus the two small
// clearly-marked blocks that consume it in Header.tsx and ProjectBar.tsx.
// ─────────────────────────────────────────────────────────────────────────────

export const HEADER_AUTO_HIDE = true;

// The header stays fully put (never hides on scroll) until THIS section — the first
// project — rises to meet it. Only once its bar has reached the header's lock band
// does the hide/reveal arm, so it reads as the first project pushing the header out
// rather than the header bailing on the first flick of scroll. Same anchor id
// Header.tsx uses for its background fade.
const ARM_ANCHOR_ID = "uber-visa-card";

// px of upward scroll to ABSORB before the reveal engages. From fully hidden, the
// first ~this-much of up-scroll does nothing (header stays hidden); only past it does
// the header start following your scroll 1:1 down into view. Hiding has no such
// delay — it tracks immediately. Re-armed every time the header returns to fully
// hidden, and reset if you stop mid-pull, so it takes one deliberate upward pull.
const REVEAL_DELAY = 100;

// Release-snap commit point, in `current` units (0 = shown, 1 = hidden). When you
// STOP scrolling with the header partway, it settles to shown if `current` is below
// this, hidden otherwise. LOWER = harder to reveal / easier to hide (you must pull the
// header down closer to all the way before it commits to staying shown); HIGHER =
// easier to reveal. Tune to feel — this is the knob, not a scroll distance anymore.
const SNAP_POINT = 0.4;
const SNAP_EASE = 0.28; // per-frame easing for the short settle AFTER you stop scrolling
const IDLE_FRAMES = 6; // frames of no scroll movement that count as "stopped"

// How hidden the header is right now: 0 (fully shown) → 1 (fully hidden). Driven
// DIRECTLY by scroll distance while scrolling (1:1 with the page); only the brief
// settle after you stop is animated.
let current = 0;
let started = false;

const listeners = new Set<() => void>();

function notify() {
  for (const l of listeners) l();
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

function start() {
  if (started || typeof window === "undefined") return;
  started = true;

  // Cached once — both exist by the time the first subscriber mounts.
  const anchor = document.getElementById(ARM_ANCHOR_ID);
  const headerEl = document.querySelector("header");

  let scrollRaf: number | null = null;
  let snapRaf: number | null = null;
  let lastY = window.scrollY;
  let idle = 0;
  // Upward scroll banked while fully hidden, waiting to clear REVEAL_DELAY before the
  // reveal engages (see below).
  let revealAccum = 0;

  const cancelSnap = () => {
    if (snapRaf !== null) {
      cancelAnimationFrame(snapRaf);
      snapRaf = null;
    }
  };

  // Once scrolling stops, settle the header to the nearest committed edge so it never
  // rests half-open. This is the ONLY animated part; the tracking above is pure 1:1.
  const settle = () => {
    if (current <= 0 || current >= 1) return;
    const target = current < SNAP_POINT ? 0 : 1;
    const step = () => {
      const diff = target - current;
      if (Math.abs(diff) < 0.002) {
        current = target;
        notify();
        snapRaf = null;
        return;
      }
      current += diff * SNAP_EASE;
      notify();
      snapRaf = requestAnimationFrame(step);
    };
    cancelSnap();
    snapRaf = requestAnimationFrame(step);
  };

  // Per painted frame while scrolling: move `current` by the exact scroll delta
  // (÷ header height, so one header-height of scroll fully hides/shows it) — locked to
  // the compositor's scroll offset, so the header moves precisely with the page rather
  // than chasing it at its own eased speed. Parks after a short idle, then settles.
  const frame = () => {
    const y = window.scrollY;
    const delta = y - lastY;
    if (delta !== 0) {
      lastY = y;
      idle = 0;

      const headerH = headerEl?.getBoundingClientRect().height ?? 60;
      // Not armed until the first project bar has reached the header's lock band. While
      // still in the hero above it, keep the header fully shown.
      const armed = !!anchor && anchor.getBoundingClientRect().top <= headerH;
      if (!armed) {
        revealAccum = 0;
        if (current !== 0) {
          current = 0;
          notify();
        }
      } else if (delta > 0) {
        // Scrolling down → hide 1:1 immediately, and re-arm the reveal dead zone.
        revealAccum = 0;
        const next = clamp01(current + delta / headerH);
        if (next !== current) {
          current = next;
          notify();
        }
      } else if (current >= 1) {
        // Fully hidden, scrolling up → bank the up-scroll; the header stays put until
        // it clears REVEAL_DELAY, then only the surplus beyond it moves the header
        // (so the reveal picks up 1:1 exactly where the dead zone ends).
        revealAccum += -delta;
        if (revealAccum > REVEAL_DELAY) {
          const next = clamp01(1 - (revealAccum - REVEAL_DELAY) / headerH);
          if (next !== current) {
            current = next;
            notify();
          }
        }
      } else {
        // Already engaged (partially shown) → track 1:1 in both directions.
        const next = clamp01(current + delta / headerH);
        if (next !== current) {
          current = next;
          notify();
        }
      }
    } else if (++idle > IDLE_FRAMES) {
      scrollRaf = null;
      // Re-arm the dead zone if we parked still fully hidden, so a fresh reveal needs a
      // full, deliberate REVEAL_DELAY pull rather than leaking across separate flicks.
      if (current >= 1) revealAccum = 0;
      settle();
      return;
    }
    scrollRaf = requestAnimationFrame(frame);
  };

  const kick = () => {
    cancelSnap();
    if (scrollRaf === null) {
      idle = 0;
      // Re-seat lastY so a parked gap (or programmatic jump) doesn't read as one huge
      // delta on the first frame back.
      lastY = window.scrollY;
      scrollRaf = requestAnimationFrame(frame);
    }
  };

  window.addEventListener("scroll", kick, { passive: true });
}

/** Subscribe to shift changes; returns an unsubscribe fn. Lazily starts the shared
 *  scroll loop on the first subscriber. No-op when the feature is off. */
export function subscribeHeaderShift(listener: () => void): () => void {
  if (!HEADER_AUTO_HIDE) return () => {};
  start();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Current shift, 0 (shown) → 1 (hidden). Always 0 when the feature is off. */
export function getHeaderShift(): number {
  return HEADER_AUTO_HIDE ? current : 0;
}
