"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteContent } from "../content/siteContent";
import "./MotionDirector.css";

type SectionMotion = {
  root: string;
  panel: string;
  heading?: string;
  content?: string;
  cards?: string;
};

const sectionMotions: SectionMotion[] = [
  {
    root: ".practice-foundations",
    panel: ".foundation-grid",
    heading: ".foundation-intro p",
    content: ".seed-mark",
    cards: ".foundation-item",
  },
  {
    root: "#about",
    panel: ".about-grid",
    heading: ".about-copy h2",
    content:
      ".about-copy > .eyebrow, .about-lead, .about-copy > p:not(.eyebrow):not(.about-lead), .about-contact",
    cards: ".identity-card, .stats > div",
  },
  {
    root: "#why-i-teach",
    panel: ".why-teach-inner",
    heading: ".why-teach-heading h2",
    content: ".why-teach-heading .eyebrow",
    cards: ".story-chapter",
  },
  {
    root: "#experience",
    panel: ":scope > .shell",
    heading: ".journey-intro h2",
    content: ".journey-intro .eyebrow, .journey-intro-copy > p",
    cards: ".experience-card",
  },
  {
    root: "#practice",
    panel: ":scope > .shell",
    heading: ".section-heading h2",
    content: ".section-heading .eyebrow, .section-heading-split > p",
    cards: ".project-card, .portfolio-folder-showcase",
  },
  {
    root: "#strengths",
    panel: ":scope > .shell",
    heading: ".strengths-intro h2",
    content:
      ".strengths-intro .eyebrow, .strengths-intro > p:last-child, .core-strengths-heading, .toolkit-heading",
    cards:
      ".quality-card, .core-strength-card, .toolkit-group, .credential-list span",
  },
  {
    root: "#evidence",
    panel: ".evidence-inner",
    heading: ".evidence-heading h2",
    content:
      ".evidence-heading .eyebrow, .evidence-heading-summary",
    cards: ".evidence-master-folder-stage, .evidence-gallery-clean",
  },
  {
    root: "#contact",
    panel: ".contact-inner",
    heading: ".contact-inner h2",
    cards: ".contact-copy, .contact-email, .contact-action, .contact-meta span",
  },
];

const revealTiming = {
  panel: 0.4,
  title: 0.5,
  content: 0.35,
  card: 0.4,
  stagger: 0.04,
};

type MotionDirectorProps = {
  opening?: boolean;
  content?: SiteContent["opening"];
};

