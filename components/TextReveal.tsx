"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import styles from "./TextReveal.module.css";

gsap.registerPlugin(SplitText);

type TextRevealProps = {
  as?: "h1" | "h2" | "p";
  className?: string;
  children: React.ReactNode;
  /** Delay (s) before the first line starts revealing. */
  delay?: number;
  /** Extra delay (s) added per subsequent line, for the cascading reveal. */
  stagger?: number;
  /**
   * Called with this instance's split characters every time SplitText (re-)splits
   * (initial split, and again on resize via autoSplit). The caller owns the
   * scroll-scrubbed exit dissolve — this only reports the chars to animate, since
   * that dissolve is sequenced across multiple TextReveal instances (see Hero.tsx).
   */
  onChars?: (chars: Element[]) => void;
};

/**
 * Splits its text into lines and reveals them with a staggered slide-up-out-of-a-mask
 * animation (each line clipped by an overflow:clip wrapper), matching the paragraph
 * reveal on kononenkogroup.com. SplitText's `autoSplit` re-splits on resize so the
 * reveal re-triggers correctly at the new line breaks.
 *
 * The initial split waits for document.fonts.ready first: globals.css loads Brandon
 * Grotesque via a plain @font-face (not next/font), so it swaps in asynchronously
 * after first paint. Splitting before that swap measures lines against the fallback
 * font, and autoSplit's own font-load re-split can then race with layout — observed
 * in testing as lines corrupting into one word per line. Measuring only after fonts
 * have settled avoids that race entirely.
 */
export function TextReveal({
  as = "p",
  className,
  children,
  delay = 0,
  stagger = 0.07,
  onChars,
}: TextRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let ctx: gsap.Context | undefined;
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled || !el) return;
      ctx = gsap.context(() => {
        const split = SplitText.create(el, {
          type: "lines, words, chars",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            el.classList.remove(styles.pending);

            if (prefersReducedMotion) {
              gsap.set(self.lines, { opacity: 1 });
            } else {
              gsap.from(self.lines, {
                yPercent: 110,
                opacity: 0,
                duration: 1,
                delay,
                stagger,
                ease: "expo.out",
              });
            }

            onChars?.(self.chars ?? []);
          },
        });
        return () => split.revert();
      }, el);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [delay, stagger, onChars]);

  const Tag = as;
  return (
    <>
      <noscript>
        <style>{`.${styles.pending}{opacity:1 !important}`}</style>
      </noscript>
      <Tag ref={ref as React.Ref<never>} className={`${styles.pending} ${className ?? ""}`}>
        {children}
      </Tag>
    </>
  );
}
