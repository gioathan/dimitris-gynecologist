"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "home", label: "Αρχική" },
  { href: "/doctor", icon: "medical_services", label: "Ιατρός" },
  { href: "/services", icon: "spa", label: "Υπηρεσίες" },
  { href: "/clinic", icon: "location_on", label: "Ιατρείο" },
  { href: "/contact", icon: "chat_bubble", label: "Επικοινωνία" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/90 backdrop-blur-2xl rounded-t-[2rem] shadow-[0_-10px_40px_-15px_rgba(21,28,39,0.06)]">
      {navItems.map(({ href, icon, label }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center px-5 py-2 rounded-full transition-all duration-200 ${
              isActive ? "bg-primary/10 text-primary" : "text-slate-400 hover:text-primary"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider mt-1">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