export function MotionDirector({
  opening = false,
  content,
}: MotionDirectorProps) {
  const openingRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({
      ignoreMobileResize: true,
      limitCallbacks: true,
    });

    const html = document.documentElement;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isDesktop = window.matchMedia("(min-width: 761px)").matches;
    const playOpening =
      opening &&
      window.sessionStorage.getItem("becca-opening-played") !== "true";
    const heroWelcome =
      document.querySelector<HTMLElement>(".hero-welcome.t-stagger");
    let heroWelcomeFrame: number | undefined;
    const showHeroWelcome = () => {
      if (!heroWelcome) {
        return;
      }

      heroWelcome.classList.remove("is-hiding", "is-shown");
      void heroWelcome.offsetHeight;
      heroWelcome.classList.add("is-shown");
    };

    html.classList.add("motion-enhanced");

    if (reduceMotion || (opening && !playOpening)) {
      gsap.set(openingRef.current, { display: "none" });

      if (reduceMotion) {
        heroWelcome?.classList.add("is-shown");
        return () => html.classList.remove("motion-enhanced");
      }

      heroWelcomeFrame = window.requestAnimationFrame(showHeroWelcome);
    }

    const context = gsap.context(() => {
      if (playOpening) {
        window.sessionStorage.setItem("becca-opening-played", "true");
        html.classList.add("motion-lock");

        const openingPanels =
          gsap.utils.toArray<HTMLElement>(".opening-panel");
        const openingWords = gsap.utils.toArray<HTMLElement>(
          ".opening-word-inner",
        );
        const heroTitleLines = gsap.utils.toArray<HTMLElement>(
          ".hero-title-line-inner",
        );

        gsap.set(openingPanels, { scaleY: 1 });
        gsap.set(".opening-kicker", { autoAlpha: 0, y: 22 });
        gsap.set(openingWords, {
          yPercent: 125,
          scaleX: 0.72,
          scaleY: 0.82,
          skewX: -5,
          transformOrigin: "left bottom",
        });
        gsap.set(".opening-rule", {
          scaleX: 0,
          transformOrigin: "left center",
        });
        gsap.set(".opening-meta", { autoAlpha: 0, y: 14 });
        gsap.set(".site-header", { autoAlpha: 0, y: -28 });
        gsap.set(heroTitleLines, {
          yPercent: 125,
          scaleX: 0.86,
          scaleY: 0.72,
          transformOrigin: "left bottom",
        });
        gsap.set(
          [
            ".hero-eyebrow",
            ".hero-copy",
            ".hero-actions",
            ".hero-foot",
          ],
          {
            autoAlpha: 0,
            y: 36,
          },
        );
        gsap.set(".hero-welcome", { autoAlpha: 0 });

        const openingTimeline = gsap.timeline({
          defaults: { ease: "power4.out" },
          onComplete: () => {
            html.classList.remove("motion-lock");
            gsap.set(openingRef.current, { display: "none" });
            gsap.set(
              [
                ".site-header",
                ...heroTitleLines,
                ".hero-eyebrow",
                ".hero-welcome",
                ".hero-copy",
                ".hero-actions",
                ".hero-foot",
              ],
              {
                clearProps: "opacity,transform,visibility",
              },
            );
            ScrollTrigger.refresh();
          },
        });

        openingTimeline
          .to(".opening-kicker", {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
          }, 0.12)
          .to(openingWords, {
            yPercent: 0,
            scaleX: 1,
            scaleY: 1,
            skewX: 0,
            duration: 1.18,
            stagger: 0.12,
          }, 0.2)
          .to(".opening-rule", {
            scaleX: 1,
            duration: 0.72,
          }, 0.72)
          .to(".opening-meta", {
            autoAlpha: 1,
            y: 0,
            duration: 0.68,
            stagger: 0.08,
          }, 0.78)
          .to(openingWords, {
            scaleX: 0.78,
            duration: 0.42,
            ease: "power3.inOut",
            stagger: 0.04,
          }, 1.5)
          .to(openingWords, {
            scaleX: 1,
            duration: 0.72,
            ease: "expo.out",
            stagger: 0.04,
          }, 1.92)
          .to(".opening-brand", {
            autoAlpha: 0,
            y: -38,
            duration: 0.52,
            ease: "power3.in",
          }, 2.45)
          .to(openingPanels, {
            scaleY: 0,
            duration: 1.15,
            stagger: {
              amount: 0.22,
              from: "end",
            },
            ease: "power4.inOut",
          }, 2.62)
          .to(".site-header", {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
          }, 2.94)
          .to(heroTitleLines, {
            yPercent: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 1.34,
            stagger: 0.12,
            ease: "expo.out",
          }, 2.82)
          .to(".hero-eyebrow", {
            autoAlpha: 1,
            y: 0,
            duration: 0.86,
          }, 3.05)
          .to(".hero-welcome", {
            autoAlpha: 1,
            duration: 0.25,
          }, 3.18)
          .call(showHeroWelcome, [], 3.18)
          .to([".hero-copy", ".hero-actions", ".hero-foot"], {
            autoAlpha: 1,
            y: 0,
            duration: 1.05,
            stagger: 0.12,
          }, 3.32);
      }

      sectionMotions.forEach(({ root, panel, heading, content, cards }) => {
        const section = document.querySelector<HTMLElement>(root);

        if (!section) {
          return;
        }

        const panelElement = section.querySelector<HTMLElement>(panel);
        const sectionWord =
          section.querySelector<HTMLElement>(".motion-section-word");
        const headingElement = heading
          ? section.querySelector<HTMLElement>(heading)
          : null;
        const contentElements = content
          ? gsap.utils.toArray<HTMLElement>(
              section.querySelectorAll<HTMLElement>(content),
            )
          : [];
        const cardElements = cards
          ? gsap.utils.toArray<HTMLElement>(
              section.querySelectorAll<HTMLElement>(cards),
            )
          : [];
        const sectionTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 84%",
            once: true,
          },
        });

        if (panelElement) {
          sectionTimeline.fromTo(
            panelElement,
            {
              autoAlpha: 0,
              y: isDesktop ? 30 : 20,
              scale: isDesktop ? 0.99 : 1,
              willChange: "transform, opacity",
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: revealTiming.panel,
              ease: "power4.out",
              onComplete: () => {
                gsap.set(panelElement, {
                  clearProps: "opacity,transform,visibility,willChange",
                });
              },
            },
            0,
          );
        }

        if (sectionWord) {
          sectionTimeline.fromTo(
            sectionWord,
            {
              autoAlpha: 0,
              xPercent: -20,
              scaleX: 0.72,
              transformOrigin: "left center",
            },
            {
              autoAlpha: root === "#contact" ? 0.1 : 0.075,
              xPercent: 0,
              scaleX: 1,
              duration: revealTiming.title,
              ease: "expo.out",
            },
            0,
          );
        }

        if (headingElement) {
          sectionTimeline.fromTo(
            headingElement,
            {
              autoAlpha: 0,
              yPercent: 48,
              scaleX: 0.92,
              skewY: 1,
              clipPath: "inset(0 0 100% 0)",
              transformOrigin: "left bottom",
            },
            {
              autoAlpha: 1,
              yPercent: 0,
              scaleX: 1,
              skewY: 0,
              clipPath: "inset(0 0 0% 0)",
              duration: revealTiming.title,
              ease: "expo.out",
              onComplete: () => {
                gsap.set(headingElement, {
                  clearProps:
                    "clipPath,opacity,transform,visibility,willChange",
                });
              },
            },
            sectionWord ? 0.24 : 0.12,
          );
        }

        if (contentElements.length) {
          sectionTimeline.fromTo(
            contentElements,
            {
              autoAlpha: 0,
              y: isDesktop ? 12 : 8,
              willChange: "transform, opacity",
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: revealTiming.content,
              stagger: {
                each: revealTiming.stagger,
                from: "start",
              },
              ease: "power4.out",
              onComplete: () => {
                gsap.set(contentElements, {
                  clearProps: "opacity,transform,visibility,willChange",
                });
              },
            },
            headingElement ? 0.5 : 0.28,
          );
        }

        if (cardElements.length) {
          sectionTimeline.fromTo(
            cardElements,
            {
              autoAlpha: 0,
              y: isDesktop ? 30 : 20,
              scale: 0.985,
              rotateX: isDesktop ? 2 : 0,
              transformPerspective: 1200,
              willChange: "transform, opacity",
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              duration: revealTiming.card,
              stagger: {
                each:
                  cardElements.length > 8
                    ? 0.02
                    : revealTiming.stagger,
                from: "start",
              },
              ease: "power4.out",
              onComplete: () => {
                gsap.set(cardElements, {
                  clearProps:
                    "opacity,transform,visibility,willChange,perspective",
                });
              },
            },
            headingElement ? 0.74 : 0.4,
          );
        }
      });

      const experienceSection =
        document.querySelector<HTMLElement>("#experience");
      const experienceCards = gsap.utils.toArray<HTMLElement>(
        "#experience .experience-card",
      );

      if (experienceSection && experienceCards.length) {
        const experienceWord =
          experienceSection.querySelector<HTMLElement>(
            ".motion-section-word",
          );
        const experienceTitle =
          experienceSection.querySelector<HTMLElement>(".experience-title");
        const experiencePanel =
          experienceSection.querySelector<HTMLElement>(":scope > .shell");
        const experienceSupporting = gsap.utils.toArray<HTMLElement>(
          experienceSection.querySelectorAll<HTMLElement>(
            ".experience-timeline, .experience-active-summary",
          ),
        );

        experienceCards.forEach((card) =>
          card.classList.add("is-motion-revealing"),
        );

        const experienceTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: experienceSection,
            start: "top 84%",
            once: true,
          },
        });

        if (experiencePanel) {
          experienceTimeline.fromTo(
            experiencePanel,
            {
              autoAlpha: 0,
              y: isDesktop ? 30 : 20,
              scale: isDesktop ? 0.99 : 1,
              willChange: "transform, opacity",
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: revealTiming.panel,
              ease: "power4.out",
              onComplete: () => {
                gsap.set(experiencePanel, {
                  clearProps: "opacity,transform,visibility,willChange",
                });
              },
            },
            0,
          );
        }

        if (experienceWord) {
          experienceTimeline.fromTo(
            experienceWord,
            {
              autoAlpha: 0,
              xPercent: -20,
              scaleX: 0.72,
              transformOrigin: "left center",
            },
            {
              autoAlpha: 0.075,
              xPercent: 0,
              scaleX: 1,
              duration: revealTiming.title,
              ease: "expo.out",
            },
            0,
          );
        }

        if (experienceTitle) {
          experienceTimeline.fromTo(
            experienceTitle,
            {
              autoAlpha: 0,
              yPercent: 48,
              scaleX: 0.92,
              clipPath: "inset(0 0 100% 0)",
              transformOrigin: "left bottom",
            },
            {
              autoAlpha: 1,
              yPercent: 0,
              scaleX: 1,
              clipPath: "inset(0 0 0% 0)",
              duration: revealTiming.title,
              ease: "expo.out",
              onComplete: () => {
                gsap.set(experienceTitle, {
                  clearProps: "clipPath,opacity,transform,visibility",
                });
              },
            },
            0.22,
          );
        }

        experienceTimeline.fromTo(
          experienceCards,
          {
            "--motion-reveal-y": isDesktop ? "30px" : "20px",
            "--motion-reveal-opacity": 0,
          },
          {
            "--motion-reveal-y": "0px",
            "--motion-reveal-opacity": 1,
            duration: revealTiming.card,
            stagger: revealTiming.stagger,
            ease: "power4.out",
            onComplete: () => {
              experienceCards.forEach((card) => {
                card.classList.remove("is-motion-revealing");
                card.style.removeProperty("--motion-reveal-y");
                card.style.removeProperty("--motion-reveal-opacity");
              });
            },
          },
          0.62,
        );

        experienceTimeline.fromTo(
          experienceSupporting,
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: revealTiming.content,
            stagger: revealTiming.stagger,
            ease: "power4.out",
          },
          0.84,
        );
      }

      const footer = document.querySelector<HTMLElement>(".site-footer");
      const footerItems = gsap.utils.toArray<HTMLElement>(
        ".site-footer .footer-inner > *",
      );

      if (footer && footerItems.length) {
        const footerTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: footer,
            start: "top 94%",
            once: true,
          },
        });

        footerTimeline
          .fromTo(
            footer,
            {
              autoAlpha: 0,
              y: isDesktop ? 30 : 20,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: revealTiming.panel,
              ease: "power4.out",
            },
            0,
          )
          .fromTo(
            footerItems,
            {
              autoAlpha: 0,
              y: 12,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: revealTiming.content,
              stagger: revealTiming.stagger,
              ease: "power4.out",
              onComplete: () => {
                gsap.set([footer, ...footerItems], {
                  clearProps: "opacity,transform,visibility,willChange",
                });
              },
            },
            0.18,
          );
      }

      const revealImages = gsap.utils.toArray<HTMLImageElement>(
        ".project-card img",
      );

      revealImages.forEach((image) => {
        const trigger = image.closest<HTMLElement>(
          ".project-card, .experience-card",
        );

        if (!trigger) {
          return;
        }

        gsap.fromTo(
          image,
          { clipPath: "inset(6% 5% 6% 5%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.5,
            ease: "power4.out",
            scrollTrigger: {
              trigger,
              start: "top 90%",
              once: true,
            },
            onComplete: () => gsap.set(image, { clearProps: "clipPath" }),
          },
        );
      });

    });

    return () => {
      if (heroWelcomeFrame) {
        window.cancelAnimationFrame(heroWelcomeFrame);
      }
      context.revert();
      html.classList.remove("motion-enhanced", "motion-lock");
    };
  }, [opening]);

  return (
    opening ? (
      <div className="opening-sequence" ref={openingRef} aria-hidden="true">
        <div className="opening-panels">
          <span className="opening-panel opening-panel-one" />
          <span className="opening-panel opening-panel-two" />
          <span className="opening-panel opening-panel-three" />
          <span className="opening-panel opening-panel-four" />
        </div>
        <div className="opening-brand">
          <p className="opening-kicker">{content?.kicker}</p>
          <div className="opening-word">
            <span className="opening-word-inner">{content?.firstName}</span>
          </div>
          <div className="opening-word opening-word-last">
            <span className="opening-word-inner">{content?.lastName}</span>
          </div>
          <span className="opening-rule" />
          <div className="opening-footer">
            {content?.meta.map((item) => (
              <span className="opening-meta" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    ) : null
  );
}
