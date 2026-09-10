import { useState, useEffect, useCallback } from 'react';
import { ShotData, StoryboardProject } from '../types';
import { STORYBOARD_PRESETS } from '../data/presets';

const STORAGE_KEY = 'veo_director_storyboard_project_v1';

export function useStoryboard() {
  const [project, setProject] = useState<StoryboardProject>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.shots) && parsed.shots.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load storyboard from localStorage:', e);
    }
    return STORYBOARD_PRESETS[0];
  });

  const [activeShotId, setActiveShotId] = useState<number>(() => project.shots[0]?.id || 1);

  // Save to localStorage whenever project changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch (e) {
      console.warn('Failed to persist storyboard:', e);
    }
  }, [project]);

  // Ensure activeShotId stays valid
  const activeShot = project.shots.find(s => s.id === activeShotId) || project.shots[0];

  const updateShot = useCallback((shotId: number, changes: Partial<ShotData>) => {
    setProject(prev => {
      const updatedShots = prev.shots.map(s => {
        if (s.id === shotId) {
          return {
            ...s,
            ...changes,
            userCanvasOverrides: {
              ...(s.userCanvasOverrides || {}),
              ...(changes.userCanvasOverrides || {})
            }
          };
        }
        return s;
      });

      // Recalculate total duration
      const totalDur = updatedShots.length > 0 
        ? updatedShots[updatedShots.length - 1].endTime 
        : 30;

      return {
        ...prev,
        totalDuration: totalDur,
        shots: updatedShots
      };
    });
  }, []);

  const addShot = useCallback(() => {
    setProject(prev => {
      const lastShot = prev.shots[prev.shots.length - 1];
      const newStartTime = lastShot ? lastShot.endTime : 0;
      const newEndTime = newStartTime + 6;
      const newId = (lastShot ? lastShot.id : 0) + 1;

      const newShot: ShotData = {
        id: newId,
        title: `Custom Shot ${newId}`,
        subtitle: 'User Directed Scene',
        durationStr: `${formatTimecode(newStartTime)} - ${formatTimecode(newEndTime)}`,
        startTime: newStartTime,
        endTime: newEndTime,
        veoPrompt: 'Cinematic wide establishing shot with dynamic camera movement, volumetric lighting, photorealistic 8K fidelity.',
        audioPrompt: 'Atmospheric ambient drone with synthetic harmonic chimes and rich sub-bass.',
        voiceover: `Scene ${newId}: Breakthrough developments expanding the horizon.`,
        keyEntities: ['Custom Entity 1', 'Custom Entity 2', 'Key Metric'],
        visualKeywords: ['Cinematic', 'Atmospheric', 'Macro Lens', 'Volumetric'],
        cameraMotion: 'Slow forward dolly in',
        lightingStyle: 'Chiaroscuro rim lighting',
        colorGrade: 'Cyan (#06B6D4) and Slate (#0F172A)',
        soundDesignStems: ['Sub-Bass Drone', 'Ambient Synth', 'Digital Ping'],
        directorNotes: 'Add strategic visual weight to this sequence.',
        technicalMetrics: [
          { label: 'Key Metric', value: '100%', sublabel: 'Operational' },
          { label: 'Latency', value: '4ms', sublabel: 'Response' },
          { label: 'Efficiency', value: '+300%', sublabel: 'Performance' }
        ],
        userCanvasOverrides: {
          headline: `SCENE ${newId} BREAKTHROUGH`,
          primaryStat: '100% OPERATIONAL',
          secondaryStat: '+300% EFFICIENCY',
          customBrand: prev.brand
        }
      };

      const updatedShots = [...prev.shots, newShot];
      return {
        ...prev,
        totalDuration: newEndTime,
        shots: updatedShots
      };
    });
  }, []);

  const duplicateShot = useCallback((shotId: number) => {
    setProject(prev => {
      const target = prev.shots.find(s => s.id === shotId);
      if (!target) return prev;

      const newId = Math.max(...prev.shots.map(s => s.id)) + 1;
      const duration = target.endTime - target.startTime;
      const lastShot = prev.shots[prev.shots.length - 1];
      const startTime = lastShot.endTime;
      const endTime = startTime + duration;

      const duplicated: ShotData = {
        ...target,
        id: newId,
        title: `${target.title} (Copy)`,
        startTime,
        endTime,
        durationStr: `${formatTimecode(startTime)} - ${formatTimecode(endTime)}`,
        userCanvasOverrides: { ...(target.userCanvasOverrides || {}) }
      };

      return {
        ...prev,
        totalDuration: endTime,
        shots: [...prev.shots, duplicated]
      };
    });
  }, []);

  const deleteShot = useCallback((shotId: number) => {
    setProject(prev => {
      if (prev.shots.length <= 1) return prev; // Keep at least one shot
      const filtered = prev.shots.filter(s => s.id !== shotId);

      // Re-align timecodes consecutively
      let runningTime = 0;
      const reindexed = filtered.map((shot, idx) => {
        const dur = shot.endTime - shot.startTime;
        const start = runningTime;
        const end = runningTime + dur;
        runningTime = end;
        return {
          ...shot,
          id: idx + 1,
          startTime: start,
          endTime: end,
          durationStr: `${formatTimecode(start)} - ${formatTimecode(end)}`
        };
      });

      return {
        ...prev,
        totalDuration: runningTime,
        shots: reindexed
      };
    });
  }, []);

  const loadPreset = useCallback((presetId: string) => {
    const found = STORYBOARD_PRESETS.find(p => p.id === presetId);
    if (found) {
      // Deep clone so changes don't mutate preset
      const cloned = JSON.parse(JSON.stringify(found));
      setProject(cloned);
      setActiveShotId(cloned.shots[0]?.id || 1);
    }
  }, []);

  const loadProject = useCallback((newProject: StoryboardProject) => {
    setProject(newProject);
    setActiveShotId(newProject.shots[0]?.id || 1);
  }, []);

  const resetToDefault = useCallback(() => {
    const defaultProject = JSON.parse(JSON.stringify(STORYBOARD_PRESETS[0]));
    setProject(defaultProject);
    setActiveShotId(1);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    project,
    shots: project.shots,
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
    presets: STORYBOARD_PRESETS
  };
}

function formatTimecode(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
