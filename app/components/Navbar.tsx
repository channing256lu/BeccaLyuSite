"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "../content/siteContent";

type MenuPhase = "closed" | "open" | "closing";
type DesktopMenuState = {
  id: string | null;
  phase: MenuPhase;
};

function readMotionDuration(property: string, fallback: number) {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(property)
    .trim();
  const value = Number.parseFloat(raw);

  if (!Number.isFinite(value)) return fallback;
  return raw.endsWith("s") && !raw.endsWith("ms") ? value * 1000 : value;
}

type NavbarProps = {
  content: SiteContent["nav"];
};

export function Navbar({ content }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuPhase, setMenuPhase] = useState<MenuPhase>("closed");
  const [desktopMenu, setDesktopMenu] = useState<DesktopMenuState>({
    id: null,
    phase: "closed",
  });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const desktopCloseDelay = useRef<ReturnType<typeof setTimeout> | null>(null);
  const desktopCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuOpen = menuPhase === "open";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      if (desktopCloseDelay.current) clearTimeout(desktopCloseDelay.current);
      if (desktopCloseTimer.current) clearTimeout(desktopCloseTimer.current);
    },
    [],
  );

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenuPhase("open");
  };

  const closeMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenuPhase("closing");
    closeTimer.current = setTimeout(
      () => setMenuPhase("closed"),
      readMotionDuration("--dropdown-close-dur", 150),
    );
  };

  const openDesktopMenu = (id: string) => {
    if (desktopCloseDelay.current) clearTimeout(desktopCloseDelay.current);
    if (desktopCloseTimer.current) clearTimeout(desktopCloseTimer.current);
    setDesktopMenu({ id, phase: "open" });
  };

  const navigateDesktopMenuHome = (href: string) => {
    openDesktopMenu(href);
    if (pathname !== href || window.location.hash) router.push(href);
  };

  const handleDesktopMenuEnter = (href: string) => {
    if (href === "/about") {
      navigateDesktopMenuHome(href);
      return;
    }

    openDesktopMenu(href);
  };

  const closeDesktopMenu = (id: string) => {
    if (desktopCloseDelay.current) clearTimeout(desktopCloseDelay.current);
    if (desktopCloseTimer.current) clearTimeout(desktopCloseTimer.current);

    setDesktopMenu((current) =>
      current.id === id ? { id, phase: "closing" } : current,
    );
    desktopCloseTimer.current = setTimeout(() => {
      setDesktopMenu((current) =>
        current.id === id ? { id: null, phase: "closed" } : current,
      );
    }, readMotionDuration("--dropdown-close-dur", 150));
  };

  const queueDesktopMenuClose = (id: string) => {
    if (desktopCloseDelay.current) clearTimeout(desktopCloseDelay.current);
    desktopCloseDelay.current = setTimeout(() => closeDesktopMenu(id), 110);
  };

  return (
    <header
      className={`site-header ${scrolled ? "is-scrolled" : ""}`}
    >
      <nav className="shell nav-shell" aria-label="Primary navigation">
        <Link href="/" className="brand" aria-label={content.homeLabel}>
          <span className="brand-mark" aria-hidden="true">
            {content.brandInitials}
          </span>
          <span className="brand-name">{content.brandName}</span>
        </Link>

        <ul className="desktop-nav">
          {content.links.map((link) => {
            const isActive = pathname === link.href;
            const submenuId = link.submenu
              ? `desktop-submenu-${link.href.slice(1)}`
              : undefined;
            const submenuPhase =
              desktopMenu.id === link.href ? desktopMenu.phase : "closed";

            return (
              <li
                className={link.submenu ? "desktop-submenu-menu" : undefined}
                key={link.href}
                onMouseEnter={
                  link.submenu
                    ? () => handleDesktopMenuEnter(link.href)
                    : undefined
                }
                onMouseLeave={
                  link.submenu
                    ? (event) => {
                        if (
                          !event.currentTarget.contains(document.activeElement)
                        ) {
                          queueDesktopMenuClose(link.href);
                        }
                      }
                    : undefined
                }
                onFocusCapture={
                  link.submenu
                    ? () => openDesktopMenu(link.href)
                    : undefined
                }
                onBlurCapture={
                  link.submenu
                    ? (event) => {
                        if (
                          !event.currentTarget.contains(
                            event.relatedTarget as Node | null,
                          )
                        ) {
                          queueDesktopMenuClose(link.href);
                        }
                      }
                    : undefined
                }
                onKeyDown={
                  link.submenu
                    ? (event) => {
                        if (event.key === "Escape") {
                          event.preventDefault();
                          closeDesktopMenu(link.href);
                          event.currentTarget
                            .querySelector<HTMLButtonElement>(
                              ".desktop-submenu-trigger",
                            )
                            ?.focus();
                        }
                      }
                    : undefined
                }
              >
                {link.submenu ? (
                  <button
                    type="button"
                    className={`desktop-submenu-trigger ${
                      isActive ? "is-active" : ""
                    }`}
                    aria-haspopup="menu"
                    aria-expanded={submenuPhase === "open"}
                    aria-controls={submenuId}
                    onClick={() => navigateDesktopMenuHome(link.href)}
                  >
                    {link.label}
                    <span className="nav-submenu-chevron" aria-hidden="true">
                      ↓
                    </span>
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={isActive ? "is-active" : undefined}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                )}

                {link.submenu ? (
                  <ul
                    id={submenuId}
                    data-origin="top-center"
                    aria-hidden={submenuPhase !== "open"}
                    inert={submenuPhase !== "open"}
                    className={`desktop-submenu ${
                      submenuPhase === "open"
                        ? "is-open"
                        : submenuPhase === "closing"
                          ? "is-closing"
                          : ""
                    }`}
                    aria-label={`${link.label} submenu`}
                  >
                    {link.submenu.map((subLink) => (
                      <li key={subLink.href}>
                        <Link
                          href={subLink.href}
                          className="nav-submenu-link-label-only"
                        >
                          <span>{subLink.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          className="menu-toggle"
          onClick={menuOpen ? closeMenu : openMenu}
        >
          <span
            className="t-icon-swap"
            data-state={menuOpen ? "b" : "a"}
            aria-hidden="true"
          >
            <span className="t-icon menu-glyph" data-icon="a">
              ≡
            </span>
            <span className="t-icon menu-glyph" data-icon="b">
              ×
            </span>
          </span>
        </button>
      </nav>

      <ul
        id="mobile-navigation"
        data-origin="top-right"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={`t-dropdown mobile-nav ${
          menuPhase === "open"
            ? "is-open"
            : menuPhase === "closing"
              ? "is-closing"
              : ""
        }`}
      >
        {content.links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <li
              className={link.submenu ? "mobile-submenu-menu" : undefined}
              key={link.href}
            >
              <Link
                href={link.href}
                className={isActive ? "is-active" : undefined}
                aria-current={isActive ? "page" : undefined}
                onClick={closeMenu}
              >
                {link.label}
              </Link>

              {link.submenu ? (
                <ul
                  className="mobile-submenu"
                  aria-label={`${link.label} submenu`}
                >
                  {link.submenu.map((subLink) => (
                    <li key={subLink.href}>
                      <Link
                        href={subLink.href}
                        className="nav-submenu-link-label-only"
                        onClick={closeMenu}
                      >
                        <span>{subLink.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </header>
  );
}
