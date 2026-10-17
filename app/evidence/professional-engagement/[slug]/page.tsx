import { notFound } from "next/navigation";
import { BorderGlow } from "../../../components/BorderGlow";
import { ErrorBoundary } from "../../../components/ErrorBoundary";
import { ProfessionalPracticeEvidenceArticle } from "../../../components/ProfessionalPracticeEvidenceArticle";
import {
  getProfessionalEngagementEvidence,
  professionalEngagementEvidence,
} from "../../../content/professionalEngagementData";

type ProfessionalEngagementEvidencePageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return professionalEngagementEvidence.map((item) => ({
    slug: item.slug,
  }));
}

export default function ProfessionalEngagementEvidencePage({
  params,
}: ProfessionalEngagementEvidencePageProps) {
  const evidence = getProfessionalEngagementEvidence(params.slug);

  if (!evidence) {
    notFound();
  }

  return (
    <>
      <BorderGlow />
      <main className="route-main route-content route-enter">
        <ErrorBoundary>
          <ProfessionalPracticeEvidenceArticle
            backHref="/evidence#professional-engagement-evidence"
            evidence={evidence}
            pdfPreviewPath="/evidence/professional-engagement/pdf-preview"
          />
        </ErrorBoundary>
      </main>
    </>
  );
}
