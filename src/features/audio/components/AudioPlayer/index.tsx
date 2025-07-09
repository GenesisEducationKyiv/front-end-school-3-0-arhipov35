import AudioVisualization from '../AudioVisualizer';
import useAudioPlayer from '@/features/audio/hooks/useAudioPlayer';
import { formatTime } from '@/features/audio/utils/audioUtils';
import '@/styles/audio-player.scss';
import '@/styles/audio-visualization.scss';

interface AudioPlayerProps {
  src: string;
  className?: string;
  showDebug?: boolean;
}

const AudioPlayer = ({ src, className = '', showDebug = false }: AudioPlayerProps) => {
  const {
    error,
    loaded,
    playing,
    duration,
    currentTime,
    audioInfo,
    audioRef,
    togglePlay,
    formattedSrc
  } = useAudioPlayer(src);
  
  return (
    <div 
      className={`custom-audio-player ${className}`} 
      data-testid={`audio-player-${src.split('/').pop()?.split('.')[0] ?? 'main'}`}
    >
      <audio 
        ref={audioRef}
        src={formattedSrc}
        preload="metadata"
        crossOrigin="anonymous"
      />
      
      {(showDebug || error) && (
        <div className="player-debug">
          {showDebug && audioInfo && audioInfo}
          {error && (
            <>
              <br />
              <strong>Debug Info:</strong><br />
              Original URL: {src}<br />
              Formatted URL: {formattedSrc}
              <br />
              <strong>Варіанти виправлення:</strong><br />
              1. Спробуйте відкрити <a href={formattedSrc} target="_blank" rel="noopener noreferrer">файл напряму</a> щоб перевірити посилання.<br />
              2. Протестуйте різні шляхи через параметр URL, наприклад:<br />
              <code>?audioPath=api/tracks/file</code> або <code>?audioPath=uploads</code><br />
              3. Перевірте чи правильно налаштований сервер для віддачі статичних файлів.<br />
              4. Подивіться в консолі мережеві запити, щоб побачити точний шлях до файлу.
            </>
          )}
        </div>
      )}
      
      <div className="player-controls">
        <button 
          type="button" 
          className={`btn btn-sm ${playing ? 'btn-danger' : 'btn-primary'}`}
          onClick={togglePlay}
          disabled={!loaded && !error}
          data-testid={playing ? `pause-button-${src.split('/').pop()?.split('.')[0] ?? 'main'}` : `play-button-${src.split('/').pop()?.split('.')[0] ?? 'main'}`}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {!loaded && !error ? (
            <i className="bi bi-hourglass"></i>
          ) : playing ? (
            <i className="bi bi-pause-fill"></i>
          ) : (
            <i className="bi bi-play-fill"></i>
          )}
        </button>
        
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          {loaded && <span> / {formatTime(duration)}</span>}
        </div>
        
        
      </div>
      
      {src && (
        <AudioVisualization 
          audioRef={audioRef}
          playing={playing}
          loaded={loaded}
          duration={duration}
          currentTime={currentTime}
          className={className.includes('compact') ? 'audio-visualization--compact' : ''}
          data-testid={`audio-progress-${src.split('/').pop()?.split('.')[0] ?? 'main'}`}
        />
      )}
      
      {error && (
        <div className="alert alert-danger mt-2 p-2">
          <small>{error}</small>
        </div>
      )}
      
      {showDebug && (
        <div className="debug-info mt-2">
          <small className="text-muted d-block">Status: {loaded ? 'Loaded' : 'Not loaded'}{playing ? ', Playing' : ''}</small>
          <small className="text-muted d-block">Source: {src}</small>
          <small className="text-muted d-block">Formatted: {formattedSrc}</small>
          <small className="text-muted d-block">Info: {audioInfo}</small>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
