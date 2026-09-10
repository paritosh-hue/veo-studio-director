import React from 'react';
import { Shield, AlertTriangle, Cpu, Radio, Terminal } from 'lucide-react';
import { ShotData } from '../../types';

interface ShotViewProps {
  progress: number; // 0 to 1 within this shot
  currentTime: number; // absolute time (0 to 4s)
  isVertical: boolean;
  shot?: ShotData;
}

export const Shot1View: React.FC<ShotViewProps> = ({ progress, currentTime, isVertical, shot }) => {
  // Phase 1: 0.0 to 0.55 -> Bold electric cyan flashing headline
  // Phase 2: 0.55 to 1.0 -> Rapid montage cut to NSA, CISA, FBI seals
  const isSealMontage = progress > 0.52;

  // Flash cycle
  const flashSpeed = shot?.userCanvasOverrides?.flashSpeed || 8;
  const flashCycle = Math.floor(currentTime * flashSpeed) % 2 === 0;

  // User overrides or fallback
  const headline = shot?.userCanvasOverrides?.headline || "How to build a";
  const primaryAmount = shot?.userCanvasOverrides?.primaryStat || "billion-dollar AI";
  const secondaryAmount = shot?.userCanvasOverrides?.secondaryStat || "$5 million.";
  const voiceoverText = shot?.voiceover || `"Warning: How to build a billion-dollar AI... for five million dollars."`;

  return (
    <div className="relative w-full h-full bg-[#05070B] overflow-hidden flex flex-col items-center justify-center select-none">
      {/* Studio Lighting Radial Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(0, 240, 255, 0.12) 0%, rgba(5, 7, 11, 0.95) 75%)'
        }}
      />

      {/* Subtle Digital Grid Floor */}
      <div className="absolute inset-0 digital-grid opacity-20" />

      {/* Top HUD Telemetry */}
      <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-xs text-cyan-400/70 z-20 font-mono tracking-wider">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold text-cyan-300">DEFCON-AI // PROBE DETECTED</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-[10px]">
            LENS: 50MM MACRO F/1.2
          </span>
          <span className="text-cyan-500 font-bold">{currentTime.toFixed(2)}s / {shot?.endTime || 4.00}s</span>
        </div>
      </div>

      {!isSealMontage ? (
        /* Phase 1: Bold Electric Cyan Flashing Text */
        <div className="relative z-10 max-w-4xl px-8 text-center flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-mono tracking-widest uppercase">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            {shot?.subtitle || "Special Intelligence Briefing"}
          </div>

          <h1 
            className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight transition-all duration-75 ${
              flashCycle ? 'text-cyan-300 drop-shadow-[0_0_35px_rgba(0,240,255,0.85)] scale-[1.01]' : 'text-white drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]'
            }`}
          >
            {headline} <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-400 underline decoration-cyan-400/50 underline-offset-8">
              {primaryAmount}
            </span>
            <br />
            for <span className="text-emerald-400 font-extrabold drop-shadow-[0_0_20px_rgba(52,211,153,0.7)]">{secondaryAmount}</span>
          </h1>

          <div className="mt-8 flex items-center gap-4 text-xs font-mono text-cyan-400/60">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>CAPEX COLLAPSE</span>
            </div>
            <span>•</span>
            <div>FRONTIER MODEL ASYMMETRY</div>
          </div>
        </div>
      ) : (
        /* Phase 2: Fast Montage of NSA, CISA, FBI Seals with Neon Digital Borders */
        <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-mono tracking-wider animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            CYBERSECURITY WARNING NOTICE
          </div>

          <div className={`grid ${isVertical ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-6'} w-full max-w-3xl`}>
            {/* NSA Seal Card */}
            <div className="relative group p-5 rounded-xl bg-slate-900/80 border-2 border-cyan-400/60 shadow-[0_0_30px_rgba(0,240,255,0.25)] flex flex-col items-center text-center backdrop-blur-md">
              <div className="relative w-20 h-20 rounded-full border-2 border-cyan-400 flex items-center justify-center bg-cyan-950/50 mb-3 shadow-[0_0_20px_rgba(0,240,255,0.5)] animate-pulse">
                <Shield className="w-10 h-10 text-cyan-300" />
                <div className="absolute inset-0 rounded-full border border-dashed border-cyan-300 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <div className="text-sm font-bold tracking-widest text-cyan-200 font-mono">NSA</div>
              <div className="text-[10px] text-cyan-400/80 tracking-wide mt-0.5">NATIONAL SECURITY AGENCY</div>
              <div className="mt-2 text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                SIGNALS INTELLIGENCE
              </div>
            </div>

            {/* CISA Seal Card */}
            <div className="relative group p-5 rounded-xl bg-slate-900/80 border-2 border-emerald-400/60 shadow-[0_0_30px_rgba(52,211,153,0.25)] flex flex-col items-center text-center backdrop-blur-md">
              <div className="relative w-20 h-20 rounded-full border-2 border-emerald-400 flex items-center justify-center bg-emerald-950/50 mb-3 shadow-[0_0_20px_rgba(52,211,153,0.5)] animate-pulse">
                <Cpu className="w-10 h-10 text-emerald-300" />
                <div className="absolute inset-0 rounded-full border border-dashed border-emerald-300 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div className="text-sm font-bold tracking-widest text-emerald-200 font-mono">CISA</div>
              <div className="text-[10px] text-emerald-400/80 tracking-wide mt-0.5">CYBERSECURITY & INFRASTRUCTURE</div>
              <div className="mt-2 text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                CRITICAL TECH ADVISORY
              </div>
            </div>

            {/* FBI Seal Card */}
            <div className="relative group p-5 rounded-xl bg-slate-900/80 border-2 border-rose-400/60 shadow-[0_0_30px_rgba(244,63,94,0.25)] flex flex-col items-center text-center backdrop-blur-md">
              <div className="relative w-20 h-20 rounded-full border-2 border-rose-400 flex items-center justify-center bg-rose-950/50 mb-3 shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-pulse">
                <Shield className="w-10 h-10 text-rose-300" />
                <div className="absolute inset-0 rounded-full border border-dashed border-rose-300 animate-spin" style={{ animationDuration: '12s' }} />
              </div>
              <div className="text-sm font-bold tracking-widest text-rose-200 font-mono">FBI</div>
              <div className="text-[10px] text-rose-400/80 tracking-wide mt-0.5">FEDERAL BUREAU OF INVESTIGATION</div>
              <div className="mt-2 text-[9px] font-mono px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/30 text-rose-300">
                INTELLECTUAL PROPERTY / TOS
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Subtitle / Voiceover banner */}
      <div className="absolute bottom-5 left-6 right-6 text-center z-20">
        <p className="inline-block px-4 py-1.5 rounded-lg bg-black/85 border border-cyan-500/30 text-cyan-200 text-xs sm:text-sm font-medium backdrop-blur-md shadow-lg">
          {progress < 0.55 ? (
            <span>{voiceoverText}</span>
          ) : (
            <span className="text-rose-200 font-semibold">"Official advisories: Global models under continuous extraction probe."</span>
          )}
        </p>
      </div>

      {/* Scanline Overlay */}
      <div className="absolute inset-0 subtle-scanline z-30 pointer-events-none" />
    </div>
  );
};
