import React, { useMemo } from 'react';
import { Database, ArrowDown, Sparkles, Cpu, Layers, Network } from 'lucide-react';
import { ShotData } from '../../types';

interface ShotViewProps {
  progress: number; // 0 to 1
  currentTime: number; // 4 to 12s
  isVertical: boolean;
  shot?: ShotData;
}

interface DistillerCompany {
  name: string;
  codename: string;
  specialty: string;
  distillationSource: string;
  tag: string;
  status: string;
}

const DEFAULT_COMPANIES: DistillerCompany[] = [
  { name: 'DeepSeek', codename: 'V3 / R1 Reasoning', specialty: 'DeepSeek-MoE & Synthetic Math/Code', distillationSource: 'GPT-4o & Claude 3.5', tag: '$5.6M Compute', status: 'ACTIVE' },
  { name: 'Moonshot AI', codename: 'Kimi k1.5', specialty: 'Long-Context Agentic Reasoning', distillationSource: 'Gemini 1.5 Pro & Claude 3.5', tag: '200k Context', status: 'ACTIVE' },
  { name: 'Alibaba', codename: 'Qwen 2.5 Max', specialty: 'Frontier Coding & Math Synthetic Pipelines', distillationSource: 'OpenAI o1 & GPT-4o', tag: '72B Parameters', status: 'ACTIVE' },
  { name: 'MiniMax', codename: 'Hailuo 01 / abab 7', specialty: 'Multi-Modal Reasoning & Synthetic Speech', distillationSource: 'US Frontier APIs', tag: 'Linear Attention', status: 'ACTIVE' },
  { name: 'StepFun', codename: 'Step-2 / Step-Audio', specialty: 'MoE Multimodal Scaling', distillationSource: 'Frontier Cross-Query', tag: '100B+ MoE', status: 'ACTIVE' },
  { name: 'Z.AI (Zhipu)', codename: 'GLM-4 / GLM-Zero', specialty: 'Chain-of-Thought Reflection Engines', distillationSource: 'Frontier Seed Prompts', tag: 'Cognitive Engine', status: 'ACTIVE' },
];

const FRONTIER_MODELS = [
  { name: 'OpenAI GPT-4o', org: 'OpenAI', tokens: '4.8B' },
  { name: 'Claude 3.5 Sonnet', org: 'Anthropic', tokens: '3.6B' },
  { name: 'Gemini 1.5 Pro', org: 'Google DeepMind', tokens: '5.2B' },
];

