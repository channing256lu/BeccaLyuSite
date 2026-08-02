"use client";

import Link from "next/link";
import {
  type CSSProperties,
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { SiteContent } from "../content/siteContent";
import "./PhilosophyStory.css";

type ExhibitionStyle = CSSProperties & Record<`--${string}`, string | number>;

const exhibitionNavigationIds = [
  "opening",
  "growth",
  "educator-role",
  "learning-before-bloom",
];

const growthApstTags = ["APST 1.1", "APST 1.2", "APST 1.5"];
const diversityApstTags = ["APST 1.2", "APST 1.3", "APST 1.5"];
const knowingApstTags = ["APST 1.5", "APST 3.3", "APST 3.5", "APST 3.6"];
const conditionsApstTags = ["APST 4.1", "APST 4.2", "APST 4.4"];
const scaffoldingApstTags = ["APST 1.2", "APST 1.5", "APST 3.3", "APST 3.5"];
const progressApstTags = ["APST 2.3", "APST 5.1", "APST 5.4"];
const feedbackApstTags = ["APST 3.5", "APST 5.2", "APST 5.4"];
const reflectionApstTags = [
  "APST 3.6",
  "APST 6.1",
  "APST 6.2",
  "APST 6.4",
  "APST 7.1",
];

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function stagedProgress(progress: number, start: number, end: number) {
  return clamp((progress - start) / (end - start));
}

function setRoundedProgress(
  setter: Dispatch<SetStateAction<number>>,
  value: number,
) {
  const rounded = Math.round(value * 200) / 200;
  setter((current) => (current === rounded ? current : rounded));
}

function GrowingFlower({ progress }: { progress: number }) {
  const root = stagedProgress(progress, 0.04, 0.24);
  const stem = stagedProgress(progress, 0.18, 0.5);
  const leaves = stagedProgress(progress, 0.42, 0.68);
  const bud = stagedProgress(progress, 0.62, 0.82);
  const bloom = stagedProgress(progress, 0.78, 1);

  return (
    <svg
      className="growth-svg"
      viewBox="0 0 520 680"
      aria-label="A seed grows roots, a stem, leaves, a bud and then a flower as the page scrolls"
      role="img"
    >
      <defs>
        <linearGradient id="growth-leaf-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a8c8a9" />
          <stop offset="1" stopColor="#6f9a82" />
        </linearGradient>
        <linearGradient id="growth-petal-fill" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#f8d4c4" />
          <stop offset="1" stopColor="#d99082" />
        </linearGradient>
        <radialGradient id="growth-centre-fill" cx="40%" cy="34%" r="68%">
          <stop offset="0" stopColor="#f8e7a2" />
          <stop offset="1" stopColor="#d8ad4d" />
        </radialGradient>
      </defs>
      <path d="M46 552C158 536 365 536 476 552" className="growth-soil" />
      <path d="M78 563C184 551 348 551 447 562" className="growth-soil-echo" />
      <path
        d="M236 541C238 522 254 511 276 520C282 537 272 553 253 558C243 555 237 549 236 541Z"
        className="growth-seed"
        style={{ opacity: 1 - bloom * 0.45 }}
      />
      <g
        className="growth-roots"
        style={{ opacity: root }}
      >
        <path
          d="M258 545C250 575 228 604 190 626"
          pathLength="1"
          style={{ strokeDashoffset: 1 - root }}
        />
        <path
          d="M258 545C272 580 301 608 342 627"
          pathLength="1"
          style={{ strokeDashoffset: 1 - root }}
        />
        <path
          d="M250 570C221 576 201 591 181 613"
          pathLength="1"
          style={{ strokeDashoffset: 1 - root }}
        />
        <path
          d="M272 580C300 583 321 594 343 612"
          pathLength="1"
          style={{ strokeDashoffset: 1 - root }}
        />
        <path
          d="M238 588C226 607 212 619 197 633"
          pathLength="1"
          style={{ strokeDashoffset: 1 - root }}
        />
      </g>
      <path
        d="M258 539C254 467 267 407 268 342C269 270 289 206 286 137"
        className="growth-stem"
        pathLength="1"
        style={{ strokeDashoffset: 1 - stem }}
      />
      <path
        d="M262 536C260 467 271 407 272 343C273 270 292 208 290 140"
        className="growth-stem-highlight"
        pathLength="1"
        style={{ strokeDashoffset: 1 - stem }}
      />
      <g
        className="growth-leaves"
        style={{
          opacity: leaves,
          transform: `scale(${0.8 + leaves * 0.2})`,
        }}
      >
        <path
          d="M266 407C224 405 187 376 174 331C219 326 256 355 266 407Z"
          className="growth-leaf"
        />
        <path
          d="M273 326C316 315 349 283 359 240C315 242 282 275 273 326Z"
          className="growth-leaf"
        />
        <path d="M263 400C230 379 207 356 184 339" className="growth-leaf-vein" />
        <path d="M278 318C308 297 331 271 349 250" className="growth-leaf-vein" />
      </g>
      <g
        className="growth-bud"
        style={{ opacity: bud * (1 - bloom) }}
      >
        <path
          d="M286 163C269 154 260 133 266 113C282 115 294 130 294 151Z"
          className="growth-bud-sepal"
        />
        <path
          d="M286 151C268 139 267 111 285 91C306 107 306 135 286 151Z"
          className="growth-bud-petal"
        />
      </g>
      <g
        className="growth-bloom"
        style={{
          opacity: bloom,
          transform: `scale(${0.72 + bloom * 0.28})`,
        }}
      >
        <g className="growth-bloom-art" transform="rotate(-4 286 108)">
          {Array.from({ length: 8 }, (_, index) => (
            <path
              d="M286 108C263 89 263 60 286 38C309 60 309 89 286 108Z"
              className={`growth-petal ${
                index % 2 === 0 ? "growth-petal-soft" : ""
              }`}
              transform={`rotate(${index * 45} 286 108)`}
              key={index}
            />
          ))}
          <circle cx="286" cy="108" r="27" className="growth-centre-halo" />
          <circle cx="286" cy="108" r="19" className="growth-centre" />
          <g className="growth-pollen">
            <circle cx="279" cy="103" r="2.4" />
            <circle cx="292" cy="101" r="2" />
            <circle cx="286" cy="114" r="2.6" />
            <circle cx="296" cy="112" r="1.8" />
            <circle cx="276" cy="114" r="1.7" />
          </g>
        </g>
      </g>
      <g className="growth-sparkles" style={{ opacity: bloom }}>
        <path d="M383 96L383 112M375 104H391" />
        <path d="M191 87L191 99M185 93H197" />
        <circle cx="370" cy="159" r="4" />
        <circle cx="211" cy="151" r="3" />
      </g>
    </svg>
  );
}

function ConditionsDiagram({ progress }: { progress: number }) {
  const roots = stagedProgress(progress, 0.08, 0.42);
  const water = stagedProgress(progress, 0.32, 0.58);
  const light = stagedProgress(progress, 0.5, 0.72);
  const plant = stagedProgress(progress, 0.62, 1);

  return (
    <svg
      className="conditions-svg"
      viewBox="0 0 620 620"
      aria-label="Soil, roots, water and light gradually appear before a plant grows"
      role="img"
    >
      <path d="M70 359C207 339 426 339 550 359" className="conditions-soil" />
      <g className="conditions-roots" style={{ opacity: roots }}>
        <path
          d="M310 357C282 409 252 449 204 485"
          pathLength="1"
          style={{ strokeDashoffset: 1 - roots }}
        />
        <path
          d="M310 357C333 413 373 456 424 486"
          pathLength="1"
          style={{ strokeDashoffset: 1 - roots }}
        />
        <path
          d="M289 400C250 412 226 432 207 458"
          pathLength="1"
          style={{ strokeDashoffset: 1 - roots }}
        />
        <path
          d="M337 410C376 421 404 445 425 471"
          pathLength="1"
          style={{ strokeDashoffset: 1 - roots }}
        />
      </g>
      <g className="conditions-water" style={{ opacity: water }}>
        <path d="M150 180C130 210 129 232 150 244C172 232 170 209 150 180Z" />
        <path d="M202 145C184 171 183 192 202 202C222 191 221 171 202 145Z" />
      </g>
      <g className="conditions-light" style={{ opacity: light }}>
        <circle cx="474" cy="135" r="44" />
        <path d="M474 58V28M474 242V212M397 135H367M581 135H551M419 80L398 59M550 211L529 190M529 80L550 59" />
      </g>
      <path
        d="M310 355C308 303 308 256 313 205"
        className="conditions-stem"
        pathLength="1"
        style={{ strokeDashoffset: 1 - plant }}
      />
      <g
        className="conditions-plant"
        style={{
          opacity: plant,
          transform: `scale(${0.76 + plant * 0.24})`,
        }}
      >
        <path d="M311 278C276 275 253 257 245 231C280 226 304 246 311 278Z" />
        <path d="M313 245C345 239 367 220 376 194C343 192 321 214 313 245Z" />
        <circle cx="313" cy="188" r="18" />
      </g>
      <g className="conditions-labels">
        <text x="84" y="386" style={{ opacity: roots }}>SOIL</text>
        <text x="380" y="506" style={{ opacity: roots }}>ROOTS</text>
        <text x="116" y="272" style={{ opacity: water }}>WATER</text>
        <text x="459" y="206" style={{ opacity: light }}>LIGHT</text>
      </g>
    </svg>
  );
}

function ExhibitionProgress({
  active,
  progress,
  navigation,
}: {
  active: string;
  progress: number;
  navigation: { id: string; label: string }[];
}) {
  return (
    <nav
      className="exhibition-progress-nav"
      aria-label="Teaching philosophy exhibition sections"
      style={{ "--exhibition-progress": progress } as ExhibitionStyle}
    >
      <span className="exhibition-progress-track" aria-hidden="true">
        <i />
      </span>
      <ol>
        {navigation.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={active === item.id ? "is-active" : undefined}
              aria-current={active === item.id ? "location" : undefined}
            >
              <span aria-hidden="true" />
              <b>{item.label}</b>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

type PhilosophyStoryProps = {
  content: SiteContent["philosophy"];
};

export function PhilosophyStory({ content }: PhilosophyStoryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const growthStageRef = useRef<HTMLElement>(null);
  const conditionsStageRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState("opening");
  const [pageProgress, setPageProgress] = useState(0);
  const [growthProgress, setGrowthProgress] = useState(0);
  const [conditionsProgress, setConditionsProgress] = useState(0);
  const [activeArtifact, setActiveArtifact] = useState(0);
  const exhibitionNavigation = useMemo(
    () =>
      exhibitionNavigationIds.map((id, index) => ({
        id,
        label: content.navigation[index] ?? id,
      })),
    [content.navigation],
  );
  const corePrinciples = content.principles;
  const evidenceTimeline = content.evidenceTimeline;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const revealSections = Array.from(
      root.querySelectorAll<HTMLElement>(".exhibition-reveal"),
    );

    if (reduceMotion) {
      revealSections.forEach((section) => section.classList.add("is-shown"));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-shown");
            revealObserver.unobserve(entry.target);
          });
        },
        {
          threshold: 0.2,
          rootMargin: "0px 0px -10% 0px",
        },
      );

      revealSections.forEach((section) => revealObserver.observe(section));

      return () => revealObserver.disconnect();
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;

    const progressFor = (reference: RefObject<HTMLElement | null>) => {
      const section = reference.current;
      if (!section) return 0;
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
      return clamp(-section.getBoundingClientRect().top / scrollable);
    };

    const update = () => {
      frame = 0;
      const rootRect = root.getBoundingClientRect();
      const scrollable = Math.max(1, root.offsetHeight - window.innerHeight);
      setRoundedProgress(setPageProgress, -rootRect.top / scrollable);
      setRoundedProgress(setGrowthProgress, progressFor(growthStageRef));
      setRoundedProgress(
        setConditionsProgress,
        progressFor(conditionsStageRef),
      );

      const marker = window.innerHeight * 0.45;
      let current = "opening";

      exhibitionNavigation.forEach((item) => {
        const section = document.getElementById(item.id);
        if (section && section.getBoundingClientRect().top <= marker) {
          current = item.id;
        }
      });

      setActiveSection((active) => (active === current ? active : current));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [exhibitionNavigation]);

  return (
    <div className="philosophy-exhibition" ref={rootRef}>
      <ExhibitionProgress
        active={activeSection}
        progress={pageProgress}
        navigation={exhibitionNavigation}
      />

      <section
        id="opening"
        data-exhibition-major
        className="exhibition-scene exhibition-hero exhibition-reveal t-stagger"
        aria-labelledby="exhibition-hero-title"
      >
        <div className="shell exhibition-hero-inner">
          <p className="exhibition-kicker t-stagger-line t-stagger-line--1">
            {content.heroKicker}
          </p>
          <h1 id="exhibition-hero-title" className="exhibition-hero-title">
            <span className="exhibition-hero-title-mask">
              <span className="exhibition-hero-title-line exhibition-hero-title-line--1">
                {content.heroTitleLine1}
              </span>
            </span>
            <span className="exhibition-hero-title-mask">
              <span className="exhibition-hero-title-line exhibition-hero-title-line--2">
                {content.heroTitleLine2}
              </span>
            </span>
          </h1>
          <p className="exhibition-hero-subtitle t-stagger-line t-stagger-line--4">
            {content.heroSubtitle}
          </p>
          <p className="exhibition-hero-introduction t-stagger-line t-stagger-line--4">
            {content.heroIntro}
          </p>
          <a
            href="#principles"
            className="exhibition-scroll-indicator t-stagger-line t-stagger-line--4"
            aria-label="Begin the exhibition"
          >
            <span>{content.scrollLabel}</span>
            <i aria-hidden="true">↓</i>
          </a>
        </div>
      </section>

      <section
        id="principles"
        className="exhibition-scene exhibition-principles exhibition-reveal"
        aria-labelledby="principles-title"
      >
        <div className="shell exhibition-principles-inner">
          <div className="exhibition-principles-board">
            <div className="exhibition-principles-intro">
              <span className="exhibition-principles-mark" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <h2 id="principles-title">{content.principlesTitle}</h2>
            </div>
            {corePrinciples.map((principle, index) => (
              <div
                className="exhibition-principle-cell"
                style={
                  {
                    "--principle-index": index,
                    "--principle-accent": `var(--principle-${principle.accent})`,
                  } as ExhibitionStyle
                }
                key={principle.title}
              >
                <i aria-hidden="true" />
                <strong>{principle.title}</strong>
                <span>{principle.keywords}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="growth"
        data-exhibition-major
        className="exhibition-scene exhibition-chapter-opening exhibition-growth-opening exhibition-reveal t-stagger"
        aria-labelledby="growth-title"
      >
        <div className="shell exhibition-chapter-opening-inner">
          <p className="exhibition-kicker t-stagger-line t-stagger-line--1">
            {content.growthKicker}
          </p>
          <h2 id="growth-title" className="t-stagger-line t-stagger-line--2">
            {content.growthTitle}
          </h2>
          <p className="exhibition-growth-statement">
            {content.growthStatement}
          </p>
          <p className="exhibition-growth-reference">
            {content.growthReference}
          </p>
          <div className="exhibition-growth-tags" aria-label="Relevant APST standards">
            {growthApstTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={growthStageRef}
        className="exhibition-scroll-stage exhibition-growth-stage"
        aria-labelledby="development-title"
      >
        <div className="exhibition-sticky-frame">
          <div className="shell exhibition-sticky-grid">
            <div className="exhibition-sticky-copy">
              <h2
                id="development-title"
                className="exhibition-rose-heading"
              >
                {content.developmentTitle}
              </h2>
              <p className="exhibition-rose-premise">
                {content.rosePremise}
              </p>
              <p className="exhibition-rose-comparison">
                {content.roseComparison.map((paragraph) => (
                  <span key={paragraph}>{paragraph}</span>
                ))}
              </p>
              <p className="exhibition-rose-languages">
                {content.roseLanguages}
              </p>
              <p
                className={`exhibition-highlight ${
                  growthProgress > 0.72 ? "is-visible" : ""
                }`}
              >
                {content.roseHighlight}
              </p>
            </div>
            <div className="exhibition-growth-visual">
              <GrowingFlower progress={growthProgress} />
              <div className="growth-stage-labels" aria-hidden="true">
                {content.growthStages.map(
                  (label, index) => (
                    <span
                      className={
                        growthProgress >= index / 5 ? "is-active" : undefined
                      }
                      key={label}
                    >
                      {label}
                    </span>
                  ),
                )}
              </div>
              <div
                className="exhibition-growth-tags exhibition-stage-tags"
                aria-label="Relevant APST standards for child diversity"
              >
                {diversityApstTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="educator-role"
        data-exhibition-major
        className="exhibition-scene exhibition-chapter-opening exhibition-role-opening exhibition-reveal t-stagger"
        aria-labelledby="role-title"
      >
        <div className="shell exhibition-chapter-opening-inner">
          <h2 id="role-title" className="t-stagger-line t-stagger-line--1">
            {content.roleTitle}
          </h2>
          <p className="exhibition-chapter-statement t-stagger-line t-stagger-line--2">
            {content.roleStatement}
          </p>
          <ol
            className="exhibition-metaphor-trail t-stagger-line t-stagger-line--3"
            aria-label="Teaching philosophy exhibition sequence"
          >
            {content.metaphorTrail.map((item) => (
              <li className={item === "Teacher" ? "is-current" : undefined} key={item}>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="knowing-each-child"
        className="exhibition-scene exhibition-knowing exhibition-reveal t-stagger"
        aria-labelledby="knowing-title"
      >
        <div className="shell exhibition-knowing-inner">
          <header className="exhibition-knowing-heading">
            <p className="exhibition-knowing-title t-stagger-line t-stagger-line--1">
              {content.knowingTitle}
            </p>
            <h2
              id="knowing-title"
              className="exhibition-knowing-subtitle t-stagger-line t-stagger-line--2"
            >
              {content.knowingSubtitle}
            </h2>
            <p className="exhibition-knowing-lede t-stagger-line t-stagger-line--3">
              {content.knowingLede}
            </p>
          </header>

          <div className="exhibition-knowing-grid">
            <article className="exhibition-knowing-copy t-stagger-line t-stagger-line--3">
              {content.knowingParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className="exhibition-reference">
                {content.educationReference}
              </p>
              <div
                className="exhibition-apst-tags"
                aria-label="Relevant APST standards for knowing each child"
              >
                {knowingApstTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section
        ref={conditionsStageRef}
        className="exhibition-scroll-stage exhibition-conditions-stage"
        aria-labelledby="conditions-title"
      >
        <div className="exhibition-sticky-frame exhibition-conditions-frame">
          <div className="shell exhibition-sticky-grid exhibition-conditions-grid">
            <h2
              id="conditions-title"
              className="exhibition-section-hero-title exhibition-conditions-title"
            >
              {content.conditionsTitle}
            </h2>
            <div className="exhibition-conditions-visual">
              <ConditionsDiagram progress={conditionsProgress} />
            </div>
            <div className="exhibition-sticky-copy exhibition-conditions-copy">
              {content.conditionsParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p
                className={`exhibition-highlight ${
                  conditionsProgress > 0.68 ? "is-visible" : ""
                }`}
              >
                {content.conditionsHighlight}
              </p>
              <div
                className="exhibition-apst-tags"
                aria-label="Relevant APST standards for supportive conditions"
              >
                {conditionsApstTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="alfie-kohn"
        className="exhibition-scene exhibition-quote exhibition-reveal t-stagger"
        aria-labelledby="kohn-quote"
      >
        <div className="shell exhibition-quote-inner">
          <p className="exhibition-kicker t-stagger-line t-stagger-line--1">
            {content.quoteKicker}
          </p>
          <blockquote id="kohn-quote">
            <p className="t-stagger-line t-stagger-line--2">
              {content.quote}
            </p>
            <cite className="t-stagger-line t-stagger-line--3">
              {content.quoteAuthor}
            </cite>
          </blockquote>
        </div>
      </section>

      <section
        id="responsive-scaffolding"
        className="exhibition-scene exhibition-scaffolding exhibition-reveal t-stagger"
        aria-labelledby="scaffolding-title"
      >
        <div className="shell exhibition-scaffolding-grid">
          <h2
            id="scaffolding-title"
            className="exhibition-section-hero-title exhibition-scaffolding-title t-stagger-line t-stagger-line--1"
          >
            {content.scaffoldingTitle}
          </h2>
          <p className="exhibition-section-deck exhibition-scaffolding-deck t-stagger-line t-stagger-line--2">
            {content.scaffoldingDeck}
          </p>
          <div className="exhibition-scaffolding-copy t-stagger-line t-stagger-line--3">
            <div className="exhibition-scaffolding-copy-columns">
              {content.scaffoldingParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <footer className="exhibition-scaffolding-meta">
              <p className="exhibition-reference">
                {content.educationReference}
              </p>
              <div
                className="exhibition-apst-tags"
                aria-label="Relevant APST standards for responsive scaffolding"
              >
                {scaffoldingApstTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </footer>
          </div>
        </div>
      </section>

      <section
        id="learning-before-bloom"
        data-exhibition-major
        className="exhibition-scene exhibition-chapter-opening exhibition-learning-opening exhibition-reveal t-stagger"
        aria-labelledby="learning-title"
      >
        <div className="shell exhibition-chapter-opening-inner">
          <h2 id="learning-title" className="t-stagger-line t-stagger-line--1">
            {content.learningTitle}
          </h2>
          <p className="exhibition-chapter-statement t-stagger-line t-stagger-line--2">
            {content.learningStatement}
          </p>
          <ol
            className="exhibition-metaphor-trail t-stagger-line t-stagger-line--3"
            aria-label="Teaching philosophy exhibition sequence"
          >
            {content.metaphorTrail.map((item) => (
              <li
                className={item === "Assessment" ? "is-current" : undefined}
                key={item}
              >
                {item}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="making-progress-visible"
        className="exhibition-scene exhibition-timeline exhibition-reveal t-stagger"
        aria-labelledby="timeline-title"
      >
        <div className="shell exhibition-timeline-inner">
          <header className="exhibition-timeline-heading">
            <div>
              <h2
                id="timeline-title"
                className="exhibition-section-hero-title exhibition-timeline-title t-stagger-line t-stagger-line--1"
              >
                {content.timelineTitle}
              </h2>
              <p className="exhibition-section-deck t-stagger-line t-stagger-line--2">
                {content.timelineDeck}
              </p>
            </div>
            <div className="exhibition-timeline-copy t-stagger-line t-stagger-line--3">
              {content.timelineParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className="exhibition-assessment-note">
                {content.assessmentNote}
              </p>
              <div
                className="exhibition-apst-tags"
                aria-label="Relevant APST standards for making progress visible"
              >
                {progressApstTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </header>
          <p className="exhibition-timeline-instruction t-stagger-line t-stagger-line--3">
            {content.timelineInstruction}
          </p>
          <div className="exhibition-timeline-track t-stagger-line t-stagger-line--4">
            {evidenceTimeline.map((item, index) => (
              <button
                type="button"
                className={activeArtifact === index ? "is-active" : undefined}
                aria-pressed={activeArtifact === index}
                onPointerEnter={() => setActiveArtifact(index)}
                onFocus={() => setActiveArtifact(index)}
                onClick={() => setActiveArtifact(index)}
                key={item.label}
              >
                <span aria-hidden="true" />
                <strong>{item.label}</strong>
              </button>
            ))}
          </div>
          <article
            className="exhibition-artifact"
            aria-live="polite"
            key={evidenceTimeline[activeArtifact]?.label}
          >
            <p>{evidenceTimeline[activeArtifact]?.artifact}</p>
            <h3>{evidenceTimeline[activeArtifact]?.label}</h3>
            <span>{evidenceTimeline[activeArtifact]?.detail}</span>
            <Link href="/evidence">{content.viewEvidenceLabel}</Link>
          </article>
        </div>
      </section>

      <section
        id="feedback"
        className="exhibition-scene exhibition-feedback exhibition-reveal t-stagger"
        aria-labelledby="feedback-title"
      >
        <div className="shell exhibition-feedback-inner">
          <div className="exhibition-feedback-heading">
            <div>
              <p className="exhibition-kicker t-stagger-line t-stagger-line--1">
                {content.feedbackKicker}
              </p>
              <h2
                id="feedback-title"
                className="t-stagger-line t-stagger-line--2"
              >
                {content.feedbackTitle}
              </h2>
            </div>
            <div className="exhibition-feedback-copy t-stagger-line t-stagger-line--3">
              {content.feedbackParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className="exhibition-reference">
                {content.feedbackReference}
              </p>
              <div
                className="exhibition-apst-tags"
                aria-label="Relevant APST standards for feedback"
              >
                {feedbackApstTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="exhibition-feedback-compare t-stagger-line t-stagger-line--4">
            <article className="is-before">
              <span aria-hidden="true">×</span>
              <p>{content.feedbackBeforeTitle}</p>
              <blockquote>{content.feedbackBeforeQuote}</blockquote>
              <small>{content.feedbackBeforeSmall}</small>
            </article>
            <article className="is-after">
              <span aria-hidden="true">✓</span>
              <p>{content.feedbackAfterTitle}</p>
              <blockquote>{content.feedbackAfterQuote}</blockquote>
              <small>{content.feedbackAfterSmall}</small>
            </article>
          </div>
        </div>
      </section>

      <section
        id="growing-alongside"
        className="exhibition-scene exhibition-coda exhibition-reveal t-stagger"
        aria-labelledby="coda-title"
      >
        <div className="exhibition-coda-blur" aria-hidden="true" />
        <div className="shell exhibition-coda-inner">
          <p className="exhibition-kicker t-stagger-line t-stagger-line--1">
            {content.codaKicker}
          </p>
          <h2
            id="coda-title"
            className="exhibition-coda-title-long t-stagger-line t-stagger-line--2"
          >
            {content.codaTitle}
          </h2>
          <p className="exhibition-coda-copy t-stagger-line t-stagger-line--3">
            {content.codaCopy}
          </p>
          <div
            className="exhibition-apst-tags exhibition-coda-tags t-stagger-line t-stagger-line--4"
            aria-label="Relevant APST standards for growing alongside children"
          >
            {reflectionApstTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <span className="exhibition-coda-line t-stagger-line t-stagger-line--4" />
          <div className="exhibition-coda-words t-stagger-line t-stagger-line--4">
            {content.codaWords.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>
          <Link
            href="/evidence"
            className="exhibition-coda-link t-stagger-line t-stagger-line--4"
          >
            {content.continueLabel} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
