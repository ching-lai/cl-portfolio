"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevDown } from "@/components/icons/ChevDown";
import { TextReveal } from "@/components/TextReveal";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

// The background exit fade/slide-out completes once the hero has scrolled this
// fraction of its own height out of view.
const EXIT_DISTANCE_RATIO = 0.6;
const EXIT_END = `${EXIT_DISTANCE_RATIO * 100}% top`;
// The text block still scrolls with the page (it's normal document flow), but lags
// behind by this fraction of the scroll distance, so it drifts up slower than the
// rest of the page — a subtle parallax rather than a 1:1 scroll.
const PARALLAX_LAG_RATIO = 0.5;
// The text must have fully dissolved by the time it's this many px below the top of
// the viewport (not right as it crosses it) — see textExitDistanceRef below for how
// this turns into an actual scroll distance once the parallax lag is accounted for.
const TEXT_TOP_MARGIN_PX = 60;
// How much of each block's budget a single character's fade spans (see addDissolve).
// 0.35 read as too soft/wide (~86 of the body's 250 characters fading at once); the
// original each*1.5 read as too sharp (~1-2 at once). This splits the difference.
const DISSOLVE_OVERLAP_RATIO = 0.18;

/**
 * Adds one leg of the letter-dissolve to `tl`: fades `chars` out from the *last*
 * character back to the first (stagger `from: "end"`), consuming `budget` units of
 * the timeline regardless of how many characters there are, so unequal-length blocks
 * (the ~250-character body vs. the 14-character headline) get a comparable amount of
 * the scroll range rather than the shorter block flashing by instantly.
 *
 * Each character's own fade spans a fixed fraction of the whole block's budget
 * (rather than a small multiple of the per-character stagger step), so at any given
 * scroll position a span of characters — a word or so — is simultaneously mid-fade,
 * reading as a gradient sweep instead of a hard, one-letter-at-a-time cutoff.
 */
