import { notFound } from "next/navigation";
import { BorderGlow } from "../../../components/BorderGlow";
import { ErrorBoundary } from "../../../components/ErrorBoundary";
import { ProfessionalPracticeEvidenceArticle } from "../../../components/ProfessionalPracticeEvidenceArticle";
import {
  getProfessionalKnowledgeEvidence,
  professionalKnowledgeEvidence,
} from "../../../content/professionalKnowledgeData";

type ProfessionalKnowledgeEvidencePageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return professionalKnowledgeEvidence.map((item) => ({
    slug: item.slug,
  }));
}

export default function ProfessionalKnowledgeEvidencePage({
  params,
}: ProfessionalKnowledgeEvidencePageProps) {
  const evidence = getProfessionalKnowledgeEvidence(params.slug);

  if (!evidence) {
    notFound();
  }

  return (
    <>
      <BorderGlow />
      <main className="route-main route-content route-enter">
        <ErrorBoundary>
          <ProfessionalPracticeEvidenceArticle
            backHref="/evidence#professional-knowledge-evidence"
            evidence={evidence}
            pdfPreviewPath="/evidence/professional-knowledge/pdf-preview"
          />
        </ErrorBoundary>
      </main>
    </>
  );
}
