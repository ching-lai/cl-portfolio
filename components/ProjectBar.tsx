"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { InfoModal, type InfoContent } from "@/components/InfoModal";
import { useTheme } from "@/lib/theme";
import { subscribeHeaderShift, getHeaderShift } from "@/lib/header-reveal";
import styles from "./ProjectBar.module.css";

interface ProjectBarProps {
  title: string;
  /** Set to false for sections that don't have an Info link in the frame (e.g. Uber Partnerships). */
  info?: boolean;
  /** Content for the Info modal. Sections without this yet keep the Info link inert. */
  infoContent?: InfoContent;
  /** Modal heading, if it should differ from the bar's own title (e.g. bar reads
   *  "Personal: Mutating Monsters", modal just reads "Mutating Monsters"). Defaults to `title`. */
  infoTitle?: string;
}

// The bar's fill is the page's background gradient sampled at this bar's locked
// viewport position. It's built from the theme's LIVE custom properties (--background
// / --background-bottom) rather than a JS snapshot of their RGB, so that on a theme
// toggle the bar fades in lockstep with those properties' own 0.6s transition (see
// globals.css) — the same fade the rest of the page gets — instead of snapping to the
// new palette instantly. The scroll-driven `fraction` is baked in as a literal
// color-mix ratio, so scrolling still repaints the bar immediately: there is no CSS
// transition on the bar itself; the only thing that animates is the custom properties
// during a theme change. Same treatment for both themes — dark's --background and
// --background-bottom differ (a real top↔bottom gradient), light's are both #e6e6e6
// (see :root[data-theme="light"] in globals.css), so this naturally renders as a flat
// solid fill with no gradient in light mode, no theme branching needed here.
function barBackground(fraction: number): string {
  const bottomPct = Math.round(fraction * 100);
  // Inner mix: top↔bottom of the gradient by scroll position. Outer mix folds in 4%
  // transparent to land a 0.95 alpha frosted fill.
  return `color-mix(in srgb, transparent 5%, color-mix(in srgb, var(--background-bottom) ${bottomPct}%, var(--background)))`;
}
// How far (in px) before the *next* bar reaches its own lock point this one starts
// covering, finishing exactly as the next bar arrives and covers it.
const FADE_DISTANCE = 80;

// How far the .dim overlay washes a bar as the next bar finishes covering it — a
// color overlay on top of the always-mounted bar, not a fade of the bar's own opacity
// (that would let the stacked bar underneath show through it).
// Dark: --bar-dim-color is black; only wash it part way — slightly darker while
// covered, not heavily dimmed.
const DIM_MAX_DARK = 0.8;
// Light: --bar-dim-color is #e6e6e6 (the page color) — wash it all the way to fully
// opaque, so this reads as the next bar's #e6e6e6 fill physically covering it rather
// than a dim/fade effect.
const DIM_MAX_LIGHT = 1;

