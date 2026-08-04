import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const originalHeaderSet = Headers.prototype.set;

Headers.prototype.set = function setHeaderWithEncodedLink(name, value) {
  if (name.toLowerCase() === "link") {
    return originalHeaderSet.call(this, name, encodeURI(value));
  }

  return originalHeaderSet.call(this, name, value);
};

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set(
    "test",
    `${path}-${process.pid}-${Date.now()}-${Math.random()}`,
  );
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function renderHtml(path) {
  const response = await render(path);
  assert.equal(response.status, 200, `${path} should render successfully`);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  return response.text();
}

test("home is a lightweight entry page with route-based navigation", async () => {
  const html = await renderHtml("/");

  assert.match(html, /<title>Becca Lyu \| Early Childhood Educator<\/title>/i);
  assert.match(html, /Every child deserves/);
  assert.match(
    html,
    /hero-welcome-message[\s\S]*welcome to my page\./,
  );
  assert.doesNotMatch(html, /hero-welcome-greeting/);
  assert.doesNotMatch(html, /reliable, reflective and detail-oriented/);
  assert.doesNotMatch(html, /I create calm, play-based environments/);
  assert.match(html, /opening-sequence/);
  assert.match(html, /href="\/about"/);
  assert.match(html, /href="\/philosophy"/);
  assert.match(html, /href="\/evidence"/);
  assert.match(html, /href="\/contact"/);
  assert.match(html, /href="\/about#why-i-teach"/);
  assert.match(html, /href="\/evidence#professional-knowledge"/);
  assert.doesNotMatch(html, /Children aged 0–8/);
  assert.doesNotMatch(html, /English · Mandarin/);
  assert.doesNotMatch(html, /<footer class="site-footer"/);
  assert.doesNotMatch(html, /id="experience"/);
  assert.doesNotMatch(html, /id="evidence"/);
  assert.doesNotMatch(html, /CircularGallery/);
  assert.doesNotMatch(html, /id="contact"/);
  assert.doesNotMatch(html, /Care, curiosity and evidence in equal measure/);
});

