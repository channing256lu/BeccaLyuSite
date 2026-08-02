import type { SiteContent } from "./siteContent";
import { aboutPageData } from "./aboutPageData";
import { contactPageData } from "./contactPageData";
import { evidencePageData } from "./evidencePageData";
import { homePageData } from "./homePageData";
import { philosophyPageData } from "./philosophyPageData";
import { sharedData } from "./sharedData";

export const siteContent = {
  ...sharedData,
  ...homePageData,
  ...aboutPageData,
  ...philosophyPageData,
  ...evidencePageData,
  ...contactPageData,
} satisfies SiteContent;
