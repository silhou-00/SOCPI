"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Siren, Scale, ShieldCheck, Share2 } from "lucide-react";

const navLinks = [
  { href: "/", label: "The Threat", icon: Siren },
  { href: "/legal-laws", label: "Legal Laws", icon: Scale },
  { href: "/privacy-tools", label: "Privacy Tools", icon: ShieldCheck },
  { href: "/social-media", label: "Social Media", icon: Share2 },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-4 left-4 z-50 flex items-center gap-4">
      {/* Hamburger Button */}
      <button
        className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-jungle-mist-800/60 bg-black/80 backdrop-blur-xl text-jungle-mist-100 cursor-pointer shrink-0 transition-all duration-300 hover:border-jungle-mist-400 hover:bg-jungle-mist-950/90 hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Expandable Bar */}
      {isOpen && (
        <div className="flex items-center h-14 rounded-full border-2 border-jungle-mist-800/60 bg-black/80 backdrop-blur-xl px-2 animate-fade-slide-in">
          {navLinks.map((link, idx) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <div key={link.href} className="flex items-center">
                {idx > 0 && (
                  <div className="w-px h-6 bg-jungle-mist-700/50 mx-1" />
                )}
                <a
                  href={link.href}
                  className={`flex items-center gap-2.5 text-base font-semibold no-underline py-2 px-5 rounded-full transition-all duration-200 ${
                    isActive
                      ? "text-jungle-mist-50 bg-jungle-mist-500/20"
                      : "text-jungle-mist-300 hover:text-jungle-mist-50 hover:bg-jungle-mist-500/15"
                  }`}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </a>
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
}