export function ProjectBar({ title, info = true, infoContent, infoTitle }: ProjectBarProps) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  // Read inside the scroll loop's apply() to freeze the bar's paint while the modal is
  // open. Opening the modal pins document.body to position: fixed (InfoModal's iOS
  // scroll lock), which collapses window.scrollY to 0 and fires a scroll event — that
  // would otherwise drive apply() to repaint this bar's gradient (now sampled at
  // scrollY 0) and re-wash its .dim overlay, visibly shifting the bars' color as the
  // modal wipes up over them. A ref (not the state value) so the always-mounted effect
  // sees the live flag without being torn down and recreated on open/close.
  const isInfoOpenRef = useRef(false);
  const { theme } = useTheme();

  useEffect(() => {
    const spacer = spacerRef.current;
    const line = lineRef.current;
    const dim = dimRef.current;
    const section = spacer?.closest("section");
    const page = document.querySelector<HTMLElement>(".page");
    const header = document.querySelector("header");
    if (!spacer || !line || !dim || !section || !page) return;

    // The next sibling <section> (if any) is the next project's bar — Byeeee (the
    // last one) has no next sibling within <main>, so it never dims. Footer is a
    // sibling of <main> itself, not of the last section, so this needs no extra check.
    const nextSection = section.nextElementSibling;

    // Tracks the bar's current positioning state so the position/top styles are
    // written only when it actually crosses the lock threshold (a one-time state
    // flip), never every frame — the whole point of the "manual sticky" approach is
    // that scrolling itself moves the bar natively, with no per-frame JS writes to lag
    // behind. null = not yet applied; true = locked (fixed); false = pre-lock (absolute).
    let locked: boolean | null = null;
    let appliedHeaderHeight = -1;

    const apply = () => {
      // Modal open: keep this bar's current gradient/dim/position frozen (see
      // isInfoOpenRef above) rather than repainting it against the pinned-body scroll
      // geometry. The modal covers the viewport, so nothing here needs updating until
      // it closes and the real scroll offset is restored.
      if (isInfoOpenRef.current) return;

      // .header's height and .line's own (.bar's min-height) both scale past 1440px
      // (see --scale-1440 in globals.css), so both are measured live rather than
      // assumed to be a fixed 60.
      const headerHeight = header?.getBoundingClientRect().height ?? 60;
      const barHeight = line.getBoundingClientRect().height;

      // ── Scroll-direction hide/reveal (see lib/header-reveal.ts) ───────────────
      // As the header slides up (shift 0→1) it vacates its band at the top, so the
      // bar should lock higher — right up to viewport top:0 when the header is fully
      // hidden. `effectiveHeaderHeight` is the header's currently-visible height; it
      // drives BOTH the lock threshold below and the transform that shifts a locked
      // bar up with the header, keeping the absolute→fixed handoff seamless at every
      // shift value. With the feature off, getHeaderShift() is 0 → effectiveHeaderHeight
      // === headerHeight and the transform is translateY(0): original behavior exactly.
      const shiftPx = getHeaderShift() * headerHeight;
      const effectiveHeaderHeight = headerHeight - shiftPx;

      // "Where would this bar be if it just scrolled normally" is wherever its spacer
      // (which sits in normal flow at the section's top) currently renders on screen.
      // Once that reaches the (visible) header, the bar should lock; while it's still
      // below, the bar rides the page natively in its pre-lock absolute state.
      const naturalTop = spacer.getBoundingClientRect().top;
      const shouldLock = naturalTop <= effectiveHeaderHeight;

      // Flip the position only on a genuine state change (or if the header height
      // changed under a locked bar, e.g. on resize past a breakpoint). absolute→fixed
      // is seamless: at the threshold the section's top is at headerHeight, so the
      // absolute bar (top: 0 within the section) and the fixed bar (top: headerHeight)
      // occupy the same viewport row — no visible jump. Once fixed it STAYS fixed as
      // later sections scroll past (naturalTop only gets more negative, so shouldLock
      // stays true), which is what keeps it locked and covered; scrolling back up above
      // the lock point flips it back to absolute so it rejoins the flow.
      if (shouldLock !== locked || (shouldLock && headerHeight !== appliedHeaderHeight)) {
        locked = shouldLock;
        if (shouldLock) {
          line.style.position = "fixed";
          line.style.top = `${headerHeight}px`;
          appliedHeaderHeight = headerHeight;
        } else {
          line.style.position = "absolute";
          line.style.top = "0px";
        }
      }

      // ── Scroll-direction hide/reveal (see lib/header-reveal.ts) ───────────────
      // A locked bar sits at top: headerHeight; translate it up by the header's shift
      // so its visible top is effectiveHeaderHeight — i.e. it rises to viewport 0 as
      // the header fully hides. Pre-lock bars ride the page in flow and get no shift.
      // shiftPx is 0 with the feature off, so this is a harmless translateY(0).
      line.style.transform = shouldLock ? `translateY(${-shiftPx}px)` : "";

      // Wash this bar's .dim overlay (see DIM_MAX_DARK / DIM_MAX_LIGHT above) as the
      // next bar approaches its lock point and paints over this one — dark washes
      // part way to black, light washes all the way to #e6e6e6 so it reads as the
      // next bar's own fill physically covering it, not a fade.
      let dimOpacity = 0;
      let fullyCovered = false;
      if (nextSection) {
        const nextNaturalTop = nextSection.getBoundingClientRect().top;
        const distanceUntilNextLocks = nextNaturalTop - effectiveHeaderHeight;
        const progress = Math.min(1, Math.max(0, (FADE_DISTANCE - distanceUntilNextLocks) / FADE_DISTANCE));
        dimOpacity = progress * (theme === "light" ? DIM_MAX_LIGHT : DIM_MAX_DARK);
        fullyCovered = progress >= 1;
      }
      dim.style.opacity = String(dimOpacity);
      // Every locked bar stays mounted at the same fixed position forever (see the
      // "stays locked" comment above) — nothing ever unmounts. Once the next bar has
      // fully arrived and this one is completely covered, hide it: otherwise its own
      // near-opaque background + backdrop-filter blur stay in the paint stack, and
      // every bar that locks in later ends up blurring an increasingly deep pile of
      // previous bars instead of the real page content — which is why the first bar
      // reads as genuine frosted glass and bars near the bottom of the page read as
      // flat and solid. Hiding fully-covered bars keeps each currently-visible bar's
      // blur sampling the actual page behind it, at every scroll position.
      line.style.visibility = fullyCovered ? "hidden" : "visible";

      // Gradient color match — unchanged from before, based on absolute scroll position.
      // Header height + half the bar's own height: while a bar is locked it sits at
      // this viewport offset, so this is the page position its center represents.
      const stuckCenterOffset = headerHeight + barHeight / 2;
      const pageHeight = page.getBoundingClientRect().height;
      const fraction = Math.min(1, Math.max(0, (window.scrollY + stuckCenterOffset) / pageHeight));
      line.style.background = barBackground(fraction);
    };

    // The bar's position must stay glued to the compositor's scroll offset every
    // rendered frame, or it visibly jitters/trails the page as it scrolls. Driving
    // apply() from 'scroll' events can't guarantee that: browsers coalesce and
    // throttle scroll-event dispatch during fast fling / momentum scrolling — badly on
    // touch (the 2017 iPad especially), and enough to notice on trackpads too — so the
    // events land in sparse bursts and the bar lags the page in between. Scheduling a
    // single rAF per scroll event (the previous approach) only inherits that same
    // sparse cadence. Instead, a scroll KICKS OFF a self-perpetuating rAF loop that
    // re-applies on every frame the browser paints — in lockstep with compositing,
    // regardless of when scroll events happen to fire — for as long as the scroll
    // offset keeps changing, then parks itself after a short idle so it costs nothing
    // at rest. window.scrollY / innerHeight gate the work and neither forces layout,
    // so parked/idle frames are cheap.
    let rafId: number | null = null;
    let lastScrollY = Number.NaN;
    let lastInnerHeight = Number.NaN;
    let idleFrames = 0;

    const frame = () => {
      const y = window.scrollY;
      const h = window.innerHeight;
      if (y !== lastScrollY || h !== lastInnerHeight) {
        lastScrollY = y;
        lastInnerHeight = h;
        idleFrames = 0;
        apply();
      } else if (++idleFrames > 10) {
        // ~10 still frames (~160ms): the fling has settled — stop until the next kick.
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (rafId === null) {
        idleFrames = 0;
        rafId = requestAnimationFrame(frame);
      }
    };

    apply();
    window.addEventListener("scroll", kick, { passive: true });
    // Resize can change the header/bar heights and page height with no scroll at all,
    // so re-apply right away and (re)start the loop to settle into the new layout.
    const onResize = () => {
      apply();
      kick();
    };
    window.addEventListener("resize", onResize);
    // ── Scroll-direction hide/reveal (see lib/header-reveal.ts) ─────────────────
    // The shift keeps easing for a few frames after scrolling stops (or when it
    // toggles from a scroll that this bar's own idle loop has already parked), so
    // re-apply on every shift change to follow the header up/down. No-op with the
    // feature off. Remove this line + its cleanup to fully revert.
    const unsubscribeShift = subscribeHeaderShift(apply);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", onResize);
      unsubscribeShift();
    };
  }, [theme]);

  return (
    <>
      {/* Reserves this bar's flow-space permanently, since .line itself is always
          position: fixed and never contributes to layout. */}
      <div ref={spacerRef} className={styles.spacer} />
      <div
        ref={lineRef}
        className={styles.line}
        // backdrop-filter is set via inline style rather than the CSS module: Turbopack's
        // Lightning CSS processor silently strips it (both prefixed and unprefixed) from
        // compiled CSS Modules in this Next.js version. background starts as a fallback
        // (top-of-gradient color) and is immediately corrected by the effect above to
        // track the page gradient as you scroll. Same treatment for both themes — see
        // barBackground.
        style={{
          background: barBackground(0),
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className={`inset ${styles.bar}`}>
          <h2 className={styles.title}>{title}</h2>
          {info && (
            <button
              type="button"
              className={`${styles.info} draw-underline`}
              /* data-label feeds the hover underline's transparent-glyph copy of this
                 label (see .draw-underline::after in globals.css); aria-label pins the
                 accessible name, which that copy would otherwise duplicate into
                 "Info Info". */
              data-label="Info"
              aria-label="Info"
              onClick={
                infoContent
                  ? () => {
                      isInfoOpenRef.current = true;
                      setIsInfoOpen(true);
                    }
                  : undefined
              }
            >
              Info
            </button>
          )}
        </div>
        <div ref={dimRef} className={styles.dim} />
      </div>
      {infoContent &&
        isInfoOpen &&
        createPortal(
          <InfoModal
            title={infoTitle ?? title}
            content={infoContent}
            onClose={() => {
              isInfoOpenRef.current = false;
              setIsInfoOpen(false);
            }}
          />,
          document.body
        )}
    </>
  );
}