test("each portfolio area renders only on its own route", async () => {
  const [
    about,
    philosophy,
    evidence,
    evidenceDetail,
    professionalKnowledgeDetail,
    pdfPreview,
    professionalKnowledgePdfPreview,
    contact,
  ] = await Promise.all([
    renderHtml("/about"),
    renderHtml("/philosophy"),
    renderHtml("/evidence"),
    renderHtml("/evidence/professional-practice/pp-evidence-1"),
    renderHtml("/evidence/professional-knowledge/pk-evidence-1"),
    renderHtml(
      "/evidence/professional-practice/pdf-preview?src=https%3A%2F%2Fpub-0d63e00396f84c818d577fbc98732ebd.r2.dev%2FProfessionalPractice%2FEvidence1%2Ffile%2FFigure1.pdf&title=Figure%201",
    ),
    renderHtml(
      "/evidence/professional-knowledge/pdf-preview?src=https%3A%2F%2Fpub-0d63e00396f84c818d577fbc98732ebd.r2.dev%2FProfessionalKnowledge%2FEvidence1%2Ffiles%2FFigure1.pdf&title=Figure%201",
    ),
    renderHtml("/contact"),
  ]);

  assert.match(about, /ABOUT ME· MEET BECCA/);
  assert.doesNotMatch(about, /Training areas/);
  assert.match(about, /Flinders University/);
  assert.match(about, /becca-lyu-educator-portrait\.jpg/);
  assert.match(
    about,
    /Illustrated portrait of Becca Lyu surrounded by young children/,
  );
  assert.match(about, /Interactive professional experience timeline/);
  assert.match(
    about,
    /Flinders University[\s\S]*Goodwood Primary School/,
  );
  assert.match(
    about,
    /Early Learning Centre[\s\S]*Immanuel Primary School[\s\S]*Coming Soon/,
  );
  assert.match(about, /<span>2026<\/span>[\s\S]*Next chapter/);
  assert.match(about, /Because I was/);
  assert.match(about, /once[\s\S]*<em>seen\.<\/em>/);
  assert.match(about, /Where it all began/);
  assert.match(about, /Passing the light on/);
  assert.match(
    about,
    /story-chapter-index">A<\/span>[\s\S]*<span>Where it all began<\/span>/,
  );
  assert.match(
    about,
    /story-chapter-index">B<\/span>[\s\S]*<span>Passing the light on<\/span>/,
  );
  assert.match(
    about,
    /story-chapter-index">C<\/span>[\s\S]*<span>Today<\/span>/,
  );
  assert.match(
    about,
    /story-chapter-index">D<\/span>[\s\S]*<span>Looking forward<\/span>/,
  );
  assert.doesNotMatch(about, /叫啊叫啊叫/);
  assert.match(about, /My strengths/);
  assert.match(about, /What I Bring to the Classroom/);
  assert.match(about, />Becca Lyu<\/h2>/);
  assert.match(about, /Early Childhood Educator \(Birth–8\)/);
  assert.match(
    about,
    /I(?:&apos;|')m a reliable, reflective and responsive educator/,
  );
  assert.match(about, /Open to opportunities across Australia/);
  assert.match(about, /including regional and remote communities/);
  assert.match(about, /Based in South Australia/);
  assert.match(about, /href="\/media\/becca-lyu-cv\.pdf" download/);
  assert.doesNotMatch(about, /Phone available on request/);
  assert.doesNotMatch(about, /identity-caption/);
  assert.doesNotMatch(about, /Finding belonging/);
  assert.doesNotMatch(
    about,
    /Two strengths shape my teaching and the learning experiences I create/,
  );
  assert.match(about, /My Education and Professional Experience/);
  assert.match(about, /Early Childhood Education/);
  assert.match(about, />B–8<\/strong>/);
  assert.doesNotMatch(about, />0–8<\/strong>/);
  assert.match(
    about,
    /currently studying Early Childhood Education for children from birth to eight years/,
  );
  assert.match(about, /completed two professional placements/);
  assert.match(about, /If you remember one thing about me/);
  assert.match(about, /Reliable &amp; Detail-Oriented/);
  assert.match(about, /Relationship Builder/);
  assert.match(about, /Creative Learning Designer/);
  assert.match(about, /Prepared for thoughtful practice/);
  assert.match(about, /Literacy &amp; Numeracy/);
  assert.match(about, /Digital &amp; Creative Skills/);
  assert.match(about, /Eligible for Teacher Registration/);
  assert.match(about, /href="\/evidence#professional-practice"/);
  assert.match(about, /href="\/evidence#professional-engagement"/);
  assert.match(about, /id="why-i-teach"/);
  assert.match(about, /id="professional-toolkit"/);
  assert.doesNotMatch(about, /Practice, made accountable/);

  assert.match(philosophy, /No Flower[\s\S]*Begins in Bloom/);
  assert.match(philosophy, /A teaching philosophy of growth, belonging and possibility/);
  assert.match(philosophy, /My Core Principles/);
  assert.match(philosophy, /Child-centred/);
  assert.match(philosophy, /Voice · Agency · Belonging/);
  assert.match(philosophy, /Play-based/);
  assert.match(philosophy, /Reggio Emilia-inspired/);
  assert.match(philosophy, /Intentional &amp; Responsive/);
  assert.match(philosophy, /Inclusive &amp; Strengths-based/);
  assert.match(philosophy, /Growth is Development and Ongoing/);
  assert.match(philosophy, /Children’s physical, social, emotional, linguistic and cognitive development/);
  assert.match(philosophy, /ACECQA, 2012, 2024/);
  assert.match(philosophy, /APST 1\.1/);
  assert.match(philosophy, /APST 1\.2/);
  assert.match(philosophy, /APST 1\.5/);
  assert.match(philosophy, /No Flower Must Become a Rose/);
  assert.match(philosophy, /a hundred languages/);
  assert.match(philosophy, /id="role-title"[^>]*>Understanding Growth/);
  assert.match(philosophy, />support</);
  assert.match(philosophy, />assess</);
  assert.doesNotMatch(philosophy, /II · Teacher/);
  assert.match(philosophy, />Knowing Each Child</);
  assert.doesNotMatch(philosophy, /01 · Knowing Each Child/);
  assert.match(philosophy, /Knowing begins with attention, not assumption/);
  assert.doesNotMatch(philosophy, /knowing-each-child-illustration\.jpg/);
  assert.doesNotMatch(philosophy, /Open the observation lens/);
  assert.match(philosophy, /Creating Supportive Conditions/);
  assert.doesNotMatch(philosophy, /02 · Creating Supportive Conditions/);
  assert.doesNotMatch(philosophy, /Conditions make growth possible/);
  assert.match(philosophy, /APST 4\.4/);
  assert.match(philosophy, /If children feel safe/);
  assert.doesNotMatch(philosophy, /exhibition-quote-mark/);
  assert.match(philosophy, /Responsive Scaffolding/);
  assert.doesNotMatch(philosophy, /03 · Responsive Scaffolding/);
  assert.doesNotMatch(philosophy, /exhibition-scaffolding-journey/);
  assert.doesNotMatch(philosophy, /III · Assessment/);
  assert.match(philosophy, /Making Progress Visible/);
  assert.doesNotMatch(philosophy, /01 · Making Progress Visible/);
  assert.match(
    philosophy,
    /Learning becomes visible long before the final bloom/,
  );
  assert.doesNotMatch(philosophy, /See the learning before the bloom/);
  assert.match(philosophy, /Growth Alongside Children/);
  assert.match(philosophy, /href="\/evidence"/);
  assert.doesNotMatch(philosophy, /Teaching portfolio/);
  assert.doesNotMatch(philosophy, /project-card/);
  assert.doesNotMatch(philosophy, /Interactive professional experience timeline/);

  assert.match(evidence, /APST Evidence/);
  assert.doesNotMatch(evidence, /05 · APST Evidence/);
  assert.match(evidence, /Practice, made accountable/);
  assert.match(evidence, /Open APST evidence collection/);
  assert.match(evidence, /Professional Knowledge/);
  assert.match(evidence, /Professional Practice/);
  assert.match(evidence, /Professional Engagement/);
  assert.match(evidence, /Professional Knowledge Evidence/);
  assert.match(evidence, /Following Curiosity Through Sensory Inquiry/);
  assert.match(evidence, /From Story to Curriculum: Integrating Literacy, Numeracy and Inquiry/);
  assert.match(evidence, /href="\/evidence\/professional-knowledge\/pk-evidence-1"/);
  assert.match(evidence, /href="\/evidence\/professional-knowledge\/pk-evidence-2"/);
  assert.match(evidence, /Professional Practice Evidence/);
  assert.match(evidence, /Beyond Behaviour: Understanding the Need Behind the Behaviour/);
  assert.match(evidence, /Assessment-Informed Planning for Individual Progress/);
  assert.match(evidence, /Making Learning Visible Through Assessment/);
  assert.match(evidence, /href="\/evidence\/professional-practice\/pp-evidence-1"/);
  assert.match(evidence, /View evidence page/);
  assert.match(evidence, /id="professional-knowledge"/);
  assert.match(evidence, /id="professional-practice"/);
  assert.match(evidence, /id="professional-engagement"/);
  assert.match(evidence, /id="professional-knowledge-evidence"/);
  assert.match(evidence, /id="professional-practice-evidence"/);
  assert.match(evidence, /evidence-growth-folder-cover\.jpg/);
  assert.match(evidence, /--folder-scale:4\.6/);
  assert.match(
    evidence,
    /<header class="evidence-heading">[\s\S]*?evidence-master-folder-stage[\s\S]*?<\/header>/,
  );
  assert.match(evidence, /choose a card to jump to its evidence/i);
  assert.doesNotMatch(evidence, /Interactive evidence index/);
  assert.doesNotMatch(evidence, /Drag · scroll · arrow keys/);
  assert.doesNotMatch(evidence, /Interactive professional experience timeline/);

  assert.match(evidenceDetail, /Beyond Behaviour: Understanding the Need Behind the Behaviour/);
  assert.match(evidenceDetail, /Figure 1\. Individualised Positive Behaviour Support Plan/);
  assert.match(evidenceDetail, /<img[^>]+Figure 2\. Individual Communication Supports/);
  assert.match(
    evidenceDetail,
    /href="\/evidence\/professional-practice\/pdf-preview\?title=Figure\+1\.[^"]+src=https%3A%2F%2Fpub-0d63e00396f84c818d577fbc98732ebd\.r2\.dev%2FProfessionalPractice%2FEvidence1%2Ffile%2FFigure1\.pdf"/,
  );
  assert.match(
    evidenceDetail,
    /professional-practice-detail-footer[\s\S]*professional-practice-back-button[\s\S]*\/evidence#professional-practice-evidence[\s\S]*Back/,
  );
  assert.doesNotMatch(evidenceDetail, /evidence-preview-modal/);
  assert.match(professionalKnowledgeDetail, /Following Curiosity Through Sensory Inquiry/);
  assert.match(professionalKnowledgeDetail, /Figure 2\. Learning Story documenting the Bee Sensory Inquiry/);
  assert.match(
    professionalKnowledgeDetail,
    /<img[^>]+Figure 2\. Learning Story documenting the Bee Sensory Inquiry/,
  );
  assert.match(
    professionalKnowledgeDetail,
    /href="\/evidence\/professional-knowledge\/pdf-preview\?title=Figure\+1\.[^"]+src=https%3A%2F%2Fpub-0d63e00396f84c818d577fbc98732ebd\.r2\.dev%2FProfessionalKnowledge%2FEvidence1%2Ffiles%2FFigure1\.pdf"/,
  );
  assert.match(
    professionalKnowledgeDetail,
    /professional-practice-detail-footer[\s\S]*professional-practice-back-button[\s\S]*\/evidence#professional-knowledge-evidence[\s\S]*Back/,
  );
  assert.match(pdfPreview, /<iframe class="pdf-preview-frame"/);
  assert.match(pdfPreview, /Open original/);
  assert.match(professionalKnowledgePdfPreview, /<iframe class="pdf-preview-frame"/);
  assert.match(professionalKnowledgePdfPreview, /Open original/);

  assert.match(contact, /Let’s Make Every Child/);
  assert.doesNotMatch(contact, /06 · Let/);
  assert.match(contact, /Feel[\s\S]*<em>Seen<\/em>[\s\S]*— Together\./);
  assert.match(contact, /<strong>ECT<\/strong>/);
  assert.match(contact, /<strong>2027<\/strong>/);
  assert.match(contact, /beccalyu22@gmail\.com/);
  assert.match(contact, /Copy Email/);
  assert.match(contact, /View &amp; Download CV/);
  assert.match(contact, /href="\/media\/becca-lyu-cv\.pdf"/);
  assert.match(contact, /href="mailto:beccalyu22@gmail\.com"/);
  assert.doesNotMatch(contact, />Email Me</);
  assert.doesNotMatch(contact, /Practice, made accountable/);
});

