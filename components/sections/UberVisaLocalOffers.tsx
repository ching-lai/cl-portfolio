import { Fragment } from "react";
import { ProjectBar } from "@/components/ProjectBar";
import { Row, ImageMedia, Stage, StageVideo, StageImage } from "@/components/media";
import styles from "./section.module.css";
import infoStyles from "@/components/InfoModal.module.css";

const VIDEOS = "/videos/uber-visa-local-offers";
const IMAGES = "/images/uber-visa-local-offers";

const INFO = {
  subtitle: "Product Design Lead",
  body: [
    "The Uber Visa Local Offers program turns everyday spending into Uber Cash. Users earn Uber Cash by paying with any Visa card on file at a participating merchant. A push notification confirms the reward within seconds of the swipe. For merchants, it created a new way to acquire customers, increase sales, and build loyalty. I led the design of every version of this product.",
    <Fragment key="commercial">
      The first version launched in phases across San Francisco and Los Angeles, using per-merchant enrollment. It earned coverage from TechCrunch, Refinery29, and The Points Guy, along with a{" "}
      <a
        className={`${infoStyles.bodyLink} draw-underline`}
        data-label="commercial"
        aria-label="commercial"
        href="https://www.youtube.com/watch?v=QwfQ7pNiEhg"
        target="_blank"
        rel="noopener noreferrer"
      >
        commercial
      </a>{" "}
      featuring Kaley Cuoco. After the Uber app rebrand, I led a redesign that replaced per-merchant enrollment with a single one-time enrollment, a major UX improvement.
    </Fragment>,
  ],
  rolesLeft: ["UX Design", "Visual Design"],
  rolesRight: ["Prototyping", "Design Research"],
};

export function UberVisaLocalOffers() {
  return (
    <section id="uber-visa-local-offers" className={styles.section}>
      <ProjectBar title="Uber Visa Local Offers" infoContent={INFO} />
      <div className="desktop-only">
      <div className={styles.body}>
        {/* v1 (448×386 @ left-215/top+40) and main (261×466 @ left-915) — offset, not centered.
            The main video fills the Stage's full height (top:0/height:100%), so its
            bottom edge is the Stage's own bottom edge — the extra 80px goes on a
            wrapper around the whole Stage. */}
        <div style={{ width: "100%", marginBottom: "calc(80px * var(--scale-1440))" }}>
          <Stage aspect="1440 / 466">
            <StageVideo
              src={`${VIDEOS}/uber-visa-local-offers-v1.mp4`}
              left="14.931%"
              top="8.584%"
              width="31.111%"
              height="82.833%"
            />
            <StageVideo
              src={`${VIDEOS}/uber-visa-local-offers.mp4`}
              left="63.542%"
              top="0%"
              width="18.125%"
              height="100%"
            />
          </Stage>
        </div>

        {/* Four screens: 225/1440 = 15.625%, gap 81px = 5.625% */}
        <Row gap="5.625%">
          {[1, 2, 3, 4].map((n) => (
            <ImageMedia
              key={n}
              src={`${IMAGES}/uber-visa-local-offers-${n}.jpg`}
              alt={`Uber Visa Local Offers screen ${n}`}
              width="15.625%"
              aspect="225 / 400"
              sizes="16vw"
            />
          ))}
        </Row>
      </div>
      </div>

      {/* Mobile: v1 (top-left) + main (top-right) videos, then a 2x2 zigzag of the
          4 screens. Stage is 402 wide / 756 tall (section 812 minus the 56px bar). */}
      <div className="mobile-only">
        <Stage aspect="402 / 756">
          <StageVideo src={`${VIDEOS}/uber-visa-local-offers-v1.mp4`} left="4.975%" top="6.349%" width="47.264%" height="21.693%" />
          <StageVideo src={`${VIDEOS}/uber-visa-local-offers.mp4`} left="67.662%" top="4.233%" width="27.363%" height="25.926%" />
          <StageImage src={`${IMAGES}/uber-visa-local-offers-1.jpg`} alt="Uber Visa Local Offers screen 1" left="16.667%" top="35.45%" width="27.363%" height="25.926%" sizes="28vw" />
          <StageImage src={`${IMAGES}/uber-visa-local-offers-2.jpg`} alt="Uber Visa Local Offers screen 2" left="55.97%" top="35.45%" width="27.363%" height="25.926%" sizes="28vw" />
          <StageImage src={`${IMAGES}/uber-visa-local-offers-3.jpg`} alt="Uber Visa Local Offers screen 3" left="16.667%" top="67.725%" width="27.363%" height="25.926%" sizes="28vw" />
          <StageImage src={`${IMAGES}/uber-visa-local-offers-4.jpg`} alt="Uber Visa Local Offers screen 4" left="55.97%" top="67.725%" width="27.363%" height="25.926%" sizes="28vw" />
        </Stage>
      </div>
    </section>
  );
}
