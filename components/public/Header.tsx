"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";

const navItems = [
  { href: "/", label: "Αρχική" },
  { href: "/doctor", label: "Ιατρός" },
  { href: "/clinic", label: "Ιατρείο" },
  { href: "/services", label: "Υπηρεσίες" },
  { href: "/articles", label: "Άρθρα" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

          {/* ── Mobile left: hamburger ── */}
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container transition-colors"
            onClick={() => setOpen(true)}
            aria-label="Μενού"
          >
            <span className="material-symbols-outlined text-on-surface">menu</span>
          </button>

          {/* ── Desktop left: logo + text ── */}
          <Link href="/" className="hidden lg:flex items-center">
            <Logo showText />
          </Link>

          {/* ── Mobile center: site name ── */}
          <Link
            href="/"
            className="lg:hidden text-sm font-bold tracking-widest uppercase text-on-surface"
          >
            Ιατρείο Παπαδόπουλος
          </Link>

          {/* ── Desktop center/right: nav links ── */}
          <nav className="hidden lg:flex items-center gap-7 ml-auto mr-6">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-semibold transition-colors duration-150 ${
                  isActive(href)
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Desktop CTA + Mobile logo ── */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden lg:inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-sm shadow-primary/20 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              Ραντεβού
            </Link>
            {/* Logo always on the right */}
            <Logo />
          </div>
        </div>
      </header>

      {/* ── Mobile drawer overlay ── */}
      {open && (
        <div className="fixed inset-0 z-[60] flex lg:hidden">
          <div
            className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-surface h-full shadow-2xl flex flex-col">
            <div className="flex justify-between items-center px-6 py-5 border-b border-outline-variant/20">
              <Logo showText />
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4 flex-1">
              {[...navItems, { href: "/contact", label: "Επικοινωνία" }].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-semibold transition-colors ${
                    isActive(href)
                      ? "bg-primary/10 text-primary"
                      : "text-on-surface hover:bg-surface-container"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="px-6 pb-8">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
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
