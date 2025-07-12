import React, { useCallback, useMemo } from 'react';
import { Card } from '@/stories/Card/Card';
import AudioPlayer from '@/features/audio/components/AudioPlayer';
import { Track } from '@/types/track';
import '@/styles/track-card.scss';

interface TrackCardProps {
  track: Track;
  isBulkSelectEnabled: boolean;
  isSelected: boolean;
  toggleSelectTrack: (id: string) => void;
  onEditClick: (track: Track) => void;
  onDeleteClick: (id: string) => void;
  onUploadClick: (track: Track) => void;
  getDefaultCoverImage: () => string;
}

const TrackCard = ({
  track,
  isBulkSelectEnabled,
  isSelected,
  toggleSelectTrack,
  onEditClick,
  onDeleteClick,
  onUploadClick,
  getDefaultCoverImage
}: TrackCardProps) => {
  const handleToggleSelect = useCallback(() => toggleSelectTrack(track.id), [toggleSelectTrack, track.id]);
  const handleEditClick = useCallback(() => onEditClick(track), [onEditClick, track]);
  const handleDeleteClick = useCallback(() => onDeleteClick(track.id), [onDeleteClick, track.id]);
  const handleUploadClick = useCallback(() => onUploadClick(track), [onUploadClick, track]);
  
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = getDefaultCoverImage();
  }, [getDefaultCoverImage]);
  
  const genreTags = useMemo(() => (
    track.genres.map((genre: string, index: number) => (
      <span key={index} className="track-card__genre-tag">{genre}</span>
    ))
  ), [track.genres]);
  
  const coverImageSrc = track.coverImage || getDefaultCoverImage();
  
  const cardContent = (
    <div className="track-card__content">
      {track.album && (
        <div className="track-album mb-2">
          <strong>Album:</strong> {track.album}
        </div>
      )}
      
      {track.genres.length > 0 && (
        <div className="track-card__genres mb-3">
          <strong>Genres:</strong> <div className="d-inline-block">{genreTags}</div>
        </div>
      )}
      
      <div className="track-card__audio-section">
        {track.audioFile ? (
          <AudioPlayer 
            src={track.audioFile} 
            className="custom-audio-player--compact"
            data-testid={`audio-player-${track.id}`}
          />
        ) : (
          <div className="text-center">
            <p className="text-muted">No audio file available</p>
          </div>
        )}
      </div>
    </div>
  );

  const avatar = isBulkSelectEnabled ? (
    <div className="track-card__checkbox">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleToggleSelect}
        id={`checkbox-${track.id}`}
        data-testid={`track-checkbox-${track.id}`}
      />
    </div>
  ) : (
    track.title.charAt(0).toUpperCase()
  );

  return (
    <div 
      className="col-12 col-sm-6 col-lg-4 mb-4" 
      data-testid={`track-item-${track.id}`}
    >
      <Card
        avatar={avatar}
        header={track.title}
        subhead={track.artist}
        imageUrl={coverImageSrc}
        imageAlt={`${track.title} by ${track.artist}`}
        onImageError={handleImageError}
        showMenu={true}
        onMenuClick={handleEditClick}
        className="track-card"
        primaryButtonLabel={track.audioFile ? "Change Audio" : "Upload Audio"}
        onPrimaryButtonClick={handleUploadClick}
        secondaryButtonLabel={!isBulkSelectEnabled ? "Delete" : undefined}
        onSecondaryButtonClick={handleDeleteClick}
        data-testid={`track-card-${track.id}`}
      >
        {cardContent}
      </Card>
    </div>
  );
};

export default React.memo(TrackCard, (prevProps, nextProps) => {
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
