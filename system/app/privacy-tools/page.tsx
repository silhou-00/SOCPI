"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Shield, EyeOff, X, Lock, Globe, Server, User, Search, Eye, ChevronRight, Monitor } from "lucide-react";

// --- Types & Data ---
// ... (keep data the same)
type ToolType = "none" | "vpn" | "incognito";

interface Step {
  text: string;
  visual: "idle" | "vpn-connecting" | "vpn-encrypted" | "vpn-masked" | "incognito-start" | "incognito-local" | "incognito-warning";
}

const vpnSteps: Step[] = [
  {
    text: "A VPN (Virtual Private Network) creates a secure tunnel between your device and the internet.",
    visual: "vpn-connecting",
  },
  {
    text: "Your data is encrypted before it leaves your device, meaning anyone trying to intercept it will only see scrambled gibberish.",
    visual: "vpn-encrypted",
  },
  {
    text: "Your real IP address is hidden and replaced with the IP address of the VPN server, protecting your location and identity from the websites you visit.",
    visual: "vpn-masked",
  },
];

const incognitoSteps: Step[] = [
  {
    text: "Incognito or Private Browsing mode stops your browser from saving your local history, cookies, and site data after you close the window.",
    visual: "incognito-start",
  },
  {
    text: "This is great for keeping your activity hidden from other people who use the same physical device.",
    visual: "incognito-local",
  },
  {
    text: "HOWEVER, you are still visible to the websites you visit, your school or employer's network, and your ISP (Internet Service Provider)!",
    visual: "incognito-warning",
  },
];

