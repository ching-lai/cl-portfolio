import { ProjectBar } from "@/components/ProjectBar";
import { Row, ImageMedia, Stage, StageImage } from "@/components/media";
import styles from "./section.module.css";

const IMAGES = "/images/zinio";

const INFO = {
  subtitle: "Visual Designer",
  body: [
    "I operated across product, brand, and marketing design for a digital publishing platform featuring 5.5K+ magazines in 30+ languages across iOS, Android, Windows, and web. I helped grow the iPad app into the #1 grossing app in its category, and served as the sole Product and Marketing Designer for the Windows 8 app, which became one of the platform's highest-rated experiences.",
  ],
  rolesLeft: ["UX Design", "Visual Design"],
  rolesRight: ["Marketing Design", "Prototyping"],
};

export function Zinio() {
  return (
    <section id="zinio" className={styles.section}>
      <ProjectBar title="Zinio" infoContent={INFO} />
      <div className="desktop-only">
      <div className={styles.body}>
        {/* Three phones (315×573) with the landing-page laptop (1086×637) overlapping
            their bottom edge, exactly as in Figma. */}
        <Stage aspect="1440 / 1163">
          <StageImage
            src={`${IMAGES}/zinio-1.png`}
            alt="Zinio app — home"
            left="8.889%"
            top="0%"
            width="21.875%"
            height="49.27%"
            fit="contain"
            sizes="22vw"
          />
          <StageImage
            src={`${IMAGES}/zinio-2.png`}
            alt="Zinio app — shop"
            left="39.028%"
            top="0%"
            width="21.875%"
            height="49.27%"
            fit="contain"
            sizes="22vw"
          />
          <StageImage
            src={`${IMAGES}/zinio-3.png`}
            alt="Zinio app — reading list"
            left="69.236%"
            top="0%"
            width="21.875%"
            height="49.27%"
            fit="contain"
            sizes="22vw"
          />
          <StageImage
            src={`${IMAGES}/zinio-win-landing-page.png`}
            alt="Zinio for Nokia Windows 8 Phone landing page"
            left="12.292%"
            top="45.23%"
            width="75.417%"
            height="54.77%"
            fit="contain"
            sizes="76vw"
          />
        </Stage>

        {/* Wall + tradeshow photos: 628/1440 = 43.611% each, 24px gap */}
        <Row gap="1.667%">
          <ImageMedia
            src={`${IMAGES}/zinio-wall.jpg`}
            alt="Zinio wall installation"
            width="43.611%"
            aspect="628 / 419"
            sizes="44vw"
          />
          <ImageMedia
            src={`${IMAGES}/zinio-tradeshow.jpg`}
            alt="Zinio tradeshow booth"
            width="43.611%"
            aspect="628 / 419"
            sizes="44vw"
          />
        </Row>
      </div>
      </div>

      {/* Mobile: 3 phones row, overlapping landing page, then wall/tradeshow stacked
          full-width (not side-by-side like desktop). Stage is 402 wide / 987 tall
          (section 1043 minus the 56px bar). */}
      <div className="mobile-only">
        <Stage aspect="402 / 987">
          <StageImage src={`${IMAGES}/zinio-1.png`} alt="Zinio app — home" left="4.975%" top="4.053%" width="27.363%" height="20.263%" fit="contain" sizes="28vw" />
          <StageImage src={`${IMAGES}/zinio-2.png`} alt="Zinio app — shop" left="36.318%" top="4.053%" width="27.363%" height="20.263%" fit="contain" sizes="28vw" />
          <StageImage src={`${IMAGES}/zinio-3.png`} alt="Zinio app — reading list" left="67.662%" top="4.053%" width="27.363%" height="20.263%" fit="contain" sizes="28vw" />
          <StageImage src={`${IMAGES}/zinio-win-landing-page.png`} alt="Zinio for Nokia Windows 8 Phone landing page" left="8.458%" top="21.581%" width="83.085%" height="19.858%" fit="contain" sizes="83vw" />
          <StageImage src={`${IMAGES}/zinio-wall.jpg`} alt="Zinio wall installation" left="4.975%" top="44.681%" width="90.05%" height="24.417%" sizes="90vw" />
          <StageImage src={`${IMAGES}/zinio-tradeshow.jpg`} alt="Zinio tradeshow booth" left="4.975%" top="70.719%" width="90.05%" height="24.417%" sizes="90vw" />
        </Stage>
      </div>
    </section>
  );
}