test("ships route splitting, lightweight motion, and portfolio media", async () => {
  const [
    page,
    layout,
    aboutPage,
    philosophyPage,
    evidencePage,
    contactPage,
    navbar,
    hero,
    footer,
    css,
    packageJson,
    borderGlow,
    borderGlowCss,
    evidence,
    professionalPracticeArticle,
    professionalPracticePage,
    pdfPreviewPage,
    professionalKnowledgePage,
    professionalKnowledgePdfPreviewPage,
    professionalKnowledgeData,
    scrollVideo,
    scrollVideoCss,
    motionDirector,
    circularGallery,
    philosophyStory,
    philosophyStoryCss,
    folder,
    folderCss,
    siteContent,
  ] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/about/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/philosophy/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/evidence/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/contact/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/Navbar.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/Hero.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/Footer.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(
      new URL("../app/components/BorderGlow.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../app/components/BorderGlow.css", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/components/Evidence.tsx", import.meta.url), "utf8"),
    readFile(
      new URL(
        "../app/components/ProfessionalPracticeEvidenceArticle.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../app/evidence/professional-practice/[slug]/page.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../app/evidence/professional-practice/pdf-preview/page.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../app/evidence/professional-knowledge/[slug]/page.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../app/evidence/professional-knowledge/pdf-preview/page.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL("../app/content/professionalKnowledgeData.ts", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../app/components/ScrollVideo.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../app/components/ScrollVideo.css", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../app/components/MotionDirector.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../app/components/CircularGallery.jsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../app/components/PhilosophyStory.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../app/components/PhilosophyStory.css", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/components/Folder.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/Folder.css", import.meta.url), "utf8"),
    Promise.all([
      readFile(new URL("../app/content/siteData.ts", import.meta.url), "utf8"),
      readFile(new URL("../app/content/sharedData.ts", import.meta.url), "utf8"),
      readFile(
        new URL("../app/content/homePageData.ts", import.meta.url),
        "utf8",
      ),
      readFile(
        new URL("../app/content/aboutPageData.ts", import.meta.url),
        "utf8",
      ),
      readFile(
        new URL("../app/content/philosophyPageData.ts", import.meta.url),
        "utf8",
      ),
      readFile(
        new URL("../app/content/evidencePageData.ts", import.meta.url),
        "utf8",
      ),
      readFile(
        new URL("../app/content/contactPageData.ts", import.meta.url),
        "utf8",
      ),
    ]).then((files) => files.join("\n")),
  ]);

  assert.match(page, /getSiteContent/);
  assert.match(page, /<Hero content=\{content\.hero\} \/>/);
  assert.match(page, /<MotionDirector opening content=\{content\.opening\} \/>/);
  assert.match(page, /<BorderGlow \/>/);
  assert.doesNotMatch(page, /<About \/>|<Evidence \/>|<Gallery \/>/);
  assert.match(layout, /<ScrollVideo \/>/);
  assert.match(layout, /<Navbar content=\{content\.nav\} \/>/);
  assert.match(layout, /<Footer content=\{content\.footer\} \/>/);
  assert.match(layout, /lang="en"/);
  assert.match(
    aboutPage,
    /<About content=\{content\.about\} \/>[\s\S]*<Experience content=\{content\.experience\} \/>[\s\S]*<Strengths content=\{content\.strengths\} \/>/,
  );
  assert.match(philosophyPage, /<PhilosophyStory content=\{content\.philosophy\} \/>/);
  assert.doesNotMatch(
    philosophyPage,
    /<Foundations \/>|<Gallery \/>|<BorderGlow \/>|<MotionDirector/,
  );
  assert.match(evidencePage, /professionalPracticeEvidence/);
  assert.match(evidencePage, /professionalKnowledgeEvidence/);
  assert.match(evidencePage, /professionalKnowledgeSummaries = professionalKnowledgeEvidence\.map/);
  assert.match(evidencePage, /professionalKnowledge=\{professionalKnowledgeSummaries\}/);
  assert.match(evidencePage, /professionalPracticeSummaries = professionalPracticeEvidence\.map/);
  assert.match(evidencePage, /professionalPractice=\{professionalPracticeSummaries\}/);
  assert.match(contactPage, /<Contact content=\{content\.contact\} \/>/);
  assert.match(navbar, /from "next\/link"/);
  assert.match(navbar, /usePathname/);
  assert.match(navbar, /content\.links\.map/);
  assert.match(siteContent, /"href": "\/about"/);
  assert.match(siteContent, /"href": "\/philosophy"/);
  assert.doesNotMatch(navbar, /const philosophyLinks/);
  assert.match(siteContent, /"href": "\/evidence"/);
  assert.match(siteContent, /"href": "\/contact"/);
  assert.match(navbar, /className={`desktop-submenu-trigger/);
  assert.match(navbar, /onMouseEnter=/);
  assert.match(
    navbar,
    /const navigateDesktopMenuHome = \(href: string\) => \{[\s\S]*?openDesktopMenu\(href\);[\s\S]*?if \(pathname !== href \|\| window\.location\.hash\) router\.push\(href\);/,
  );
  assert.match(
    navbar,
    /const handleDesktopMenuEnter = \(href: string\) => \{[\s\S]*?href === "\/about"[\s\S]*?navigateDesktopMenuHome\(href\);[\s\S]*?openDesktopMenu\(href\);/,
  );
  assert.match(navbar, /\? \(\) => handleDesktopMenuEnter\(link\.href\)/);
  assert.match(
    navbar,
    /onClick=\{\(\) => navigateDesktopMenuHome\(link\.href\)\}/,
  );
  assert.match(navbar, /aria-expanded=\{submenuPhase === "open"\}/);
  assert.match(navbar, /inert=\{submenuPhase !== "open"\}/);
  assert.doesNotMatch(navbar, /order: "0[1-9]"/);
  assert.doesNotMatch(navbar, /order: "[1-7]–[1-7]"/);
  assert.match(navbar, /content\.brandInitials/);
  assert.match(siteContent, /"brandInitials": "BL"/);
  assert.doesNotMatch(navbar, /becca-lyu-nav-headshot\.jpg/);
  assert.match(hero, /href="\/philosophy#principles"/);
  assert.match(hero, /href="\/contact"/);
  assert.match(hero, /className="hero-welcome t-stagger"/);
  assert.match(hero, /hero-welcome-message t-stagger-line t-stagger-line--1/);
  assert.doesNotMatch(hero, /hero-welcome-greeting/);
  assert.doesNotMatch(hero, /className="hero-copy"/);
  assert.match(footer, /usePathname/);
  assert.match(footer, /pathname === "\/"/);
  assert.match(footer, /return null/);
  assert.match(footer, /content\.copyrightName/);
  assert.match(footer, /content\.visualCreditPrefix/);
  assert.match(motionDirector, /\.hero-welcome/);

  assert.match(css, /min\(1700px/);
  assert.match(css, /overflow-x: clip/);
  assert.match(
    css,
    /\.button \{[\s\S]*?width: fit-content;[\s\S]*?max-width: 100%;/,
  );
  assert.match(css, /--ink: #303b46/);
  assert.match(css, /--dusty-blue:/);
  assert.match(css, /--clay-deep:/);
  assert.match(css, /--video-text: #263b47/);
  assert.match(css, /--video-text-halo:/);
  assert.match(css, /\.hero-content,[\s\S]*text-shadow: var\(--video-text-halo\)/);
  assert.match(
    css,
    /\.hero-welcome-message \{[\s\S]*font-size: clamp\(2\.6rem, 5\.1vw, 4\.0625rem\);[\s\S]*font-style: italic/,
  );
  assert.match(css, /--font-editorial:/);
  assert.match(css, /--font-body:/);
  assert.match(css, /\.route-enter/);
  assert.match(css, /animation: route-enter var\(--duration-fast\)/);
  assert.match(css, /translateX\(var\(--distance-base\)\)/);
  assert.match(css, /\.desktop-nav > li > a\.is-active::after/);
  assert.match(css, /\.desktop-submenu-trigger\.is-active::after/);
  assert.match(css, /\.desktop-submenu\.is-open/);
  assert.match(css, /\.desktop-submenu\.is-closing/);
  assert.match(css, /\.brand-mark[\s\S]*background: var\(--plum\)/);
  assert.match(css, /\.botanical-sprig/);
  assert.match(css, /\.experience-fan/);
  assert.match(css, /\.experience-card-inner/);
  assert.match(css, /\.experience-arc/);
  assert.match(
    css,
    /\.philosophy-hero-inner \{[\s\S]*?text-align: center;/,
  );
  assert.match(
    css,
    /\.philosophy-chapter \{[\s\S]*?min-height: 88svh;/,
  );
  assert.match(css, /\.philosophy-chapter-visual[\s\S]*?clip-path: inset\(9%/);
  assert.match(css, /\.philosophy-coda \{[\s\S]*?min-height: 96svh;/);
  assert.match(
    css,
    /\.stats \{[\s\S]*?grid-template-columns: repeat\(3, 1fr\);/,
  );
  assert.match(
    css,
    /\.stats div \{[\s\S]*?align-items: center;[\s\S]*?text-align: center;/,
  );
  assert.match(css, /\.nav-submenu-order/);
  assert.match(css, /top: calc\(100% \+ 42px\)/);
  assert.match(
    css,
    /\.desktop-submenu \{[\s\S]*?width: max-content;[\s\S]*?min-width: 380px;/,
  );
  assert.match(
    css,
    /\.desktop-submenu a \{[\s\S]*?grid-template-columns: 1fr;[\s\S]*?white-space: nowrap;/,
  );
  assert.match(
    css,
    /\.mobile-submenu a \{[\s\S]*?font-family: var\(--font-editorial\);[\s\S]*?text-transform: none;[\s\S]*?white-space: normal;/,
  );
  assert.match(css, /scroll-margin-top: clamp\(116px, 10vw, 152px\)/);
  assert.match(css, /\.t-stagger-line/);
  assert.match(css, /--modal-open-dur: var\(--duration-fast\)/);
  assert.match(css, /\.t-modal\.is-open/);
  assert.match(css, /\.evidence-gallery-clean/);
  assert.match(
    css,
    /--evidence-readable-yellow: rgba\(241, 207, 111, 0\.92\)/,
  );
  assert.match(css, /\.evidence-readable-surface/);
  assert.match(
    css,
    /\.evidence-folder-card-copy > p:last-child[\s\S]*font-size: 3\.5px/,
  );
  assert.match(css, /prefers-reduced-motion/);
  assert.match(packageJson, /"ogl":/);
  assert.match(packageJson, /"gsap":/);
  assert.match(borderGlowCss, /@keyframes border-glow-orbit/);
  assert.match(borderGlowCss, /transform: rotate\(1turn\)/);
  assert.match(borderGlowCss, /\.border-glow-mesh::before/);
  assert.match(borderGlowCss, /infinite/);
  assert.match(borderGlowCss, /opacity: 0\.96/);
  assert.doesNotMatch(borderGlowCss, /@property --cursor-angle/);
  assert.match(borderGlow, /IntersectionObserver/);
  assert.match(borderGlow, /rootMargin: "48px 0px"/);
  assert.match(borderGlowCss, /animation-play-state: paused/);
  assert.match(borderGlowCss, /\.is-glow-active/);
  assert.match(css, /\.t-text-swap/);
  assert.match(css, /\.contact-section[\s\S]*background: transparent/);
  assert.match(css, /\.site-footer[\s\S]*background: transparent/);
  assert.match(css, /font-size: clamp\(4\.4rem, 7\.3vw, 6\.25rem\)/);
  assert.match(css, /\.contact-email[\s\S]*font-size: 1\.125rem/);
  assert.match(evidence, /<CircularGallery/);
  assert.match(evidence, /professional-practice-card-actions/);
  assert.match(evidence, /professionalKnowledge/);
  assert.match(professionalPracticeArticle, /professional-practice-figure/);
  assert.match(professionalPracticeArticle, /getPdfPreviewHref/);
  assert.match(professionalPracticeArticle, /target="_blank"/);
  assert.match(professionalPracticePage, /generateStaticParams/);
  assert.match(pdfPreviewPage, /pdf-preview-frame/);
  assert.match(professionalKnowledgePage, /generateStaticParams/);
  assert.match(professionalKnowledgePage, /professionalKnowledgeEvidence/);
  assert.match(professionalKnowledgePage, /professional-knowledge-evidence/);
  assert.match(professionalKnowledgePage, /professional-knowledge\/pdf-preview/);
  assert.match(professionalKnowledgePdfPreviewPage, /pdf-preview-frame/);
  assert.match(professionalKnowledgeData, /Following Curiosity Through Sensory Inquiry/);
  assert.match(professionalKnowledgeData, /From Story to Curriculum/);
  assert.match(siteContent, /APST 3 · From Story to Inquiry/);
  assert.match(evidence, /apst-3-from-story-to-inquiry\.jpg/);
  assert.match(evidence, /onItemActivate=\{navigateToCategory\}/);
  assert.match(evidence, /scrollIntoView/);
  assert.match(evidence, /focusIndex=\{galleryFocusIndex\}/);
  assert.match(evidence, /evidence-heading-summary evidence-readable-surface/);
  assert.doesNotMatch(evidence, /evidence-note evidence-readable-surface/);
  assert.match(folder, /onItemActivate/);
  assert.match(folder, /aria-pressed/);
  assert.match(folder, /className="rb-folder-toggle"/);
  assert.match(folder, /--folder-cover-image/);
  assert.match(philosophyStory, /IntersectionObserver/);
  assert.match(philosophyStory, /requestAnimationFrame/);
  assert.match(philosophyStory, /GrowingFlower/);
  assert.match(philosophyStory, /ConditionsDiagram/);
  assert.match(philosophyStory, /ExhibitionProgress/);
  assert.match(philosophyStory, /exhibition-reveal/);
  assert.match(philosophyStory, /t-stagger-line--4/);
  assert.match(philosophyStory, /prefers-reduced-motion: reduce/);
  assert.match(siteContent, /If children feel safe/);
  assert.match(philosophyStory, /scaffoldingApstTags/);
  assert.doesNotMatch(philosophyStory, /scaffoldingSteps/);
  assert.match(siteContent, /Learning Before Bloom/);
  assert.match(siteContent, /Making Progress Visible/);
  assert.match(
    siteContent,
    /Learning becomes visible long before the final bloom/,
  );
  assert.match(philosophyStory, /progressApstTags/);
  assert.match(siteContent, /Feedback for the Next Step/);
  assert.match(philosophyStory, /feedbackApstTags/);
  assert.match(siteContent, /Growth Alongside Children/);
  assert.match(philosophyStory, /reflectionApstTags/);
  assert.match(
    philosophyStoryCss,
    /\.exhibition-scene \{[\s\S]*?min-height: 100svh;/,
  );
  assert.match(
    philosophyStoryCss,
    /\.exhibition-sticky-frame \{[\s\S]*?position: sticky;/,
  );
  assert.match(philosophyStoryCss, /\.exhibition-progress-nav/);
  assert.match(philosophyStoryCss, /\.exhibition-timeline-track/);
  assert.match(
    philosophyStoryCss,
    /\.exhibition-principles-board \{[\s\S]*?grid-template-columns: 1\.14fr repeat\(5,/,
  );
  assert.match(philosophyStoryCss, /prefers-reduced-motion: reduce/);
  assert.match(folderCss, /\.rb-folder-paper\.is-interactive/);
  assert.match(folderCss, /\.rb-folder-toggle:focus-visible/);
  assert.match(scrollVideo, /autoPlay/);
  assert.match(scrollVideo, /loop/);
  assert.match(scrollVideo, /playbackRate = 1\.08/);
  assert.match(scrollVideo, /preload="metadata"/);
  assert.match(scrollVideo, /background-scroll-optimized\.mp4/);
  assert.match(scrollVideo, /visibilitychange/);
  assert.doesNotMatch(
    scrollVideo,
    /ScrollTrigger|gsap|currentTime|requestAnimationFrame|window\.scrollY/,
  );
  assert.match(scrollVideoCss, /@keyframes video-drift/);
  assert.match(scrollVideoCss, /translate3d/);
  assert.match(scrollVideoCss, /animation: video-drift/);
  assert.doesNotMatch(scrollVideoCss, /filter: saturate/);
  assert.match(motionDirector, /opening = false/);
  assert.match(motionDirector, /if \(playOpening\)/);
  assert.match(motionDirector, /becca-opening-played/);
  assert.match(motionDirector, /y: isDesktop \? 30 : 20/);
  assert.match(motionDirector, /cardElements\.length > 8/);
  assert.doesNotMatch(motionDirector, /scroll-video-element/);
  assert.doesNotMatch(motionDirector, /scrub:/);
  assert.match(circularGallery, /1000 \/ 45/);
  assert.match(circularGallery, /const isSettling/);
  assert.match(circularGallery, /this\.requestRender\(\)/);
  assert.match(circularGallery, /focusItem\(index\)/);
  assert.match(circularGallery, /heightSegments: 24/);
  assert.match(circularGallery, /widthSegments: 48/);
  assert.doesNotMatch(borderGlow, /pointermove|pointerout/i);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await Promise.all([
    access(
      new URL(
        "../public/media/background-scroll-optimized.mp4",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/media/becca-lyu-educator-portrait.jpg",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/media/becca-lyu-nav-headshot.jpg",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/media/evidence-growth-folder-cover.jpg",
        import.meta.url,
      ),
    ),
    access(new URL("../public/media/becca-lyu-cv.pdf", import.meta.url)),
    access(new URL("../public/media/storybook-learning.jpg", import.meta.url)),
    access(
      new URL(
        "../public/media/children-creating-together.jpg",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/media/children-exploring-together.jpg",
        import.meta.url,
      ),
    ),
  ]);

  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
  await assert.rejects(access(new URL("public/_sites-preview", root)));
});