export const Shot2View: React.FC<ShotViewProps> = ({ progress, currentTime, isVertical, shot }) => {
  // Smooth pan down calculation
  const scrollOffset = progress * 240;
  const speedMult = shot?.userCanvasOverrides?.tokenRateMultiplier || 1.0;

  // Generated dynamic particle streams
  const particles = useMemo(() => {
    return Array.from({ length: Math.floor(24 * speedMult) }).map((_, i) => ({
      id: i,
      left: 10 + (i * 3.8) % 80,
      duration: (1.2 + (i % 5) * 0.4) / speedMult,
      delay: (i * 0.15) % 1.5,
      size: 2 + (i % 3) * 2,
    }));
  }, [speedMult]);

  const totalExtractedTokens = Math.floor((12480000000 + progress * 4800000000) * speedMult);

  // Entities from shot if custom
  const companies = DEFAULT_COMPANIES;

  return (
    <div className="relative w-full h-full bg-[#03060E] overflow-hidden flex flex-col select-none">
      {/* Dark Tech-Noir Radial Lighting */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 20%, rgba(30, 58, 138, 0.35) 0%, rgba(3, 6, 14, 0.98) 80%)'
        }}
      />

      {/* Background Matrix Grid */}
      <div className="absolute inset-0 digital-grid opacity-30" />

      {/* Top Overlay: US Frontier Models (Sources of Distillation Data) */}
      <div className="relative z-20 w-full px-6 pt-4 pb-3 border-b border-blue-900/50 bg-[#060B18]/90 backdrop-blur-md">
        <div className="flex items-center justify-between text-xs font-mono text-blue-400 mb-2">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="font-bold tracking-wider text-blue-200">US FRONTIER TEACHER MODELS // OUTBOUND TOKEN STREAM</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-slate-400">EXTRACTION VOL:</span>
            <span className="text-cyan-400 font-bold font-mono text-xs">
              {totalExtractedTokens.toLocaleString()} TOKENS
            </span>
          </div>
        </div>

        {/* 3 Frontier Source Nodes */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-4xl mx-auto">
          {FRONTIER_MODELS.map((model, idx) => (
            <div 
              key={idx}
              className="relative p-2 sm:p-2.5 rounded-lg bg-blue-950/60 border border-blue-500/40 flex items-center justify-between shadow-[0_0_15px_rgba(59,130,246,0.15)]"
            >
              <div className="min-w-0 pr-1">
                <div className="text-[10px] text-blue-400 font-mono">{model.org}</div>
                <div className="text-xs sm:text-sm font-bold text-white truncate">{model.name}</div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="text-[9px] font-mono text-emerald-400 font-semibold">SYNTHESIS</span>
                <span className="text-[10px] font-mono text-cyan-300">~{model.tokens}/d</span>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
          ))}
        </div>

        {/* Data Stream Conduits Indicator */}
        <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-cyan-400 mt-2">
          <ArrowDown className="w-3 h-3 animate-bounce text-cyan-400" />
          <span>SYNTHETIC REASONING DISTILLATION CONDUITS</span>
          <ArrowDown className="w-3 h-3 animate-bounce text-cyan-400" />
        </div>
      </div>

      {/* Flowing Token Particles Container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-b from-cyan-300 to-blue-600 shadow-[0_0_8px_rgba(0,240,255,0.8)]"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size * 3}px`,
              top: `${((currentTime * 40 * speedMult + p.id * 15) % 100)}%`,
              opacity: 0.6 + ((p.id % 4) * 0.1),
              transition: 'top 0.05s linear'
            }}
          />
        ))}
      </div>

      {/* Main Vertical Scrolling Grid of Distillation Tech Companies */}
      <div className="relative flex-1 z-15 overflow-hidden px-4 sm:px-8 py-3">
        <div 
          className="transition-transform duration-100 ease-out max-w-4xl mx-auto space-y-3"
          style={{
            transform: `translateY(-${scrollOffset}px)`
          }}
        >
          {companies.map((company, index) => (
            <div
              key={index}
              className="relative p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-blue-500/30 hover:border-cyan-400/60 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              {/* Glowing accent strip */}
              <div className="absolute top-0 left-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b from-cyan-400 to-blue-600 shadow-[0_0_10px_rgba(0,240,255,0.8)]" />

              <div className="flex items-center gap-3.5 pl-2">
                <div className="w-10 h-10 rounded-lg bg-blue-950/70 border border-blue-500/40 flex items-center justify-center text-cyan-300 font-mono font-bold text-sm shadow-inner">
                  {company.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                      {company.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 border border-cyan-400/50 text-cyan-300">
                      {company.codename}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
                    <span>{company.specialty}</span>
                  </p>
                </div>
              </div>

              {/* Distillation Metadata */}
              <div className="flex items-center gap-3 sm:gap-4 pl-2 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800 text-xs font-mono">
                <div className="text-left sm:text-right">
                  <div className="text-[10px] text-slate-400">TRAINING SOURCE</div>
                  <div className="text-cyan-300 font-semibold">{company.distillationSource}</div>
                </div>
                <div className="px-2.5 py-1 rounded bg-blue-900/50 border border-blue-400/40 text-blue-200 text-xs font-bold shrink-0">
                  {company.tag}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Subtitle / Telemetry Bar */}
      <div className="relative z-20 px-6 py-2.5 bg-[#040814]/95 border-t border-blue-900/50 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-300/80 font-mono gap-1">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-slate-300">
            {shot?.voiceover || `"Behind closed doors, billions of tokens flow across borderless APIs..."`}
          </span>
        </div>
        <div className="text-cyan-400 font-bold">
          TIME: {currentTime.toFixed(2)}s ({shot?.durationStr || "0:04 - 0:12"})
        </div>
      </div>

      {/* Scanline Overlay */}
      <div className="absolute inset-0 subtle-scanline z-30 pointer-events-none" />
    </div>
  );
};
