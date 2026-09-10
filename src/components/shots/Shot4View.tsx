import React, { useRef, useEffect, useState } from 'react';
import { CheckCircle, Bell, ArrowRight, Sparkles, Share2 } from 'lucide-react';
import { ShotData } from '../../types';

interface ShotViewProps {
  progress: number; // 0 to 1 (corresponds to 20s to 30s)
  currentTime: number; // 20 to 30s
  isVertical: boolean;
  shot?: ShotData;
}

export const Shot4View: React.FC<ShotViewProps> = ({ progress, currentTime, isVertical, shot }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasFollowed, setHasFollowed] = useState(false);
  const [burstParticles, setBurstParticles] = useState<{ id: number; x: number; y: number; vx: number; vy: number; color: string; alpha: number }[]>([]);

  const isResolvePhase = progress >= 0.74;

  const brand = shot?.userCanvasOverrides?.customBrand || 'parse.it';
  const punchline1 = shot?.userCanvasOverrides?.headline || "It’s efficient.";
  const ctaText = shot?.userCanvasOverrides?.tagline || "Hit follow for weekly breakdowns";

  // Particle dust canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const dustCount = isResolvePhase ? 70 : 35;
    const particles = Array.from({ length: dustCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.6,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.1,
      alpha: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.4 ? 'rgba(0, 240, 255,' : 'rgba(255, 255, 255,'
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isResolvePhase]);

  // Interactive follow button trigger
  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasFollowed(true);

    // Trigger celebration burst
    const rect = e.currentTarget.getBoundingClientRect();
    const newBurst = Array.from({ length: 30 }).map((_, i) => ({
      id: Math.random(),
      x: rect.width / 2,
      y: rect.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12,
      color: ['#00F0FF', '#34D399', '#FBBF24', '#FFFFFF'][i % 4],
      alpha: 1
    }));
    setBurstParticles(newBurst);
    setTimeout(() => setBurstParticles([]), 1500);
  };

  return (
    <div className="relative w-full h-full bg-[#030508] overflow-hidden flex flex-col items-center justify-center select-none">
      {/* Premium Dark Tech Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(14, 28, 48, 0.4) 0%, rgba(3, 5, 8, 0.98) 75%)'
        }}
      />

      {/* Particle Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      />

      {/* Top HUD */}
      <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-xs text-slate-400 z-20 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="tracking-widest text-slate-300">CONCLUSION // THESIS RESOLVE</span>
        </div>
        <div className="text-cyan-400 font-bold">
          {currentTime.toFixed(2)}s / {shot?.endTime || 30.00}s
        </div>
      </div>

      {/* Main Content Stage */}
      <div className="relative z-20 max-w-4xl px-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        {/* Phase 1: "It’s efficient." */}
        {progress < 0.26 && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="text-xs font-mono tracking-widest text-emerald-400 uppercase mb-3">
              Observation 01
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-200 to-white drop-shadow-[0_0_35px_rgba(52,211,153,0.7)]">
              {punchline1}
            </h1>
            <p className="mt-4 text-xs sm:text-sm font-mono text-emerald-400/70">
              95% cost reduction through synthetic distillation loops.
            </p>
          </div>
        )}

        {/* Phase 2: "It violates terms of service." */}
        {progress >= 0.26 && progress < 0.52 && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="text-xs font-mono tracking-widest text-rose-400 uppercase mb-3">
              Legal Friction Point
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-200 to-white drop-shadow-[0_0_35px_rgba(244,63,94,0.7)]">
              It violates terms of service.
            </h1>
            <p className="mt-4 text-xs sm:text-sm font-mono text-rose-400/80">
              Direct conflict with frontier commercial use restrictions.
            </p>
          </div>
        )}

        {/* Phase 3: "And it’s rewriting global AI competition." */}
        {progress >= 0.52 && progress < 0.74 && (
          <div className="animate-in fade-in zoom-in-95 duration-300 max-w-3xl">
            <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase mb-3">
              Geopolitical Impact
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-[0_0_40px_rgba(0,240,255,0.6)]">
              And it’s rewriting global AI competition.
            </h1>
            <p className="mt-4 text-xs sm:text-sm font-mono text-cyan-300/80">
              Democratizing frontier intelligence across sovereign borders.
            </p>
          </div>
        )}

        {/* Phase 4: Final Resolve: Brand Logo Mark + "Hit follow" Button */}
        {isResolvePhase && (
          <div className="animate-in fade-in zoom-in-90 duration-500 flex flex-col items-center">
            {/* Ambient Brand Halo */}
            <div className="relative mb-6">
              <div className="absolute -inset-8 rounded-full bg-cyan-500/20 blur-2xl animate-pulse" />
              
              {/* Clean Brand Monogram Logo */}
              <div className="relative px-8 py-5 rounded-2xl bg-black/80 border-2 border-cyan-400/70 shadow-[0_0_40px_rgba(0,240,255,0.4)] backdrop-blur-xl flex items-center gap-3">
                <span className="text-cyan-400 font-mono text-3xl sm:text-4xl font-light">{"{"}</span>
                <div className="flex items-baseline">
                  <span className="text-3xl sm:text-5xl font-black tracking-tight text-white font-mono">
                    {brand}
                  </span>
                </div>
                <span className="text-cyan-400 font-mono text-3xl sm:text-4xl font-light">{"}"}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-mono text-slate-300 tracking-wider mb-7 max-w-md">
              Demystifying frontier AI architecture, economics, and geopolitics.
            </p>

            {/* "Hit follow" Prompt Button */}
            <div className="relative">
              <button
                onClick={handleFollowClick}
                className={`relative group px-8 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all duration-300 flex items-center gap-2.5 shadow-xl ${
                  hasFollowed 
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30' 
                    : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-cyan-500/30 scale-105'
                }`}
              >
                {hasFollowed ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-slate-950" />
                    <span>Following {brand}</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 animate-bounce" />
                    <span>{ctaText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Celebration particles on click */}
              {burstParticles.map((bp) => (
                <div
                  key={bp.id}
                  className="absolute w-2 h-2 rounded-full pointer-events-none animate-out fade-out"
                  style={{
                    left: `${bp.x}px`,
                    top: `${bp.y}px`,
                    backgroundColor: bp.color,
                    transform: `translate(${bp.vx * 8}px, ${bp.vy * 8}px)`,
                    transition: 'all 0.6s cubic-bezier(0, 0.9, 0.5, 1)'
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Subtitle / Voiceover Banner */}
      <div className="absolute bottom-5 left-6 right-6 text-center z-20">
        <p className="inline-block px-5 py-2 rounded-xl bg-black/85 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium backdrop-blur-md shadow-2xl">
          {shot?.voiceover || `"It’s efficient. It violates terms of service. And it’s rewriting global AI competition."`}
        </p>
      </div>

      {/* Scanline Overlay */}
      <div className="absolute inset-0 subtle-scanline z-30 pointer-events-none" />
    </div>
  );
};
