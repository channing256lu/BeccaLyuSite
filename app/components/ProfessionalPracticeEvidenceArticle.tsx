import Link from "next/link";
import type { ReactNode } from "react";
import type { ProfessionalPracticeEvidence } from "../content/professionalPracticeData";

type ProfessionalPracticeEvidenceArticleProps = {
  evidence: EvidenceArticleData;
  backHref?: string;
  pdfPreviewPath?: string;
};

type EvidenceArticleData = Pick<
  ProfessionalPracticeEvidence,
  "title" | "subtitle" | "standards" | "markdown"
>;

type MarkdownSegment = {
  text: string;
  href?: string;
};

const markdownLinkPattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
const standaloneLinkPattern =
  /^(?:#{1,4}\s*)?(?:📎\s*)?\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/;

function isImageUrl(url: string) {
  return /\.(png|jpe?g|webp|gif)$/i.test(url);
}

function isPdfUrl(url: string) {
  return /\.pdf$/i.test(url);
}

function getPdfPreviewHref(title: string, url: string, pdfPreviewPath: string) {
  const params = new URLSearchParams({
    title,
    src: url,
  });

  return `${pdfPreviewPath}?${params.toString()}`;
}

function splitMarkdownSegments(text: string): MarkdownSegment[] {
  const segments: MarkdownSegment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(markdownLinkPattern)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      segments.push({ text: text.slice(cursor, index) });
    }

    segments.push({
      text: match[1],
      href: match[2],
    });
    cursor = index + match[0].length;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor) });
  }

  return segments.length > 0 ? segments : [{ text }];
}

function renderInlineText(text: string, pdfPreviewPath: string): ReactNode[] {
  return splitMarkdownSegments(text).map((segment, index) => {
    if (!segment.href) {
      return <span key={`${segment.text}-${index}`}>{segment.text}</span>;
    }

    if (isPdfUrl(segment.href)) {
      return (
        <Link
          className="professional-practice-inline-link"
          href={getPdfPreviewHref(segment.text, segment.href, pdfPreviewPath)}
          key={`${segment.href}-${index}`}
          target="_blank"
        >
          {segment.text}
        </Link>
      );
    }

    return (
      <a
        className="professional-practice-inline-link"
        href={segment.href}
        key={`${segment.href}-${index}`}
        rel="noreferrer"
        target="_blank"
      >
        {segment.text}
      </a>
    );
  });
}

function renderAssetBlock(
  label: string,
  url: string,
  key: string,
  pdfPreviewPath: string,
) {
  if (isImageUrl(url)) {
    return (
      <figure className="professional-practice-figure" key={key}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={label} src={url} />
        <figcaption>{label}</figcaption>
      </figure>
    );
  }

  if (isPdfUrl(url)) {
    return (
      <div className="professional-practice-pdf-card" key={key}>
        <span>PDF evidence</span>
        <p>{label}</p>
        <Link
          href={getPdfPreviewHref(label, url, pdfPreviewPath)}
          target="_blank"
        >
          Preview PDF
        </Link>
      </div>
    );
  }

  return (
    <p key={key}>
      <a href={url} rel="noreferrer" target="_blank">
        {label}
      </a>
    </p>
  );
}

function renderMarkdown(markdown: string, pdfPreviewPath: string) {
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let skippedTitle = false;

  const flushParagraph = () => {
    if (paragraph.length === 0) {
      return;
    }

    const text = paragraph.join(" ");
    blocks.push(
      <p key={`p-${blocks.length}`}>
        {renderInlineText(text, pdfPreviewPath)}
      </p>,
    );
    paragraph = [];
  };

  markdown.split("\n").forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("<!--")) {
      flushParagraph();
      return;
    }

    const standaloneLink = trimmed.match(standaloneLinkPattern);
    if (standaloneLink) {
      flushParagraph();
      blocks.push(
        renderAssetBlock(
          standaloneLink[1],
          standaloneLink[2],
          `asset-${blocks.length}`,
          pdfPreviewPath,
        ),
      );
      return;
    }

    const heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      const level = Math.min(heading[1].length, 4);
      const text = heading[2];

      if (level === 1 && !skippedTitle) {
        skippedTitle = true;
        return;
      }

      if (level === 1 || level === 2) {
        blocks.push(
          <h2 key={`h-${blocks.length}`}>
            {renderInlineText(text, pdfPreviewPath)}
          </h2>,
        );
        return;
      }

      blocks.push(
        <h3 key={`h-${blocks.length}`}>
          {renderInlineText(text, pdfPreviewPath)}
        </h3>,
      );
      return;
    }

    paragraph.push(trimmed);
  });

  flushParagraph();
  return blocks;
}

export function ProfessionalPracticeEvidenceArticle({
  evidence,
  backHref = "/evidence#professional-practice-evidence",
  pdfPreviewPath = "/evidence/professional-practice/pdf-preview",
}: ProfessionalPracticeEvidenceArticleProps) {
  return (
    <article className="professional-practice-detail">
      <header className="professional-practice-detail-hero">
        <Link href={backHref}>Back to APST evidence</Link>
        <p>{evidence.standards.join(" · ")}</p>
        <h1>{evidence.title}</h1>
        {evidence.subtitle ? <span>{evidence.subtitle}</span> : null}
      </header>

      <div className="professional-practice-detail-body">
        {renderMarkdown(evidence.markdown, pdfPreviewPath)}
      </div>

      <footer className="professional-practice-detail-footer">
        <Link className="professional-practice-back-button" href={backHref}>
          Back
        </Link>
      </footer>
    </article>
  );
}
