"use client";

import { Fragment } from "react";
import { ProjectBar } from "@/components/ProjectBar";
import { Row, ImageMedia, Stage, StageImage } from "@/components/media";
import { useTheme } from "@/lib/theme";
import placedStyles from "./section.module.css";
import infoStyles from "@/components/InfoModal.module.css";

const IMAGES = "/images/uber-spotify";

const INFO = {
  subtitle: "Product Designer",
  body: [
    "I created the first version of the Spotify music integration in the Uber app in 2014. At a time when competition with Lyft was fierce, we drove differentiation through personalization, collaborating closely with Spotify's engineering and marketing teams to bring it to life.",
    <Fragment key="commercial">
      The launch spanned 10 cities with 10 launch concerts and became both a technology and culture story, earning coverage from WIRED, TechCrunch, and TIME. Travis Kalanick called it &quot;the first time we&apos;ve personalized the experience inside the car,&quot; while Spotify CEO Daniel Ek described Uber as &quot;an obvious fit.&quot; The &quot;Your Ride. Your Music.&quot; campaign later won a Clio Music Grand Award, and we produced a{" "}
      <a
        className={`${infoStyles.bodyLink} draw-underline`}
        data-label="commercial"
        aria-label="commercial"
        href="https://vimeo.com/112013239?fl=pl&fe=sh"
        target="_blank"
        rel="noopener noreferrer"
      >
        commercial
      </a>{" "}
      featuring our PM behind the wheel.
    </Fragment>,
  ],
  rolesLeft: ["UX Design", "Visual Design", "Prototyping"],
  rolesRight: ["Motion Design", "Design Research"],
};

export function UberSpotify() {
  const { theme } = useTheme();
  const citiesImg = theme === "light" ? "10-cities-10-concerts-dark.png" : "10-cities-10-concerts.png";
  const mapImg = theme === "light" ? "map-dark.png" : "map.png";

  return (
    <section id="uber-spotify" className={placedStyles.section}>
      <ProjectBar title="Uber Spotify Partnership" infoContent={INFO} />
      <div className="desktop-only">
      <div className={placedStyles.body}>
        {/* Four screens: 15.625%, gap 81px = 5.625% */}
        <Row gap="5.625%">
          {[1, 2, 3, 4].map((n) => (
            <ImageMedia
              key={n}
              src={`${IMAGES}/uber-spotify-${n}.jpg`}
              alt={`Uber Spotify Partnership screen ${n}`}
              width="15.625%"
              aspect="225 / 400"
              sizes="16vw"
            />
          ))}
        </Row>

        {/* Map (669×359) on the left + "10 Cities / 10 Concerts" ring on the right */}
        <Stage aspect="1440 / 359">
          <StageImage
            src={`${IMAGES}/${mapImg}`}
            alt="Map of the 10 cities on the Uber x Spotify tour"
            left="10.278%"
            top="0%"
            width="46.458%"
            height="100%"
            fit="contain"
            sizes="47vw"
          />
          {/* height is width scaled by the Stage's own aspect (1440/359), not equal to
              width, so the square PNG renders as an actual square, not stretched. */}
          <StageImage
            src={`${IMAGES}/${citiesImg}`}
            alt="10 Cities, 10 Concerts"
            left="68.128%"
            top="15.35%"
            width="17.354%"
            height="69.609%"
            fit="contain"
            sizes="18vw"
          />
        </Stage>
      </div>
      </div>

      {/* Mobile: 2x2 zigzag of the 4 screens, the map graphic where the mobile frame's
          "Vector" decoration was, + "10 Cities / 10 Concerts" circle. Stage is 402
          wide / 940 tall (section 996 minus the 56px bar). */}
      <div className="mobile-only">
        <Stage aspect="402 / 940">
          <StageImage src={`${IMAGES}/uber-spotify-1.jpg`} alt="Uber Spotify Partnership screen 1" left="16.667%" top="3.404%" width="27.363%" height="20.745%" sizes="28vw" />
          <StageImage src={`${IMAGES}/uber-spotify-2.jpg`} alt="Uber Spotify Partnership screen 2" left="55.97%" top="3.404%" width="27.363%" height="20.745%" sizes="28vw" />
          <StageImage src={`${IMAGES}/uber-spotify-3.jpg`} alt="Uber Spotify Partnership screen 3" left="16.667%" top="29.255%" width="27.363%" height="20.851%" sizes="28vw" />
          <StageImage src={`${IMAGES}/uber-spotify-4.jpg`} alt="Uber Spotify Partnership screen 4" left="55.97%" top="29.255%" width="27.363%" height="20.745%" sizes="28vw" />
          <StageImage src={`${IMAGES}/${mapImg}`} alt="Map of the 10 cities on the Uber x Spotify tour" left="4.975%" top="53.404%" width="90.05%" height="20.638%" fit="contain" sizes="90vw" />
          {/* height is width scaled by the Stage's own aspect (402/940), not equal to
              width, so the square PNG renders as an actual square, not stretched. */}
          <StageImage src={`${IMAGES}/${citiesImg}`} alt="10 Cities, 10 Concerts" left="28.607%" top="76.596%" width="42.786%" height="18.298%" fit="contain" sizes="43vw" />
        </Stage>
      </div>
    </section>
  );
}
