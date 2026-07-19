import React from 'react';

export default function Avatar({ role = "user", initials = "?", className = "w-8 h-8" }) {
  if (role === "ai") {
    return (
      <div className={`relative flex items-center justify-center rounded-full bg-emerald-950/40 border border-emerald-500/30 overflow-hidden text-gov-accent shadow-[0_0_12px_rgba(34,197,94,0.15)] shrink-0 ${className}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 animate-pulse">
          <path d="M12 8V4H8" />
          <rect width="16" height="12" x="4" y="8" rx="2" />
          <path d="M2 14h2" /><path d="M20 14h2" />
          <path d="M15 13v2" /><path d="M9 13v2" />
        </svg>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:4px_4px] pointer-events-none" />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs shrink-0 select-none ${className}`}>
      <span>{initials.toUpperCase()}</span>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
    </div>
  );
}
