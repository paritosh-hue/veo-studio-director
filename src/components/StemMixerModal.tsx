import React, { useState, useEffect } from 'react';
import { StemMixerSettings } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { Volume2, Sliders, Mic, Play, X, RotateCcw, Sparkles } from 'lucide-react';

interface StemMixerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StemMixerSettings;
  onChange: (newSettings: Partial<StemMixerSettings>) => void;
}

export const StemMixerModal: React.FC<StemMixerModalProps> = ({
  isOpen,
  onClose,
  settings,
  onChange
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const v = audioEngine.getVoices();
      if (v.length > 0) {
        setVoices(v.filter(item => item.lang.startsWith('en')));
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  if (!isOpen) return null;

  const handleSliderChange = (key: keyof StemMixerSettings, val: number) => {
    onChange({ [key]: val });
    audioEngine.setStemGains({ [key]: val });
  };

  const handleTestVoice = () => {
    audioEngine.testVoiceover("Testing audio synthesis. Sound design stems balanced and operational.");
  };

  const handleReset = () => {
    const defaults: StemMixerSettings = {
      masterVolume: 0.8,
      subBass: 0.85,
      ambience: 0.75,
      sfxClicks: 0.8,
      voiceoverGain: 1.0,
      voicePitch: 0.95,
      voiceRate: 1.05,
    };
    onChange(defaults);
    audioEngine.setStemGains(defaults);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-mono">
      <div className="relative w-full max-w-lg bg-[#090D1A] border border-cyan-500/40 rounded-2xl shadow-2xl p-6 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              SYNTHETIC AUDIO STEM MIXER
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Reset Audio Mixer Defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stem Sliders */}
        <div className="space-y-4 text-xs">
          {/* Master Volume */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-cyan-300 font-semibold">Master Gain</span>
              <span className="text-slate-400">{Math.round(settings.masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.masterVolume}
              onChange={e => handleSliderChange('masterVolume', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Sub-bass */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-amber-300 font-semibold">Sub-Bass (40Hz–60Hz Industrial Drone)</span>
              <span className="text-slate-400">{Math.round(settings.subBass * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.subBass}
              onChange={e => handleSliderChange('subBass', parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Ambience */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-blue-300 font-semibold">Atmospheric Ambience (Pad & Turbines)</span>
              <span className="text-slate-400">{Math.round(settings.ambience * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.ambience}
              onChange={e => handleSliderChange('ambience', parseFloat(e.target.value))}
              className="w-full accent-blue-400 cursor-pointer"
            />
          </div>

          {/* SFX Clicks */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-emerald-300 font-semibold">SFX Clicks & Digital Chimes</span>
              <span className="text-slate-400">{Math.round(settings.sfxClicks * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.sfxClicks}
              onChange={e => handleSliderChange('sfxClicks', parseFloat(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                <Mic className="w-3.5 h-3.5" />
                <span>Voiceover Voice Engine</span>
              </div>
              <button
                onClick={handleTestVoice}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 transition-colors"
              >
                <Play className="w-3 h-3 fill-cyan-300" />
                <span>Test Voice</span>
              </button>
            </div>

            {/* Voice select */}
            {voices.length > 0 && (
              <div className="mb-3">
                <label className="text-[10px] text-slate-400 block mb-1">Voice Profile</label>
                <select
                  value={settings.voiceName || ''}
                  onChange={e => {
                    onChange({ voiceName: e.target.value });
                    audioEngine.setStemGains({ voiceName: e.target.value });
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="">Default Native English</option>
                  {voices.map((v, i) => (
                    <option key={i} value={v.name}>{v.name} ({v.lang})</option>
                  ))}
                </select>
              </div>
            )}

            {/* Pitch and Speed */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-300">Pitch Resonance</span>
                  <span className="text-slate-400">{settings.voicePitch.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.4"
                  step="0.05"
                  value={settings.voicePitch}
                  onChange={e => handleSliderChange('voicePitch', parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-300">Speaking Velocity</span>
                  <span className="text-slate-400">{settings.voiceRate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  step="0.05"
                  value={settings.voiceRate}
                  onChange={e => handleSliderChange('voiceRate', parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-md transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
