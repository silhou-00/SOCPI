"use client";

import { useState } from "react";
import { Menu, X, Siren } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
        <div className="flex items-center h-14 rounded-full border-2 border-jungle-mist-800/60 bg-black/80 backdrop-blur-xl px-6 animate-fade-slide-in">
          <a
            href="/"
            className="flex items-center gap-2.5 text-base font-semibold text-jungle-mist-300 no-underline py-2 px-5 rounded-full transition-all duration-200 hover:text-jungle-mist-50 hover:bg-jungle-mist-500/15"
          >
            <Siren size={18} />
            <span>The Threat</span>
          </a>
        </div>
      )}
    </nav>
  );
}
