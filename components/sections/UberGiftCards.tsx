"use client";

import { Fragment } from "react";
import { ProjectBar } from "@/components/ProjectBar";
import { Row, ImageMedia, Stage, StageImage, StageVideo } from "@/components/media";
import { useTheme } from "@/lib/theme";
import styles from "./section.module.css";
import infoStyles from "@/components/InfoModal.module.css";

const VIDEOS = "/videos/uber-gift-cards";
const IMAGES = "/images/uber-gift-cards";

const INFO = {
  subtitle: "Product Design Lead",
  body: [
    <Fragment key="press">
      I led the creation of Uber's digital and physical gift cards from concept through press checks and all in-app user experiences, working across product, graphic, and motion design, including the in-app gifting animations. I traveled and conducted global research studies that shaped successful launches across numerous countries. The US launch rolled out across 35,000+ retail locations and was covered by TechCrunch, VentureBeat, Fortune, PYMNTS, and Engadget, and celebrated in Uber&apos;s{" "}
      <a
        className={`${infoStyles.bodyLink} draw-underline`}
        data-label='"Oh What a Night" commercial'
        aria-label='"Oh What a Night" commercial'
        href="https://www.youtube.com/watch?v=7-1fCFBtfj4"
        target="_blank"
        rel="noopener noreferrer"
      >
        &quot;Oh What a Night&quot; commercial
      </a>
      . Expanding into Brazil, our research surfaced a distinct gifting culture that shaped how we positioned and localized the product as Uber Pré-Pago.
    </Fragment>,
  ],
  rolesLeft: ["UX Design", "Visual Design", "Illustration"],
  rolesRight: ["Motion Design", "Prototyping", "Design Research"],
};

export function UberGiftCards() {
  const { theme } = useTheme();
  const retailersImg = theme === "light" ? "retailers-on-launch-dark.png" : "retailers-on-launch.png";

  return (
    <section id="uber-gift-cards" className={styles.section}>
      <ProjectBar title="Uber Gift Cards" infoContent={INFO} />
      <div className="desktop-only">
      <div className={styles.body}>
        {/* 3-up card PNG (627×537, transparent) + gifting video (262×466), offset */}
        <Stage aspect="1440 / 537">
          <StageImage
            src={`${IMAGES}/uber-gift-cards-3up.png`}
            alt="Uber Gift Cards, three product variations"
            left="10.347%"
            top="0%"
            width="43.542%"
            height="100%"
            fit="contain"
            sizes="44vw"
          />
          <StageVideo
            src={`${VIDEOS}/gifting-recipient.mp4`}
            left="63.542%"
            top="6.704%"
            width="18.194%"
            height="86.778%"
          />
        </Stage>

        {/* Four screens: 15.625%, gap 81px = 5.625%. .body's flex gap already gives
            48px below; +80px margin adds the requested 80px on top of that. */}
        <Row gap="5.625%" style={{ marginBottom: "calc(80px * var(--scale-1440))" }}>
          {[1, 2, 3, 4].map((n) => (
            <ImageMedia
              key={n}
              src={`${IMAGES}/uber-gift-cards-${n}.jpg`}
              alt={`Uber Gift Cards screen ${n}`}
              width="15.625%"
              aspect="225 / 400"
              sizes="16vw"
            />
          ))}
        </Row>

        {/* Retailers stat — pre-rendered gradient-ring circle (3x PNG straight from
            Figma), centered. 294/1440 = 20.417% pre-reduction; matches the prior
            CSS-drawn circle's 17.354% (294px reduced 15%). */}
        <ImageMedia
          src={`${IMAGES}/${retailersImg}`}
          alt="35,000+ retailers on launch"
          width="17.354%"
          aspect="1 / 1"
          fit="contain"
          sizes="18vw"
        />
      </div>
      </div>

      {/* Mobile: 3-up + gifting video, 2x2 image zigzag, retailers circle. Stage is
          402 wide / 968 tall (section 1024 minus the 56px bar). */}
      <div className="mobile-only">
        <Stage aspect="402 / 968">
          <StageImage src={`${IMAGES}/uber-gift-cards-3up.png`} alt="Uber Gift Cards, three product variations" left="4.975%" top="3.822%" width="53.98%" height="19.215%" fit="contain" sizes="54vw" />
          <StageVideo src={`${VIDEOS}/gifting-recipient.mp4`} left="67.662%" top="3.306%" width="27.363%" height="20.248%" />
          <StageImage src={`${IMAGES}/uber-gift-cards-1.jpg`} alt="Uber Gift Cards screen 1" left="16.667%" top="27.686%" width="27.363%" height="20.248%" sizes="28vw" />
          <StageImage src={`${IMAGES}/uber-gift-cards-2.jpg`} alt="Uber Gift Cards screen 2" left="55.97%" top="27.686%" width="27.363%" height="20.248%" sizes="28vw" />
          <StageImage src={`${IMAGES}/uber-gift-cards-3.jpg`} alt="Uber Gift Cards screen 3" left="16.667%" top="52.893%" width="27.363%" height="20.248%" sizes="28vw" />
          <StageImage src={`${IMAGES}/uber-gift-cards-4.jpg`} alt="Uber Gift Cards screen 4" left="55.97%" top="52.893%" width="27.363%" height="20.248%" sizes="28vw" />
          {/* height is width scaled by the Stage's own aspect (402/968), not equal to
              width, so the square PNG renders as an actual square, not stretched. */}
          <StageImage src={`${IMAGES}/${retailersImg}`} alt="35,000+ retailers on launch" left="28.607%" top="77.273%" width="42.786%" height="17.769%" fit="contain" sizes="43vw" />
        </Stage>
      </div>
    </section>
  );
}
