"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextReveal } from "@/components/TextReveal";
import styles from "./InfoModal.module.css";

export interface InfoContent {
  subtitle: string;
  body: React.ReactNode[];
  /** Omit both role columns for personal projects that show a link instead (see `link`). */
  rolesLeft?: string[];
  rolesRight?: string[];
  /** Personal projects (Mutating Monsters, Byeeee) show a site link instead of roles. */
  link?: { label: string; href: string };
}

interface InfoModalProps {
  title: string;
  content: InfoContent;
  onClose: () => void;
}

// Backdrop wipe: a clip-path inset whose top edge shrinks from fully-clipped (100%)
// to fully-revealed (0%), which — with the bottom edge pinned at 0% — reads as the
// glass growing upward from the bottom of the screen. Closing plays the same
// property back toward CLIPPED, so the last sliver of visibility is left at the
// bottom, matching the open direction in reverse.
const CLIPPED = "inset(100% 0% 0% 0%)";
const REVEALED = "inset(0% 0% 0% 0%)";
const OPEN_DURATION = 0.45;
const OPEN_EASE = "power3.out";
const CLOSE_DURATION = 0.4;
const CLOSE_EASE = "power3.in";
const TEXT_FADE_DURATION = 0.25;
// Stagger between the title/subtitle/body TextReveal instances (mirrors Hero's
// headline → body cascade), plus a flat buffer before the non-TextReveal roles/link
// block fades in so it doesn't pop in ahead of the paragraph it follows.
const BLOCK_STAGGER = 0.12;
const EXTRAS_BUFFER = 0.6;

