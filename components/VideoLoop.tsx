"use client";

import { useEffect, useRef, useState } from "react";

interface VideoLoopProps {
  src: string;
  /** No poster assets exist yet for these clips; leave unset until they're added. */
  poster?: string;
  className?: string;
  style?: React.CSSProperties;
  /** First-section videos load immediately instead of waiting to scroll into view. */
  priority?: boolean;
}

export function VideoLoop({ src, poster, className, style, priority = false }: VideoLoopProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(priority);

  useEffect(() => {
    // `priority` is no longer a static prop — UberVisaCard flips it from false to
    // true once it has resolved (client-side) which of its always-mounted
    // desktop/mobile layouts is actually visible. So a priority video must ACTIVATE
    // when priority becomes true, not merely have been initialized active: without
    // this setActive, a video that mounted at priority=false (isMobile still
    // unresolved) and then had priority flip true would never load — the observer
    // branch below is skipped for it, but nothing turned `active` on. That was the
    // "videos don't load on mobile / iPad Pro" regression.
    if (priority) {
      setActive(true);
      return;
    }
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      // Re-run on src changes too (e.g. the light/dark theme toggle swapping a
      // clip) — changing the src attribute alone doesn't make an already-loaded
      // <video> pick it up without an explicit reload.
      video.load();
      video.play().catch(() => {});
    } else {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
  }, [active, src]);

  return (
    <video
      ref={videoRef}
      className={className}
      style={style}
      poster={poster}
      src={active ? src : undefined}
      muted
      loop
      playsInline
      autoPlay={priority}
      preload={priority ? "auto" : "none"}
    />
  );
}
