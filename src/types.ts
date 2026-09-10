export interface ShotData {
  id: number;
  title: string;
  subtitle: string;
  durationStr: string;
  startTime: number;
  endTime: number;
  veoPrompt: string;
  audioPrompt: string;
  voiceover: string;
  keyEntities: string[];
  visualKeywords: string[];
  cameraMotion: string;
  lightingStyle: string;
  colorGrade: string;
  soundDesignStems: string[];
  directorNotes: string;
  technicalMetrics?: {
    label: string;
    value: string;
    sublabel?: string;
  }[];
  userCanvasOverrides?: {
    headline?: string;
    primaryStat?: string;
    secondaryStat?: string;
    tagline?: string;
    customBrand?: string;
    gpuCount?: number;
    apiCost?: string;
    tokenRateMultiplier?: number;
    showSeals?: boolean;
    clusterLoad?: number;
  };
}

export type AspectRatioMode = '16:9' | '9:16' | '2.39:1' | '1:1';
export type LensPreset = 'standard' | '50mm-macro' | '24mm-anamorphic' | '85mm-tele';
export type LutColorPreset = 'standard' | 'technoir' | 'cyberamber' | 'thermal' | 'monochrome';
export type ViewMode = 'player' | 'split' | 'prompts' | 'telemetry';

export interface DirectorSettings {
  aspectRatio: AspectRatioMode;
  lensPreset: LensPreset;
  lutPreset: LutColorPreset;
  showGrid: boolean;
  showScanlines: boolean;
  showTelemetryHUD: boolean;
}

export interface StemMixerSettings {
  masterVolume: number;
  subBass: number;
  ambience: number;
  sfxClicks: number;
  voiceoverGain: number;
  voicePitch: number;
  voiceRate: number;
  voiceName?: string;
}

export interface StoryboardProject {
  id: string;
  name: string;
  description: string;
  brand: string;
  totalDuration: number;
  shots: ShotData[];
  directorSettings?: Partial<DirectorSettings>;
}
