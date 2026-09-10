import React, { useRef, useEffect } from 'react';
import { audioEngine } from '../utils/audioEngine';

interface AudioVisualizerProps {
  isPlaying: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const analyser = audioEngine.getAnalyser();
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (!analyser || !isPlaying) {
        // Idle line
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.lineWidth = 1;
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        animId = requestAnimationFrame(render);
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const barWidth = (width / 32) * 1.5;
      let x = 0;

      for (let i = 0; i < 32; i++) {
        const barHeight = (dataArray[i * 2] / 255) * height * 0.9;

        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 240, 255, 0.9)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth - 1.5, barHeight);

        x += barWidth;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  return (
    <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-black/60 border border-cyan-500/20">
      <span className="text-[10px] font-mono text-cyan-400 font-semibold tracking-wider">AUDIO FX</span>
      <canvas ref={canvasRef} width={80} height={20} className="w-20 h-5" />
    </div>
  );
};
