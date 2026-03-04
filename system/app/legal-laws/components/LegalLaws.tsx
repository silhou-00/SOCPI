"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import lawsData from "@/app/data/laws.json";

/* ── Types ── */
interface Law {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export default function LegalLaws() {
  const [selectedLaw, setSelectedLaw] = useState<Law | null>(null);

  const speechBubbleText =
    "In the Philippines, identity theft is addressed through several key laws that protect personal data, regulate online behavior, and penalize fraud-related offenses.";

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden relative">
      {/* ── Gradient Background (from @theme) ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(19,19,38,1) 0%, rgba(35,37,59,1) 50%)",
        }}
      />

      {/* ── Main Content ── */}
      <div className="relative z-10 flex-1 flex flex-row items-stretch mt-20 mx-3 mb-3 gap-0">

        {/* ═══ LEFT SIDE: Angela + Speech Bubble ═══ */}
        <div
          className={`relative flex flex-col items-center transition-all duration-500 ease-in-out ${
            selectedLaw ? "w-[30%]" : "w-[40%]"
          }`}
        >
          {/* Speech Bubble — only when no law is selected */}
          {!selectedLaw && (
            <div className="w-[95%] max-w-85 z-5 animate-fade-in mt-10 -mb-15 shrink-0">
              <div className="relative bg-black/70 border border-jungle-mist-800/40 backdrop-blur-xl rounded-2xl px-5 py-4">
                <p className="text-sm lg:text-base leading-6 text-jungle-mist-200 text-center">
                  {speechBubbleText}
                </p>
                {/* Bubble tail */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-12 border-l-transparent border-r-12 border-r-transparent border-t-12 border-t-black/70" />
              </div>
            </div>
          )}

          {/* Angela Character — cropped at waist via overflow-hidden container */}
          <div className="relative z-10 w-full flex-1 overflow-hidden flex items-start justify-center">
            <Image
              src="/Character/Angela-Idle.png"
              alt="Angela"
              width={600}
              height={1000}
              className="w-auto object-cover object-top transition-all duration-500 ease-in-out drop-shadow-[0_0_40px_rgba(126,168,178,0.15)]"
              style={{
                height: "160%",
                maxWidth: "none",
                transform: selectedLaw ? "scaleX(-1)" : "scaleX(1)",
              }}
              priority
            />
          </div>
        </div>

        {/* ═══ RIGHT SIDE: Law Cards / Expanded Detail ═══ */}
        <div className="flex-1 flex flex-col gap-4 justify-center px-4 lg:px-8 min-h-0">

          {/* ── Default: 3 Law Cards ── */}
          {!selectedLaw && (
            <>
              {(lawsData as Law[]).map((law) => (
                <button
                  key={law.id}
                  className="group flex flex-col items-center gap-4 py-6 px-6 lg:py-7 lg:px-8 rounded-xl cursor-pointer transition-all duration-300 border-t-transparent border-l-transparent border-r-transparent border-b-2 border-b-jungle-mist-500/60 bg-black/30 backdrop-blur-sm hover:bg-jungle-mist-950/50 hover:border-b-jungle-mist-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(126,168,178,0.15)] animate-fade-in"
                  onClick={() => setSelectedLaw(law)}
                >
                  {/* Icon */}
                  <div className="w-16 h-16 lg:w-20 lg:h-20 relative shrink-0">
                    <Image
                      src={law.icon}
                      alt={law.title}
                      fill
                      className="object-contain drop-shadow-[0_0_12px_rgba(126,168,178,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(126,168,178,0.5)] transition-all duration-300"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg lg:text-xl font-bold text-jungle-mist-200 tracking-wide uppercase text-center group-hover:text-jungle-mist-50 transition-colors duration-300">
                    {law.title}
                  </h3>
                </button>
              ))}
            </>
          )}

          {/* ── Expanded: Selected Law Detail ── */}
          {selectedLaw && (
            <div className="flex-1 flex flex-col rounded-2xl border border-jungle-mist-800/30 bg-black/40 backdrop-blur-sm overflow-hidden animate-fade-in">
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-jungle-mist-800/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 relative shrink-0">
                    <Image
                      src={selectedLaw.icon}
                      alt={selectedLaw.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-jungle-mist-100 tracking-wide uppercase">
                    {selectedLaw.title}
                  </h2>
                </div>
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-jungle-mist-800/30 text-jungle-mist-400 cursor-pointer hover:text-jungle-mist-100 hover:border-jungle-mist-600 transition-all"
                  onClick={() => setSelectedLaw(null)}
                >
                  <X size={20} />
                </button>
              </div>
              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                <p className="text-lg lg:text-xl leading-9 text-jungle-mist-200 whitespace-pre-line">
                  {selectedLaw.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
