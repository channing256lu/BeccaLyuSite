import { PhilosophyStory } from "../components/PhilosophyStory";
import { getSiteContent } from "../content/getSiteContent";

export default function PhilosophyPage() {
  const content = getSiteContent();

  return (
    <main className="route-main route-content route-enter philosophy-route">
      <PhilosophyStory content={content.philosophy} />
    </main>
  );
}
