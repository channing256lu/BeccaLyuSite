import { BotanicalSprig } from "./BotanicalSprig";
import { ContactActions } from "./ContactActions";
import type { SiteContent } from "../content/siteContent";

type ContactProps = {
  content: SiteContent["contact"];
};

function renderContactParagraph(paragraph: string) {
  return paragraph.split(/(\(ECT\)|2027)/).map((part) => {
    if (part === "(ECT)") {
      return (
        <span key={part}>
          (<strong>ECT</strong>)
        </span>
      );
    }

    if (part === "2027") {
      return <strong key={part}>{part}</strong>;
    }

    return part;
  });
}

export function Contact({ content }: ContactProps) {
  return (
    <section id="contact" className="contact-section">
      <span className="motion-section-word" aria-hidden="true">
        {content.sectionWord}
      </span>
      <div className="contact-shape contact-shape-one" />
      <div className="contact-shape contact-shape-two" />
      <BotanicalSprig className="botanical-sprig-contact" />
      <div className="shell contact-inner">
        <h2>
          {content.titleLine1}
          <br />
          {content.titleLine2BeforeEmphasis}{" "}
          <em>{content.titleEmphasis}</em> {content.titleLine2AfterEmphasis}
        </h2>
        <div className="contact-copy-group">
          {content.copy.map((paragraph) => (
            <p className="contact-copy" key={paragraph}>
              {renderContactParagraph(paragraph)}
            </p>
          ))}
        </div>
        <a
          className="contact-email"
          href={`mailto:${content.email}`}
          aria-label="Email Becca Lyu"
        >
          {content.email}
        </a>
        <ContactActions content={content} />

        <div className="contact-meta">
          {content.meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
