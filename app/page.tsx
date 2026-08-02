import { BorderGlow } from "./components/BorderGlow";
import { Hero } from "./components/Hero";
import { MotionDirector } from "./components/MotionDirector";
import { getSiteContent } from "./content/getSiteContent";

export default function Home() {
  const content = getSiteContent();

  return (
    <>
      <MotionDirector opening content={content.opening} />
      <BorderGlow />
      <main className="route-main route-home route-enter">
        <Hero content={content.hero} />
      </main>
    </>
  );
}
