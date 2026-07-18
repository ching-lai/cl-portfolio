import { ProjectBar } from "@/components/ProjectBar";
import { Row, ImageMedia, Stage, StageImage } from "@/components/media";
import styles from "./section.module.css";

const IMAGES = "/images/mutating-monsters";
const ROWS = [
  [113, 107, 104, 43],
  [109, 85, 108, 110],
];
const MOBILE_MONSTERS = [113, 107, 104, 43, 109, 85];

const INFO = {
  subtitle: "Illustrator",
  body: [
    "I've been drawing monsters for as long as I can remember. This latest monster series started in 2015 and I'm currently on monster 116.",
  ],
  link: { label: "mutatingmonsters.com", href: "https://www.mutatingmonsters.com/" },
};

export function MutatingMonsters() {
  return (
    <section id="mutating-monsters" className={styles.section}>
      <ProjectBar
        title="Personal: Mutating Monsters"
        infoTitle="Mutating Monsters"
        infoContent={INFO}
      />

      <div className="desktop-only">
      <div className={styles.body}>
        <div style={{ display: "flex", flexDirection: "column", gap: "calc(24px * var(--scale-1440))", width: "100%" }}>
          {ROWS.map((row, i) => (
            <Row key={i} gap="calc(24px * var(--scale-1440))">
              {row.map((n) => (
                <ImageMedia
                  key={n}
                  src={`${IMAGES}/monster-${n}.jpg`}
                  alt={`Mutating Monsters drawing ${n}`}
                  width="20.903%"
                  aspect="1 / 1"
                  sizes="21vw"
                />
              ))}
            </Row>
          ))}
        </div>
      </div>
      </div>

      {/* Mobile: 2 columns x 3 rows, showing the first 6 monsters — the Figma mobile
          frame wasn't expanded for 108/110 (desktop is 4x2). Stage is 402 wide / 639
          tall (section 695 minus the 56px bar). */}
      <div className="mobile-only">
        <Stage aspect="402 / 639">
          {MOBILE_MONSTERS.map((n, i) => (
            <StageImage
              key={n}
              src={`${IMAGES}/monster-${n}.jpg`}
              alt={`Mutating Monsters drawing ${n}`}
              left={i % 2 === 0 ? "4.975%" : "51.99%"}
              top={`${6.26 + Math.floor(i / 2) * 29.577}%`}
              width="43.035%"
              height="27.074%"
              sizes="43vw"
            />
          ))}
        </Stage>
      </div>
    </section>
  );
}
