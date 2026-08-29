import { SOCIAL_LINKS } from "@/lib/social-links";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={`inset ${styles.footer}`}>
      <div className={styles.links}>
        <a
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.link} draw-underline`}
          data-label="LinkedIn"
          aria-label="LinkedIn"
        >
          LinkedIn
        </a>
        <a
          href={SOCIAL_LINKS.x}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.link} draw-underline`}
          data-label="X"
          aria-label="X"
        >
          X
        </a>
      </div>
    </footer>
  );
}
