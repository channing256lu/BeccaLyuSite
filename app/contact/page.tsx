import { BorderGlow } from "../components/BorderGlow";
import { Contact } from "../components/Contact";
import { MotionDirector } from "../components/MotionDirector";
import { getSiteContent } from "../content/getSiteContent";

export default function ContactPage() {
  const content = getSiteContent();

  return (
    <>
      <MotionDirector />
      <BorderGlow />
      <main className="route-main route-contact route-enter">
        <Contact content={content.contact} />
      </main>
    </>
  );
}
