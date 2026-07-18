import { ProjectBar } from "@/components/ProjectBar";
import { Row, ImageMedia, VideoMedia, Stage, StageImage, StageVideo } from "@/components/media";
import styles from "./section.module.css";

const IMAGES = "/images/byeeee";

const INFO = {
  subtitle: "Sculpture Street Artist, Photographer",
  body: [
    "Byeeee is a sculpture street art project I started in 2005. I've made thousands in different sizes and materials, and placed them in over 65 cities.",
  ],
  link: { label: "byeeee.com", href: "https://www.byeeee.com/" },
};

export function Byeeee() {
  return (
    <section id="byeeee" className={styles.section}>
      <ProjectBar title="Personal: Byeeee" infoTitle="Byeeee" infoContent={INFO} />

      <div className="desktop-only">
      <div className={styles.body}>
        {/* Row 1: two narrow photos + a wide photo. Row 2: a wide photo + the
            color-cubes video. Horizontal and vertical gaps are both a fixed 24px,
            matching Figma. */}
        <div style={{ display: "flex", flexDirection: "column", gap: "calc(24px * var(--scale-1440))", width: "100%" }}>
          <Row gap="calc(24px * var(--scale-1440))">
            <ImageMedia
              src={`${IMAGES}/bye-tl-stripes.jpg`}
              alt="Byeeee sculpture, striped detail"
              width="20.903%"
              aspect="301 / 439"
              sizes="21vw"
            />
            <ImageMedia
              src={`${IMAGES}/bye-east-village.jpg`}
              alt="Byeeee sculpture, East Village"
              width="20.972%"
              aspect="302 / 439"
              sizes="21vw"
            />
            <ImageMedia
              src={`${IMAGES}/bye-red-hook.jpg`}
              alt="Byeeee sculpture, Red Hook"
              width="43.611%"
              aspect="628 / 439"
              sizes="44vw"
            />
          </Row>
          <Row gap="calc(24px * var(--scale-1440))">
            <ImageMedia
              src={`${IMAGES}/bye-mexico-city.jpg`}
              alt="Byeeee sculpture, Mexico City"
              width="58.681%"
              aspect="845 / 565"
              sizes="59vw"
            />
            <VideoMedia
              src="/videos/byeeee/bye-color-cubes-600.mp4"
              width="28.472%"
              aspect="410 / 564"
              objectPosition="center calc(50% - 13px * var(--scale-1440))"
            />
          </Row>
        </div>
      </div>
      </div>

      {/* Mobile: red-hook full-width, tl-stripes/east-village side by side,
          mexico-city full-width, color-cubes video centered below. Stage is 402 wide
          / 1288 tall (section 1344 minus the 56px bar). */}
      <div className="mobile-only">
        <Stage aspect="402 / 1288">
          <StageImage src={`${IMAGES}/bye-red-hook.jpg`} alt="Byeeee sculpture, Red Hook" left="4.975%" top="3.106%" width="90.05%" height="18.789%" sizes="90vw" />
          <StageImage src={`${IMAGES}/bye-tl-stripes.jpg`} alt="Byeeee sculpture, striped detail" left="4.975%" top="23.137%" width="43.035%" height="18.478%" sizes="43vw" />
          <StageImage src={`${IMAGES}/bye-east-village.jpg`} alt="Byeeee sculpture, East Village" left="51.99%" top="23.137%" width="43.035%" height="18.478%" sizes="43vw" />
          <StageImage src={`${IMAGES}/bye-mexico-city.jpg`} alt="Byeeee sculpture, Mexico City" left="4.975%" top="42.857%" width="90.05%" height="18.789%" sizes="90vw" />
          <StageVideo src="/videos/byeeee/bye-color-cubes-600.mp4" left="22.139%" top="65.373%" width="55.721%" height="30.901%" />
        </Stage>
      </div>
    </section>
  );
}