export function InfoModal({ title, content, onClose }: InfoModalProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const extrasRef = useRef<HTMLDivElement>(null);
  const openTweenRef = useRef<gsap.core.Tween | null>(null);
  const closingRef = useRef(false);
  // InfoModal only ever mounts client-side (ProjectBar portals it in after a click),
  // so reading matchMedia in the lazy initializer — rather than an effect — is safe
  // and lets contentReady start "true" outright for reduced-motion, avoiding a
  // setState call inside an effect body just to flip it a tick later.
  const [prefersReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [contentReady, setContentReady] = useState(prefersReducedMotion);

  const hasRoles = Boolean(content.rolesLeft && content.rolesRight);
  const hasExtras = hasRoles || Boolean(content.link);
  const extrasDelay = 0.2 + content.body.length * BLOCK_STAGGER + EXTRAS_BUFFER;

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    openTweenRef.current?.kill();

    const scrollArea = scrollAreaRef.current;
    const contentEl = contentRef.current;
    const closeEl = closeRef.current;

    if (prefersReducedMotion || !scrollArea) {
      onClose();
      return;
    }

    const closeBackdrop = () => {
      gsap.to(scrollArea, {
        clipPath: CLIPPED,
        duration: CLOSE_DURATION,
        ease: CLOSE_EASE,
        onComplete: onClose,
      });
    };

    // Close only ever reached full opacity once contentReady fades it in (see the
    // effect below), so it only needs fading back out alongside the panel in that
    // same case — otherwise (closed before the panel ever appeared) it's still at
    // opacity 0 and there's nothing to fade.
    if (contentEl && contentReady) {
      const fadeTargets = [contentEl, closeEl].filter(
        (el): el is NonNullable<typeof el> => el !== null
      );
      gsap.to(fadeTargets, {
        opacity: 0,
        duration: TEXT_FADE_DURATION,
        ease: "power1.out",
        onComplete: closeBackdrop,
      });
    } else {
      closeBackdrop();
    }
  }, [contentReady, onClose, prefersReducedMotion]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);

    // body { overflow: hidden } alone doesn't reliably block background scroll on iOS
    // Safari — it's a long-standing WebKit gap where a touch-scroll gesture can still
    // reach the body underneath (this is what let the real page visibly scroll behind
    // the modal on iPhone/iPad specifically, though not on desktop, where overflow:
    // hidden alone works fine). Pinning body to position: fixed at its current scroll
    // offset is the standard cross-platform-safe lock instead: there's no scroll
    // position left on body for a stray touch gesture to move, on any engine.
    const scrollY = window.scrollY;
    const body = document.body;
    const previousPosition = body.style.position;
    const previousTop = body.style.top;
    const previousLeft = body.style.left;
    const previousRight = body.style.right;
    const previousOverflow = body.style.overflow;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.position = previousPosition;
      body.style.top = previousTop;
      body.style.left = previousLeft;
      body.style.right = previousRight;
      body.style.overflow = previousOverflow;
      window.scrollTo(0, scrollY);

      // Toggling body to position: fixed and back changes document layout
      // dimensions mid-flight, which leaves GSAP ScrollTrigger's cached
      // start/end offsets for scrub-driven timelines (e.g. Hero's exit/parallax)
      // stale relative to the restored geometry. Wait a frame for the style/
      // scroll restore above to actually paint before refreshing — a single
      // rAF can still land ahead of layout settling under production's faster,
      // minified execution (this bug reproduced only in prod, not local dev).
      requestAnimationFrame(() => {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    };
  }, [handleClose]);

  // Plays once on mount: the backdrop wipe, then (via onComplete) hands off to the
  // title/subtitle/body TextReveal instances, which only mount — and so only start
  // their own internal reveal — once this finishes, so they always start "immediately
  // after" the backdrop rather than racing it.
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea || prefersReducedMotion) return;

    openTweenRef.current = gsap.to(scrollArea, {
      clipPath: REVEALED,
      duration: OPEN_DURATION,
      ease: OPEN_EASE,
      onComplete: () => setContentReady(true),
    });

    return () => {
      openTweenRef.current?.kill();
    };
  }, [prefersReducedMotion]);

  // Close starts invisible (see the inline style below) so it doesn't hang over the
  // still-loading backdrop — it fades in the instant the panel mounts, in step with
  // the title's own reveal.
  useEffect(() => {
    if (!contentReady || prefersReducedMotion) return;
    const closeEl = closeRef.current;
    if (!closeEl) return;

    const tween = gsap.to(closeEl, { opacity: 1, duration: 0.3, ease: "power1.out" });
    return () => {
      tween.kill();
    };
  }, [contentReady, prefersReducedMotion]);

  // Roles/link aren't run through TextReveal (SplitText line-masking a two-column
  // flex list isn't worth the risk of it), but still fade up in step with the
  // paragraph reveal above them instead of popping in with the rest of the panel.
  useEffect(() => {
    if (!contentReady || !hasExtras || prefersReducedMotion) return;
    const extras = extrasRef.current;
    if (!extras) return;

    const tween = gsap.fromTo(
      extras,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, delay: extrasDelay, ease: "power2.out" }
    );
    return () => {
      tween.kill();
    };
  }, [contentReady, hasExtras, extrasDelay, prefersReducedMotion]);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={`${title} info`}>
      <button
        ref={closeRef}
        type="button"
        className={`${styles.close} draw-underline`}
        data-label="Close"
        aria-label="Close"
        onClick={handleClose}
        style={{ opacity: prefersReducedMotion ? 1 : 0 }}
      >
        Close
      </button>
      <div
        ref={scrollAreaRef}
        className={styles.scrollArea}
        // backdrop-filter is set via inline style rather than the CSS module: Turbopack's
        // Lightning CSS processor silently strips it (both prefixed and unprefixed) from
        // compiled CSS Modules in this Next.js version — see the same workaround in
        // ProjectBar.tsx. It's on this inner scrollable layer (not .overlay) because an
        // element with backdrop-filter becomes the containing block for its own
        // position: fixed descendants — putting it on .overlay made .close scroll away
        // with the content instead of staying pinned to the viewport. clipPath starts
        // fully clipped inline (not via the CSS module default) so the open tween below
        // has a guaranteed starting point regardless of module CSS load order.
        style={{
          backdropFilter: "blur(25px)",
          WebkitBackdropFilter: "blur(25px)",
          clipPath: CLIPPED,
        }}
      >
        {contentReady && (
          <div className={styles.panel} ref={contentRef}>
            <div className={styles.accent} />
            <TextReveal as="h2" className={styles.title}>
              {title}
            </TextReveal>
            <TextReveal as="p" className={styles.subtitle} delay={0.1}>
              {content.subtitle}
            </TextReveal>
            <div className={styles.body}>
              {content.body.map((paragraph, i) => (
                <TextReveal as="p" key={i} delay={0.2 + i * BLOCK_STAGGER}>
                  {paragraph}
                </TextReveal>
              ))}
            </div>
            {hasExtras && (
              <div ref={extrasRef} style={{ opacity: prefersReducedMotion ? 1 : 0 }}>
                {hasRoles && (
                  <div className={styles.roles}>
                    <h3 className={styles.rolesHeading}>My Roles</h3>
                    <div className={styles.rolesColumns}>
                      <div className={styles.rolesColumn}>
                        {content.rolesLeft!.map((role) => (
                          <p key={role}>{role}</p>
                        ))}
                      </div>
                      <div className={styles.rolesColumn}>
                        {content.rolesRight!.map((role) => (
                          <p key={role}>{role}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {content.link && (
                  <a
                    className={`${styles.link} draw-underline`}
                    data-label={content.link.label}
                    aria-label={content.link.label}
                    href={content.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content.link.label}
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
