import { ProjectBar } from "@/components/ProjectBar";
import { Row, ImageMedia, VideoMedia, Stage, StageVideo, StageImage } from "@/components/media";
import styles from "./section.module.css";

const VIDEOS = "/videos/uber-cash";
const IMAGES = "/images/uber-cash";

const INFO = {
  subtitle: "Product Design Lead",
  body: [
    "Uber Cash introduced a smarter way to pay across all of Uber's offerings, from rides to food delivery. Users could add funds in advance to earn up to 5% off, or enable auto-refill to top up automatically whenever their balance dropped below $10. By reducing payment transaction fees, we passed the savings on to customers while strengthening retention.",
    "I owned the end-to-end design process, from facilitating workshops to leading UX and visual design, and supported the researcher on an international study in São Paulo, spending a week with a local research firm and translator running in-home interviews and usability testing for Uber Cash and Gift Cards. The product launched successfully in both the US and Brazil, becoming a closed-loop wallet that became the new home for user credits like customer support refunds and Visa Local Offers, rounding out a payments and fintech foundation that also included the Uber Visa Card, Uber Rewards, and Uber Gift Cards.",
  ],
  rolesLeft: ["UX Design", "Visual Design", "Prototyping"],
  rolesRight: ["Motion Design", "Design Research"],
};

export function UberCash() {
  return (
    <section id="uber-cash" className={styles.section}>
      <ProjectBar title="Uber Cash" infoContent={INFO} />

      <div className="desktop-only">
      <div className={styles.body}>
        {/* Reward-wallet video: matches the Uber Visa Card videos' width (19.653%).
            .body's flex gap already gives 48px below; +80px margin adds the requested
            80px on top of that. */}
        <Row style={{ marginBottom: "calc(80px * var(--scale-1440))" }}>
          <VideoMedia src={`${VIDEOS}/uber-cash-rw.mp4`} width="19.653%" aspect="331 / 589" />
        </Row>

        {/* Four screens: 15.625%, gap 81px = 5.625% */}
        <Row gap="5.625%">
          {[1, 2, 3, 4].map((n) => (
            <ImageMedia
              key={n}
              src={`${IMAGES}/uber-cash-${n}.jpg`}
              alt={`Uber Cash screen ${n}`}
              width="15.625%"
              aspect="225 / 400"
              sizes="16vw"
            />
          ))}
        </Row>
      </div>
      </div>

      {/* Mobile: reward-wallet video, then a 2x2 zigzag of the 4 screens. Stage is
          402 wide / 756 tall (section 812 minus the 56px bar). */}
      <div className="mobile-only">
        <Stage aspect="402 / 756">
          <StageVideo src={`${VIDEOS}/uber-cash-rw.mp4`} left="36.318%" top="4.233%" width="27.363%" height="25.926%" />
          <StageImage src={`${IMAGES}/uber-cash-1.jpg`} alt="Uber Cash screen 1" left="16.667%" top="35.45%" width="27.363%" height="25.926%" sizes="28vw" />
          <StageImage src={`${IMAGES}/uber-cash-2.jpg`} alt="Uber Cash screen 2" left="55.97%" top="35.45%" width="27.363%" height="25.926%" sizes="28vw" />
          <StageImage src={`${IMAGES}/uber-cash-3.jpg`} alt="Uber Cash screen 3" left="16.667%" top="67.725%" width="27.363%" height="25.926%" sizes="28vw" />
          <StageImage src={`${IMAGES}/uber-cash-4.jpg`} alt="Uber Cash screen 4" left="55.97%" top="67.725%" width="27.363%" height="25.926%" sizes="28vw" />
        </Stage>
      </div>
    </section>
  );
}
