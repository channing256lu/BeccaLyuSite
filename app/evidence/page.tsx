import { BorderGlow } from "../components/BorderGlow";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Evidence } from "../components/Evidence";
import { MotionDirector } from "../components/MotionDirector";
import { getSiteContent } from "../content/getSiteContent";

export default function EvidencePage() {
  const content = getSiteContent();

  return (
    <>
      <MotionDirector />
      <BorderGlow />
      <main className="route-main route-content route-enter">
        <ErrorBoundary>
          <Evidence content={content.evidence} />
        </ErrorBoundary>
      </main>
    </>
  );
}
