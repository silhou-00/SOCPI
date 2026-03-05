"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { RotateCcw, ScrollText, HelpCircle, X, ChevronRight, Trash2, Folder, Monitor } from "lucide-react";
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

interface Malware {
  appName: string;
  size: string;
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
  malware?: Malware;
  explanation?: Explanation;
  isEnding?: boolean;
  status?: string;
}

/* ── Angela Pose Model Mapping ── */
const poseMap: Record<string, string> = {
  "angela-neutral": "/Character/Angela-Idle.png",
  "angela-listening": "/Character/Angela-Idle.png",
  "angela-alert": "/Character/Angela-TacticTalk.png",
  "angela-explaining": "/Character/Angela-TacticTalk.png",
  "angela-disappointed": "/Character/Angela-Stare.png",
};

function ThreatContent() {
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get("scenario") || "phishing-angela-predetermined";
  
  const scenario = threatData.find((s) => s.scenarioId === scenarioId) || threatData[0];

  const [currentStepId, setCurrentStepId] = useState<number>(1);
  const [explanations, setExplanations] = useState<Explanation[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [angelaPose, setAngelaPose] = useState("/Character/Angela-Idle.png");
  const [visitedSteps, setVisitedSteps] = useState<Step[]>([]);

  // Reset state when scenario changes
  useEffect(() => {
    setCurrentStepId(1);
    setExplanations([]);
    setVisitedSteps([]);
    setAngelaPose("/Character/Angela-Idle.png");
    setShowLogs(false);
    setShowHelp(false);
  }, [scenarioId]);

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
            ) : currentStep.malware ? (
              /* Windows OS Desktop Simulation UI */
              <div className="flex-1 flex flex-col w-full h-full bg-[#005A9E] animate-fade-in relative overflow-hidden select-none">
                {/* Windows 11 Inspired Wallpaper Background */}
                <div className="absolute inset-0 bg-cover bg-center pointer-events-none" style={{ backgroundImage: "linear-gradient(135deg, #024db5, #001040)" }}>
                  <div className="absolute inset-0 bg-[#0078d4]/10 backdrop-blur-[1px]"></div>
                  {/* Fake glowing shapes for W11 bloom effect */}
                  <div className="absolute top-1/4 left-[10%] w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-1/4 right-[10%] w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
                </div>

                {/* Desktop Icons */}
                <div className="absolute top-4 left-4 flex flex-col gap-5 z-0">
                  <div className="flex flex-col items-center gap-1 w-16 group cursor-default p-1.5 rounded-sm hover:bg-white/10 transition-colors">
                    <Trash2 size={24} className="text-white drop-shadow-md opacity-80 group-hover:opacity-100" />
                    <span className="text-white text-[10px] text-center drop-shadow-md leading-tight">Recycle Bin</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 w-16 group cursor-default p-1.5 rounded-sm hover:bg-white/10 transition-colors">
                    <Folder size={24} fill="#fcd34d" className="text-amber-300 drop-shadow-md" />
                    <span className="text-white text-[10px] text-center drop-shadow-md leading-tight">Work Files</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 w-16 group cursor-default p-1.5 rounded-sm bg-white/10 border border-white/20 shadow-sm">
                    <Monitor size={24} className="text-blue-300 drop-shadow-md" />
                    <span className="text-white text-[10px] text-center drop-shadow-md leading-tight line-clamp-2">SpeedUp Setup.exe</span>
                  </div>
                </div>

                {/* Windows Taskbar */}
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center justify-between px-4 z-20">
                  {/* Left spacer / Widgets area equivalent */}
                  <div className="w-24"></div>

                  {/* Centered Taskbar Icons */}
                  <div className="flex items-center gap-2">
                    {/* Start Button */}
                    <div className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center transition-colors">
                      <div className="w-3.5 h-3.5 grid grid-cols-2 gap-0.5">
                        <div className="bg-blue-400 rounded-[1px]"></div>
                        <div className="bg-blue-400 rounded-[1px]"></div>
                        <div className="bg-blue-400 rounded-[1px]"></div>
                        <div className="bg-blue-400 rounded-[1px]"></div>
                      </div>
                    </div>
                    {/* Search */}
                    <div className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center transition-colors text-white">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    {/* File Explorer */}
                    <div className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center transition-colors">
                      <Folder size={16} fill="#fcd34d" className="text-amber-300" />
                    </div>
                    {/* Browser */}
                    <div className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center transition-colors text-red-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" y1="8" x2="12" y2="8"></line><line x1="3.95" y1="6.06" x2="8.54" y2="14"></line><line x1="10.88" y1="21.94" x2="15.46" y2="14"></line></svg>
                    </div>
                    {/* Setup Active Icon */}
                    <div className="w-8 h-8 rounded bg-white/10 relative flex items-center justify-center text-blue-300">
                      <Monitor size={16} />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-blue-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* System Tray (Right) */}
                  <div className="flex items-center gap-3 text-white text-[10px] w-24 justify-end">
                    <div className="flex flex-col items-end leading-tight tracking-wide">
                      <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Application Window Container */}
                <div className="relative w-full max-w-[320px] m-auto mb-14 bg-slate-50 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-slate-500/50 flex flex-col overflow-hidden z-10 transition-transform duration-300 hover:scale-[1.01] max-h-[80%]">
                  
                  {/* Standard Windows Title Bar */}
                  <div className="bg-slate-100 flex items-center justify-between shadow-sm border-b border-slate-300/80 shrink-0">
                    <div className="flex items-center gap-2 pl-3 py-1.5">
                      <div className="w-3.5 h-3.5 rounded-sm bg-blue-600 flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold leading-none">TS</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700 tracking-tight">
                        {currentStep.malware.appName}
                      </span>
                    </div>
                    {/* Fake Windows Window Controls */}
                    <div className="flex">
                      <div className="w-10 h-7 flex items-center justify-center hover:bg-slate-200 transition-colors">
                        <div className="w-2.5 h-px bg-slate-600"></div>
                      </div>
                      <div className="w-10 h-7 flex items-center justify-center hover:bg-slate-200 transition-colors">
                        <div className="w-2.5 h-2.5 border border-slate-600"></div>
                      </div>
                      <div className="w-10 h-7 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors group">
                        <X size={14} className="text-slate-600 group-hover:text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Installer Content */}
                  <div className="p-4 bg-white flex flex-col items-center text-center overflow-y-auto overflow-x-hidden custom-scrollbar">
                    <div className="w-14 h-14 mb-3 bg-linear-to-b from-blue-500 to-blue-700 rounded-2xl shadow-md flex items-center justify-center shrink-0">
                      <RotateCcw className="text-white w-7 h-7 animate-spin-slow" />
                    </div>
                    
                    <h3 className="text-base font-bold text-slate-800 mb-0.5 shrink-0">
                      Terminal SpeedUp Pro
                    </h3>
                    <p className="text-[10px] text-slate-500 mb-4 font-medium shrink-0">
                      Version 4.2.0 • Size: {currentStep.malware.size}
                    </p>

                    <div className="w-full bg-slate-50 rounded-md p-2.5 mb-4 border border-slate-200 text-left shrink-0">
                      <h4 className="text-[9px] font-bold text-slate-700 uppercase mb-1.5 tracking-wider">Features Included:</h4>
                      <ul className="text-[10px] text-slate-600 space-y-1.5">
                        <li className="flex items-center gap-2">
                          <span className="text-green-500 font-bold">✓</span> Instant Cache Cleansing
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500 font-bold">✓</span> Registry Optimization
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500 font-bold">✓</span> Background Process Manager
                        </li>
                      </ul>
                    </div>

                    {/* Action CTA */}
                    <button
                      onClick={() => advanceTo(currentStep.malware!.nextStep)}
                      className="w-full py-2.5 px-4 rounded-md text-xs font-bold text-white bg-[#0067c0] hover:bg-[#005a9e] transition-colors shadow-sm cursor-pointer tracking-wide flex items-center justify-center gap-2 border border-transparent focus:outline-hidden focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shrink-0"
                    >
                      {currentStep.malware.actionLabel}
                      <ChevronRight size={14} />
                    </button>
                    
                    <p className="text-[8px] text-slate-400 mt-3 leading-tight shrink-0">
                      By clicking install, you agree to our Terms of Service and Privacy Policy. Recommended for administrative systems.
                    </p>
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

export default function Threat() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-black/90" />}>
      <ThreatContent />
    </Suspense>
  );
}
