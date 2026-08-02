"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import type { SiteContent } from "../content/siteContent";
import CircularGallery from "./CircularGallery";
import { Folder } from "./Folder";

type EvidenceCardStyle = CSSProperties &
  Record<"--evidence-accent", string>;

const categoryColors = ["#7f98a6", "#c57f6c", "#9c6d8b"];

const categoryGalleryIndexes = [0, 2, 5];

const evidenceItemImages = [
  "/media/children-exploring-together.jpg",
  "/media/storybook-learning.jpg",
  "/media/apst-3-from-story-to-inquiry.jpg",
  "/media/children-exploring-together.jpg",
  "/media/children-creating-together.jpg",
  "/media/storybook-learning.jpg",
  "/media/children-exploring-together.jpg",
];

type EvidenceProps = {
  content: SiteContent["evidence"];
};

export function Evidence({ content }: EvidenceProps) {
  const [activeCategoryIndex, setActiveCategoryIndex] =
    useState<number | null>(null);
  const [galleryFocusIndex, setGalleryFocusIndex] = useState(0);
  const evidenceCategories = content.categories.map((category, index) => ({
    ...category,
    color: categoryColors[index],
  }));
  const evidenceItems = content.galleryItems.map((text, index) => ({
    image: evidenceItemImages[index],
    text,
  }));

  const navigateToCategory = (index: number) => {
    const category = evidenceCategories[index];
    const target = document.getElementById("evidence-card-gallery");

    if (!target) {
      return;
    }

    setActiveCategoryIndex(index);
    setGalleryFocusIndex(categoryGalleryIndexes[index]);
    window.history.replaceState(null, "", `#${category.id}`);
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  return (
    <section id="evidence" className="section evidence-section">
      <span className="motion-section-word" aria-hidden="true">
        {content.sectionWord}
      </span>

      <div className="shell evidence-inner">
        <header className="evidence-heading">
          <div className="evidence-heading-copy">
            <div className="evidence-heading-title evidence-readable-surface">
              <p className="eyebrow">{content.eyebrow}</p>
              <h2>{content.title}</h2>
            </div>
            <p className="evidence-heading-summary evidence-readable-surface">
              {content.summary}
            </p>
          </div>

          <div className="evidence-master-folder-stage">
            <div className="evidence-master-folder-caption evidence-readable-surface">
              <span>{content.folderCaptionTitle}</span>
              <p>{content.folderCaptionCopy}</p>
            </div>

            <Folder
              size={4.6}
              color="#718a97"
              className="evidence-master-folder"
              label={content.folderLabel}
              coverImage="/media/evidence-growth-folder-cover.jpg"
              coverPosition="center 58%"
              itemLabels={evidenceCategories.map(
                (category) => `Jump to ${category.title}`,
              )}
              activeIndex={activeCategoryIndex}
              onItemActivate={navigateToCategory}
              onOpenChange={(open) => {
                if (!open) {
                  setActiveCategoryIndex(null);
                }
              }}
              items={evidenceCategories.map((category) => (
                <article
                  className="folder-paper-content evidence-folder-card"
                  style={
                    {
                      "--evidence-accent": category.color,
                    } as EvidenceCardStyle
                  }
                  key={category.id}
                >
                  <span className="evidence-folder-card-number">
                    {category.number}
                  </span>
                  <div className="evidence-folder-card-copy">
                    <p>{category.standards}</p>
                    <h3>{category.title}</h3>
                    <p>{category.copy}</p>
                  </div>
                  <i aria-hidden="true" />
                </article>
              ))}
            />

            <p className="evidence-master-folder-instruction evidence-readable-surface">
              {content.folderInstruction}
            </p>
          </div>
        </header>

        <div id="evidence-card-gallery" className="evidence-gallery-clean">
          {evidenceCategories.map((category) => (
            <span
              id={category.id}
              className="evidence-gallery-anchor"
              aria-hidden="true"
              key={category.id}
            />
          ))}
          <CircularGallery
            items={evidenceItems}
            focusIndex={galleryFocusIndex}
            bend={2.4}
            textColor="#f8f3e9"
            borderRadius={0.07}
            font='500 27px "Iowan Old Style"'
            scrollSpeed={1.7}
            scrollEase={0.055}
          />
        </div>
      </div>
    </section>
  );
}
