import { BorderGlow } from "../components/BorderGlow";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Evidence } from "../components/Evidence";
import { professionalPracticeEvidence } from "../content/professionalPracticeData";
import { MotionDirector } from "../components/MotionDirector";
import { getSiteContent } from "../content/getSiteContent";

export default function EvidencePage() {
  const content = getSiteContent();
  const professionalPracticeSummaries = professionalPracticeEvidence.map(
    (item) => ({
      id: item.id,
      slug: item.slug,
      number: item.number,
      fileName: item.fileName,
      title: item.title,
      subtitle: item.subtitle,
      standards: item.standards,
      assetCount: item.assetCount,
      imageCount: item.imageCount,
      pdfCount: item.pdfCount,
    }),
  );

  return (
    <>
      <MotionDirector />
      <BorderGlow />
      <main className="route-main route-content route-enter">
        <ErrorBoundary>
          <Evidence
            content={content.evidence}
            professionalPractice={professionalPracticeSummaries}
          />
        </ErrorBoundary>
      </main>
    </>
  );
}
