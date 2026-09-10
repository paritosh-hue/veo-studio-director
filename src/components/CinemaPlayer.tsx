import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShotData, AspectRatioMode, DirectorSettings } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { Shot1View } from './shots/Shot1View';
import { Shot2View } from './shots/Shot2View';
import { Shot3View } from './shots/Shot3View';
import { Shot4View } from './shots/Shot4View';
import { GenericShotView } from './shots/GenericShotView';
import { AudioVisualizer } from './AudioVisualizer';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Monitor, 
  Mic, 
  MicOff,
  Sliders,
  Sparkles,
  Eye,
  Film
} from 'lucide-react';

interface CinemaPlayerProps {
  shots: ShotData[];
  currentShot: ShotData;
  onShotChange: (shot: ShotData) => void;
  aspectRatio: AspectRatioMode;
  onAspectRatioChange: (mode: AspectRatioMode) => void;
  directorSettings?: DirectorSettings;
  onDirectorSettingsChange?: (settings: Partial<DirectorSettings>) => void;
  onOpenMixer?: () => void;
}

export const CinemaPlayer: React.FC<CinemaPlayerProps> = ({
  shots,
  currentShot,
  onShotChange,
  aspectRatio,
  onAspectRatioChange,
  directorSettings,
  onDirectorSettingsChange,
  onOpenMixer
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [showFilterPicker, setShowFilterPicker] = useState<boolean>(false);
  
  const totalDuration = shots.length > 0 ? shots[shots.length - 1].endTime : 30.0;
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Compute active shot from currentTime
  const activeShot = shots.find(
    s => currentTime >= s.startTime && (currentTime < s.endTime || (s.id === shots[shots.length - 1]?.id && currentTime <= s.endTime))
  ) || shots[0];

  // Notify parent if shot changed
  useEffect(() => {
    if (activeShot && activeShot.id !== currentShot.id) {
      onShotChange(activeShot);
    }
  }, [activeShot, currentShot.id, onShotChange]);

  // Handle procedural audio synchronization
  useEffect(() => {
    if (isPlaying && activeShot) {
      const progressInShot = currentTime - activeShot.startTime;
      audioEngine.playShotAudio(activeShot, progressInShot);
    } else {
      audioEngine.stopAll();
    }
  }, [isPlaying, activeShot?.id]);

  // Audio mute sync
  useEffect(() => {
    audioEngine.setMuted(isMuted);
  }, [isMuted]);

  // Voice toggle sync
  useEffect(() => {
    audioEngine.toggleVoice(isVoiceEnabled);
  }, [isVoiceEnabled]);

  // Main playback timer loop
  const updatePlayback = useCallback((timestamp: number) => {
    if (lastTimeRef.current !== null) {
      const delta = (timestamp - lastTimeRef.current) / 1000;
      setCurrentTime(prevTime => {
        const nextTime = prevTime + delta * playbackSpeed;
        if (nextTime >= totalDuration) {
          return 0; // Auto loop for smooth preview
        }
        return nextTime;
      });
    }
    lastTimeRef.current = timestamp;
    animFrameRef.current = requestAnimationFrame(updatePlayback);
  }, [playbackSpeed, totalDuration]);

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      animFrameRef.current = requestAnimationFrame(updatePlayback);
    } else {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      lastTimeRef.current = null;
    }
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, updatePlayback]);

  // Toggle Play / Pause
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  // Jump to specific time
  const seekTo = (time: number) => {
    const clamped = Math.max(0, Math.min(totalDuration, time));
    setCurrentTime(clamped);
    if (isPlaying) {
      const targetShot = shots.find(s => clamped >= s.startTime && clamped <= s.endTime) || shots[0];
      audioEngine.playShotAudio(targetShot, clamped - targetShot.startTime);
    }
  };

  // Scrub bar interaction
  const handleTimelineMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    handleTimelineMove(e);
  };

  const handleTimelineMove = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekTo(ratio * totalDuration);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsScrubbing(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isScrubbing) handleTimelineMove(e);
    };

    if (isScrubbing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isScrubbing]);

  // Shot progress (0 to 1 inside current shot)
  const shotDuration = activeShot ? (activeShot.endTime - activeShot.startTime) : 1;
  const progressInShot = activeShot 
    ? Math.max(0, Math.min(1, (currentTime - activeShot.startTime) / shotDuration))
    : 0;

  // Active filter styling
  const activeFilter = directorSettings?.colorGradingPreset || 'cyberpunk';
  const getFilterOverlayClass = () => {
    switch (activeFilter) {
      case 'matrix-emerald':
        return 'mix-blend-color-dodge bg-emerald-950/20';
      case 'noir-contrast':
        return 'contrast-125 saturate-50';
      case 'anamorphic-warmth':
        return 'sepia-[0.15] contrast-105';
      case 'bleach-bypass':
        return 'contrast-150 saturate-75';
      case 'cyberpunk':
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#05070C] select-none relative">
      {/* Top Viewport Toolbar */}
      <div className="px-4 py-2.5 bg-[#090D18] border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold text-white tracking-wide">
              VEO 3.1 CANVAS
            </span>
          </div>

          {activeShot && (
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
              <span>SHOT {activeShot.id}/{shots.length}:</span>
              <span className="font-semibold text-white truncate max-w-xs">{activeShot.title}</span>
            </div>
          )}
        </div>

        {/* Viewport Aspect Ratio, Filter & Audio Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <AudioVisualizer isPlaying={isPlaying} />

          {/* Color Grade Filter Selector */}
          <div className="relative">
            <button
              onClick={() => setShowFilterPicker(p => !p)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors"
              title="Camera Color Grade & Optical Preset"
            >
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline capitalize">{activeFilter.replace('-', ' ')}</span>
            </button>

            {showFilterPicker && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-cyan-500/40 rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-1 font-mono text-xs">
                <div className="text-[10px] text-slate-400 px-2 py-1 uppercase tracking-wider">Cinematic Lens Preset</div>
                {[
                  { id: 'cyberpunk', label: 'Cyberpunk Neon' },
                  { id: 'noir-contrast', label: 'High Contrast Noir' },
                  { id: 'matrix-emerald', label: 'Matrix Emerald' },
                  { id: 'anamorphic-warmth', label: 'Anamorphic Warmth' },
                  { id: 'bleach-bypass', label: 'Bleach Bypass 35mm' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onDirectorSettingsChange?.({ colorGradingPreset: opt.id as any });
                      setShowFilterPicker(false);
                    }}
                    className={`text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                      activeFilter === opt.id ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Aspect Ratio Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5">
            <button
              onClick={() => onAspectRatioChange('16:9')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono transition-colors ${
                aspectRatio === '16:9' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="16:9 Cinema Widescreen (YouTube, Landscape)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>16:9</span>
            </button>
            <button
              onClick={() => onAspectRatioChange('9:16')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono transition-colors ${
                aspectRatio === '9:16' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="9:16 Vertical (TikTok, Instagram Reels, YouTube Shorts)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>9:16</span>
            </button>
          </div>

          {/* Voiceover toggle */}
          <button
            onClick={() => setIsVoiceEnabled(v => !v)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isVoiceEnabled 
                ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300' 
                : 'bg-slate-900 border-slate-700 text-slate-500'
            }`}
            title={isVoiceEnabled ? 'Voiceover TTS Active' : 'Voiceover TTS Muted'}
          >
            {isVoiceEnabled ? <Mic className="w-3.5 h-3.5 text-cyan-400" /> : <MicOff className="w-3.5 h-3.5" />}
          </button>

          {/* Audio Sound FX toggle */}
          <button
            onClick={() => setIsMuted(m => !m)}
            className={`p-1.5 rounded-lg border transition-colors ${
              !isMuted 
                ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300' 
                : 'bg-slate-900 border-slate-700 text-slate-500'
            }`}
            title={isMuted ? 'Unmute Audio Stems' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          {/* Open Audio Stem Mixer button */}
          {onOpenMixer && (
            <button
              onClick={onOpenMixer}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-300 transition-colors"
              title="Open Audio Stem Mixer"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Video Viewport Stage */}
      <div className="flex-1 relative flex items-center justify-center p-2 sm:p-6 overflow-hidden bg-black/90">
        <div 
          className={`relative overflow-hidden rounded-2xl shadow-2xl border border-slate-800 transition-all duration-300 bg-black ${
            aspectRatio === '16:9' 
              ? 'w-full max-w-5xl aspect-video max-h-[68vh]' 
              : 'h-full aspect-[9/16] max-h-[68vh] shadow-[0_0_50px_rgba(0,0,0,0.8)]'
          } ${getFilterOverlayClass()}`}
        >
          {/* Active Shot Renderer */}
          {activeShot.id === 1 && (
            <Shot1View 
              progress={progressInShot} 
              currentTime={currentTime} 
              isVertical={aspectRatio === '9:16'} 
              shot={activeShot}
            />
          )}
          {activeShot.id === 2 && (
            <Shot2View 
              progress={progressInShot} 
              currentTime={currentTime} 
              isVertical={aspectRatio === '9:16'} 
              shot={activeShot}
            />
          )}
          {activeShot.id === 3 && (
            <Shot3View 
              progress={progressInShot} 
              currentTime={currentTime} 
              isVertical={aspectRatio === '9:16'} 
              shot={activeShot}
            />
          )}
          {activeShot.id === 4 && (
            <Shot4View 
              progress={progressInShot} 
              currentTime={currentTime} 
              isVertical={aspectRatio === '9:16'} 
              shot={activeShot}
            />
          )}
          {activeShot.id > 4 && (
            <GenericShotView
              shot={activeShot}
              progress={progressInShot}
              currentTime={currentTime}
              isVertical={aspectRatio === '9:16'}
            />
          )}

          {/* Optional Film Grain overlay */}
          {directorSettings?.filmGrain && (
            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-repeat bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          )}

          {/* Overlay Big Play Button on Click if Paused */}
          {!isPlaying && (
            <div 
              onClick={togglePlay}
              className="absolute inset-0 z-40 bg-black/40 backdrop-blur-xs flex items-center justify-center cursor-pointer transition-all hover:bg-black/30"
            >
              <div className="w-16 h-16 rounded-full bg-cyan-400/90 text-black flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.7)] hover:scale-110 active:scale-95 transition-transform pl-1">
                <Play className="w-8 h-8 fill-black" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Master Timeline & Scrubber Panel */}
      <div className="bg-[#080C16] border-t border-slate-800/80 p-3 sm:p-4">
        {/* Timeline Shot Track Badges (Responsive / Scrollable for N shots) */}
        <div className="flex gap-1.5 mb-2 font-mono text-[11px] overflow-x-auto pb-1 scrollbar-thin">
          {shots.map((shot) => {
            const isCurrent = activeShot?.id === shot.id;
            return (
              <button
                key={shot.id}
                onClick={() => seekTo(shot.startTime)}
                className={`p-2 rounded-lg border text-left transition-all min-w-[130px] flex-1 ${
                  isCurrent 
                    ? 'bg-cyan-950/90 border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Shot {shot.id}</span>
                  <span className="text-cyan-400 font-semibold">{shot.durationStr}</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {shot.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Scrub Bar */}
        <div 
          ref={progressBarRef}
          onMouseDown={handleTimelineMouseDown}
          className="relative h-3 bg-slate-800 rounded-full cursor-pointer group my-2 overflow-hidden"
        >
          {/* Dynamic Shot marker divisions */}
          <div className="absolute inset-0 flex pointer-events-none">
            {shots.map((s, idx) => {
              const dur = s.endTime - s.startTime;
              const widthPct = (dur / totalDuration) * 100;
              return (
                <div 
                  key={s.id} 
                  style={{ width: `${widthPct}%` }} 
                  className={idx < shots.length - 1 ? "border-r border-slate-700/80 h-full" : "h-full"} 
                />
              );
            })}
          </div>

          {/* Active progress fill */}
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 relative rounded-full"
            style={{ width: `${(currentTime / Math.max(0.1, totalDuration)) * 100}%` }}
          >
            {/* Scrubber needle */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_rgba(0,240,255,1)] -mr-1.5" />
          </div>
        </div>

        {/* Playback Controls & Time Display */}
        <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-300">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold transition-all shadow-md active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black pl-0.5" />}
            </button>

            {/* Restart */}
            <button
              onClick={() => seekTo(0)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Restart Video (0:00)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Timecode display */}
            <div className="flex items-baseline gap-1 text-sm font-bold text-white">
              <span className="text-cyan-400">{currentTime.toFixed(1)}s</span>
              <span className="text-slate-500">/</span>
              <span>{totalDuration.toFixed(1)}s</span>
            </div>
          </div>

          {/* Speed selector & shot indicators */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-slate-400">Speed:</span>
            {[0.5, 1.0, 1.5, 2.0].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  playbackSpeed === speed 
                    ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/50' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
