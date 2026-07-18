import { ProjectBar } from "@/components/ProjectBar";
import { Row, ImageMedia, Stage, StageImage } from "@/components/media";
import styles from "./section.module.css";

const IMAGES = "/images/leaflink-api-int";

const INFO = {
  subtitle: "Senior Product Designer",
  body: [
    "As the founding designer for LeafLink's API & Integrations team, I led the design of the company's developer platform and integration ecosystem. I designed the self-service application management experience, developer onboarding flows, CSV import/export tooling, and integrations with industry-critical systems such as Metrc. My work helped extend LeafLink beyond a marketplace into a connected platform serving more than 12,000 cannabis businesses and over $5B in annual transaction volume.",
  ],
  rolesLeft: ["UX Design", "Visual Design", "Prototyping"],
  rolesRight: [],
};

export function LeafLinkApiIntegrations() {
  return (
    <section id="leaflink-api-integrations" className={styles.section}>
      <ProjectBar title="LeafLink API & Integrations" infoContent={INFO} />

      <div className="desktop-only">
      <div className={styles.body}>
        {/* iPad+phone composites: 493/1440 = 34.236% each, gap 159px = 11.042% */}
        <Row gap="11.042%">
          <ImageMedia
            src={`${IMAGES}/ll-api.png`}
            alt="LeafLink API on iPad and phone"
            width="34.236%"
            aspect="986 / 1204"
            fit="contain"
            sizes="35vw"
          />
          <ImageMedia
            src={`${IMAGES}/ll-int.png`}
            alt="LeafLink Integrations on iPad and phone"
            width="34.236%"
            aspect="986 / 1204"
            fit="contain"
            sizes="35vw"
          />
        </Row>
      </div>
      </div>

      {/* Mobile: same two composites, smaller, side by side. Stage is 402 wide / 270
          tall (section 326 minus the 56px bar). */}
      <div className="mobile-only">
        <Stage aspect="402 / 270">
          <StageImage src={`${IMAGES}/ll-api.png`} alt="LeafLink API on iPad and phone" left="8.706%" top="14.815%" width="36.872%" height="67.038%" fit="contain" sizes="37vw" />
          <StageImage src={`${IMAGES}/ll-int.png`} alt="LeafLink Integrations on iPad and phone" left="55.473%" top="14.815%" width="37.064%" height="67.387%" fit="contain" sizes="37vw" />
        </Stage>
      </div>
    </section>
  );
}
