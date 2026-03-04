"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { RotateCcw, ScrollText, HelpCircle, X, ChevronRight } from "lucide-react";
import threatData from "@/app/data/threat.json";

/* ── Types ── */
interface Choice {
  label: string;
  nextStep: number;
}

interface Explanation {
  title: string;
  body: string;
}

interface Email {
  from: string;
  subject: string;
  body: string;
  actionLabel: string;
  nextStep: number;
}

interface Step {
  stepId: number;
  speaker: string;
  dialogue: string;
  picture: string;
  choices?: Choice[];
  email?: Email;
  explanation?: Explanation;
  isEnding?: boolean;
  status?: string;
}

/* ── Angela Pose Mapping ── */
const poseMap: Record<string, string> = {
  "angela-neutral": "/Character/Angela-Idle.png",
  "angela-listening": "/Character/Angela-Idle.png",
  "angela-alert": "/Character/Angela-TacticTalk.png",
  "angela-explaining": "/Character/Angela-TacticTalk.png",
  "angela-disappointed": "/Character/Angela-Stare.png",
};

export default function Threat() {
  const scenario = threatData[0];
  const [currentStepId, setCurrentStepId] = useState<number>(1);
  const [explanations, setExplanations] = useState<Explanation[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [angelaPose, setAngelaPose] = useState("/Character/Angela-Idle.png");
  const [visitedSteps, setVisitedSteps] = useState<Step[]>([]);

  const currentStep: Step | undefined = scenario.steps.find(
    (s: Step) => s.stepId === currentStepId
  );

  /* ── Angela pose logic ── */
  useEffect(() => {
    if (!currentStep) return;

    if (currentStep.speaker === "Manager") {
      // Angela listens when Manager talks
      setTimeout(() => setAngelaPose("/Character/Angela-Idle.png"), 0);
    } else {
      // Angela is talking — show TacticTalk
      setTimeout(() => {
        const pose = poseMap[currentStep.picture] || "/Character/Angela-TacticTalk.png";
        setAngelaPose(pose);
      }, 0);

      // After 1.5s transition to Stare (waiting for click)
      if (currentStep.picture !== "angela-disappointed") {
        const timer = setTimeout(() => {
          setAngelaPose("/Character/Angela-Stare.png");
        }, 4000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentStep]);

  /* ── Track visited steps + collect explanations ── */
  useEffect(() => {
    if (!currentStep) return;

    setTimeout(() => {
      setVisitedSteps((prev) => {
        if (prev.find((s) => s.stepId === currentStep.stepId)) return prev;
        return [...prev, currentStep];
      });

      if (currentStep.explanation) {
        setExplanations((prev) => {
          if (prev.find((e) => e.title === currentStep.explanation!.title)) return prev;
          return [...prev, currentStep.explanation!];
        });
      }
    }, 0);
  }, [currentStep]);

  if (!currentStep) return null;

  /* ── Determine if this is a click-to-continue or real choice ── */
  const isContinueOnly =
    currentStep.choices?.length === 1 && currentStep.choices[0].label === "Continue";
  const realChoices = isContinueOnly ? [] : (currentStep.choices || []);
  const isAngela = currentStep.speaker === "Angela";

  /* ── Handlers ── */
  const advanceTo = (nextStep: number) => {
    setCurrentStepId(nextStep);
  };

  const handleDialogueClick = () => {
    if (currentStep.isEnding) return;
    if (isContinueOnly && currentStep.choices) {
      advanceTo(currentStep.choices[0].nextStep);
    }
  };

  const handleRestart = () => {
    setCurrentStepId(1);
    setExplanations([]);
    setVisitedSteps([]);
  };

  const isSuccess = currentStep.status === "success";

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden relative">
      {/* ── Full-page Background ── */}
      <Image
        src="/Background.png"
        alt="Control room background"
        fill
        className="object-cover pointer-events-none z-0"
        priority
      />

      {/* ── Top-right Buttons (LOGS + Help) ── */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <button
          className="flex items-center gap-2 h-14 px-5 rounded-full border-2 border-jungle-mist-800/60 bg-black/80 backdrop-blur-xl text-jungle-mist-200 cursor-pointer transition-all duration-300 hover:border-jungle-mist-400 hover:text-jungle-mist-50 font-bold text-sm tracking-wider uppercase"
          onClick={() => setShowLogs(true)}
        >
          <ScrollText size={18} />
          <span>Logs</span>
        </button>
        <button
          className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-jungle-mist-800/60 bg-black/80 backdrop-blur-xl text-jungle-mist-200 cursor-pointer transition-all duration-300 hover:border-jungle-mist-400 hover:text-jungle-mist-50"
          onClick={() => setShowHelp(true)}
          aria-label="Help"
        >
          <HelpCircle size={24} />
        </button>
      </div>

      {/* ── Main Layout ── */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row mt-22 mx-3 mb-3 gap-3 min-h-0">

        {/* ═══ LEFT PANEL: Visualizer + Dialogue ═══ */}
        <div className="lg:w-[55%] flex flex-col rounded-2xl border border-jungle-mist-800/30 overflow-hidden relative bg-linear-to-b from-transparent to-black/10">
          {/* Scenario Header */}
          <div className="absolute top-0 left-0 right-0 px-6 py-3 z-20 bg-black/80 border-b border-jungle-mist-800/20">
            <h2 className="text-base font-bold text-jungle-mist-300 tracking-wider uppercase">
              Scenario #1: {scenario.title}
            </h2>
          </div>

          {/* Character Area — Angela cropped at knees */}
          <div className="flex-1 flex items-end justify-center relative overflow-hidden min-h-0">
            <div className="relative z-10 h-[130%] w-auto">
              <Image
                src={angelaPose}
                alt="Angela"
                width={600}
                height={1000}
                className="h-full w-auto object-contain drop-shadow-[0_0_40px_rgba(126,168,178,0.2)] transition-all duration-500 mt-75"
                priority
              />
            </div>
          </div>

          {/* Dialogue Box — overlays lower portion, text at top */}
          <div
            className={`absolute bottom-0 left-0 right-0 z-20 h-[35%] mx-4 mb-4 rounded-xl border border-jungle-mist-800/30 bg-black/80 px-6 py-5 flex flex-col justify-start transition-all duration-200 select-none ${
              isContinueOnly && !currentStep.isEnding
                ? "cursor-pointer hover:bg-black/85 hover:border-jungle-mist-600/40"
                : ""
            }`}
            onClick={handleDialogueClick}
          >
            {/* Speaker Name */}
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-lg font-bold uppercase tracking-[0.2em] ${
                  isAngela ? "text-jungle-mist-400" : "text-white"
                }`}
              >
                {currentStep.speaker}
              </span>
              {isContinueOnly && !currentStep.isEnding && (
                <span className="flex items-center gap-1 text-xs text-jungle-mist-600 uppercase tracking-widest">
                  Click to continue
                  <ChevronRight size={12} className="animate-blink" />
                </span>
              )}
            </div>

            {/* Dialogue Text */}
            <p
              className={`text-2xl leading-8 animate-fade-in ${
                isAngela ? "text-jungle-mist-300" : "text-white"
              }`}
            >
              {isAngela ? `"${currentStep.dialogue}"` : currentStep.dialogue}
            </p>

            {/* Ending: Restart inside dialogue box */}
            {currentStep.isEnding && (
              <button
                className={`flex items-center justify-center mt-20 gap-2 w-full py-3.5 px-5 text-base font-bold border rounded-lg cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                  isSuccess
                    ? "text-green-400 border-green-500/40 bg-green-500/10 hover:bg-green-500/20"
                    : "text-red-400 border-red-500/40 bg-red-500/10 hover:bg-red-500/20"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRestart();
                }}
              >
                <RotateCcw size={18} />
                <span>Restart Simulation</span>
              </button>
            )}
          </div>
        </div>

        {/* ═══ RIGHT PANEL: Two separate sub-containers ═══ */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">

          {/* Explanation Container — own box */}
          <div className="flex-1 flex flex-col rounded-2xl border border-jungle-mist-800/30 overflow-hidden bg-linear-to-b from-transparent to-black/80 min-h-0">
            <div className="px-6 py-3 border-b border-jungle-mist-800/20 bg-black/80 shrink-0">
              <h2 className="text-sm font-bold text-jungle-mist-300 tracking-wider uppercase">
                Threat Breakdown
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {explanations.length === 0 ? (
                <p className="text-lg text-jungle-mist-100 italic text-center mt-35">
                  Explanations will appear here as the scenario progresses...
                </p>
              ) : (
                explanations.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-jungle-mist-800/25 bg-jungle-mist-950/90 animate-fade-in"
                  >
                    <h3 className="text-lg font-bold text-jungle-mist-200 mb-2">{exp.title}</h3>
                    <p className="text-md leading-7 text-jungle-mist-300 whitespace-pre-line">{exp.body}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Dialogue Options OR Custom UI (e.g., Email Simulation) */}
          <div className="flex-1 flex flex-col rounded-2xl border-jungle-mist-800/30 overflow-hidden min-h-0 border bg-black/30 p-0">
            {currentStep.email ? (
              /* Email Simulation UI */
              <div className="flex-1 flex flex-col w-full h-full bg-slate-50 animate-fade-in relative overflow-hidden">
                {/* Email Header/App Bar */}
                <div className="bg-slate-200 border-b border-slate-300 px-4 py-2 flex items-center gap-3 shrink-0">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 mx-auto">Inbox - Work Mail</span>
                </div>
                
                {/* Email Metadata */}
                <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{currentStep.email.subject}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                        N
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {currentStep.email.from.split(" <")[0]}
                        </p>
                        <p className="text-xs text-slate-500">
                          {currentStep.email.from.includes("<") ? `<${currentStep.email.from.split("<")[1]}` : currentStep.email.from}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">10:42 AM (2 minutes ago)</span>
                  </div>
                </div>

                {/* Email Body & CTA */}
                <div className="p-6 flex-1 overflow-y-auto">
                  <div className="max-w-xl">
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-8">
                      {currentStep.email.body}
                    </p>
                    <div className="flex justify-center">
                      <button
                        onClick={() => advanceTo(currentStep.email!.nextStep)}
                        className="py-3 px-8 rounded-md font-bold text-white bg-[#0f172a] hover:bg-slate-800 transition-colors shadow-md cursor-pointer"
                      >
                        {currentStep.email.actionLabel}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Standard Dialogue Choices */
              <div className="p-5 space-y-3 h-full flex flex-col justify-center">
                {realChoices.length > 0 ? (
                  <>
                    {realChoices.map((choice: Choice, idx: number) => (
                      <button
                        key={idx}
                        className="w-full py-4 px-6 text-2xl font-semibold text-white bg-black/80 border-2 border-jungle-mist-500/80 rounded-lg cursor-pointer text-left transition-all duration-200 hover:border-jungle-mist-300 hover:bg-jungle-mist-600 hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(126,168,178,0.2)]"
                        onClick={() => advanceTo(choice.nextStep)}
                      >
                        {choice.label}
                      </button>
                    ))}
                  </>
                ) : (
                  <p className="text-lg text-jungle-mist-100 italic text-center mt-auto mb-auto">
                    Click the dialogue box to continue...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ LOGS Overlay ═══ */}
      {showLogs && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[80vh] mx-4 rounded-2xl border border-jungle-mist-800/40 bg-jungle-mist-950/95 backdrop-blur-xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-jungle-mist-800/20">
              <h2 className="text-lg font-bold text-jungle-mist-100 tracking-tight">Scenario Logs</h2>
              <button
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-jungle-mist-800/30 text-jungle-mist-400 cursor-pointer hover:text-jungle-mist-100 hover:border-jungle-mist-600 transition-all"
                onClick={() => setShowLogs(false)}
              >
                <X size={18} />
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {visitedSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    step.stepId === currentStepId
                      ? "border-jungle-mist-500/40 bg-jungle-mist-500/10"
                      : "border-jungle-mist-800/20 bg-black/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest text-jungle-mist-600">
                      Step {step.stepId}
                    </span>
                    <span className={`text-[0.6rem] font-bold uppercase tracking-widest ${
                      step.speaker === "Angela" ? "text-jungle-mist-400" : "text-white/70"
                    }`}>
                      — {step.speaker}
                    </span>
                    {step.stepId === currentStepId && (
                      <span className="text-[0.55rem] font-bold uppercase tracking-widest text-jungle-mist-500 ml-auto">
                        Current
                      </span>
                    )}
                  </div>
                  <p className={`text-sm leading-6 ${
                    step.speaker === "Angela" ? "text-jungle-mist-300" : "text-jungle-mist-200"
                  }`}>
                    {step.speaker === "Angela" ? `"${step.dialogue}"` : step.dialogue}
                  </p>
                </div>
              ))}

              {/* Explanation summaries */}
              {explanations.length > 0 && (
                <>
                  <div className="pt-3 border-t border-jungle-mist-800/20">
                    <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-jungle-mist-500">
                      Threat Knowledge Acquired
                    </span>
                  </div>
                  {explanations.map((exp, idx) => (
                    <div key={`exp-${idx}`} className="p-3 rounded-lg border border-jungle-mist-800/15 bg-jungle-mist-950/30">
                      <h4 className="text-xs font-bold text-jungle-mist-300 mb-1">{exp.title}</h4>
                      <p className="text-xs leading-5 text-jungle-mist-500 whitespace-pre-line">{exp.body}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Help Overlay ═══ */}
      {showHelp && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg mx-4 rounded-2xl border border-jungle-mist-800/40 bg-jungle-mist-950/95 backdrop-blur-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-jungle-mist-800/20">
              <h2 className="text-lg font-bold text-jungle-mist-100">How to Play</h2>
              <button
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-jungle-mist-800/30 text-jungle-mist-400 cursor-pointer hover:text-jungle-mist-100 hover:border-jungle-mist-600 transition-all"
                onClick={() => setShowHelp(false)}
              >
                <X size={18} />
              </button>
            </div>
            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="text-jungle-mist-400 font-bold text-sm shrink-0">1.</span>
                  <p className="text-sm text-jungle-mist-200 leading-6">
                    <strong className="text-jungle-mist-100">Read the dialogue</strong> — Angela (your AI assistant) and you (the Manager) will converse about a cybersecurity scenario.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="text-jungle-mist-400 font-bold text-sm shrink-0">2.</span>
                  <p className="text-sm text-jungle-mist-200 leading-6">
                    <strong className="text-jungle-mist-100">Click the dialogue box</strong> to progress the story when advancing normally.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="text-jungle-mist-400 font-bold text-sm shrink-0">3.</span>
                  <p className="text-sm text-jungle-mist-200 leading-6">
                    <strong className="text-jungle-mist-100">Choose your response</strong> when decision buttons appear on the right panel.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="text-jungle-mist-400 font-bold text-sm shrink-0">4.</span>
                  <p className="text-sm text-jungle-mist-200 leading-6">
                    <strong className="text-jungle-mist-100">Learn from explanations</strong> that appear in the right panel as Angela reveals threat details.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="text-jungle-mist-400 font-bold text-sm shrink-0">5.</span>
                  <p className="text-sm text-jungle-mist-200 leading-6">
                    <strong className="text-jungle-mist-100">Check Logs</strong> to review past dialogue and acquired threat knowledge.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-jungle-mist-800/20">
                <div className="flex gap-4 text-xs">
                  <span><span className="text-jungle-mist-400 font-bold">Angela</span> = Blue text with &ldquo;quotes&rdquo;</span>
                  <span><span className="text-white font-bold">Manager</span> = White text, no quotes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
