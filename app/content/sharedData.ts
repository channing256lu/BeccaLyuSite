import type { SiteContent } from "./siteContent";

export const sharedData = {
  "metadata": {
    "title": "Becca Lyu | Early Childhood Educator",
    "description": "Early Childhood Educator and Graduate ECT in South Australia. Play-based, child-centred and reflective practice across birth to eight.",
    "ogDescription": "Every child deserves to feel seen.",
    "ogAlt": "Becca Lyu — Every child deserves to feel seen.",
    "personName": "Becca Lyu",
    "jobTitle": "Early Childhood Educator",
    "knowsAbout": [
      "Early Childhood Education",
      "Play-based Learning",
      "Child Development",
      "Australian Professional Standards for Teachers"
    ]
  },
  "nav": {
    "brandInitials": "BL",
    "brandName": "Becca Lyu",
    "homeLabel": "Becca Lyu home",
    "links": [
      {
        "href": "/about",
        "label": "About Me",
        "submenu": [
          {
            "href": "/about#why-i-teach",
            "label": "Why I Teach"
          },
          {
            "href": "/about#experience",
            "label": "Education & Professional Journey"
          },
          {
            "href": "/about#strengths",
            "label": "My Qualities and Strengths"
          },
          {
            "href": "/about#professional-toolkit",
            "label": "Professional Toolkit"
          }
        ]
      },
      {
        "href": "/philosophy",
        "label": "Teaching Philosophy"
      },
      {
        "href": "/evidence",
        "label": "APST Evidence",
        "submenu": [
          {
            "href": "/evidence#professional-knowledge",
            "label": "Professional Knowledge"
          },
          {
            "href": "/evidence#professional-practice",
            "label": "Professional Practice"
          },
          {
            "href": "/evidence#professional-engagement",
            "label": "Professional Engagement"
          }
        ]
      },
      {
        "href": "/contact",
        "label": "Contact Me"
      }
    ]
  },
  "opening": {
    "kicker": "Early childhood educator · Portfolio",
    "firstName": "Becca",
    "lastName": "Lyu",
    "meta": [
      "South Australia",
      "Care · Curiosity · Belonging",
      "2026"
    ]
  },
  "footer": {
    "copyrightName": "Becca Lyu",
    "tagline": "Early Childhood Educator · Graduate ECT",
    "visualCreditPrefix": "Initial concept visuals from",
    "visualCreditMiddle": "and",
    "pexelsLabel": "Pexels",
    "unsplashLabel": "Unsplash"
  }
} satisfies Pick<SiteContent, "metadata" | "nav" | "opening" | "footer">;
