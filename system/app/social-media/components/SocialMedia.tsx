"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Bell, LogOut, ShieldAlert } from "lucide-react";
import SocialMediaAuth from "./SocialMediaAuth";
import socmedData from "@/app/data/socmed.json";

/* ── Types ── */
interface ChecklistItem {
  id: string;
  category: string;
  statement: string;
  riskIfYes: boolean;
  explanation: string;
}

/* ── Category accent colors ── */
function getCategoryAccent(category: string): string {
  const map: Record<string, string> = {
    "Profile Privacy": "#06b6d4",
    "Account Security": "#8b5cf6",
    "Social Awareness": "#f97316",
    "App Permissions": "#ec4899",
    "Content Sharing": "#f59e0b",
  };
  return map[category] || "#7ea8b2";
}

export default function SocialMedia() {
  const [username, setUsername] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showingExplanation, setShowingExplanation] = useState(false);
  const [lastAnsweredId, setLastAnsweredId] = useState<string | null>(null);

  /* ── Auth screen ── */
  if (!username) {
    return <SocialMediaAuth onAuthenticated={(name) => setUsername(name)} />;
  }

  /* ── Finalize Account screen ── */
  const items = socmedData as ChecklistItem[];
  const allDone = currentIndex >= items.length;

  const handleAnswer = (id: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setLastAnsweredId(id);
    setShowingExplanation(true);
  };

  const handleContinue = () => {
    // Only advance if the answered item was the current question (not a re-answer of a past card)
    const answeredIdx = items.findIndex((i) => i.id === lastAnsweredId);
    setShowingExplanation(false);
    setLastAnsweredId(null);
    if (answeredIdx === currentIndex) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  /* Get the explanation item for Angela's speech bubble */
  const explanationItem = lastAnsweredId
    ? items.find((i) => i.id === lastAnsweredId)
    : null;
  const isLastAnswerRisky = explanationItem
    ? explanationItem.riskIfYes
      ? answers[explanationItem.id]
      : !answers[explanationItem.id]
    : false;



  return (
    <div className="h-screen w-full flex flex-col overflow-hidden relative">
      {/* ── Gradient Background ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(19,19,38,1) 0%, rgba(35,37,59,1) 50%)",
        }}
      />

      {/* ── Top Bar ── */}
      <header className="relative z-20 flex items-center justify-between h-14 px-5 border-b border-jungle-mist-800/20 bg-black/60 backdrop-blur-xl shrink-0 mt-20">
        <h1 className="text-xl font-extrabold tracking-tight">
          <span className="text-jungle-mist-50">Nex</span>
          <span className="text-jungle-mist-400">Link</span>
        </h1>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-jungle-mist-800/30 bg-jungle-mist-950/50 w-64">
          <Search size={14} className="text-jungle-mist-600" />
          <input
            placeholder="Search NexLink"
            className="bg-transparent text-sm text-jungle-mist-200 placeholder:text-jungle-mist-700 outline-none w-full"
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button className="text-jungle-mist-500 hover:text-jungle-mist-200 transition-colors cursor-pointer">
            <Bell size={18} />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-jungle-mist-800/30 bg-jungle-mist-950/40">
            <div className="w-6 h-6 rounded-full bg-jungle-mist-600 flex items-center justify-center text-xs font-bold text-white uppercase">
              {username[0]}
            </div>
            <span className="text-xs font-semibold text-jungle-mist-300 hidden sm:block">
              {username}
            </span>
          </div>
          <button
            onClick={() => setUsername(null)}
            className="text-jungle-mist-600 hover:text-red-400 transition-colors cursor-pointer"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div className="relative z-10 flex-1 flex min-h-0 mt-3 mx-3 mb-3 gap-0">

        {/* ═══ LEFT SIDE: Angela + Speech Bubble ═══ */}
        <div className="relative flex flex-col items-center w-[30%] lg:w-[28%]">
          {/* Speech Bubble — auto-shows explanation after answering */}
          {showingExplanation && explanationItem && (
            <div className="w-[95%] max-w-85 z-20 animate-fade-in mb-1 shrink-0">
              <div className={`relative border backdrop-blur-xl rounded-2xl px-5 py-4 ${
                isLastAnswerRisky
                  ? "bg-red-950/60 border-red-500/30"
                  : "bg-emerald-950/60 border-emerald-500/30"
              }`}>
                <p className={`text-[0.65rem] font-bold uppercase tracking-widest mb-2 ${
                  isLastAnswerRisky ? "text-red-400" : "text-emerald-400"
                }`}>
                  {isLastAnswerRisky ? "⚠ Potential Risk" : "✓ Good Practice"}
                </p>
                <p className="text-sm lg:text-base leading-6 text-jungle-mist-200">
                  {explanationItem.explanation}
                </p>
                {/* Continue button */}
                <button
                  onClick={handleContinue}
                  className="mt-3 w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 bg-jungle-mist-500/20 text-jungle-mist-200 border border-jungle-mist-500/30 hover:bg-jungle-mist-500/30"
                >
                  {(() => {
                    const aidx = items.findIndex((i) => i.id === lastAnsweredId);
                    if (aidx !== currentIndex) return "Got it";
                    if (currentIndex + 1 < items.length) return "Next Question →";
                    return "Finish";
                  })()}
                </button>
                {/* Bubble tail */}
                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-12 border-l-transparent border-r-12 border-r-transparent border-t-12 ${
                  isLastAnswerRisky ? "border-t-red-950/60" : "border-t-emerald-950/60"
                }`} />
              </div>
            </div>
          )}

          {/* Default speech bubble — shown when waiting for an answer */}
          {!showingExplanation && !allDone && (
            <div className="w-[95%] max-w-85 z-20 animate-fade-in mb-1 shrink-0">
              <div className="relative bg-black/70 border border-jungle-mist-800/40 backdrop-blur-xl rounded-2xl px-5 py-4">
                <p className="text-sm lg:text-base leading-6 text-jungle-mist-200 text-center">
                  Answer question <span className="font-bold text-jungle-mist-300">{currentIndex + 1}</span> of{" "}
                  <span className="font-bold text-jungle-mist-300">{items.length}</span>
                  {" "}— I&apos;ll give you feedback on each one.
                </p>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-12 border-l-transparent border-r-12 border-r-transparent border-t-12 border-t-black/70" />
              </div>
            </div>
          )}

          {/* Completion speech bubble */}
          {allDone && !showingExplanation && (
            <div className="w-[95%] max-w-85 z-20 animate-fade-in mb-1 shrink-0">
              <div className="relative bg-emerald-950/60 border border-emerald-500/30 backdrop-blur-xl rounded-2xl px-5 py-4">
                <p className="text-sm lg:text-base leading-6 text-jungle-mist-200 text-center">
                  🎉 You&apos;ve completed your security checkup! Review your results below
                  and take action on any areas marked as risks.
                </p>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-12 border-l-transparent border-r-12 border-r-transparent border-t-12 border-t-emerald-950/60" />
              </div>
            </div>
          )}

          {/* Angela Character — cropped at waist */}
          <div className="relative z-10 w-full flex-1 overflow-hidden flex items-start justify-center">
            <Image
              src="/Character/Angela-TipTalk.png"
              alt="Angela"
              width={600}
              height={1000}
              className="w-auto object-cover object-top transition-all duration-500 ease-in-out drop-shadow-[0_0_40px_rgba(126,168,178,0.15)]"
              style={{ height: "160%", maxWidth: "none" }}
              priority
            />
          </div>
        </div>

        {/* ═══ RIGHT SIDE: Security Checklist — Card Grid ═══ */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4">
          <div className="max-w-3xl mx-auto">
            {/* Section header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-jungle-mist-500/15 flex items-center justify-center">
                  <ShieldAlert size={16} className="text-jungle-mist-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-jungle-mist-100">Security Checkup</h2>
                  <p className="text-xs text-jungle-mist-600">
                    Question {Math.min(currentIndex + 1, items.length)} of {items.length}
                  </p>
                </div>
              </div>
              {/* Progress dots */}
              <div className="flex items-center gap-1">
                {items.map((item, idx) => {
                  const answered = item.id in answers;
                  const risky = answered && (item.riskIfYes ? answers[item.id] : !answers[item.id]);
                  return (
                    <div
                      key={item.id}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        !answered
                          ? idx === currentIndex
                            ? "bg-jungle-mist-400 scale-125"
                            : "bg-jungle-mist-800/50"
                          : risky
                            ? "bg-red-400"
                            : "bg-emerald-400"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Two-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {items.map((item, idx) => {
                const isYes = answers[item.id] ?? false;
                const isAnswered = item.id in answers;
                const isRisky = isAnswered && (item.riskIfYes ? isYes : !isYes);
                const isCurrent = idx === currentIndex && !showingExplanation;
                const isDisabled = !isCurrent || showingExplanation;
                const accentColor = getCategoryAccent(item.category);

                return (
                  <div
                    key={item.id}
                    className={`group relative rounded-xl overflow-hidden transition-all duration-300 animate-fade-in ${
                      isCurrent ? "ring-1 ring-jungle-mist-400/50" : ""
                    } ${isDisabled && !isAnswered ? "opacity-40" : ""}`}
                  >
                    {/* Left accent bar */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300"
                      style={{
                        backgroundColor: isAnswered
                          ? isRisky
                            ? "#ef4444"
                            : "#22c55e"
                          : accentColor,
                      }}
                    />

                    <div className="bg-black/40 backdrop-blur-sm border border-jungle-mist-800/20 rounded-xl pl-5 pr-4 py-4">
                      {/* Top row: category */}
                      <span
                        className="text-[0.6rem] font-bold uppercase tracking-[0.15em] block mb-2"
                        style={{ color: accentColor }}
                      >
                        {item.category}
                      </span>

                      {/* Question */}
                      <p className="text-sm leading-6 text-jungle-mist-200 mb-3">
                        {item.statement}
                      </p>

                      {/* Answer buttons — show for unanswered cards AND risky answered cards (so user can fix) */}
                      {(!isAnswered || (isRisky && !showingExplanation)) && (
                        <div className="flex flex-col gap-2">
                          {isRisky && (
                            <p className="text-[0.6rem] text-red-400/70 font-semibold uppercase tracking-widest">
                              ⚠ Risk — change your answer below
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAnswer(item.id, true)}
                              disabled={isDisabled && !isRisky}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
                                isRisky && isYes
                                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                                  : "bg-jungle-mist-900/30 text-jungle-mist-600 border-jungle-mist-800/20 hover:border-jungle-mist-600/40 hover:text-jungle-mist-400"
                              } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-jungle-mist-800/20 disabled:hover:text-jungle-mist-600`}
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => handleAnswer(item.id, false)}
                              disabled={isDisabled && !isRisky}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
                                isRisky && !isYes
                                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                                  : "bg-jungle-mist-900/30 text-jungle-mist-600 border-jungle-mist-800/20 hover:border-jungle-mist-600/40 hover:text-jungle-mist-400"
                              } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-jungle-mist-800/20 disabled:hover:text-jungle-mist-600`}
                            >
                              No
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Safe answered state — locked */}
                      {isAnswered && !isRisky && (
                        <div className="flex items-center justify-between py-1.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider animate-fade-in bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                          <span>✓ Safe</span>
                          <span className="text-jungle-mist-500 font-normal normal-case tracking-normal">
                            answered: {isYes ? "Yes" : "No"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary bar — shown when all done */}
            {allDone && (
              <div className="mt-5 rounded-xl border border-jungle-mist-800/25 bg-black/40 backdrop-blur-sm px-5 py-3 flex items-center justify-between animate-fade-in">
                <span className="text-xs text-jungle-mist-500">
                  {Object.keys(answers).length} of {items.length} answered
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-emerald-400">
                    ✓ {items.filter((i) => i.id in answers && !(i.riskIfYes ? answers[i.id] : !answers[i.id])).length} safe
                  </span>
                  <span className="text-xs text-red-400">
                    ⚠ {items.filter((i) => i.id in answers && (i.riskIfYes ? answers[i.id] : !answers[i.id])).length} risks
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
