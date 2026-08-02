import Link from "next/link";
import type { SiteContent } from "../content/siteContent";

type HeroProps = {
  content: SiteContent["hero"];
};

export function Hero({ content }: HeroProps) {
  return (
    <section id="home" className="hero">
      <div className="shell hero-content">
        <p className="eyebrow hero-eyebrow">
          {content.eyebrowBefore} <span>•</span> {content.eyebrowAfter}
        </p>
        <h1>
          <span className="hero-title-line">
            <span className="hero-title-line-inner">
              {content.titleLine1}
            </span>
          </span>
          <span className="hero-title-line">
            <span className="hero-title-line-inner">
              {content.titleLine2Before} <em>{content.titleLine2Emphasis}</em>
            </span>
          </span>
        </h1>
        <p
          className="hero-welcome t-stagger"
          aria-label={content.welcome}
        >
          <span className="hero-welcome-message t-stagger-line t-stagger-line--1">
            {content.welcome}
          </span>
        </p>
        <div className="hero-actions">
          <Link href="/philosophy#principles" className="button button-light">
            {content.practiceButton}
            <span aria-hidden="true">↓</span>
          </Link>
          <Link href="/contact" className="text-link text-link-light">
            {content.connectLink} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
