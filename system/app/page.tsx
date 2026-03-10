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
    <div className="h-screen w-full flex flex-col overflow-hidden relative group/page">
      {/* ── Gradient Background ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(19,19,38,1) 0%, rgba(35,37,59,1) 50%)",
        }}
      />

      {/* ── Animated Background Grid ── */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none transition-opacity duration-1000 group-hover/page:opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(126,168,178,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(126,168,178,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      />
      
      {/* ── Ambient Glowing Accents ── */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-jungle-mist-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

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
                  <div className="relative">
                    {/* Glowing highlight behind active button */}
                    {isDropdown && threatOpen && (
                      <div className="absolute inset-0 bg-jungle-mist-400/20 blur-xl rounded-2xl transition-opacity duration-300"></div>
                    )}
                    
                    <a
                      href={isDropdown ? undefined : btn.href}
                      onClick={(e) => {
                        if (isDropdown) {
                          e.preventDefault();
                          setThreatOpen((prev) => !prev);
                        }
                      }}
                      className={`flex items-center gap-4 w-85 py-5 px-8 rounded-2xl border border-white/10 backdrop-blur-xl font-bold text-xl tracking-wide shadow-xl no-underline cursor-pointer transition-all duration-300 select-none relative group overflow-hidden
                        ${isDropdown && threatOpen 
                          ? "bg-white/10 border-white/40 text-white shadow-[0_0_30px_rgba(126,168,178,0.2)] translate-x-2" 
                          : "bg-black/40 text-jungle-mist-100 hover:bg-white/10 hover:border-white/30 hover:text-white hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(126,168,178,0.3)] hover:translate-x-1"
                        }
                      `}
                    >
                      {/* Subtle inner top highlight */}
                      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      
                      {/* Hover gradient overlay */}
                      <div className="absolute inset-0 bg-linear-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                      <Icon size={24} className={`shrink-0 transition-colors duration-300 ${isDropdown && threatOpen ? "text-jungle-mist-200" : "text-jungle-mist-400 group-hover:text-jungle-mist-200"}`} />
                      <span className="relative z-10">{btn.label}</span>
                      
                      {isDropdown && (
                        <ChevronRight
                          size={20}
                          className={`ml-auto transition-transform duration-300 ${isDropdown && threatOpen ? "text-jungle-mist-200" : "text-jungle-mist-500 group-hover:text-jungle-mist-300"} ${
                            threatOpen ? "" : "rotate-180"
                          }`}
                        />
                      )}
                    </a>
                  </div>

                  {/* Threat Dropdown — appears to the right of the button */}
                  {isDropdown && threatOpen && (
                    <div className="flex flex-col gap-3 animate-fade-slide-in ml-4">
                      {btn.subLinks!.map((sub) => (
                        <a
                          key={sub.href}
                          href={sub.href}
                          className="flex items-center gap-3 w-73 py-4 px-6 rounded-xl border border-white/5 bg-black/40 backdrop-blur-lg text-jungle-mist-300 font-semibold text-base no-underline cursor-pointer transition-all duration-300 hover:border-jungle-mist-500/50 hover:bg-jungle-mist-900/40 hover:text-white hover:translate-x-2 hover:shadow-[0_0_20px_rgba(126,168,178,0.15)] group relative overflow-hidden"
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-jungle-mist-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 rounded-l-xl"></div>
                          <ChevronRight size={16} className="text-jungle-mist-600 group-hover:text-jungle-mist-400 transition-colors duration-300 group-hover:translate-x-1" />
                          <span className="relative z-10">{sub.label}</span>
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
