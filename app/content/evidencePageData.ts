import type { SiteContent } from "./siteContent";

export const evidencePageData = {
  "evidence": {
    "sectionWord": "Evidence",
    "eyebrow": "APST Evidence",
    "title": "Practice, made accountable.",
    "summary": "A growing evidence map connecting professional knowledge, teaching decisions and reflective engagement to the Australian Professional Standards for Teachers.",
    "folderCaptionTitle": "One evidence collection",
    "folderCaptionCopy": "Open the folder to reveal the three professional domains.",
    "folderLabel": "APST evidence collection",
    "folderInstruction": "Open the folder · choose a card to jump to its evidence",
    "categories": [
      {
        "id": "professional-knowledge",
        "number": "01",
        "title": "Professional Knowledge",
        "standards": "APST 1–2",
        "copy": "Knowing children, how they learn, and the content and teaching strategies that make learning meaningful."
      },
      {
        "id": "professional-practice",
        "number": "02",
        "title": "Professional Practice",
        "standards": "APST 3–5",
        "copy": "Planning, creating safe learning environments, teaching responsively and assessing learning with purpose."
      },
      {
        "id": "professional-engagement",
        "number": "03",
        "title": "Professional Engagement",
        "standards": "APST 6–7",
        "copy": "Learning professionally and engaging respectfully with colleagues, families and the wider community."
      }
    ],
    "galleryItems": [
      "APST 1 · Know learners",
      "APST 2 · Know content",
      "APST 3 · From Story to Inquiry",
      "APST 4 · Safe environments",
      "APST 5 · Assess learning",
      "APST 6 · Professional learning",
      "APST 7 · Engage communities"
    ]
  }
} satisfies Pick<SiteContent, "evidence">;
