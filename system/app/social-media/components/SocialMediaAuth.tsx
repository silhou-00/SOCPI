"use client";

import { useState, useMemo } from "react";
import { Eye, EyeOff, Check, X, Clock, ShieldCheck, User, Lock } from "lucide-react";
import {
  checkPasswordConditions,
  estimateCrackTime,
  getPasswordStrength,
} from "@/app/utils/passwordUtils";

interface SocialMediaAuthProps {
  onAuthenticated: (username: string) => void;
}

export default function SocialMediaAuth({ onAuthenticated }: SocialMediaAuthProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const conditions = useMemo(
    () => checkPasswordConditions(password, username),
    [password, username]
  );

  const crackTime = useMemo(() => estimateCrackTime(password), [password]);
  const strength = useMemo(() => getPasswordStrength(conditions), [conditions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length > 0 && password.length > 0) {
      onAuthenticated(username.trim());
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center overflow-hidden relative">
      {/* ── Gradient Background ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(19,19,38,1) 0%, rgba(35,37,59,1) 50%)",
        }}
      />

      {/* ── Auth Form ── */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* NexLink Branding */}
        <div className="text-center mb-10">
          <h1 className="text-6xl font-extrabold tracking-tight">
            <span className="text-jungle-mist-50">Nex</span>
            <span className="text-jungle-mist-400">Link</span>
          </h1>
          <p className="text-jungle-mist-400 text-lg mt-2">
            Connect. Share. Stay Secure.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-jungle-mist-800/30 bg-black/50 backdrop-blur-xl p-8">
          <h2 className="text-2xl font-bold text-jungle-mist-100 mb-1">
            Create your account
          </h2>
          <p className="text-sm text-jungle-mist-400 mb-6">
            Set up your NexLink profile to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-jungle-mist-500 mb-1.5 block">
                Username
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-jungle-mist-600"
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter a username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-jungle-mist-800/40 bg-jungle-mist-950/60 text-jungle-mist-100 placeholder:text-jungle-mist-700 focus:outline-none focus:border-jungle-mist-500 transition-colors text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-jungle-mist-500 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-jungle-mist-600"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-jungle-mist-800/40 bg-jungle-mist-950/60 text-jungle-mist-100 placeholder:text-jungle-mist-700 focus:outline-none focus:border-jungle-mist-500 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-jungle-mist-600 hover:text-jungle-mist-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Strength Bar */}
            {password.length > 0 && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-widest text-jungle-mist-500">
                    Strength
                  </span>
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: strength.color }}
                  >
                    {strength.label}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-jungle-mist-900/60 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${strength.percent}%`,
                      backgroundColor: strength.color,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Password Conditions Checklist */}
            {password.length > 0 && (
              <div className="space-y-1.5 animate-fade-in">
                {conditions.map((cond) => (
                  <div key={cond.id} className="flex items-center gap-2">
                    {cond.met ? (
                      <Check size={14} className="text-emerald-400 shrink-0" />
                    ) : (
                      <X size={14} className="text-red-400/60 shrink-0" />
                    )}
                    <span
                      className={`text-xs ${
                        cond.met
                          ? "text-jungle-mist-300"
                          : "text-jungle-mist-600"
                      }`}
                    >
                      {cond.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Crack Time */}
            {password.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-jungle-mist-800/30 bg-jungle-mist-950/40 animate-fade-in">
                <Clock size={16} className="text-jungle-mist-500 shrink-0" />
                <div>
                  <span className="text-xs text-jungle-mist-500">
                    Estimated time to crack:{" "}
                  </span>
                  <span className="text-sm font-bold text-jungle-mist-200">
                    {crackTime}
                  </span>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={username.trim().length === 0 || password.length === 0}
              className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider cursor-pointer transition-all duration-300 bg-jungle-mist-500 text-white hover:bg-jungle-mist-400 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(94,142,153,0.3)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              <span className="flex items-center justify-center gap-2">
                <ShieldCheck size={16} />
                Create Account
              </span>
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-jungle-mist-700 mt-4">
          This is a simulation for cybersecurity awareness.
        </p>
      </div>
    </div>
  );
}
