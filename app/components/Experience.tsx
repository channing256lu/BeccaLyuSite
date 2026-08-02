"use client";

import type { CSSProperties, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "../content/siteContent";

const experienceAssets = [
  {
    image: "/media/storybook-learning.jpg",
    imageAlt:
      "An educator sharing a storybook learning moment with young children",
    imagePosition: "center 48%",
    accent: "#7f98a6",
  },
  {
    image: "/media/children-exploring-together.jpg",
    imageAlt:
      "Children exploring and learning together in a natural classroom setting",
    imagePosition: "center",
    accent: "#d6b65f",
  },
  {
    image: "/media/children-creating-together.jpg",
    imageAlt:
      "Young children creating together during a collaborative art experience",
    imagePosition: "center",
    accent: "#c57f6c",
  },
  {
    image: "/media/storybook-learning.jpg",
    imageAlt:
      "A warm classroom moment centred on stories, relationships and learning",
    imagePosition: "74% center",
    accent: "#536a60",
  },
  {
    image: "/media/children-exploring-together.jpg",
    imageAlt:
      "Children exploring and learning together in a natural classroom setting",
    imagePosition: "74% center",
    accent: "#879a88",
  },
  {
    image: "/media/evidence-growth-folder-cover.jpg",
    imageAlt:
      "A small figure watering young plants as a symbol of future growth",
    imagePosition: "center 58%",
    accent: "#d6b65f",
  },
];

type ExperienceStyle = CSSProperties & {
  "--experience-x": string;
  "--experience-y": string;
  "--experience-rotation": string;
  "--experience-scale": number;
  "--experience-opacity": number;
  "--experience-overlay": number;
  "--experience-saturation": number;
  "--experience-accent": string;
};

type TimelineStyle = CSSProperties & {
  "--timeline-x": string;
  "--timeline-top": string;
  "--timeline-rotation": string;
};

type ExperienceProps = {
  content: SiteContent["experience"];
};

export function Experience({ content }: ExperienceProps) {
  const experiences = content.items.map((item, index) => ({
    ...item,
    ...experienceAssets[index],
  }));
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const fanRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<number | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const fan = fanRef.current;
      const activeCard = fan?.querySelector<HTMLElement>(
        `[data-experience-index="0"]`,
      );

      if (!fan || !activeCard || fan.scrollWidth <= fan.clientWidth + 1) {
        return;
      }

      fan.scrollTo({
        left:
          activeCard.offsetLeft -
          (fan.clientWidth - activeCard.offsetWidth) / 2,
        behavior: "auto",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  function alignMobileCard(index: number) {
    requestAnimationFrame(() => {
      const fan = fanRef.current;
      const card = fan?.querySelector<HTMLElement>(
        `[data-experience-index="${index}"]`,
      );

      if (!fan || !card || fan.scrollWidth <= fan.clientWidth + 1) {
        return;
      }

      fan.scrollTo({
        left: card.offsetLeft - (fan.clientWidth - card.offsetWidth) / 2,
        behavior: "smooth",
      });
    });
  }

  function showExperience(index: number, revealDetails = false) {
    const nextIndex = Math.max(0, Math.min(index, experiences.length - 1));
    setActiveIndex(nextIndex);
    setIsFlipped(revealDetails);
    alignMobileCard(nextIndex);
  }

  function moveExperience(direction: -1 | 1) {
    showExperience(activeIndex + direction);
  }

  function handleCardClick(index: number) {
    if (index === activeIndex) {
      setIsFlipped((current) => !current);
      return;
    }

    showExperience(index);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    pointerStart.current = event.clientX;
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (pointerStart.current === null) {
      return;
    }

    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;

    if (Math.abs(distance) < 48) {
      return;
    }

    moveExperience(distance > 0 ? -1 : 1);
  }

  const activeExperience = experiences[activeIndex];

  return (
    <section id="experience" className="section experience-section">
      <span className="motion-section-word" aria-hidden="true">
        {content.sectionWord}
      </span>
      <div className="experience-glow experience-glow-one" aria-hidden="true" />
      <div className="experience-glow experience-glow-two" aria-hidden="true" />

      <div className="shell">
        <header className="journey-intro">
          <div className="journey-intro-title">
            <p className="eyebrow">{content.eyebrow}</p>
            <h2>{content.title}</h2>
          </div>
          <div className="journey-intro-copy">
            {content.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </header>

        <div
          className="experience-stage"
          aria-label="Interactive professional experience timeline"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              moveExperience(-1);
            }

            if (event.key === "ArrowRight") {
              event.preventDefault();
              moveExperience(1);
            }
          }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            pointerStart.current = null;
          }}
          tabIndex={0}
        >
          <p className="experience-instruction">
            {content.instruction}
          </p>

          <div className="experience-fan" ref={fanRef}>
            {experiences.map((item, index) => {
                const offset = index - activeIndex;
                const distance = Math.abs(offset);
                const isActive = index === activeIndex;
                const direction = Math.sign(offset);
                const xMultipliers = [0, 1, 1.8, 2.55, 3.1, 3.55];
                const yMultipliers = [0, 1, 1.75, 2.7, 3.5, 4.2];
                const rotations = [0, 17, 29, 39, 47, 53];
                const scales = [1, 0.76, 0.74, 0.72, 0.7, 0.68];
                const opacities = [1, 0.98, 0.94, 0.88, 0.82, 0.76];
                const cardStyle: ExperienceStyle = {
                  "--experience-x": `calc(${direction * xMultipliers[distance]} * clamp(155px, 12.5vw, 250px))`,
                  "--experience-y": `calc(${yMultipliers[distance]} * clamp(60px, 5vw, 105px))`,
                  "--experience-rotation": `${direction * rotations[distance]}deg`,
                  "--experience-scale": scales[distance],
                  "--experience-opacity": opacities[distance],
                  "--experience-overlay": Math.min(0.08, distance * 0.02),
                  "--experience-saturation": Math.max(0.86, 0.98 - distance * 0.03),
                  "--experience-accent": item.accent,
                  zIndex: isActive
                    ? experiences.length + 2
                    : experiences.length - distance,
                };

                return (
                  <article
                    className={`experience-card ${
                      isActive ? "is-active" : ""
                    } ${isActive && isFlipped ? "is-flipped" : ""}`}
                    style={cardStyle}
                    data-experience-index={index}
                    key={`${item.place}-${item.period}`}
                  >
                    <button
                      className="experience-card-trigger"
                      type="button"
                      onClick={() => handleCardClick(index)}
                      onMouseDown={(event) => event.preventDefault()}
                      aria-current={isActive ? "step" : undefined}
                      aria-expanded={isActive && isFlipped}
                      aria-label={
                        isActive
                          ? isFlipped
                            ? `Show the photo for ${item.role} at ${item.place}`
                            : `Show details for ${item.role} at ${item.place}`
                          : `Select ${item.role} at ${item.place} and show details`
                      }
                    >
                      <span className="experience-card-inner">
                        <span
                          className="experience-card-face experience-card-front"
                          aria-hidden={isActive && isFlipped}
                        >
                          <span className="experience-card-image">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image}
                              alt={item.imageAlt}
                              loading="lazy"
                              decoding="async"
                              style={{ objectPosition: item.imagePosition }}
                            />
                          </span>
                          <span className="experience-card-caption">
                            <strong>{item.place}</strong>
                            <small>
                              {item.role} · {item.cohort}
                            </small>
                          </span>
                        </span>

                        <span
                          className="experience-card-face experience-card-back"
                          aria-hidden={!isActive || !isFlipped}
                        >
                          <span className="experience-card-era">
                            <i aria-hidden="true" />
                            {item.period}
                          </span>
                          <strong>{item.role}</strong>
                          <span className="experience-card-place">
                            {item.place} · {item.cohort}
                          </span>
                          <span className="experience-card-detail">
                            {item.detail}
                          </span>
                          <span className="experience-card-back-foot">
                            <small>{item.label}</small>
                            <i aria-hidden="true">↻</i>
                          </span>
                        </span>
                      </span>
                    </button>
                  </article>
                );
            })}
          </div>

          <button
            className="experience-side-control experience-side-control-prev"
            type="button"
            onClick={() => moveExperience(-1)}
            disabled={activeIndex === 0}
            aria-label="Show previous experience"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            className="experience-side-control experience-side-control-next"
            type="button"
            onClick={() => moveExperience(1)}
            disabled={activeIndex === experiences.length - 1}
            aria-label="Show next experience"
          >
            <span aria-hidden="true">›</span>
          </button>

          <div
            className="experience-timeline"
            aria-label="Experience timeline"
          >
            <div className="experience-arc" aria-hidden="true" />

              <div className="experience-timeline-years">
                {experiences.map((item, index) => {
                  const offset = index - activeIndex;
                  const distance = Math.abs(offset);
                  const direction = Math.sign(offset);
                  const timelineX = [0, 1, 1.95, 2.8, 3.55, 4.15];
                  const timelineY = [0, 1, 2.5, 4.4, 6.6, 9];
                  const timelineStyle: TimelineStyle = {
                    "--timeline-x": `calc(${direction * timelineX[distance]} * clamp(78px, 6.5vw, 126px))`,
                    "--timeline-top": `calc(24px + ${timelineY[distance]} * clamp(6px, 0.55vw, 11px))`,
                    "--timeline-rotation": `${direction * distance * 7}deg`,
                  };

                  return (
                    <button
                      className={index === activeIndex ? "is-active" : ""}
                      style={timelineStyle}
                      type="button"
                      onClick={() => showExperience(index)}
                      key={`${item.year}-${item.label}`}
                      aria-label={`Show ${item.label}, ${item.period}`}
                      aria-current={index === activeIndex ? "step" : undefined}
                    >
                      <span>{item.year}</span>
                      <small>{item.label}</small>
                    </button>
                  );
                })}
              </div>

              <div className="experience-needle" aria-hidden="true">
                <span />
              </div>

              <div
                className="experience-controls"
                aria-label="Experience cards"
              >
                <button
                  type="button"
                  onClick={() => moveExperience(-1)}
                  disabled={activeIndex === 0}
                  aria-label="Show previous experience"
                >
                  <span aria-hidden="true">←</span> Prev
                </button>
                <span className="experience-progress" aria-live="polite">
                  {String(activeIndex + 1).padStart(2, "0")}
                  <i aria-hidden="true" />
                  {String(experiences.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => moveExperience(1)}
                  disabled={activeIndex === experiences.length - 1}
                  aria-label="Show next experience"
                >
                  Next <span aria-hidden="true">→</span>
                </button>
              </div>
          </div>

          <p className="experience-active-summary" aria-live="polite">
            <span>{activeExperience.period}</span>
            {activeExperience.place}
          </p>
        </div>
      </div>
    </section>
  );
}
