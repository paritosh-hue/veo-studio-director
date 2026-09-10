/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShotData, AspectRatioMode, DirectorSettings, StemMixerSettings, StoryboardProject } from './types';
import { useStoryboard } from './hooks/useStoryboard';
import { CinemaPlayer } from './components/CinemaPlayer';
import { PromptsInspector } from './components/PromptsInspector';
import { StemMixerModal } from './components/StemMixerModal';
import { AIGeneratorModal } from './components/AIGeneratorModal';
import { 
  Clapperboard, 
  Sparkles, 
  Copy, 
  Check, 
  Share2, 
  Download, 
  Layout, 
  Sliders, 
  Wand2,
  Film,
  Terminal,
  RotateCcw
} from 'lucide-react';

export default function App() {
  const {
    project,
    shots,
    activeShot,
    activeShotId,
    setActiveShotId,
    updateShot,
    addShot,
    duplicateShot,
    deleteShot,
    loadPreset,
    loadProject,
    resetToDefault,
    presets
  } = useStoryboard();

  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>('16:9');
  const [layoutMode, setLayoutMode] = useState<'split' | 'cinema_only' | 'inspector_only'>('split');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Director settings
  const [directorSettings, setDirectorSettings] = useState<DirectorSettings>({
    playbackSpeed: 1.0,
    aspectRatio: '16:9',
    hudTelemetryVisible: true,
    filmGrain: false,
    cameraMotionSmoothing: 0.8,
    colorGradingPreset: 'cyberpunk'
  });

  // Audio Stem Mixer settings
  const [stemSettings, setStemSettings] = useState<StemMixerSettings>({
    masterVolume: 0.8,
    subBass: 0.85,
    ambience: 0.75,
    sfxClicks: 0.8,
    voiceoverGain: 1.0,
    voicePitch: 0.95,
    voiceRate: 1.05,
  });

  const [isMixerOpen, setIsMixerOpen] = useState(false);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);

  const handleCopyAllPrompts = () => {
    const fullScript = shots.map(shot => (
      `============================================================\n` +
      `Shot ${shot.id}: ${shot.title}\n` +
      `Duration: ${shot.durationStr} (${shot.startTime}s - ${shot.endTime}s)\n\n` +
      `Veo 3.1 Prompt:\n${shot.veoPrompt}\n\n` +
      `Native Audio Prompt:\n${shot.audioPrompt}\n\n` +
      `Voiceover:\n${shot.voiceover}\n` +
      `============================================================\n`
    )).join('\n');

    navigator.clipboard.writeText(fullScript);
    setCopiedNotification(`All ${shots.length} Prompts Copied!`);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  const handleDownloadScript = () => {
    const markdownContent = `# Veo 3.1 Production Storyboard: ${project.name}\n` +
      `**Brand / Channel:** ${project.brand}\n` +
      `**Total Duration:** ${project.totalDuration}s (${shots.length} shots)\n\n` +
      shots.map(s => 
        `## Shot ${s.id}: ${s.title} (${s.durationStr})\n\n` +
        `### Veo 3.1 Prompt\n\`\`\`\n${s.veoPrompt}\n\`\`\`\n\n` +
        `### Native Audio Prompt\n\`\`\`\n${s.audioPrompt}\n\`\`\`\n\n` +
        `### Voiceover\n> ${s.voiceover}\n\n` +
        `### Specs\n` +
        `- Camera Motion: ${s.cameraMotion}\n` +
        `- Lighting: ${s.lightingStyle}\n` +
        `- Color Grade: ${s.colorGrade}\n` +
        `- Audio Stems: ${s.soundDesignStems.join(', ')}\n\n`
      ).join('\n---\n\n');

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.id || 'veo-storyboard'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#04060A] text-slate-100 overflow-hidden font-sans">
      {/* Top Main Navigation Bar */}
      <header className="h-14 px-4 sm:px-6 bg-[#080C16] border-b border-slate-800 flex items-center justify-between shrink-0 z-30">
        {/* Left Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded-lg bg-black border border-cyan-500/40 text-cyan-400 font-mono text-xs font-black tracking-tight flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <span className="text-cyan-300">{"{"}</span>
            <span className="text-white font-mono">{project.brand || 'parse.it'}</span>
            <span className="text-cyan-300">{"}"}</span>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div>
            <h1 className="text-xs sm:text-sm font-extrabold text-white tracking-wide truncate max-w-xs sm:max-w-md">
              Veo 3.1 Director: {project.name}
            </h1>
            <p className="text-[10px] text-cyan-400/80 font-mono hidden sm:block">
              User-Controlled Studio • Real-Time Canvas & Audio Stems • {shots.length} Shots
            </p>
          </div>
        </div>

        {/* Right Action Suite */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification toast */}
          {copiedNotification && (
            <div className="animate-in fade-in slide-in-from-top-2 text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-300 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{copiedNotification}</span>
            </div>
          )}

          {/* AI Generator Trigger */}
          <button
            onClick={() => setIsAIGeneratorOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold transition-all shadow-sm"
            title="Generate new custom storyboard with Gemini AI"
          >
            <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Storyboard</span>
          </button>

          {/* Stem Mixer Trigger */}
          <button
            onClick={() => setIsMixerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono transition-colors"
            title="Open Audio Stem Mixer"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Audio Mixer</span>
          </button>

          {/* Copy All Prompts Button */}
          <button
            onClick={handleCopyAllPrompts}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono transition-colors shadow-sm"
            title="Copy all prompts to clipboard"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copy All</span>
          </button>

          {/* Download Script */}
          <button
            onClick={handleDownloadScript}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Download Storyboard Markdown file"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Layout View Mode Switcher */}
          <div className="hidden md:flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => setLayoutMode('split')}
              className={`px-2 py-1 rounded transition-colors ${
                layoutMode === 'split' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Split View (Cinema + Inspector)"
            >
              Split
            </button>
            <button
              onClick={() => setLayoutMode('cinema_only')}
              className={`px-2 py-1 rounded transition-colors ${
                layoutMode === 'cinema_only' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Cinema Viewport Only"
            >
              Cinema
            </button>
            <button
              onClick={() => setLayoutMode('inspector_only')}
              className={`px-2 py-1 rounded transition-colors ${
                layoutMode === 'inspector_only' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Prompts Inspector Only"
            >
              Director
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Cinema Video Viewport Section */}
        {(layoutMode === 'split' || layoutMode === 'cinema_only') && (
          <section 
            className={`flex flex-col ${
              layoutMode === 'split' ? 'w-full lg:w-[60%] xl:w-[63%]' : 'w-full'
            } h-full border-b lg:border-b-0 lg:border-r border-slate-800`}
          >
            <CinemaPlayer
              shots={shots}
              currentShot={activeShot}
              onShotChange={(shot) => setActiveShotId(shot.id)}
              aspectRatio={aspectRatio}
              onAspectRatioChange={(mode) => setAspectRatio(mode)}
              directorSettings={directorSettings}
              onDirectorSettingsChange={(changes) => setDirectorSettings(prev => ({ ...prev, ...changes }))}
              onOpenMixer={() => setIsMixerOpen(true)}
            />
          </section>
        )}

        {/* Prompts & Director Console Section */}
        {(layoutMode === 'split' || layoutMode === 'inspector_only') && (
          <section 
            className={`flex flex-col ${
              layoutMode === 'split' ? 'w-full lg:w-[40%] xl:w-[37%]' : 'w-full'
            } h-full overflow-hidden`}
          >
            <PromptsInspector
              currentShot={activeShot}
              allShots={shots}
              project={project}
              presets={presets}
              onSelectShot={(id) => setActiveShotId(id)}
              onUpdateShot={updateShot}
              onAddShot={addShot}
              onDuplicateShot={duplicateShot}
              onDeleteShot={deleteShot}
              onLoadPreset={loadPreset}
              onLoadProject={loadProject}
              onResetToDefault={resetToDefault}
              onOpenAIGenerator={() => setIsAIGeneratorOpen(true)}
              onOpenMixer={() => setIsMixerOpen(true)}
            />
          </section>
        )}
      </main>

      {/* Audio Stem Mixer Modal */}
      <StemMixerModal
        isOpen={isMixerOpen}
        onClose={() => setIsMixerOpen(false)}
        settings={stemSettings}
        onChange={(newSettings) => setStemSettings(prev => ({ ...prev, ...newSettings }))}
      />

      {/* AI Storyboard Generator Modal */}
      <AIGeneratorModal
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
        onApplyProject={(newProj) => loadProject(newProj)}
      />
    </div>
  );
}
