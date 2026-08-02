import { notFound } from "next/navigation";
import { BorderGlow } from "../../../components/BorderGlow";
import { ErrorBoundary } from "../../../components/ErrorBoundary";
import { ProfessionalPracticeEvidenceArticle } from "../../../components/ProfessionalPracticeEvidenceArticle";
import {
  getProfessionalPracticeEvidence,
  professionalPracticeEvidence,
} from "../../../content/professionalPracticeData";

type ProfessionalPracticeEvidencePageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return professionalPracticeEvidence.map((item) => ({
    slug: item.slug,
  }));
}

export default function ProfessionalPracticeEvidencePage({
  params,
}: ProfessionalPracticeEvidencePageProps) {
  const evidence = getProfessionalPracticeEvidence(params.slug);

  if (!evidence) {
    notFound();
  }

  return (
    <>
      <BorderGlow />
      <main className="route-main route-content route-enter">
        <ErrorBoundary>
          <ProfessionalPracticeEvidenceArticle evidence={evidence} />
        </ErrorBoundary>
      </main>
    </>
  );
}