export default function PrivacyToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolType>("none");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [eyesOpen, setEyesOpen] = useState(true);

  // --- Angela Blink Animation ---
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const blink = () => {
      const openDuration = 2500 + Math.random() * 1500;
      timeout = setTimeout(() => {
        setEyesOpen(false);
        timeout = setTimeout(() => {
          setEyesOpen(true);
          blink();
        }, 150 + Math.random() * 100);
      }, openDuration);
    };
    blink();
    return () => clearTimeout(timeout);
  }, []);

  // --- Handlers ---
  const handleToolSelect = (tool: ToolType) => {
    setActiveTool(tool);
    setCurrentStepIndex(0);
  };

  const currentSteps = activeTool === "vpn" ? vpnSteps : incognitoSteps;
  const currentStep = activeTool !== "none" ? currentSteps[currentStepIndex] : null;

  const handleNextStep = () => {
    if (activeTool === "none") return;
    if (currentStepIndex < currentSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setActiveTool("none");
    }
  };

  // --- Visual Renderers ---
  const renderVisual = (visual: string) => {
    switch (visual) {
      // VPN Visuals
      case "vpn-connecting":
        return (
          <div className="flex flex-col items-center justify-center h-full gap-8 animate-fade-in">
            <div className="flex items-center gap-12">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-jungle-mist-900/50 flex items-center justify-center border border-jungle-mist-500/30">
                  <User className="text-jungle-mist-300" size={32} />
                </div>
                <span className="text-jungle-mist-300 text-sm font-semibold">You</span>
              </div>
              
              <div className="relative w-48 h-2 bg-jungle-mist-900/50 rounded-full overflow-hidden">
                <div className="absolute inset-x-0 h-full bg-linear-to-r from-transparent via-cyan-400 to-transparent animate-[slide_2s_linear_infinite]" />
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-cyan-900/40 flex items-center justify-center border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                  <Server className="text-cyan-400" size={32} />
                </div>
                <span className="text-cyan-400 text-sm font-semibold">VPN Server</span>
              </div>
            </div>
          </div>
        );
      case "vpn-encrypted":
        return (
          <div className="flex flex-col items-center justify-center h-full gap-8 animate-fade-in">
             <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
                  <div className="w-24 h-24 rounded-full bg-green-950/50 flex items-center justify-center border-2 border-green-500/50 relative z-10">
                    <Lock className="text-green-400" size={48} />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-green-300 font-mono text-xs opacity-70 mb-1">RAW IP PACKET</p>
                  <p className="text-green-400 font-mono text-sm break-all max-w-75 leading-relaxed">
                    e2a3 4f8b 91c2 d5e7 f0a1 b2c3 d4e5 f6a7 b8c9 d0e1
                  </p>
                </div>
             </div>
          </div>
        );
      case "vpn-masked":
        return (
          <div className="flex flex-col items-center justify-center h-full gap-8 animate-fade-in">
             <div className="flex items-center gap-12">
                <div className="flex flex-col items-center gap-2 opacity-50">
                  <span className="line-through decoration-red-500 text-jungle-mist-400 font-mono">192.168.1.100</span>
                  <span className="text-jungle-mist-500 text-xs">Real IP Hidden</span>
                </div>
                
                <ChevronRight className="text-cyan-500/50 animate-pulse" size={32} />

                <div className="flex flex-col items-center gap-4">
                   <Globe className="text-cyan-400" size={48} />
                   <div className="bg-cyan-950/40 px-4 py-2 rounded border border-cyan-500/30">
                     <span className="text-cyan-300 font-mono font-bold tracking-widest">145.23.88.212</span>
                   </div>
                   <span className="text-cyan-500 text-xs">Masked VPN IP</span>
                </div>
             </div>
          </div>
        );

      // Incognito Visuals
      case "incognito-start":
        return (
          <div className="flex flex-col items-center justify-center h-full gap-8 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gray-500/10 blur-2xl rounded-full" />
              <div className="w-32 h-32 rounded-full bg-gray-900/80 flex items-center justify-center border border-gray-600/50 relative z-10 shadow-2xl">
                <EyeOff className="text-gray-300" size={64} />
              </div>
            </div>
            <div className="flex gap-4">
               <div className="bg-red-950/30 px-3 py-1 rounded border border-red-500/20 text-red-300/70 text-sm line-through">History</div>
               <div className="bg-red-950/30 px-3 py-1 rounded border border-red-500/20 text-red-300/70 text-sm line-through">Cookies</div>
               <div className="bg-red-950/30 px-3 py-1 rounded border border-red-500/20 text-red-300/70 text-sm line-through">Cache</div>
            </div>
          </div>
        );
      case "incognito-local":
        return (
          <div className="flex flex-col items-center justify-center h-full gap-8 animate-fade-in">
             <div className="flex items-center gap-8">
               <div className="w-20 h-20 bg-gray-800/80 rounded-xl flex items-center justify-center border border-gray-600">
                  <Monitor className="text-gray-400" size={40} />
               </div>
               <div className="flex flex-col gap-2">
                 <div className="flex items-center gap-3 bg-green-950/20 px-4 py-2 rounded-lg border border-green-500/20">
                    <Shield className="text-green-500" size={20} />
                    <span className="text-green-300 text-sm">Safe from Siblings</span>
                 </div>
                 <div className="flex items-center gap-3 bg-green-950/20 px-4 py-2 rounded-lg border border-green-500/20">
                    <Shield className="text-green-500" size={20} />
                    <span className="text-green-300 text-sm">Safe from Parents/Roommates</span>
                 </div>
               </div>
             </div>
          </div>
        );
      case "incognito-warning":
        return (
          <div className="flex flex-col items-center justify-center h-full gap-6 animate-fade-in">
            <div className="text-red-400/80 uppercase tracking-[0.2em] text-sm font-bold animate-pulse">Warning: You are still visible</div>
            <div className="flex gap-8 items-end">
              <div className="flex flex-col items-center gap-3">
                 <div className="w-16 h-16 bg-red-950/40 rounded-full flex items-center justify-center border border-red-500/40">
                   <Globe className="text-red-400" size={28} />
                 </div>
                 <span className="text-red-300 text-xs">Websites</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                 <div className="w-20 h-20 bg-red-950/40 rounded-full flex items-center justify-center border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                   <Eye className="text-red-500" size={36} />
                 </div>
                 <span className="text-red-400 text-sm font-bold">Your ISP</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                 <div className="w-16 h-16 bg-red-950/40 rounded-full flex items-center justify-center border border-red-500/40">
                   <Search className="text-red-400" size={28} />
                 </div>
                 <span className="text-red-300 text-xs">School/Work Network</span>
              </div>
            </div>
            <p className="text-jungle-mist-300 text-sm max-w-sm text-center mt-4">
              Incognito only hides data on your physical device. Your Internet Service Provider and websites can still track your IP and traffic.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden relative">
      {/* ── Background (Image as requested) ── */}
      <Image
        src="/Background.png"
        alt="Control room background"
        fill
        className="object-cover pointer-events-none z-0"
        priority
      />

      {/* ── Overlay to darken background ── */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* ── Content Overlay ── */}
      <div className="relative z-10 flex flex-col h-full pl-24 pt-16">
        {/* ── Title Section ── */}
        <div className="z-20 relative">
          <h1 className="text-[4rem] font-bold text-white tracking-tight leading-tight drop-shadow-md">
            Privacy Tools
          </h1>
          <p className="text-xl text-jungle-mist-300 mt-2 font-medium tracking-wide drop-shadow-md">
            Understand how to protect your digital footprint.
          </p>
        </div>

        {/* ── Main Area: Angela (left) + Nav Buttons (right) ── */}
        <div className="flex-1 flex mt-20">
          
          {/* ── Angela Character ── */}
          <div className="relative h-[140%] -mt-24 w-auto shrink-0 flex items-end">
            <Image
              src="/Character/Angela-Stare.png"
              alt="Angela eyes open"
              width={650}
              height={1100}
              className="h-full w-auto object-contain drop-shadow-[0_0_40px_rgba(126,168,178,0.1)]"
              priority
            />
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

          {/* ── Right Side: Main Menu vs Sequence ── */}
          <div className="flex-1 h-full flex flex-col justify-start pt-12 pr-24 pl-8">
            
            {activeTool === "none" ? (
              // --- MAIN MENU ---
              <div className="flex flex-col gap-6 ml-20 animate-fade-in w-full max-w-2xl">
                <button
                  onClick={() => handleToolSelect("vpn")}
                  className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl py-6 px-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:bg-cyan-950/30 hover:shadow-[0_10px_40px_-10px_rgba(34,211,238,0.3)]"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="flex items-center gap-6">
                    <div className="rounded-full bg-cyan-950/50 p-4 border border-cyan-500/20 group-hover:border-cyan-400/50 transition-colors duration-300">
                      <Globe className="text-cyan-400" size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">VPN Connection</h2>
                      <p className="text-jungle-mist-300 mt-1">Learn how a Virtual Private Network secures your data and masks your identity.</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleToolSelect("incognito")}
                  className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl py-6 px-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-gray-400/50 hover:bg-gray-800/40 hover:shadow-[0_10px_40px_-10px_rgba(156,163,175,0.2)]"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gray-400/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="flex items-center gap-6">
                    <div className="rounded-full bg-gray-900/80 p-4 border border-gray-600/30 group-hover:border-gray-400/50 transition-colors duration-300">
                      <EyeOff className="text-gray-300" size={32} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Incognito Mode</h2>
                      <p className="text-jungle-mist-300 mt-1">Understand the limits of private browsing and what it actually hides.</p>
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              // --- SEQUENCE MODE ---
              <div className="flex flex-col h-[75%] px-4 animate-fade-slide-in relative -mt-4">
                
                {/* Top Bar with title and close button */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl border ${activeTool === "vpn" ? "bg-cyan-950/50 border-cyan-500/30 text-cyan-400" : "bg-gray-900/80 border-gray-600/50 text-gray-300"}`}>
                      {activeTool === "vpn" ? <Globe size={24} /> : <EyeOff size={24} />}
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-wide">
                      {activeTool === "vpn" ? "VPN Connection Setup" : "Incognito Mode"}
                    </h2>
                  </div>
                  
                  <button 
                    onClick={() => setActiveTool("none")}
                    className="p-3 rounded-xl bg-black/40 border border-white/10 text-jungle-mist-300 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Main Visual Area */}
                <div className="flex-1 bg-black/50 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-2xl overflow-hidden relative mb-6 min-h-62.5">
                   {currentStep && renderVisual(currentStep.visual)}
                </div>

                {/* Dialogue Box Area */}
                <div className="h-40 shrink-0 relative">
                  <div 
                    onClick={handleNextStep}
                    className="h-full w-full bg-black/70 backdrop-blur-xl border-l-4 border-l-jungle-mist-500 border border-white/10 rounded-2xl shadow-xl overflow-hidden cursor-pointer group hover:border-white/30 transition-all flex flex-col p-6"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-jungle-mist-400 font-bold tracking-[0.2em] text-sm group-hover:text-jungle-mist-300 transition-colors">
                        ANGELA
                      </span>
                      <span className="text-xs text-jungle-mist-600 font-medium group-hover:text-jungle-mist-400 transition-colors flex items-center gap-1">
                        CLICK TO CONTINUE <ChevronRight size={14} />
                      </span>
                    </div>
                    
                    <div className="flex-1 text-jungle-mist-100 text-lg font-medium leading-relaxed tracking-wide">
                      "{currentStep?.text}"
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex gap-2 mt-auto">
                      {currentSteps.map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            idx === currentStepIndex 
                              ? (activeTool === "vpn" ? "w-8 bg-cyan-400" : "w-8 bg-jungle-mist-300")
                              : "w-2 bg-jungle-mist-800"
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
      
      {/* Required for the tailwind arbitrary animation we used inline */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
