import React from 'react';
import { ShotData } from '../../types';
import { Camera, Radio, Sparkles, Layers, Sliders, Cpu, Activity } from 'lucide-react';

interface GenericShotViewProps {
  shot: ShotData;
  progress: number;
  currentTime: number;
  isVertical: boolean;
}

export const GenericShotView: React.FC<GenericShotViewProps> = ({
  shot,
  progress,
  currentTime,
  isVertical
}) => {
  const headline = shot.userCanvasOverrides?.headline || shot.title;
  const primaryStat = shot.userCanvasOverrides?.primaryStat || (shot.technicalMetrics && shot.technicalMetrics[0]?.value) || 'VEO 3.1 NATIVE';
  const secondaryStat = shot.userCanvasOverrides?.secondaryStat || (shot.technicalMetrics && shot.technicalMetrics[1]?.value) || shot.subtitle;
  const brand = shot.userCanvasOverrides?.customBrand || 'STUDIO.VEO';

  // Kinetic pulse calculation
  const pulseScale = 1 + Math.sin(progress * Math.PI * 4) * 0.03;

  return (
    <div className="relative w-full h-full bg-[#04060C] overflow-hidden flex flex-col items-center justify-center select-none text-slate-100">
      {/* Dynamic Lighting Vignette based on shot colorGrade or keywords */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(6, 182, 212, 0.16) 0%, rgba(4, 6, 12, 0.96) 80%)'
        }}
      />

      {/* Cyber Digital Floor Grid */}
      <div className="absolute inset-0 digital-grid opacity-25" />

      {/* Subtle Scanlines overlay */}
      <div className="absolute inset-0 subtle-scanline opacity-30 pointer-events-none" />

      {/* Top Telemetry HUD */}
      <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-xs text-cyan-400/80 z-20 font-mono tracking-wider">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold text-cyan-300 uppercase tracking-widest">{brand} // SHOT #{shot.id}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-[10px] hidden sm:inline-block">
            {shot.cameraMotion || 'DYNAMIC 3D CAMERA'}
          </span>
          <span className="text-cyan-400 font-bold">{currentTime.toFixed(2)}s / {shot.endTime.toFixed(2)}s</span>
        </div>
      </div>

      {/* Center Cinematic Stage */}
      <div className="relative z-10 max-w-4xl px-8 text-center flex flex-col items-center justify-center">
        {/* Category / Subtitle Chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 text-xs font-mono tracking-widest uppercase">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="truncate max-w-md">{shot.subtitle || 'DIRECTOR SCENE TAKE'}</span>
        </div>

        {/* Dynamic User Title / Headline with Kinetic Pulse */}
        <h1 
          style={{ transform: `scale(${pulseScale})` }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-[0_0_25px_rgba(6,182,212,0.6)] mb-6 transition-transform duration-100"
        >
          {headline}
        </h1>

        {/* Primary and Secondary Metrics Cards */}
        <div className="flex flex-wrap items-center justify-center gap-4 my-2">
          {primaryStat && (
            <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-cyan-300 shadow-lg backdrop-blur-md flex items-center gap-2 font-mono text-sm font-bold">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{primaryStat}</span>
            </div>
          )}

          {secondaryStat && (
            <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 shadow-lg backdrop-blur-md flex items-center gap-2 font-mono text-sm">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="truncate max-w-xs">{secondaryStat}</span>
            </div>
          )}
        </div>

        {/* Key Visual Entities Chips */}
        {shot.keyEntities && shot.keyEntities.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-2xl">
            {shot.keyEntities.slice(0, 4).map((entity, idx) => (
              <span 
                key={idx}
                className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-slate-400 text-xs font-mono"
              >
                #{entity}
              </span>
            ))}
          </div>
        )}

        {/* Live Voiceover Subtitle Bar */}
        {shot.voiceover && (
          <div className="mt-8 px-5 py-2.5 rounded-xl bg-black/70 border border-cyan-500/30 text-slate-200 text-xs sm:text-sm font-sans italic max-w-xl backdrop-blur-md shadow-2xl">
            "{shot.voiceover}"
          </div>
        )}
      </div>

      {/* Bottom Telemetry HUD */}
      <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[11px] font-mono text-slate-500 z-20">
        <div className="flex items-center gap-3">
          <span>COLOR: {shot.colorGrade?.slice(0, 30) || 'CINEMATIC HDR'}</span>
        </div>
        <div className="flex items-center gap-2 text-cyan-400/70">
          <span>PROGRESS: {Math.round(progress * 100)}%</span>
        </div>
      </div>
    </div>
  );
};
