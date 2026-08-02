export type NavLink = {
  href: string;
  label: string;
  submenu?: {
    href: string;
    label: string;
  }[];
};

export type SiteContent = {
  metadata: {
    title: string;
    description: string;
    ogDescription: string;
    ogAlt: string;
    personName: string;
    jobTitle: string;
    knowsAbout: string[];
  };
  nav: {
    brandInitials: string;
    brandName: string;
    homeLabel: string;
    links: NavLink[];
  };
  opening: {
    kicker: string;
    firstName: string;
    lastName: string;
    meta: string[];
  };
  hero: {
    eyebrowBefore: string;
    eyebrowAfter: string;
    titleLine1: string;
    titleLine2Before: string;
    titleLine2Emphasis: string;
    welcome: string;
    practiceButton: string;
    connectLink: string;
  };
  about: {
    sectionWord: string;
    portraitAlt: string;
    eyebrow: string;
    name: string;
    lead: string;
    intro: string;
    opportunityLine1: string;
    opportunityLine2: string;
    email: string;
    location: string;
    cvLabel: string;
    statsLabel: string;
    stats: { value: string; label: string }[];
    why: {
      sectionWord: string;
      eyebrow: string;
      titleBeforeBreak: string;
      titleAfterBreakBeforeEmphasis: string;
      titleEmphasis: string;
      chapters: {
        index: string;
        title: string;
        paragraphs: string[];
      }[];
    };
  };
  experience: {
    sectionWord: string;
    eyebrow: string;
    title: string;
    intro: string[];
    instruction: string;
    items: {
      period: string;
      year: string;
      label: string;
      role: string;
      place: string;
      cohort: string;
      detail: string;
    }[];
  };
  strengths: {
    sectionWord: string;
    eyebrow: string;
    title: string;
    intro: string;
    qualitiesLabel: string;
    qualities: {
      number: string;
      title: string;
      copy: string;
    }[];
    coreHeading: string;
    coreSubheading: string;
    coreStrengths: {
      number: string;
      title: string;
      subtitle: string;
      copy: string;
      keywords: string[];
    }[];
    toolkitEyebrow: string;
    toolkitTitle: string;
    toolkitIntro: string;
    professionalTitle: string;
    professionalSkills: { label: string; href: string }[];
    professionalNote: string;
    digitalTitle: string;
    digitalSkills: string[];
    credentialsTitle: string;
    qualificationLabel: string;
    qualification: string;
    qualificationMeta: string;
    credentials: string[];
  };
  evidence: {
    sectionWord: string;
    eyebrow: string;
    title: string;
    summary: string;
    folderCaptionTitle: string;
    folderCaptionCopy: string;
    folderLabel: string;
    folderInstruction: string;
    categories: {
      id: string;
      number: string;
      title: string;
      standards: string;
      copy: string;
    }[];
    galleryItems: string[];
  };
  philosophy: {
    navigation: string[];
    heroKicker: string;
    heroTitleLine1: string;
    heroTitleLine2: string;
    heroSubtitle: string;
    heroIntro: string;
    scrollLabel: string;
    principlesTitle: string;
    principles: {
      title: string;
      keywords: string;
      accent: string;
    }[];
    growthKicker: string;
    growthTitle: string;
    growthStatement: string;
    growthReference: string;
    developmentTitle: string;
    rosePremise: string;
    roseComparison: string[];
    roseLanguages: string;
    roseHighlight: string;
    growthStages: string[];
    roleTitle: string;
    roleStatement: string;
    metaphorTrail: string[];
    knowingTitle: string;
    knowingSubtitle: string;
    knowingLede: string;
    knowingParagraphs: string[];
    educationReference: string;
    conditionsTitle: string;
    conditionsParagraphs: string[];
    conditionsHighlight: string;
    quoteKicker: string;
    quote: string;
    quoteAuthor: string;
    scaffoldingTitle: string;
    scaffoldingDeck: string;
    scaffoldingParagraphs: string[];
    learningTitle: string;
    learningStatement: string;
    timelineTitle: string;
    timelineDeck: string;
    timelineParagraphs: string[];
    assessmentNote: string;
    timelineInstruction: string;
    evidenceTimeline: {
      label: string;
      artifact: string;
      detail: string;
    }[];
    viewEvidenceLabel: string;
    feedbackKicker: string;
    feedbackTitle: string;
    feedbackParagraphs: string[];
    feedbackReference: string;
    feedbackBeforeTitle: string;
    feedbackBeforeQuote: string;
    feedbackBeforeSmall: string;
    feedbackAfterTitle: string;
    feedbackAfterQuote: string;
    feedbackAfterSmall: string;
    codaKicker: string;
    codaTitle: string;
    codaCopy: string;
    codaWords: string[];
    continueLabel: string;
  };
  contact: {
    sectionWord: string;
    titleLine1: string;
    titleLine2BeforeEmphasis: string;
    titleEmphasis: string;
    titleLine2AfterEmphasis: string;
    copy: string[];
    email: string;
    copyEmailLabel: string;
    copiedLabel: string;
    tryAgainLabel: string;
    copySuccess: string;
    copyError: string;
    cvLabel: string;
    meta: string[];
  };
  footer: {
    copyrightName: string;
    tagline: string;
    visualCreditPrefix: string;
    visualCreditMiddle: string;
    pexelsLabel: string;
    unsplashLabel: string;
  };
};
