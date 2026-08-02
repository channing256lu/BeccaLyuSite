"use client";

import { useEffect } from "react";
import "./BorderGlow.css";

const defaultSurfaceSelector = [
  ".site-header",
  ".brand-mark",
  ".button",
  ".menu-toggle",
  ".about-grid",
  ".identity-card",
  ".story-chapter",
  ".foundation-grid",
  ".experience-card-face",
  ".experience-side-control",
  ".project-card",
  ".portfolio-folder-showcase",
  ".portfolio-folder-legend > span",
  ".quality-card",
  ".core-strength-card",
  ".toolkit-group",
  ".qualification-card",
  ".toolkit-tag-list > a",
  ".credential-list > span",
  ".evidence-folder-card",
  ".contact-action",
].join(",");

const edgeSurfaceSelector = [
  ".site-header",
  ".about-grid",
  ".identity-card",
  ".story-chapter",
  ".foundation-grid",
  ".experience-card-face",
  ".project-card",
  ".portfolio-folder-showcase",
  ".core-strength-card",
  ".toolkit-group",
  ".evidence-folder-card",
].join(",");

type BorderGlowProps = {
  selector?: string;
  glowColor?: string;
  glowRadius?: number;
  glowIntensity?: number;
  colors?: string[];
};

function parseHsl(value: string) {
  const match = value.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);

  if (!match) {
    return { h: 44, s: 58, l: 67 };
  }

  return {
    h: Number.parseFloat(match[1]),
    s: Number.parseFloat(match[2]),
    l: Number.parseFloat(match[3]),
  };
}

function setGlowVariables(
  element: HTMLElement,
  {
    glowColor,
    glowRadius,
    glowIntensity,
    colors,
  }: Required<Omit<BorderGlowProps, "selector">>,
) {
  const { h, s, l } = parseHsl(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const opacityKeys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];

  element.style.setProperty("--glow-padding", `${glowRadius}px`);
  element.style.setProperty("--glow-accent-one", colors[0] ?? "#d6b65f");
  element.style.setProperty("--glow-accent-two", colors[1] ?? colors[0]);
  element.style.setProperty("--glow-accent-three", colors[2] ?? colors[0]);

  opacities.forEach((opacity, index) => {
    element.style.setProperty(
      `--glow-color${opacityKeys[index]}`,
      `hsl(${base} / ${Math.min(opacity * glowIntensity, 100)}%)`,
    );
  });
}

export function BorderGlow({
  selector = defaultSurfaceSelector,
  glowColor = "42 64 58",
  glowRadius = 38,
  glowIntensity = 0.9,
  colors = ["#ddb84e", "#89a5b3", "#c97f6d"],
}: BorderGlowProps) {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(selector),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(
            "is-glow-active",
            entry.isIntersecting,
          );
        });
      },
      { rootMargin: "48px 0px", threshold: 0.01 },
    );

    targets.forEach((element, index) => {
      element.classList.add("border-glow-target");

      if (getComputedStyle(element).position === "static") {
        element.classList.add("border-glow-positioned");
      }

      setGlowVariables(element, {
        glowColor,
        glowRadius,
        glowIntensity,
        colors,
      });
      element.style.setProperty(
        "--glow-orbit-delay",
        `${-((index % 10) * 0.83)}s`,
      );

      if (element.matches("ul, ol")) {
        element.classList.add("border-glow-static");
      } else {
        const mesh = document.createElement("span");
        mesh.className = "border-glow-mesh";
        mesh.setAttribute("aria-hidden", "true");
        element.append(mesh);

        if (element.matches(edgeSurfaceSelector)) {
          const edge = document.createElement("span");
          edge.className = "border-glow-edge";
          edge.setAttribute("aria-hidden", "true");
          element.append(edge);
        }
      }

      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      targets.forEach((element) => {
        element.classList.remove(
          "border-glow-target",
          "border-glow-positioned",
          "border-glow-static",
          "is-glow-active",
        );
        element
          .querySelectorAll(
            ":scope > .border-glow-mesh, :scope > .border-glow-edge",
          )
          .forEach((layer) => layer.remove());
      });
    };
  }, [
    colors,
    glowColor,
    glowIntensity,
    glowRadius,
    selector,
  ]);

  return null;
}
