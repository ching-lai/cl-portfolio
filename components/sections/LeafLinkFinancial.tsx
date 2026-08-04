import Image from "next/image";
import { ProjectBar } from "@/components/ProjectBar";
import { Row, ImageMedia, Stage, StageImage, IMAGE_QUALITY } from "@/components/media";
import styles from "./section.module.css";
import llf from "./LeafLinkFinancial.module.css";

const IMAGES = "/images/leaflink-financial";

const INFO = {
  subtitle: "Senior Product Designer",
  body: [
    "LeafLink is a B2B marketplace that provides order management, financial, and logistics solutions to licensed cannabis businesses. As the founding product designer for LeafLink Financial, I defined and launched the first user experiences for the company's lending, credit, and B2B payments products, establishing the design foundation for a new fintech business. I helped scale financial services into LeafLink's largest revenue-generating business line.",
  ],
  rolesLeft: ["UX Design", "Visual Design", "Data Visualization"],
  rolesRight: ["Prototyping", "Illustration"],
};

export function LeafLinkFinancial() {
  return (
    <section id="leaflink-financial" className={styles.section}>
      <ProjectBar title="LeafLink Financial" infoContent={INFO} />

      <div className="desktop-only">
      <div className={styles.body}>
        <div className={llf.groups}>
          <div className={llf.group}>
            <p className={styles.caption}>Buyer Dashboard</p>
            <div className={llf.frame}>
              <Image
                src={`${IMAGES}/llf-buyer-dashboard.png`}
                alt="LeafLink Financial buyer dashboard on laptop and phone"
                fill
                sizes="44vw"
                quality={IMAGE_QUALITY}
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
          <div className={llf.group}>
            <p className={styles.caption}>Seller Dashboard</p>
            <div className={llf.frame}>
              <Image
                src={`${IMAGES}/llf-seller-dashboard.png`}
                alt="LeafLink Financial seller dashboard on laptop and phone"
                fill
                sizes="44vw"
                quality={IMAGE_QUALITY}
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>

        {/* Onboarding: 335/1440 = 23.264%, gap 99px = 6.875% */}
        <Row gap="6.875%">
          {[1, 2, 3].map((n) => (
            <ImageMedia
              key={n}
              src={`${IMAGES}/llf-seller-onboarding-${n}.jpg`}
              alt={`LeafLink Financial seller onboarding step ${n}`}
              width="23.264%"
              aspect="335 / 276"
              sizes="24vw"
            />
          ))}
        </Row>
      </div>
      </div>

      {/* Mobile: buyer/seller dashboards side by side (smaller) + 3 onboarding shots
          offset below. Stage is 402 wide / 548 tall (section 604 minus the 56px bar). */}
      <div className="mobile-only">
        <Stage aspect="402 / 548">
          <div className={styles.placed} style={{ left: "4.975%", top: "7.299%", width: "43.065%" }}>
            <p className={styles.caption}>Buyer Dashboard</p>
          </div>
          <div className={styles.placed} style={{ left: "51.99%", top: "7.299%", width: "43.065%" }}>
            <p className={styles.caption}>Seller Dashboard</p>
          </div>
          <StageImage src={`${IMAGES}/llf-buyer-dashboard.png`} alt="LeafLink Financial buyer dashboard on laptop and phone" left="4.975%" top="17.701%" width="43.065%" height="25.73%" fit="contain" sizes="44vw" />
          <StageImage src={`${IMAGES}/llf-seller-dashboard.png`} alt="LeafLink Financial seller dashboard on laptop and phone" left="51.99%" top="17.701%" width="43.065%" height="25.73%" fit="contain" sizes="44vw" />
          <StageImage src={`${IMAGES}/llf-seller-onboarding-1.jpg`} alt="LeafLink Financial seller onboarding step 1" left="10.448%" top="46.35%" width="32.338%" height="19.526%" sizes="33vw" />
          <StageImage src={`${IMAGES}/llf-seller-onboarding-2.jpg`} alt="LeafLink Financial seller onboarding step 2" left="57.463%" top="46.35%" width="32.338%" height="19.526%" sizes="33vw" />
          <StageImage src={`${IMAGES}/llf-seller-onboarding-3.jpg`} alt="LeafLink Financial seller onboarding step 3" left="33.831%" top="71.715%" width="32.338%" height="19.526%" sizes="33vw" />
        </Stage>
      </div>
    </section>
  );
}
