import { useRef, useEffect, useState } from 'react';
import '@/styles/audio-visualization.scss';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

interface AudioVisualizationProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  playing: boolean;
  loaded: boolean;
  duration: number;
  currentTime: number;
  className?: string;
}

const AudioVisualization = ({
  audioRef,
  playing,
  loaded,
  duration,
  currentTime,
  className = ''
}: AudioVisualizationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!loaded || !audioRef.current) return;

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioContext();

      const analyzerNode = context.createAnalyser();
      analyzerNode.fftSize = 256;
      const bufferLength = analyzerNode.frequencyBinCount;
      const dataArr = new Uint8Array(bufferLength);

      const source = context.createMediaElementSource(audioRef.current);
      source.connect(analyzerNode);
      analyzerNode.connect(context.destination);

      setAnalyser(analyzerNode);
      setDataArray(dataArr);

      return () => {
        if (context.state !== 'closed') {
          context.close();
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    } catch (error) {

      return;
    }
  }, [loaded, audioRef]);

  useEffect(() => {
    if (!analyser || !dataArray || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvasCtx.scale(dpr, dpr);

    const draw = () => {
      if (!analyser || !dataArray) return;

      animationFrameRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.clearRect(0, 0, rect.width, rect.height);

      const barWidth = rect.width / (dataArray.length / 2);
      let x = 0;

      const gradient = canvasCtx.createLinearGradient(0, 0, 0, rect.height);
      gradient.addColorStop(0, playing ? '#0d6efd' : '#6c757d');
      gradient.addColorStop(1, playing ? '#0a58ca' : '#5a6268');
      canvasCtx.fillStyle = gradient;

      for (let i = 0; i < dataArray.length / 2; i++) {

        const value = dataArray[i] ?? 0;
        const barHeight = (value / 255) * rect.height * 0.8;

        const y = (rect.height - barHeight) / 2;

        canvasCtx.fillRect(x, y, barWidth - 1, barHeight);

        x += barWidth;
      }
    };

    if (playing) {
      draw();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);

      analyser.getByteFrequencyData(dataArray);
      canvasCtx.clearRect(0, 0, rect.width, rect.height);

      const barWidth = rect.width / (dataArray.length / 2);
      let x = 0;

      const gradient = canvasCtx.createLinearGradient(0, 0, 0, rect.height);
      gradient.addColorStop(0, '#6c757d');
      gradient.addColorStop(1, '#5a6268');
      canvasCtx.fillStyle = gradient;

      for (let i = 0; i < dataArray.length / 2; i++) {
        const value = dataArray[i] ?? 0;
        const barHeight = (value / 255) * rect.height * 0.7;
        const y = (rect.height - barHeight) / 2;
        canvasCtx.fillRect(x, y, barWidth - 1, barHeight);
        x += barWidth;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, dataArray, playing, canvasRef]);

  const progressPercentage = loaded && duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`audio-visualization ${playing ? 'audio-visualization--playing' : ''} ${className}`}>
      {loaded ? (
        <>
          <canvas
            ref={canvasRef}
            className="audio-visualization__canvas"
          ></canvas>
          <div
            className="audio-visualization__progress"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </>
      ) : (
        <div className="audio-visualization__placeholder">
          {playing ? 'Loading visualization...' : 'Visualization will appear when audio is played'}
        </div>
      )}
    </div>
  );
};

export default AudioVisualization;
