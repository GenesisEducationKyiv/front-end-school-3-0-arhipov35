import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
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
      const AudioContext = window.AudioContext ?? window.webkitAudioContext;
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
          void context.close();
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    } catch (error) {
      console.error('Error setting up audio context:', error);
      return;
    }
  }, [loaded, audioRef]);

  const drawVisualization = useCallback((canvasCtx: CanvasRenderingContext2D, rect: DOMRect, isPlaying: boolean) => {
    if (!analyser || !dataArray) return;
    
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, rect.width, rect.height);
    
    const barWidth = rect.width / (dataArray.length / 2);
    let x = 0;
    
    const gradient = canvasCtx.createLinearGradient(0, 0, 0, rect.height);
    gradient.addColorStop(0, isPlaying ? '#0d6efd' : '#6c757d');
    gradient.addColorStop(1, isPlaying ? '#0a58ca' : '#5a6268');
    canvasCtx.fillStyle = gradient;
    
    const heightMultiplier = isPlaying ? 0.8 : 0.7;
    
    for (let i = 0; i < dataArray.length / 2; i++) {
      const value = dataArray[i] ?? 0;
      const barHeight = (value / 255) * rect.height * heightMultiplier;
      const y = (rect.height - barHeight) / 2;
      canvasCtx.fillRect(x, y, barWidth - 1, barHeight);
      x += barWidth;
    }
  }, [analyser, dataArray]);

  const animate = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;
    
    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      drawVisualization(canvasCtx, canvas.getBoundingClientRect(), playing);
    };
    
    draw();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawVisualization, playing]);

  useEffect(() => {
    if (!analyser || !dataArray || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const dpr = window.devicePixelRatio ?? 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvasCtx.scale(dpr, dpr);

    if (playing) {
      const cleanup = animate();
      return cleanup;
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      drawVisualization(canvasCtx, rect, false);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, dataArray, playing, canvasRef, animate, drawVisualization]);

  const progressPercentage = useMemo(() => {
    return loaded && duration > 0 ? (currentTime / duration) * 100 : 0;
  }, [loaded, duration, currentTime]);
  
  const containerClassName = useMemo(() => {
    return `audio-visualization ${playing ? 'audio-visualization--playing' : ''} ${className}`;
  }, [playing, className]);
  
  const placeholderText = useMemo(() => {
    return playing ? 'Loading visualization...' : 'Visualization will appear when audio is played';
  }, [playing]);

  return (
    <div className={containerClassName}>
      {loaded ? (
        <>
          <canvas ref={canvasRef} className="audio-visualization__canvas"></canvas>
          <div 
            className="audio-visualization__progress" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </>
      ) : (
        <div className="audio-visualization__placeholder">{placeholderText}</div>
      )}
    </div>
  );
};

export default AudioVisualization;
