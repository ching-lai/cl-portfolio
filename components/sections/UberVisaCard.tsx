"use client";

import { Fragment } from "react";
import { ProjectBar } from "@/components/ProjectBar";
import { Row, ImageMedia, VideoMedia, Stage, StageImage, StageVideo } from "@/components/media";
import { useTheme } from "@/lib/theme";
import styles from "./section.module.css";
import infoStyles from "@/components/InfoModal.module.css";

const VIDEOS = "/videos/uber-visa-card";
const IMAGES = "/images/uber-visa-card";

const INFO = {
  subtitle: "Product Design Lead",
  body: [
    "Our mission on the Financial Products Team was to create Uber-owned financial products that deepen our relationship with our customers and strengthen our business. I was the founding designer for this team and I led the design of Uber’s first credit card. We collaborated closely with Barclays and Visa to create innovative experiences that have never been done in the industry. It was known as one of the best no-annual-fee credit cards in the market.",
    <Fragment key="press">
      I owned the end-to-end design process, from the physical card to every experience in the app, including a multi-day press check at a secure card manufacturing facility and close collaboration with Barclays and legal on the native application and instant provisioning flow. We ran a conjoint analysis with a researcher to identify which benefits our most frequent riders valued most, and built the card's offering around those findings. For launch, we partnered with Marketing on a Ride & Dine stunt with celebrity chef Alex Guarnaschelli and drew press from New York Magazine, The Points Guy, Refinery29, NerdWallet, People, and Afar, including Mashable calling it “
      <a
        className={`${infoStyles.bodyLink} draw-underline`}
        data-label="the ultimate millennial credit card."
        aria-label="the ultimate millennial credit card."
        href="https://mashable.com/article/uber-credit-card-visa"
        target="_blank"
        rel="noopener noreferrer"
      >
        the ultimate millennial credit card.
      </a>
      ”
    </Fragment>,
  ],
  rolesLeft: ["UX Design", "Visual Design", "Card Design"],
  rolesRight: ["Prototyping", "Motion Design", "Design Research"],
};

// First project section — media loads eagerly rather than lazily.
export function UberVisaCard() {
  const { theme } = useTheme();
  // Only this hero clip has a light-theme variant (swapped via the header's
  // sun/moon toggle); every other video on the page is theme-agnostic.
  const heroVideo = theme === "light" ? "uber-visa-card-light.mp4" : "uber-visa-card.mp4";

  return (
    <section id="uber-visa-card" className={styles.section}>
      <ProjectBar title="Uber Visa Card" infoContent={INFO} />

      <div className="desktop-only">
      <div className={styles.body}>
        {/* Hero video: 732/1440 = 50.833%, centered */}
        <Row>
          <VideoMedia src={`${VIDEOS}/${heroVideo}`} width="50.833%" aspect="732 / 565" priority feather />
        </Row>

        {/* Three portrait videos: 331/1440 = 22.986%, reduced 10% then another 5% = 19.653%.
            .body's flex gap already gives 48px below; +80px margin adds the requested
            80px on top of that. */}
        <Row gap="6.875%" style={{ marginBottom: "calc(80px * var(--scale-1440))" }}>
          <VideoMedia src={`${VIDEOS}/uber-visa-card-instant-provisioning.mp4`} width="19.653%" aspect="331 / 588" priority />
          <VideoMedia src={`${VIDEOS}/uber-visa-card-redemption.mp4`} width="19.653%" aspect="331 / 588" priority />
          <VideoMedia src={`${VIDEOS}/uber-visa-card-menu-prop.mp4`} width="19.653%" aspect="331 / 588" priority />
        </Row>

        {/* Five product PNGs, edge-to-edge (no gap): 240/1440 = 16.667% each */}
        <Row gap="0">
          {[1, 2, 3, 4, 5].map((n) => (
            <ImageMedia
              key={n}
              src={`${IMAGES}/uber-visa-card-${n}.png`}
              alt={`Uber Visa Card product photo ${n}`}
              width="16.667%"
              aspect="240 / 420"
              fit="contain"
              priority
              sizes="17vw"
            />
          ))}
        </Row>
      </div>
      </div>

      {/* Mobile (402x874 frame): hero video full-width, 3 small videos row, then a
          2-3 zigzag of the 5 product photos. All positions are percentages of the
          402-wide / 1002-tall content stage (section height 1058 minus the 56px bar). */}
      <div className="mobile-only">
        <Stage aspect="402 / 1002">
          <StageVideo src={`${VIDEOS}/${heroVideo}`} left="4.975%" top="0.998%" width="90.05%" height="27.944%" priority />
          <StageVideo src={`${VIDEOS}/uber-visa-card-instant-provisioning.mp4`} left="4.975%" top="29.741%" width="27.363%" height="19.561%" priority />
          <StageVideo src={`${VIDEOS}/uber-visa-card-redemption.mp4`} left="36.318%" top="29.741%" width="27.363%" height="19.561%" priority />
          <StageVideo src={`${VIDEOS}/uber-visa-card-menu-prop.mp4`} left="67.662%" top="29.741%" width="27.363%" height="19.561%" priority />
          <StageImage src={`${IMAGES}/uber-visa-card-1.png`} alt="Uber Visa Card product photo 1" left="4.975%" top="52.495%" width="30.1%" height="21.058%" fit="contain" priority sizes="31vw" />
          <StageImage src={`${IMAGES}/uber-visa-card-2.png`} alt="Uber Visa Card product photo 2" left="35.075%" top="52.495%" width="30.1%" height="21.158%" fit="contain" priority sizes="31vw" />
          <StageImage src={`${IMAGES}/uber-visa-card-3.png`} alt="Uber Visa Card product photo 3" left="64.925%" top="52.495%" width="30.1%" height="21.058%" fit="contain" priority sizes="31vw" />
          <StageImage src={`${IMAGES}/uber-visa-card-4.png`} alt="Uber Visa Card product photo 4" left="17.91%" top="74.85%" width="30.1%" height="21.158%" fit="contain" priority sizes="31vw" />
          <StageImage src={`${IMAGES}/uber-visa-card-5.png`} alt="Uber Visa Card product photo 5" left="51.99%" top="74.85%" width="30.1%" height="21.158%" fit="contain" priority sizes="31vw" />
        </Stage>
      </div>
    </section>
  );
}
