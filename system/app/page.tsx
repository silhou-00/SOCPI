"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Siren, Scale, ShieldCheck, Share2, ChevronRight } from "lucide-react";

const navButtons = [
  {
    id: "threat",
    label: "The Threat",
    icon: Siren,
    href: "#",
    hasDropdown: true,
    subLinks: [
      { href: "/threat?scenario=phishing-angela-predetermined", label: "Phishing" },
      { href: "/threat?scenario=malware-angela-predetermined", label: "Malware" },
    ],
  },
  { id: "legal", label: "Legal Laws", icon: Scale, href: "/legal-laws" },
  { id: "privacy", label: "Privacy Tools", icon: ShieldCheck, href: "/privacy-tools" },
  { id: "social", label: "Social Media", icon: Share2, href: "/social-media" },
];

export default function Home() {
  const [eyesOpen, setEyesOpen] = useState(true);
  const [threatOpen, setThreatOpen] = useState(false);

  /* ── Angela blink loop ── */
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const blink = () => {
      // Eyes open for 2.5–4s
      const openDuration = 2500 + Math.random() * 1500;
      timeout = setTimeout(() => {
        setEyesOpen(false);
        // Eyes closed for 150–250ms (natural blink)
        timeout = setTimeout(() => {
          setEyesOpen(true);
          blink();
        }, 150 + Math.random() * 100);
      }, openDuration);
    };

    blink();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden relative">
      {/* ── Gradient Background (matching other pages) ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(19,19,38,1) 0%, rgba(35,37,59,1) 50%)",
        }}
      />

      {/* ── Content Overlay ── */}
      <div className="relative z-10 flex flex-col h-full pl-24 pt-16">
        
        {/* ── Title Section ── */}
        <div className="z-20 relative">
          <h1 className="text-[4rem] font-bold text-white tracking-tight leading-tight drop-shadow-md">
            Social Cyber Threats and Protection
          </h1>
          <p className="text-xl text-jungle-mist-300 mt-2 font-medium tracking-wide drop-shadow-md">
            Social and Professional Issues
          </p>
        </div>

        {/* ── Main Area: Angela (left) + Nav Buttons (middle-ish) ── */}
        <div className="flex-1 flex mt-20">
          
          {/* ── Angela Character ── */}
          <div className="relative h-[140%] -mt-24 w-auto shrink-0 flex items-end">
            {/* Stare (eyes open) — base layer, always fully opaque */}
            <Image
              src="/Character/Angela-Stare.png"
              alt="Angela eyes open"
              width={650}
              height={1100}
              className="h-full w-auto object-contain drop-shadow-[0_0_40px_rgba(126,168,178,0.1)]"
              priority
            />
            {/* Idle (eyes closed) — overlay layer, fades in and out to prevent transparency glitch */}
            <Image
              src="/Character/Angela-Idle.png"
              alt="Angela eyes closed"
              width={650}
              height={1100}
              className={`absolute inset-0 h-full w-auto object-contain drop-shadow-[0_0_40px_rgba(126,168,178,0.1)] transition-opacity duration-100 ${
                eyesOpen ? "opacity-0" : "opacity-100"
              }`}
              priority
            />
          </div>

          {/* ── Navigation Buttons ── */}
          <div className="flex flex-col gap-6 ml-20 justify-center pb-32">
            {navButtons.map((btn) => {
              const Icon = btn.icon;
              const isDropdown = btn.hasDropdown;

              return (
                <div key={btn.id} className="flex flex-row items-center gap-6">
                  {/* Main Button */}
                  <div>
                    <a
                      href={isDropdown ? undefined : btn.href}
                      onClick={(e) => {
                        if (isDropdown) {
                          e.preventDefault();
                          setThreatOpen((prev) => !prev);
                        }
                      }}
                      className="flex items-center gap-4 w-85 py-5 px-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl text-white font-bold text-xl tracking-wide shadow-lg no-underline cursor-pointer transition-all duration-200 hover:border-white/30 hover:bg-white/10 hover:-translate-y-0.5 select-none relative group overflow-hidden"
                    >
                      {/* Subtle inner top highlight */}
                      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
                      
                      <Icon size={24} className="shrink-0 text-jungle-mist-200 group-hover:text-white transition-colors" />
                      <span>{btn.label}</span>
                      {isDropdown && (
                        <ChevronRight
                          size={20}
                          className={`ml-auto text-jungle-mist-400 group-hover:text-white transition-all duration-300 ${
                            threatOpen ? "" : "rotate-180"
                          }`}
                        />
                      )}
                    </a>
                  </div>

                  {/* Threat Dropdown — appears to the right of the button */}
                  {isDropdown && threatOpen && (
                    <div className="flex flex-col gap-3 animate-fade-slide-in">
                      {btn.subLinks!.map((sub) => (
                        <a
                          key={sub.href}
                          href={sub.href}
                          className="flex items-center gap-3 w-73 py-4 px-6 rounded-xl border border-white/5 bg-black/30 backdrop-blur-lg text-jungle-mist-200 font-semibold text-base no-underline cursor-pointer transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white group"
                        >
                          <ChevronRight size={16} className="text-jungle-mist-500 group-hover:text-white transition-colors" />
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
