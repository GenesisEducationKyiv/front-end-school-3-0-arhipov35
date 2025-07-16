import { useState, useRef, useEffect, useCallback } from 'react';
import { formatAudioUrl } from '../utils/audioUtils';

interface AudioPlayerState {
  error: string | null;
  loaded: boolean;
  playing: boolean;
  duration: number;
  currentTime: number;
  audioInfo: string;
}

interface AudioPlayerHook extends AudioPlayerState {
  audioRef: React.RefObject<HTMLAudioElement>;
  togglePlay: () => void;
  formattedSrc: string;
}

export const useAudioPlayer = (src: string): AudioPlayerHook => {
  const [state, setState] = useState<AudioPlayerState>({
    error: null,
    loaded: false,
    playing: false,
    duration: 0,
    currentTime: 0,
    audioInfo: ''
  });
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const formattedSrc = formatAudioUrl(src);
  const prevSrcRef = useRef<string>(formattedSrc);
  
  useEffect(() => {
    
    if (prevSrcRef.current === formattedSrc) {
      return;
    }
    
    
    const wasPlaying = state.playing;
    prevSrcRef.current = formattedSrc;
    
    setState(prev => ({
      ...prev,
      error: null,
      loaded: false,
      playing: false,
      duration: 0,
      currentTime: 0,
      audioInfo: `Loading: ${formattedSrc}`
    }));
    
    
    if (wasPlaying) {
      const audio = audioRef.current;
      if (audio) {
        const playWhenReady = () => {
          audio.play().catch(() => {
            console.debug('Auto-play was prevented');
          });
        };
        audio.addEventListener('canplay', playWhenReady, { once: true });
        return () => audio.removeEventListener('canplay', playWhenReady);
      }
    }
  }, [formattedSrc, state.playing]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const onLoadedMetadata = () => {
      setState(prev => ({
        ...prev,
        loaded: true,
        error: null,
        duration: audio.duration,
        audioInfo: `Loaded: ${formattedSrc}`
      }));
    };
    
    const onTimeUpdate = () => {
      setState(prev => ({
        ...prev,
        currentTime: audio.currentTime
      }));
    };
    
    const onPlay = () => {
      setState(prev => ({
        ...prev,
        playing: true,
        audioInfo: `Playing: ${formattedSrc}`
      }));
    };
    
    const onPause = () => {
      setState(prev => ({
        ...prev,
        playing: false,
        audioInfo: `Paused: ${formattedSrc}`
      }));
    };
    
    const onEnded = () => {
      setState(prev => ({
        ...prev,
        playing: false,
        currentTime: 0,
        audioInfo: `Ended: ${formattedSrc}`
      }));
    };
    
    const onError = () => {
      const errorDetails = audio.error ? 
        `Code: ${audio.error.code}, Message: ${audio.error.message}` : 
        'Unknown error';
      
      setState(prev => ({
        ...prev,
        error: `Failed to load audio. ${errorDetails}`,
        loaded: false,
        audioInfo: `Error: ${errorDetails}`
      }));
    };
    
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    
    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [formattedSrc]);
  
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (state.playing) {
      audio.pause();
    } else {
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setState(prev => ({
              ...prev,
              error: null
            }));
          })
          .catch((err: Error) => {
            setState(prev => ({
              ...prev,
              error: `Playback failed: ${err.message}`
            }));
          });
      }
    }
  }, [state.playing]);
  
  return {
    ...state,
    audioRef,
    togglePlay,
    formattedSrc
  } as AudioPlayerHook;
};

export default useAudioPlayer;
