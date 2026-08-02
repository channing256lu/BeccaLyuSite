import type { SiteContent } from "./siteContent";

export const homePageData = {
  "hero": {
    "eyebrowBefore": "Early Childhood Educator",
    "eyebrowAfter": "Graduate ECT",
    "titleLine1": "Every child deserves",
    "titleLine2Before": "to feel",
    "titleLine2Emphasis": "seen.",
    "welcome": "welcome to my page.",
    "practiceButton": "Explore my practice",
    "connectLink": "Let's connect"
  }
} satisfies Pick<SiteContent, "hero">;
