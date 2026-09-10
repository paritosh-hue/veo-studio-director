import React, { useState } from 'react';
import { StoryboardProject } from '../types';
import { Sparkles, X, Wand2, Loader2, Check, Video, ArrowRight, AlertCircle } from 'lucide-react';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyProject: (project: StoryboardProject) => void;
}

const QUICK_SUGGESTIONS = [
  { topic: 'Nuclear Fusion Net Energy Ignition', brand: 'IGNITE.AI' },
  { topic: 'Autonomous Humanoid Robotics Factory', brand: 'CYBER.MECH' },
  { topic: 'SpaceX Starship Commercial Mars Cargo', brand: 'STARSHIP.X' },
  { topic: 'Synthetic Biology & DNA Data Storage', brand: 'HELIX.BIO' },
];

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyProject
}) => {
  const [topic, setTopic] = useState('');
  const [brand, setBrand] = useState('STUDIO.VEO');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<StoryboardProject | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (targetTopic?: string, targetBrand?: string) => {
    const finalTopic = targetTopic || topic;
    const finalBrand = targetBrand || brand;

    if (!finalTopic.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedProject(null);

    try {
      const res = await fetch('/api/generate-storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: finalTopic, brand: finalBrand })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (data.project) {
        setGeneratedProject(data.project);
      } else {
        throw new Error('No project payload returned.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate storyboard. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedProject) {
      onApplyProject(generatedProject);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-mono">
      <div className="relative w-full max-w-2xl bg-[#080C16] border border-cyan-500/40 rounded-2xl shadow-2xl p-6 text-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                AI CINEMATIC STORYBOARD GENERATOR
              </h2>
              <p className="text-[11px] text-cyan-400/70">
                Powered by Gemini 3.8 Flash & Veo 3.1 Prompt Architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Prompt Input */}
          <div>
            <label className="text-xs font-bold text-white block mb-1.5">
              Describe Your Cinematic Storyboard Concept:
            </label>
            <textarea
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. A high-stakes documentary breakdown of the global race for room-temperature superconductors..."
              rows={3}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-xs text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Brand Name Input */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Creator / Brand Name:
            </label>
            <input
              type="text"
              value={brand}
              onChange={e => setBrand(e.target.value)}
              placeholder="e.g. parse.it, NEXUS.TECH, DEEP.DIVE"
              className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Quick Concept Chips */}
          <div>
            <span className="text-[11px] text-slate-400 block mb-2">Quick Storyboard Inspiration:</span>
            <div className="flex flex-wrap gap-2">
              {QUICK_SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTopic(s.topic);
                    setBrand(s.brand);
                    handleGenerate(s.topic, s.brand);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-[11px] text-slate-300 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>{s.topic}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-cyan-500/30 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <div className="text-sm font-bold text-white">Synthesizing 4-Shot Cinematic Arc...</div>
              <p className="text-xs text-slate-400 max-w-sm">
                Formulating Veo 3.1 visual directives, camera choreography, sound design stems, and kinetic typography.
              </p>
            </div>
          )}

          {/* Generated Result Preview */}
          {generatedProject && !isLoading && (
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-cyan-200">{generatedProject.name}</div>
                  <div className="text-xs text-slate-300 mt-0.5">{generatedProject.description}</div>
                </div>
                <div className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400/40 text-cyan-300 text-xs font-mono">
                  {generatedProject.shots.length} SHOTS • {generatedProject.totalDuration}s
                </div>
              </div>

              {/* Shot mini breakdown */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cyan-900/40 text-xs">
                {generatedProject.shots.map(s => (
                  <div key={s.id} className="p-2 rounded-lg bg-slate-900/80 border border-slate-700">
                    <div className="text-cyan-300 font-bold">Shot {s.id}: {s.title}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{s.subtitle}</div>
                    <div className="text-[9px] text-slate-400 mt-1 italic line-clamp-1">"{s.voiceover}"</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {!generatedProject ? (
              <button
                disabled={isLoading || !topic.trim()}
                onClick={() => handleGenerate()}
                className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                <span>Generate Storyboard</span>
              </button>
            ) : (
              <button
                onClick={handleApply}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Load Into Director Canvas</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
