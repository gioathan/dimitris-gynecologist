"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";

type NavChild = { href: string; label: string };
type NavItem = { href: string; label: string; children?: NavChild[] };

interface HeaderProps {
  navItems: NavItem[];
  instagram?: string | null;
}

export default function Header({ navItems, instagram }: HeaderProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-secondary/90 backdrop-blur-md border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

          {/* ── Mobile left: hamburger ── */}
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container transition-colors"
            onClick={() => setDrawerOpen(true)}
            aria-label="Μενού"
          >
            <span className="material-symbols-outlined text-on-surface">menu</span>
          </button>

          {/* ── Desktop left: logo + text ── */}
          <Link href="/" className="hidden lg:flex items-center">
            <Logo showText circled />
          </Link>

          {/* ── Mobile center: site name ── */}
          <Link
            href="/"
            className="lg:hidden min-w-0 flex-1 text-xs font-bold tracking-wide uppercase text-white truncate text-center px-2"
          >
            Δημήτριος Ελ. Χριστακόπουλος
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden lg:flex items-center gap-7 ml-auto mr-6">
            {navItems.map(({ href, label, children }) =>
              children?.length ? (
                <div key={href} className="relative group">
                  <Link
                    href={href}
                    className={`text-sm font-semibold transition-colors duration-150 ${
                      isActive(href) ? "text-primary" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                  {/* pt-4 creates a hover bridge so the gap doesn't close the dropdown */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 z-50">
                    <div className="bg-secondary-container/95 backdrop-blur-md rounded-2xl shadow-2xl border border-outline-variant/20 p-1.5 w-56">
                      {children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:bg-secondary transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          <span className="truncate">{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm font-semibold transition-colors duration-150 ${
                    isActive(href) ? "text-primary" : "text-white/60 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              )
            )}
          </nav>

          {/* ── Desktop CTA + instagram + mobile logo ── */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden lg:inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-sm shadow-primary/20 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              Ραντεβού
            </Link>
            {/* Instagram — desktop only */}
            {instagram && (
              <a
                href={instagram.startsWith("http") ? instagram : `https://instagram.com/${instagram.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center justify-center w-9 h-9 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}
            {/* Mobile right: instagram + logo */}
            <div className="lg:hidden flex items-center gap-2">
              {instagram && (
                <a
                  href={instagram.startsWith("http") ? instagram : `https://instagram.com/${instagram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              <Logo circled />
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] flex lg:hidden">
          <div
            className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-surface h-full shadow-2xl flex flex-col">
            <div className="flex justify-between items-center px-6 py-5 border-b border-outline-variant/20">
              <Logo showText textDark />
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
              {[...navItems, { href: "/contact", label: "Επικοινωνία" }].map(({ href, label, children }) => (
                <div key={href}>
                  <div className="flex items-center">
                    <Link
                      href={href}
                      onClick={() => { setDrawerOpen(false); setExpandedMobile(null); }}
                      className={`flex-1 flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-semibold transition-colors ${
                        isActive(href)
                          ? "bg-primary/10 text-primary"
                          : "text-on-surface hover:bg-surface-container"
                      }`}
                    >
                      {label}
                    </Link>
                    {children?.length ? (
                      <button
                        onClick={() => setExpandedMobile(expandedMobile === href ? null : href)}
                        className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-surface-container transition-colors shrink-0"
                      >
                        <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 ${expandedMobile === href ? "rotate-180" : ""}`}>
                          expand_more
                        </span>
                      </button>
                    ) : null}
                  </div>
                  {children?.length && expandedMobile === href ? (
                    <div className="pl-4 mt-1 flex flex-col gap-1">
                      {children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => { setDrawerOpen(false); setExpandedMobile(null); }}
                          className="px-4 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>
            <div className="px-6 pb-8 flex flex-col gap-3">
              <Link
                href="/contact"
                onClick={() => setDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-container text-white font-bold py-4 rounded-full shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                Κλείστε Ραντεβού
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
