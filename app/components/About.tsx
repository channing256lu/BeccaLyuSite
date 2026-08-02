import { BotanicalSprig } from "./BotanicalSprig";
import type { SiteContent } from "../content/siteContent";

type AboutProps = {
  content: SiteContent["about"];
};

export function About({ content }: AboutProps) {
  return (
    <>
      <section id="about" className="section about-section">
        <span className="motion-section-word" aria-hidden="true">
          {content.sectionWord}
        </span>
        <BotanicalSprig className="botanical-sprig-about" />
        <div className="shell about-grid">
          <div className="identity-card">
            <div className="identity-portrait-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="identity-portrait"
                src="/media/becca-lyu-educator-portrait.jpg"
                alt={content.portraitAlt}
                width="1290"
                height="1267"
                loading="eager"
                decoding="async"
              />
              <span className="identity-orbit identity-orbit-one" />
              <span className="identity-orbit identity-orbit-two" />
            </div>
          </div>

          <div className="about-copy">
            <p className="eyebrow">{content.eyebrow}</p>
            <h2>{content.name}</h2>
            <p className="about-lead">{content.lead}</p>
            <div className="about-star-divider" aria-hidden="true">
              <span>✦</span>
              <span>✦</span>
              <span>✦</span>
            </div>
            <p>{content.intro}</p>
            <p className="about-opportunities">
              {content.opportunityLine1}
              <br />
              {content.opportunityLine2}
            </p>

            <div className="about-contact">
              <a href={`mailto:${content.email}`}>{content.email}</a>
              <span>{content.location}</span>
              <a href="/media/becca-lyu-cv.pdf" download>
                {content.cvLabel}
              </a>
            </div>

            <div className="stats" aria-label={content.statsLabel}>
              {content.stats.map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="why-i-teach" className="section why-teach-section">
        <span className="motion-section-word" aria-hidden="true">
          {content.why.sectionWord}
        </span>
        <div className="shell why-teach-inner">
          <header className="why-teach-heading">
            <div>
              <p className="eyebrow">{content.why.eyebrow}</p>
              <h2>
                {content.why.titleBeforeBreak}
                <br />
                {content.why.titleAfterBreakBeforeEmphasis}{" "}
                <em>{content.why.titleEmphasis}</em>
              </h2>
            </div>
          </header>

          <div className="story-grid">
            {content.why.chapters.map((chapter, index) => (
              <article
                className={`story-chapter ${
                  index === 0
                    ? "story-chapter-origin"
                    : index === 2
                      ? "story-chapter-today"
                      : index === 3
                        ? "story-chapter-forward"
                        : ""
                }`}
                key={chapter.index}
              >
                <h3 className="story-chapter-title">
                  <span className="story-chapter-index">{chapter.index}</span>
                  <span>{chapter.title}</span>
                </h3>
                {chapter.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
