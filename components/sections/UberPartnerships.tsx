"use client";

import Image from "next/image";
import { ProjectBar } from "@/components/ProjectBar";
import { useTheme } from "@/lib/theme";
import styles from "./section.module.css";
import logoStyles from "./UberPartnerships.module.css";

const IMAGES = "/images/uber-partnerships";

// Plain variants for the dark site; -dark variants (visually darker marks) are used
// on the light theme instead, since they're the ones that read against a light bg.
const LOGOS = [
  { name: "google", width: 144, height: 49 },
  { name: "apple", width: 55, height: 66 },
  { name: "amex", width: 155, height: 42 },
  { name: "paytm", width: 132, height: 44 },
  { name: "visa", width: 116, height: 41 },
  { name: "united", width: 198, height: 37 },
  { name: "facebook", width: 177, height: 37 },
  { name: "spotify", width: 170, height: 51 },
  { name: "reserve", width: 169, height: 26 },
  { name: "opentable", width: 194, height: 45 },
  { name: "walmart", width: 180, height: 42 },
  { name: "samsung", width: 179, height: 27 },
  { name: "topps", width: 118, height: 56 },
  { name: "microsoft", width: 180, height: 39 },
  { name: "barclays", width: 179, height: 30 },
  { name: "hilton", width: 131, height: 49 },
  { name: "foursquare", width: 191, height: 24 },
  { name: "capone", width: 160, height: 57 },
  { name: "baidu", width: 152, height: 52 },
];

export function UberPartnerships() {
  const { theme } = useTheme();
  const suffix = theme === "light" ? "-dark" : "";

  return (
    <section id="uber-partnerships" className={styles.section}>
      <ProjectBar title="Uber Partnerships" info={false} />
      <div className={`inset ${logoStyles.wrap}`}>
        <p className={styles.blurb}>Here is a selection of partnerships I worked on.</p>
        <div className={logoStyles.logos}>
          {LOGOS.map((logo) => (
            <div key={logo.name} className={logoStyles.cell}>
              <Image
                src={`${IMAGES}/${logo.name}${suffix}.png`}
                alt={logo.name}
                width={logo.width}
                height={logo.height}
                sizes="20vw"
                className={`${logoStyles.logo}${logo.name === "apple" ? ` ${logoStyles.apple}` : ""}`}
                style={{ objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
