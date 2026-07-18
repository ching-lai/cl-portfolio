"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VideoLoop } from "./VideoLoop";
import styles from "./sections/section.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Rises up and fades in the first time an element scrolls into view (Apple's
 * "Explore the lineup" product grid is the reference) — shared by every media
 * wrapper below so every image/video on the site gets the same treatment. Purely
 * a paint/compositing animation (opacity + transform), decoupled from whether the
 * underlying image/video has actually finished loading — VideoLoop already lazy-
 * loads itself via its own IntersectionObserver, and next/image via `priority` —
 * so this doesn't introduce any loading delay of its own. Plays once; never
 * reverses on scroll back up.
 */
function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const tween = gsap.fromTo(
      el,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return ref;
}

/** A horizontal group of media, centered, matching Figma's centered rows. */
export function Row({
  children,
  gap = "1.667%",
  className,
  style,
}: {
  children: React.ReactNode;
  /** Gap as a percentage of the 1440 canvas (e.g. 99px = "6.875%"). */
  gap?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`${styles.row} ${className ?? ""}`}
      style={{ gap, ...style }}
    >
      {children}
    </div>
  );
}

interface MediaProps {
  /** Width as a percentage of the 1440 canvas (e.g. 240px = "16.667%"). */
  width: string;
  /** Aspect ratio "w / h" from the Figma frame. */
  aspect: string;
  /** contain for transparent PNGs / composites so they never crop; cover for photos. */
  fit?: "cover" | "contain";
  priority?: boolean;
  sizes?: string;
}

export function ImageMedia({
  src,
  alt,
  width,
  aspect,
  fit = "cover",
  priority = false,
  sizes = "(max-width: 900px) 100vw, 50vw",
}: MediaProps & { src: string; alt: string }) {
  const ref = useRevealOnScroll<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={styles.media}
      style={{ flex: `0 0 ${width}`, width, aspectRatio: aspect }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        style={{ objectFit: fit }}
      />
    </div>
  );
}

export function VideoMedia({
  src,
  width,
  aspect,
  priority = false,
  feather = false,
  objectPosition,
}: MediaProps & {
  src: string;
  feather?: boolean;
  /** Optional object-position for the <video> (which is object-fit: cover). Shifts
   *  which part of the clip shows through the fixed frame — e.g.
   *  "center calc(50% - 10px)" moves the video content up 10px within the crop, with
   *  the frame itself staying put. Only affects clips whose cover-scaling overflows on
   *  that axis. */
  objectPosition?: string;
}) {
  const ref = useRevealOnScroll<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`${styles.media} ${feather ? styles.feather : ""}`}
      style={{ flex: `0 0 ${width}`, width, aspectRatio: aspect }}
    >
      <VideoLoop
        src={src}
        priority={priority}
        style={objectPosition ? { objectPosition } : undefined}
      />
    </div>
  );
}

/** A relative canvas (aspect = "1440 / <sectionHeight>") for absolutely-placed children. */
export function Stage({
  aspect,
  children,
}: {
  aspect: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.stage} style={{ aspectRatio: aspect }}>
      {children}
    </div>
  );
}

interface PlacedProps {
  /** All values are percentages of the Stage (left/width of 1440, top/height of stage height). */
  left: string;
  top: string;
  width: string;
  height: string;
}

export function StageImage({
  src,
  alt,
  left,
  top,
  width,
  height,
  fit = "cover",
  priority = false,
  sizes = "(max-width: 900px) 100vw, 50vw",
  opacity,
}: PlacedProps & {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  priority?: boolean;
  sizes?: string;
  opacity?: number;
}) {
  const ref = useRevealOnScroll<HTMLDivElement>();
  return (
    <div ref={ref} className={styles.placed} style={{ left, top, width, height }}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        style={{ objectFit: fit, opacity }}
      />
    </div>
  );
}

export function StageVideo({
  src,
  left,
  top,
  width,
  height,
  priority = false,
}: PlacedProps & { src: string; priority?: boolean }) {
  const ref = useRevealOnScroll<HTMLDivElement>();
  return (
    <div ref={ref} className={styles.placed} style={{ left, top, width, height }}>
      <VideoLoop src={src} priority={priority} />
    </div>
  );
}
