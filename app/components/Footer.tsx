"use client";

import { usePathname } from "next/navigation";
import type { SiteContent } from "../content/siteContent";

type FooterProps = {
  content: SiteContent["footer"];
};

export function Footer({ content }: FooterProps) {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <p>
          © {new Date().getFullYear()} {content.copyrightName}
        </p>
        <p>{content.tagline}</p>
        <p className="visual-credit">
          {content.visualCreditPrefix}{" "}
          <a href="https://www.pexels.com/" target="_blank" rel="noreferrer">
            {content.pexelsLabel}
          </a>{" "}
          {content.visualCreditMiddle}{" "}
          <a href="https://unsplash.com/" target="_blank" rel="noreferrer">
            {content.unsplashLabel}
          </a>
        </p>
      </div>
    </footer>
  );
}
