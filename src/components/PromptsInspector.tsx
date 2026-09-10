import React, { useState } from 'react';
import { ShotData, StoryboardProject } from '../types';
import { audioEngine } from '../utils/audioEngine';
import { 
  Copy, 
  Check, 
  Sparkles, 
  Volume2, 
  Video, 
  Code, 
  FileText, 
  Download, 
  Edit3, 
  Layers, 
  Camera, 
  Palette,
  Play,
  Plus,
  Trash2,
  CopyPlus,
  Sliders,
  Wand2,
  RotateCcw,
  Upload,
  Radio
} from 'lucide-react';

interface PromptsInspectorProps {
  currentShot: ShotData;
  allShots: ShotData[];
  project: StoryboardProject;
  presets: StoryboardProject[];
  onSelectShot: (shotId: number) => void;
  onUpdateShot: (shotId: number, changes: Partial<ShotData>) => void;
  onAddShot: () => void;
  onDuplicateShot: (shotId: number) => void;
  onDeleteShot: (shotId: number) => void;
  onLoadPreset: (presetId: string) => void;
  onLoadProject: (project: StoryboardProject) => void;
  onResetToDefault: () => void;
  onOpenAIGenerator: () => void;
  onOpenMixer: () => void;
}

export const PromptsInspector: React.FC<PromptsInspectorProps> = ({
  currentShot,
  allShots,
  project,
  presets,
  onSelectShot,
  onUpdateShot,
  onAddShot,
  onDuplicateShot,
  onDeleteShot,
  onLoadPreset,
  onLoadProject,
  onResetToDefault,
  onOpenAIGenerator,
  onOpenMixer
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'current' | 'all' | 'api_json' | 'analysis'>('editor');
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const generateVeoApiPayload = () => {
    return JSON.stringify({
      model: "veo-3.1-generate-001",
      project: project.name,
      brand: project.brand,
      aspectRatio: "16:9",
      targetDurationSeconds: project.totalDuration,
      sequence: allShots.map(s => ({
        shotIndex: s.id,
        name: s.title,
        timecode: s.durationStr,
        startSeconds: s.startTime,
        endSeconds: s.endTime,
        prompt: {
          text: s.veoPrompt,
          cameraMovement: s.cameraMotion,
          lighting: s.lightingStyle,
          colorGrade: s.colorGrade
        },
        nativeAudio: {
          prompt: s.audioPrompt,
          voiceover: s.voiceover,
          stems: s.soundDesignStems
        },
        canvasOverrides: s.userCanvasOverrides
      }))
    }, null, 2);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${project.id || 'storyboard'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleApplyImport = () => {
    try {
      setImportError(null);
      const parsed = JSON.parse(importJsonText);
      if (!parsed || !Array.isArray(parsed.shots) || parsed.shots.length === 0) {
        throw new Error("Invalid format: Must contain a 'shots' array with at least one shot.");
      }
      onLoadProject(parsed);
      setShowImportModal(false);
      setImportJsonText('');
    } catch (e: any) {
      setImportError(e.message || "Failed to parse JSON");
    }
  };

  const handlePlayTTS = () => {
    if (currentShot.voiceover) {
      audioEngine.testVoiceover(currentShot.voiceover);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#080B12] border-t lg:border-t-0 lg:border-l border-slate-800 text-slate-200">
      {/* Top Header & Preset Bar */}
      <div className="p-4 border-b border-slate-800/80 bg-[#0A0E18]">
        {/* Project Title & Global Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shrink-0">
              <Video className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white tracking-wide truncate">
                {project.name}
              </h3>
              <p className="text-[11px] font-mono text-cyan-400/80 truncate">
                Director Studio // {project.brand}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            {/* AI Generator Button */}
            <button
              onClick={onOpenAIGenerator}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/40 text-cyan-300 font-bold transition-all shadow-sm"
              title="Generate new storyboard with Gemini"
            >
              <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Storyboard</span>
            </button>

            {/* Audio Stem Mixer */}
            <button
              onClick={onOpenMixer}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Stem Audio Mixer"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            {/* Export JSON */}
            <button
              onClick={handleExportJson}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Export Storyboard JSON"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Import JSON */}
            <button
              onClick={() => setShowImportModal(true)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Import Storyboard JSON"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Preset Selector Dropdown */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-mono text-slate-400 shrink-0 uppercase tracking-wider">Preset:</span>
          <select
            value={project.id}
            onChange={e => onLoadPreset(e.target.value)}
            className="flex-1 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400"
          >
            {presets.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.brand})
              </option>
            ))}
          </select>
          <button
            onClick={onResetToDefault}
            className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs transition-colors shrink-0"
            title="Reset to default project"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-1 p-1 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'editor' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Director Controls
          </button>
          <button
            onClick={() => setActiveTab('current')}
            className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'current' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Veo Prompt
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'all' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Full Script
          </button>
          <button
            onClick={() => setActiveTab('api_json')}
            className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'api_json' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Veo API
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'analysis' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Notes
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: INTERACTIVE DIRECTOR CONTROLS */}
        {activeTab === 'editor' && (
          <div className="space-y-4 font-mono text-xs">
            {/* Shot Navigation & Actions Header */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">Active Shot:</span>
                <select
                  value={currentShot.id}
                  onChange={e => onSelectShot(parseInt(e.target.value, 10))}
                  className="px-2 py-1 rounded bg-slate-950 border border-slate-700 text-white font-bold"
                >
                  {allShots.map(s => (
                    <option key={s.id} value={s.id}>
                      Shot {s.id}: {s.title} ({s.durationStr})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onDuplicateShot(currentShot.id)}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                  title="Duplicate Current Shot"
                >
                  <CopyPlus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onAddShot}
                  className="p-1.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900"
                  title="Add New Shot"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                {allShots.length > 1 && (
                  <button
                    onClick={() => onDeleteShot(currentShot.id)}
                    className="p-1.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900/80"
                    title="Delete Current Shot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Live Canvas On-Screen Text Overrides */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/30 space-y-3">
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <Palette className="w-3.5 h-3.5" />
                <span>Live Canvas Overrides (Updates Instantly)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Primary Headline / Hook</label>
                  <input
                    type="text"
                    value={currentShot.userCanvasOverrides?.headline ?? currentShot.title}
                    onChange={e => onUpdateShot(currentShot.id, {
                      userCanvasOverrides: { headline: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Primary Metric Stat</label>
                  <input
                    type="text"
                    value={currentShot.userCanvasOverrides?.primaryStat ?? ''}
                    placeholder="e.g. 10,000 YEARS -> 180 SEC"
                    onChange={e => onUpdateShot(currentShot.id, {
                      userCanvasOverrides: { primaryStat: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Secondary Sub-Stat</label>
                  <input
                    type="text"
                    value={currentShot.userCanvasOverrides?.secondaryStat ?? ''}
                    placeholder="e.g. 10,000,000x REDUCTION"
                    onChange={e => onUpdateShot(currentShot.id, {
                      userCanvasOverrides: { secondaryStat: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Brand Name Watermark</label>
                  <input
                    type="text"
                    value={currentShot.userCanvasOverrides?.customBrand ?? project.brand}
                    onChange={e => onUpdateShot(currentShot.id, {
                      userCanvasOverrides: { customBrand: e.target.value }
                    })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Narration Script & TTS Voiceover */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Voiceover Narration Script</span>
                </div>
                <button
                  onClick={handlePlayTTS}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 transition-colors"
                >
                  <Play className="w-3 h-3 fill-cyan-300" />
                  <span>Preview Audio</span>
                </button>
              </div>
              <textarea
                value={currentShot.voiceover}
                onChange={e => onUpdateShot(currentShot.id, { voiceover: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400 text-xs leading-relaxed"
              />
            </div>

            {/* Veo 3.1 Prompt Editing */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Video className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Veo 3.1 Video Generation Prompt</span>
                </div>
                <button
                  onClick={() => copyToClipboard(currentShot.veoPrompt, 'veo_single')}
                  className="text-slate-400 hover:text-white text-[11px] flex items-center gap-1"
                >
                  {copiedType === 'veo_single' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <textarea
                value={currentShot.veoPrompt}
                onChange={e => onUpdateShot(currentShot.id, { veoPrompt: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400 text-xs leading-relaxed"
              />
            </div>

            {/* Native Audio Prompt */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Native Audio Prompt (Sound Design)</span>
                </div>
                <button
                  onClick={() => copyToClipboard(currentShot.audioPrompt, 'audio_single')}
                  className="text-slate-400 hover:text-white text-[11px] flex items-center gap-1"
                >
                  {copiedType === 'audio_single' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <textarea
                value={currentShot.audioPrompt}
                onChange={e => onUpdateShot(currentShot.id, { audioPrompt: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400 text-xs leading-relaxed"
              />
            </div>

            {/* Camera Motion & Lighting Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Camera Motion</label>
                <input
                  type="text"
                  value={currentShot.cameraMotion}
                  onChange={e => onUpdateShot(currentShot.id, { cameraMotion: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Lighting Technique</label>
                <input
                  type="text"
                  value={currentShot.lightingStyle}
                  onChange={e => onUpdateShot(currentShot.id, { lightingStyle: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CURRENT SHOT PROMPT DETAILS */}
        {activeTab === 'current' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-300">
                  Veo 3.1 Video Prompt // Shot {currentShot.id}
                </span>
                <button
                  onClick={() => copyToClipboard(currentShot.veoPrompt, 'veo_p')}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                >
                  {copiedType === 'veo_p' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Prompt</span>
                </button>
              </div>
              <p className="text-xs font-mono text-slate-200 leading-relaxed bg-slate-950/80 p-3 rounded-lg border border-slate-800 select-all">
                {currentShot.veoPrompt}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-blue-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-blue-300">
                  Native Audio Prompt // Sound FX
                </span>
                <button
                  onClick={() => copyToClipboard(currentShot.audioPrompt, 'audio_p')}
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                >
                  {copiedType === 'audio_p' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Prompt</span>
                </button>
              </div>
              <p className="text-xs font-mono text-slate-200 leading-relaxed bg-slate-950/80 p-3 rounded-lg border border-slate-800 select-all">
                {currentShot.audioPrompt}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs font-mono font-bold text-slate-300 mb-2">
                Sound Design Stems ({currentShot.soundDesignStems.length})
              </div>
              <div className="grid grid-cols-2 gap-2">
                {currentShot.soundDesignStems.map((stem, i) => (
                  <div key={i} className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-400/90 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{stem}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ALL SHOTS SCRIPT */}
        {activeTab === 'all' && (
          <div className="space-y-4">
            {allShots.map(shot => (
              <div
                key={shot.id}
                onClick={() => onSelectShot(shot.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  currentShot.id === shot.id
                    ? 'bg-slate-900/90 border-cyan-400/60 shadow-lg'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-300 text-xs">
                      SHOT {shot.id} // {shot.durationStr}
                    </span>
                    <span className="text-white font-bold text-xs truncate max-w-xs">{shot.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{shot.cameraMotion}</span>
                </div>
                <p className="text-xs font-mono text-slate-300 mb-2 line-clamp-2">{shot.veoPrompt}</p>
                <div className="p-2 rounded bg-black/60 text-xs italic text-cyan-200/90 font-sans border border-cyan-900/30">
                  "{shot.voiceover}"
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: VEO API JSON */}
        {activeTab === 'api_json' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                Production-Ready Veo 3.1 REST API Request
              </span>
              <button
                onClick={() => copyToClipboard(generateVeoApiPayload(), 'api_copy')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-500/30"
              >
                {copiedType === 'api_copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Full JSON</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300/90 overflow-x-auto leading-relaxed max-h-[500px]">
              {generateVeoApiPayload()}
            </pre>
          </div>
        )}

        {/* TAB 5: DIRECTOR NOTES */}
        {activeTab === 'analysis' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-cyan-300 font-bold mb-2">Director Vision & Storytelling Hook</h4>
              <p className="text-slate-300 leading-relaxed">{currentShot.directorNotes}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-amber-300 font-bold mb-2">Technical Metrics Benchmark</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {currentShot.technicalMetrics?.map((m, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400">{m.label}</div>
                    <div className="text-sm font-bold text-white mt-0.5">{m.value}</div>
                    <div className="text-[9px] text-cyan-400/80 mt-0.5">{m.sublabel}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-purple-300 font-bold mb-2">Color Grading & Cinematic Palette</h4>
              <p className="text-slate-300">{currentShot.colorGrade}</p>
            </div>
          </div>
        )}
      </div>

      {/* JSON Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0A0E1A] border border-cyan-500/40 rounded-2xl p-6 text-slate-200 font-mono text-xs">
            <h3 className="text-sm font-bold text-white mb-2">Import Storyboard Project JSON</h3>
            <p className="text-slate-400 mb-3">Paste a valid StoryboardProject JSON payload below:</p>
            <textarea
              value={importJsonText}
              onChange={e => setImportJsonText(e.target.value)}
              rows={8}
              placeholder='{ "id": "my-project", "name": "...", "shots": [...] }'
              className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 text-xs focus:outline-none focus:border-cyan-400"
            />
            {importError && <p className="text-rose-400 mt-2">{importError}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyImport}
                className="px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 font-bold"
              >
                Import Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
