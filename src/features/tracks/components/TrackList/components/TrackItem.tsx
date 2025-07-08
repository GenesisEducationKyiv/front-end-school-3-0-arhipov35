import React, { useCallback, useMemo } from 'react';
import AudioPlayer from '@/features/audio/components/AudioPlayer';
import { Track } from '@/types/track';

interface TrackItemProps {
  track: Track;
  isBulkSelectEnabled: boolean;
  isSelected: boolean;
  toggleSelectTrack: (id: string) => void;
  onEditClick: (track: Track) => void;
  onDeleteClick: (id: string) => void;
  onUploadClick: (track: Track) => void;
  getDefaultCoverImage: () => string;
}

const TrackItem = ({
  track,
  isBulkSelectEnabled,
  isSelected,
  toggleSelectTrack,
  onEditClick,
  onDeleteClick,
  onUploadClick,
  getDefaultCoverImage
}: TrackItemProps) => {
  const handleToggleSelect = useCallback(() => toggleSelectTrack(track.id), [toggleSelectTrack, track.id]);
  const handleEditClick = useCallback(() => onEditClick(track), [onEditClick, track]);
  const handleDeleteClick = useCallback(() => onDeleteClick(track.id), [onDeleteClick, track.id]);
  const handleUploadClick = useCallback(() => onUploadClick(track), [onUploadClick, track]);
  
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = getDefaultCoverImage();
  }, [getDefaultCoverImage]);
  
  const genreTags = useMemo(() => (
    track.genres.map((genre: string, index: number) => (
      <span key={index} className="genre-tag">{genre}</span>
    ))
  ), [track.genres]);
  
 
  const coverImageSrc = useMemo(() => 
    track.coverImage || getDefaultCoverImage(), 
    [track.coverImage, getDefaultCoverImage]
  );
  
  
  const uploadButtonText = useMemo(() => 
    track.audioFile ? 'Change Audio' : 'Upload Audio', 
    [track.audioFile]
  );
  
  return (
    <tr data-testid={`track-item-${track.id}`}>
      {isBulkSelectEnabled && (
        <td>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={isSelected}
              onChange={handleToggleSelect}
              id={`checkbox-${track.id}`}
              data-testid={`track-checkbox-${track.id}`}
            />
          </div>
        </td>
      )}
      <td>
        <img 
          src={coverImageSrc} 
          alt={track.title}
          className="track-cover-thumbnail"
          onError={handleImageError}
        />
      </td>
      <td data-testid={`track-item-${track.id}-title`}>{track.title}</td>
      <td data-testid={`track-item-${track.id}-artist`}>{track.artist}</td>
      <td>{track.album || '-'}</td>
      <td>
        <div className="track-genres">{genreTags}</div>
      </td>
      <td className="track-audio-cell">
        {track.audioFile ? (
          <AudioPlayer 
            src={track.audioFile} 
            className="custom-audio-player--compact"
            data-testid={`audio-player-${track.id}`}
          />
        ) : (
          <button 
            className="btn btn-sm btn-outline-primary"
            onClick={handleUploadClick}
            data-testid={`upload-button-${track.id}`}
          >
            Upload Audio
          </button>
        )}
      </td>
      <td>
        <div className="btn-group btn-group-sm">
          <button 
            className="btn btn-sm btn-outline-primary" 
            onClick={handleEditClick}
            title="Edit track"
            data-testid={`edit-track-${track.id}`}
          >
            Edit
          </button>
          <button 
            className="btn btn-sm btn-outline-info" 
            onClick={handleUploadClick}
            title="Upload audio file"
            data-testid={`upload-track-${track.id}`}
          >
            {uploadButtonText}
          </button>
          {!isBulkSelectEnabled && (
            <button 
              className="btn btn-sm btn-outline-danger"
              onClick={handleDeleteClick}
              title="Delete track"
              data-testid={`delete-track-${track.id}`}
            >
              Delete
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

// Мемоізуємо компонент TrackItem для запобігання зайвих перерендерів
export default React.memo(TrackItem, (prevProps, nextProps) => {
  // Порівнюємо всі важливі пропси для визначення необхідності перерендеру
  return (
    prevProps.track.id === nextProps.track.id &&
    prevProps.track.title === nextProps.track.title &&
    prevProps.track.artist === nextProps.track.artist &&
    prevProps.track.album === nextProps.track.album &&
    prevProps.track.coverImage === nextProps.track.coverImage &&
    prevProps.track.audioFile === nextProps.track.audioFile &&
    JSON.stringify(prevProps.track.genres) === JSON.stringify(nextProps.track.genres) &&
    prevProps.isBulkSelectEnabled === nextProps.isBulkSelectEnabled &&
    prevProps.isSelected === nextProps.isSelected
  );
});
