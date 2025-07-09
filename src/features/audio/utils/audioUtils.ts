/**
 * Utility functions for handling audio files and URLs
 */

export const formatAudioUrl = (audioSrc: string): string => {
  if (!audioSrc) return '';
  
  if (audioSrc.startsWith('http://') || audioSrc.startsWith('https://')) {
    return audioSrc;
  }
  
  const baseUrl = 'http://localhost:4000';
  const audioEndpoint = '/files';
  
  let formattedUrl;
  
  if (!audioSrc.includes('/')) {
    formattedUrl = `${baseUrl}${audioEndpoint}/${audioSrc}`;
  }
  else if (audioSrc.startsWith('/')) {
    formattedUrl = `${baseUrl}${audioSrc}`;
  }
  else {
    formattedUrl = `${baseUrl}/${audioSrc}`;
  }
  
  try {
    const params = new URLSearchParams(window.location.search);
    const testPath = params.get('audioPath');
    
    if (testPath) {
      if (!audioSrc.includes('/')) {
        formattedUrl = `${baseUrl}/${testPath}/${audioSrc}`;
      }
    }
  } catch {
    console.warn('Failed to parse URL parameters for audio path');
  }
  
  return formattedUrl;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};