import Link from "next/link";
import type { SiteContent } from "../content/siteContent";

type StrengthsProps = {
  content: SiteContent["strengths"];
};

export function Strengths({ content }: StrengthsProps) {
  return (
    <section id="strengths" className="section strengths-section">
      <span className="motion-section-word" aria-hidden="true">
        {content.sectionWord}
      </span>
      <div className="shell">
        <div className="strengths-intro">
          <p className="eyebrow">{content.eyebrow}</p>
          <h2>{content.title}</h2>
          <p>{content.intro}</p>
        </div>

        <div className="qualities-grid" aria-label={content.qualitiesLabel}>
          {content.qualities.map((quality) => (
            <article className="quality-card" key={quality.title}>
              <span className="quality-index">{quality.number}</span>
              <h3>{quality.title}</h3>
              <p>{quality.copy}</p>
            </article>
          ))}
        </div>

        <div className="core-strengths-heading">
          <h3 className="core-strengths-title">{content.coreHeading}</h3>
          <p>{content.coreSubheading}</p>
        </div>

        <div className="core-strengths-grid">
          {content.coreStrengths.map((strength) => (
            <article className="core-strength-card" key={strength.title}>
              <span className="core-strength-index">{strength.number}</span>
              <div>
                <p>{strength.subtitle}</p>
                <h3>{strength.title}</h3>
                <p>{strength.copy}</p>
                <ul aria-label={`${strength.title} key ideas`}>
                  {strength.keywords.map((keyword) => (
                    <li key={keyword}>{keyword}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div id="professional-toolkit" className="professional-toolkit">
          <header className="toolkit-heading">
            <p className="eyebrow">{content.toolkitEyebrow}</p>
            <h2>{content.toolkitTitle}</h2>
            <p>{content.toolkitIntro}</p>
          </header>

          <div className="toolkit-grid">
            <article className="toolkit-group toolkit-group-professional">
              <div className="toolkit-group-heading">
                <span>01</span>
                <h3>{content.professionalTitle}</h3>
              </div>
              <div className="toolkit-tag-list">
                {content.professionalSkills.map((skill) => (
                  <Link href={skill.href} key={skill.label}>
                    {skill.label}
                    <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
              <p className="toolkit-note">
                {content.professionalNote}
              </p>
            </article>

            <article className="toolkit-group">
              <div className="toolkit-group-heading">
                <span>02</span>
                <h3>{content.digitalTitle}</h3>
              </div>
              <div className="toolkit-tag-list toolkit-tag-list-static">
                {content.digitalSkills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </article>

            <article className="toolkit-group toolkit-group-credentials">
              <div className="toolkit-group-heading">
                <span>03</span>
                <h3>{content.credentialsTitle}</h3>
              </div>
              <div className="qualification-card">
                <span>{content.qualificationLabel}</span>
                <strong>{content.qualification}</strong>
                <small>{content.qualificationMeta}</small>
              </div>
              <div className="credential-list">
                {content.credentials.map((credential) => (
                  <span key={credential}>{credential}</span>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
