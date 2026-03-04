"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Siren, Scale, ShieldCheck, Share2 } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  icon: any;
  subLinks?: { href: string; label: string }[];
}

const navLinks: NavLink[] = [
  { 
    href: "/threat", 
    label: "The Threat", 
    icon: Siren,
    subLinks: [
      { href: "/threat?scenario=phishing-angela-predetermined", label: "Phishing" },
      { href: "/threat?scenario=malware-angela-predetermined", label: "Malware" }
    ]
  },
  { href: "/legal-laws", label: "Legal Laws", icon: Scale },
  { href: "/privacy-tools", label: "Privacy Tools", icon: ShieldCheck },
  { href: "/social-media", label: "Social Media", icon: Share2 },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
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
        <div className="flex items-center h-14 rounded-full border-2 border-jungle-mist-800/60 bg-black/80 backdrop-blur-xl px-2 animate-fade-slide-in relative">
          {navLinks.map((link, idx) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            const isDropdown = !!link.subLinks;

            return (
              <div
                key={link.href}
                className="flex items-center relative h-full"
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {idx > 0 && (
                  <div className="w-px h-6 bg-jungle-mist-700/50 mx-1" />
                )}
                <a
                  href={isDropdown ? "#" : link.href}
                  className={`flex items-center gap-2.5 text-base font-semibold no-underline py-2 px-5 rounded-full transition-all duration-200 h-[80%] ${
                    isActive
                      ? "text-jungle-mist-50 bg-jungle-mist-500/20"
                      : "text-jungle-mist-300 hover:text-jungle-mist-50 hover:bg-jungle-mist-500/15"
                  }`}
                  onClick={(e) => {
                    if (isDropdown) e.preventDefault();
                  }}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </a>

                {/* Dropdown Menu */}
                {isDropdown && hoveredLink === link.href && (
                  <div className="absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 pt-4 bg-transparent animate-fade-in z-50">
                    {/* Invisible bridge to prevent hover gap disconnects */}
                    <div className="absolute top-0 inset-x-0 h-8 bg-transparent" />
                    <div className="w-48 bg-black/90 backdrop-blur-xl border border-jungle-mist-800/60 rounded-xl overflow-hidden shadow-xl relative">
                      {link.subLinks!.map((sub) => (
                        <a
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-3 text-sm font-semibold text-jungle-mist-300 hover:bg-jungle-mist-500/20 hover:text-jungle-mist-50 transition-colors border-b border-jungle-mist-800/30 last:border-0"
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
}
