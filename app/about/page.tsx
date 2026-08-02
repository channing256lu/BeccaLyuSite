import { About } from "../components/About";
import { BorderGlow } from "../components/BorderGlow";
import { Experience } from "../components/Experience";
import { MotionDirector } from "../components/MotionDirector";
import { Strengths } from "../components/Strengths";
import { getSiteContent } from "../content/getSiteContent";

export default function AboutPage() {
  const content = getSiteContent();

  return (
    <>
      <MotionDirector />
      <BorderGlow />
      <main className="route-main route-content route-enter">
        <About content={content.about} />
        <Experience content={content.experience} />
        <Strengths content={content.strengths} />
      </main>
    </>
  );
}
