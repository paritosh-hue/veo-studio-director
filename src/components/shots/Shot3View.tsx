import React, { useState, useEffect } from 'react';
import { Server, Terminal, Zap, DollarSign, Volume2, Cpu, Activity, Play } from 'lucide-react';
import { ShotData } from '../../types';

interface ShotViewProps {
  progress: number; // 0 to 1
  currentTime: number; // 12 to 20s
  isVertical: boolean;
  shot?: ShotData;
}

export const Shot3View: React.FC<ShotViewProps> = ({ progress, currentTime, isVertical, shot }) => {
  // Blinking server lights generator
  const [ledStates, setLedStates] = useState<boolean[]>(() => 
    Array.from({ length: 48 }, () => Math.random() > 0.5)
  );

  const gpuCount = shot?.userCanvasOverrides?.gpuCount || 16384;
  const apiCost = shot?.userCanvasOverrides?.apiCost || "$0.05";
  const clusterLoad = shot?.userCanvasOverrides?.clusterLoad || 100;

  // Live query count on the right side
  const currentQueryNum = Math.floor(184000 + progress * 24000);

  useEffect(() => {
    const interval = setInterval(() => {
      setLedStates(prev => prev.map(() => Math.random() > (clusterLoad < 50 ? 0.6 : 0.35)));
    }, 120);
    return () => clearInterval(interval);
  }, [clusterLoad]);

  return (
    <div className={`relative w-full h-full bg-[#07090E] overflow-hidden flex ${isVertical ? 'flex-col' : 'flex-row'} select-none`}>
      {/* Top Banner indicating Split Audio Channels */}
      <div className="absolute top-3 left-4 right-4 z-30 flex items-center justify-between text-[11px] font-mono pointer-events-none">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 backdrop-blur-md">
          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          <span>AUDIO CH-LEFT: HEAVY MECHANICAL 60HZ HUM</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 backdrop-blur-md">
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>AUDIO CH-RIGHT: CLEAN DIGITAL CHIME</span>
        </div>
      </div>

      {/* ================= LEFT HALF: TOWERING SUPERCOMPUTER ================= */}
      <div className="relative flex-1 bg-gradient-to-b from-[#140E0A] via-[#0D0B0A] to-[#080605] overflow-hidden flex flex-col justify-between p-4 sm:p-8 border-b sm:border-b-0 sm:border-r border-amber-500/30">
        {/* Amber Industrial Volumetric Lighting */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(245, 158, 11, 0.15) 0%, transparent 70%)'
          }}
        />

        {/* Heavy Metallic Cooling Tubes Illustration */}
        <div className="absolute -right-8 top-0 bottom-0 w-24 pointer-events-none opacity-40 flex gap-2">
          <div className="w-6 h-full bg-gradient-to-r from-neutral-700 via-neutral-500 to-neutral-800 rounded-full border-x border-neutral-400 shadow-2xl" />
          <div className="w-8 h-full bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-900 rounded-full border-x border-neutral-500 shadow-2xl" />
        </div>

        {/* Left Side Header */}
        <div className="relative z-10 pt-8 sm:pt-6">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-2">
            <Server className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-bold tracking-wider">FRONTIER MODEL CLUSTER INFRASTRUCTURE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-amber-100 tracking-tight">
            {gpuCount.toLocaleString()}x H100 Supercomputer
          </h2>
          <p className="text-xs text-amber-400/80 font-mono mt-1">
            52MW Dedicated Substation • Liquid Nitrogen Loops
          </p>
        </div>

        {/* Blinking Server Rack Light Matrix */}
        <div className="relative z-10 my-auto py-4">
          <div className="p-3 sm:p-4 rounded-xl bg-black/70 border border-amber-500/30 backdrop-blur-md shadow-2xl">
            <div className="text-[10px] font-mono text-amber-400/70 mb-2 flex items-center justify-between">
              <span>RACK BAY 01–32 ACTIVITY MATRIX</span>
              <span className="text-emerald-400 font-bold">{clusterLoad}% GPU LOAD</span>
            </div>
            
            {/* Grid of LEDs */}
            <div className="grid grid-cols-12 gap-1.5 sm:gap-2">
              {ledStates.map((isActive, i) => (
                <div
                  key={i}
                  className={`h-2 sm:h-3 rounded-xs transition-colors duration-75 ${
                    isActive 
                      ? i % 3 === 0 
                        ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]' 
                        : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]'
                      : 'bg-neutral-800 opacity-40'
                  }`}
                />
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-amber-900/50 flex items-center justify-between text-[10px] font-mono text-amber-300/80">
              <div>THERMAL: {Math.round(65 + clusterLoad * 0.15)}°C</div>
              <div>POWER: {Math.round(clusterLoad * 482).toLocaleString()} kW</div>
              <div>CLOCK: 1,980 MHz</div>
            </div>
          </div>
        </div>

        {/* GIANT BOLD "$$$$" STAMP */}
        <div className="relative z-10 flex items-center justify-between pt-2">
          <div className="inline-flex flex-col">
            <div className="text-4xl sm:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-amber-500 drop-shadow-[0_0_25px_rgba(245,158,11,0.6)] font-mono">
              $$$$
            </div>
            <div className="text-[11px] font-mono font-bold text-amber-400 tracking-wider">
              ~$100,000,000+ TRAINING RUN
            </div>
          </div>

          <div className="text-right text-xs font-mono text-amber-200/70">
            <div className="text-[10px] text-amber-500">EST. HARDWARE CAPEX</div>
            <div className="text-sm sm:text-base font-bold text-amber-100">$350M - $1.2B</div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT HALF: MINIMALIST API DISTILLATION LOOP ================= */}
      <div className="relative flex-1 bg-gradient-to-b from-[#090D16] via-[#060911] to-[#03060C] overflow-hidden flex flex-col justify-between p-4 sm:p-8">
        {/* Surgical Ice-White Volumetric Lighting */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 70% 30%, rgba(6, 182, 212, 0.15) 0%, transparent 70%)'
          }}
        />

        {/* Right Side Header */}
        <div className="relative z-10 pt-8 sm:pt-6">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-2">
            <Terminal className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-bold tracking-wider">REASONING DISTILLATION LOOP</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Minimalist API Prompt Automation
          </h2>
          <p className="text-xs text-cyan-400/80 font-mono mt-1">
            Standard Workstation • Continuous Synthetic Extraction
          </p>
        </div>

        {/* Clean Code Screen with syntax highlighting */}
        <div className="relative z-10 my-auto py-4">
          <div className="rounded-xl bg-[#030509]/95 border border-cyan-500/40 p-4 font-mono text-xs shadow-2xl backdrop-blur-md">
            {/* Editor Top Bar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyan-900/40 text-[10px] text-cyan-400/80">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-slate-300 font-semibold">distill_teacher.py</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>ACTIVE STREAM</span>
              </div>
            </div>

            {/* Code Lines */}
            <div className="space-y-1.5 leading-relaxed overflow-x-auto text-[11px] sm:text-xs">
              <div>
                <span className="text-purple-400 font-semibold">for</span>{' '}
                <span className="text-cyan-200">prompt</span>{' '}
                <span className="text-purple-400 font-semibold">in</span>{' '}
                <span className="text-blue-300">synthetic_reasoning_seeds</span>:
              </div>
              <div className="pl-4">
                <span className="text-slate-400"># Query US frontier model via API</span>
              </div>
              <div className="pl-4">
                <span className="text-cyan-300">solution</span> ={' '}
                <span className="text-amber-300">teacher_api</span>.
                <span className="text-emerald-300">complete</span>(
                <span className="text-cyan-200">prompt</span>,{' '}
                <span className="text-blue-300">cot</span>=
                <span className="text-purple-400">True</span>)
              </div>
              <div className="pl-4">
                <span className="text-slate-400"># Train student weights directly</span>
              </div>
              <div className="pl-4">
                <span className="text-emerald-300">student_model</span>.
                <span className="text-cyan-300">backprop</span>(
                <span className="text-cyan-200">solution</span>)
              </div>
            </div>

            {/* Live Query Stream Feedback */}
            <div className="mt-3 pt-3 border-t border-cyan-900/40 flex items-center justify-between text-[10px] text-slate-400">
              <div className="text-cyan-300">
                SEED #{currentQueryNum.toLocaleString()}
              </div>
              <div className="text-emerald-400 font-bold">
                COMPLETED (0.24s)
              </div>
            </div>
          </div>
        </div>

        {/* SLEEK "$0.05" STAMP */}
        <div className="relative z-10 flex items-center justify-between pt-2">
          <div className="inline-flex flex-col">
            <div className="text-4xl sm:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-200 to-emerald-400 drop-shadow-[0_0_25px_rgba(52,211,153,0.7)] font-mono">
              {apiCost}
            </div>
            <div className="text-[11px] font-mono font-bold text-emerald-400 tracking-wider">
              PER 1,000 SYNTHETIC TOKENS
            </div>
          </div>

          <div className="text-right text-xs font-mono text-cyan-200/70">
            <div className="text-[10px] text-cyan-400">STUDENT TRAINING COST</div>
            <div className="text-sm sm:text-base font-bold text-white">&lt; 1% of Base Capex</div>
          </div>
        </div>
      </div>

      {/* Center Laser Divider */}
      <div className={`absolute ${isVertical ? 'top-1/2 left-0 right-0 h-0.5' : 'top-0 bottom-0 left-1/2 w-0.5'} bg-gradient-to-b from-amber-400 via-white to-cyan-400 shadow-[0_0_15px_rgba(255,255,255,0.9)] z-40 pointer-events-none`} />

      {/* Scanline Overlay */}
      <div className="absolute inset-0 subtle-scanline z-50 pointer-events-none" />
    </div>
  );
};
