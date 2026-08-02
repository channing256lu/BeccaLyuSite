"use client";

import { useEffect, useRef } from "react";
import type { SiteContent } from "../content/siteContent";

type ContactActionsProps = {
  content: Pick<
    SiteContent["contact"],
    | "email"
    | "copyEmailLabel"
    | "copiedLabel"
    | "tryAgainLabel"
    | "copySuccess"
    | "copyError"
    | "cvLabel"
  >;
};

function readTextSwapDuration() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--text-swap-dur")
    .trim();
  const value = Number.parseFloat(raw);

  if (!Number.isFinite(value)) return 150;
  return raw.endsWith("s") && !raw.endsWith("ms") ? value * 1000 : value;
}

function fallbackCopy(value: string) {
  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.append(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();

  if (!copied) throw new Error("Copy command was unavailable");
}

export function ContactActions({ content }: ContactActionsProps) {
  const labelRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const swapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    },
    [],
  );

  const swapLabel = (next: string) => {
    const label = labelRef.current;
    if (!label) return;

    if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
    label.classList.remove("is-exit", "is-enter-start");
    void label.offsetHeight;
    label.classList.add("is-exit");

    swapTimerRef.current = setTimeout(() => {
      label.textContent = next;
      label.classList.remove("is-exit");
      label.classList.add("is-enter-start");
      void label.offsetHeight;
      label.classList.remove("is-enter-start");
    }, readTextSwapDuration());
  };

  const copyEmail = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(content.email);
      } else {
        fallbackCopy(content.email);
      }

      swapLabel(content.copiedLabel);
      if (statusRef.current) {
        statusRef.current.textContent = content.copySuccess;
      }
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        swapLabel(content.copyEmailLabel);
        if (statusRef.current) statusRef.current.textContent = "";
      }, 2200);
    } catch {
      swapLabel(content.tryAgainLabel);
      if (statusRef.current) {
        statusRef.current.textContent = content.copyError;
      }
    }
  };

  return (
    <div className="contact-actions" aria-label="Contact shortcuts">
      <button
        className="contact-action"
        type="button"
        onClick={copyEmail}
        aria-describedby="contact-copy-status"
      >
        <span ref={labelRef} className="t-text-swap">
          {content.copyEmailLabel}
        </span>
        <span className="contact-action-mark" aria-hidden="true">
          +
        </span>
      </button>

      <a
        className="contact-action"
        href="/media/becca-lyu-cv.pdf"
        target="_blank"
        rel="noreferrer"
        aria-label="View and download Becca Lyu's CV as a PDF"
      >
        <span>{content.cvLabel}</span>
        <span className="contact-action-mark" aria-hidden="true">
          ↓
        </span>
      </a>

      <span
        id="contact-copy-status"
        ref={statusRef}
        className="contact-action-status"
        role="status"
        aria-live="polite"
      />
    </div>
  );
}