function addDissolve(tl: gsap.core.Timeline, chars: Element[], budget: number) {
  if (!chars.length) return;
  const each = budget / chars.length;
  tl.to(chars, {
    opacity: 0,
    ease: "none",
    duration: budget * DISSOLVE_OVERLAP_RATIO,
    stagger: { each, from: "end" },
  });
}

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgLeftRef = useRef<HTMLDivElement | null>(null);
  const bgRightRef = useRef<HTMLDivElement | null>(null);
  const bgLeftInnerRef = useRef<HTMLDivElement | null>(null);
  const bgRightInnerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const chevronRef = useRef<HTMLButtonElement | null>(null);

  const headlineCharsRef = useRef<Element[]>([]);
  const bodyCharsRef = useRef<Element[]>([]);
  const exitTimelineRef = useRef<gsap.core.Timeline | null>(null);
  // Scroll distance (px) at which the text should be fully dissolved — computed once
  // on mount from the content block's actual starting position, see the main effect.
  const textExitDistanceRef = useRef(0);

  // Rebuilds the combined dissolve every time either TextReveal reports fresh chars
  // (initial split, and again on resize via autoSplit) — body first, then headline,
  // as one connected sequence rather than two independent fades.
  const rebuildTextExit = useCallback(() => {
    const section = sectionRef.current;
    const textExitDistance = textExitDistanceRef.current;
    if (!section || textExitDistance <= 0) return;

    exitTimelineRef.current?.scrollTrigger?.kill();
    exitTimelineRef.current?.kill();
    exitTimelineRef.current = null;

    const bodyChars = bodyCharsRef.current;
    const headlineChars = headlineCharsRef.current;
    if (!bodyChars.length && !headlineChars.length) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${textExitDistance}`,
        scrub: true,
      },
    });
    addDissolve(tl, bodyChars, 1);
    addDissolve(tl, headlineChars, 1);
    exitTimelineRef.current = tl;

    // The bg-exit and parallax ScrollTriggers above are created synchronously on
    // mount, before SplitText's document.fonts.ready gate resolves. If the font swap
    // (or anything else) reflows the page after that, their start/end stay stale —
    // observed in testing as a wildly wrong `end` (measured against a taller,
    // pre-settled layout). This is the one point guaranteed to run after the text has
    // finished settling, so refreshing here corrects every trigger, not just this one.
    ScrollTrigger.refresh();
  }, []);

  const handleHeadlineChars = useCallback(
    (chars: Element[]) => {
      headlineCharsRef.current = chars;
      rebuildTextExit();
    },
    [rebuildTextExit]
  );

  const handleBodyChars = useCallback(
    (chars: Element[]) => {
      bodyCharsRef.current = chars;
      rebuildTextExit();
    },
    [rebuildTextExit]
  );

  useEffect(() => {
    const section = sectionRef.current;
    const bgLeft = bgLeftRef.current;
    const bgRight = bgRightRef.current;
    const bgLeftInner = bgLeftInnerRef.current;
    const bgRightInner = bgRightInnerRef.current;
    const content = contentRef.current;
    const chevron = chevronRef.current;
    if (
      !section ||
      !bgLeft ||
      !bgRight ||
      !bgLeftInner ||
      !bgRightInner ||
      !content ||
      !chevron
    ) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Scroll distance at which the parallax-lagged content reaches TEXT_TOP_MARGIN_PX
    // below the viewport top. Content moves at (1 - PARALLAX_LAG_RATIO) of the actual
    // scroll speed, so it takes more raw scroll than the on-screen distance traveled
    // to get there — solved for below so the text finishes dissolving right as it
    // reaches that point, not still fading as it crosses it. Measured now, before any
    // transform has been applied, so this is content's true untransformed position.
    const initialContentTop = content.getBoundingClientRect().top + window.scrollY;
    const textExitDistance = Math.max(
      1,
      (initialContentTop - TEXT_TOP_MARGIN_PX) / (1 - PARALLAX_LAG_RATIO)
    );
    textExitDistanceRef.current = textExitDistance;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([bgLeft, bgRight, bgLeftInner, bgRightInner], {
          opacity: 1,
          xPercent: 0,
          scale: 1,
        });
        return;
      }

      // Entrance ("zoom quickly into frame, slow easing on arrival"), plays once on
      // load. Lives on an inner wrapper so it never fights with the scroll-scrubbed
      // exit tween below, which owns the outer element's opacity/xPercent instead.
      // Uses fromTo (not from) with an explicit end state: the .bgInner CSS default
      // is opacity: 0 (to avoid a pre-JS flash), and gsap.from() would otherwise
      // capture that as its own end value too, leaving opacity stuck at 0 forever.
      gsap.fromTo(
        bgLeftInner,
        { xPercent: -60, scale: 1.15, opacity: 0 },
        { xPercent: 0, scale: 1, opacity: 1, duration: 1.1, ease: "expo.out" }
      );
      gsap.fromTo(
        bgRightInner,
        { xPercent: 60, scale: 1.15, opacity: 0 },
        { xPercent: 0, scale: 1, opacity: 1, duration: 1.1, ease: "expo.out" }
      );

      // Exit: as the hero scrolls out of view, the backgrounds fade out and continue
      // sliding outward (left keeps going left, right keeps going right), scrubbed
      // directly to scroll position so it reverses cleanly if the user scrolls back
      // up. The text itself dissolves letter by letter instead (see rebuildTextExit).
      const exitTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: EXIT_END,
          scrub: true,
        },
      });
      exitTl
        .to(bgLeft, { xPercent: -30, opacity: 0, ease: "none" }, 0)
        .to(bgRight, { xPercent: 30, opacity: 0, ease: "none" }, 0);

      // Parallax: the text still scrolls with the page, just slower than 1:1, so it
      // visibly lags behind rather than tracking the scroll exactly. Ends exactly
      // where the letter-dissolve (rebuildTextExit) does, so both finish together.
      gsap.fromTo(
        content,
        { y: 0 },
        {
          y: textExitDistance * PARALLAX_LAG_RATIO,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${textExitDistance}`,
            scrub: true,
          },
        }
      );

      // Chevron idles with a gentle continuous float — y only (no scale), eased both
      // directions with no overshoot, one full down-and-back cycle every 2s.
      gsap.to(chevron, {
        y: 4,
        duration: 1,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Fades out the instant the user starts scrolling (not gradually — "top top-=1"
      // fires as soon as the page has scrolled 1px), and fades back in if they scroll
      // back up to the very top.
      gsap.to(chevron, {
        opacity: 0,
        duration: 0.25,
        ease: "power1.out",
        scrollTrigger: {
          trigger: section,
          start: "top top-=1",
          toggleActions: "play none none reverse",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className={styles.hero} ref={sectionRef}>
      <noscript>
        <style>{`.${styles.bgInner}{opacity:1 !important;transform:none !important}`}</style>
      </noscript>
      <div className={styles.bgLeft} ref={bgLeftRef}>
        <div className={styles.bgInner} ref={bgLeftInnerRef}>
          <Image
            src="/images/home/home-bg-left.png"
            alt=""
            fill
            priority
            sizes="66vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
      <div className={styles.bgRight} ref={bgRightRef}>
        <div className={styles.bgInner} ref={bgRightInnerRef}>
          <Image
            src="/images/home/home-bg-right.png"
            alt=""
            fill
            priority
            sizes="28vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      <div className={styles.content} ref={contentRef}>
        <TextReveal as="h1" className={styles.headline} onChars={handleHeadlineChars}>
          Hi, I&rsquo;m Ching Lai
        </TextReveal>
        <TextReveal
          as="p"
          className={styles.body}
          delay={0.3}
          stagger={0.09}
          onChars={handleBodyChars}
        >
          I&rsquo;m a multidisciplinary designer with experience building products at{" "}
          <a
            href="https://www.uber.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="draw-underline"
            data-label="Uber"
            aria-label="Uber"
          >
            Uber
          </a>
          ,{" "}
          <a
            href="https://www.leaflink.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="draw-underline"
            data-label="LeafLink"
            aria-label="LeafLink"
          >
            LeafLink
          </a>
          , and{" "}
          <a
            href="https://www.zinio.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="draw-underline"
            data-label="Zinio"
            aria-label="Zinio"
          >
            Zinio
          </a>
          . I built a reputation for launching 0-to-1 initiatives that grew into
          scaled products and dedicated teams. You can find me drawing{" "}
          <a
            href="https://www.mutatingmonsters.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="draw-underline"
            data-label="monsters"
            aria-label="monsters"
          >
            monsters
          </a>{" "}
          and making{" "}
          <a
            href="https://www.byeeee.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="draw-underline"
            data-label="sculptures"
            aria-label="sculptures"
          >
            sculptures
          </a>{" "}
          in my spare time.
        </TextReveal>
      </div>

      <button
        ref={chevronRef}
        type="button"
        className={styles.chevron}
        aria-label="Scroll to projects"
        onClick={() =>
          document.getElementById("uber-visa-card")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <ChevDown size={24} />
      </button>
    </section>
  );
}
