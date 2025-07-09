import { useCallback } from 'react';

export function useAudioManager() {
  const generateCacheBustingUrl = useCallback((url: string | undefined): string => {
    if (!url) return '';
    const timestamp = new Date().getTime();
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?t=${timestamp}`;
  }, []);

  const forceReloadAudioElements = useCallback(() => {
    const timestamp = new Date().getTime();
    const audioElements = document.querySelectorAll('audio');

    audioElements.forEach(audio => {
      if (audio.src) {
        const baseUrl = audio.src.split('?')[0];
        const newSrc = `${baseUrl}?t=${timestamp}`;
        
        audio.setAttribute('src', newSrc);
        
        audio.load();
        
        if (audio.paused) {
          audio.currentTime = 0;
        }
      }
    });
  }, []);

  const clearMediaCache = useCallback(async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await window.caches.keys();
        const mediaCaches = cacheNames.filter(name => 
          name.includes('media') || name.includes('audio') || name.includes('static')
        );
        
        if (mediaCaches.length > 0) {
          await Promise.all(mediaCaches.map(cacheName => window.caches.delete(cacheName)));
        }
      } catch {
        console.warn('Failed to clear media cache');
      }
    }
  }, []);

  return {
    generateCacheBustingUrl,
    forceReloadAudioElements,
    clearMediaCache
  };
}
