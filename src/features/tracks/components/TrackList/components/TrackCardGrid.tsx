import React, { useMemo, useCallback } from 'react';
import { Track } from '@/types/track';
import TrackCard from './TrackCard';
import '@/styles/track-card-grid.scss';

interface TrackCardGridProps {
  tracks: Track[];
  isBulkSelectEnabled: boolean;
  selectedTrackIds: string[];
  toggleSelectTrack: (id: string) => void;
  toggleSelectAll: () => void;
  onEditClick: (track: Track) => void;
  onDeleteClick: (id: string) => void;
  onUploadClick: (track: Track) => void;
  getDefaultCoverImage: () => string;
}

const TrackCardGrid = ({
  tracks,
  isBulkSelectEnabled,
  selectedTrackIds,
  toggleSelectTrack,
  toggleSelectAll,
  onEditClick,
  onDeleteClick,
  onUploadClick,
  getDefaultCoverImage
}: TrackCardGridProps) => {
  const allSelected = useMemo(() => 
    tracks.length > 0 && selectedTrackIds.length === tracks.length,
    [tracks.length, selectedTrackIds.length]
  );
  
  const isTrackSelected = useCallback(
    (trackId: string) => selectedTrackIds.includes(trackId),
    [selectedTrackIds]
  );
  
  const trackCards = useMemo(() => {
    return tracks.map((track) => (
      <TrackCard
        key={track.id}
        track={track}
        isBulkSelectEnabled={isBulkSelectEnabled}
        isSelected={isTrackSelected(track.id)}
        toggleSelectTrack={toggleSelectTrack}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
        onUploadClick={onUploadClick}
        getDefaultCoverImage={getDefaultCoverImage}
      />
    ));
  }, [tracks, isBulkSelectEnabled, isTrackSelected, toggleSelectTrack, onEditClick, onDeleteClick, onUploadClick, getDefaultCoverImage]);

  return (
    <div className="track-card-grid__container">
      {isBulkSelectEnabled && (
        <div className="track-card-grid__select-all mb-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              id="selectAllCheckbox"
              data-testid="select-all"
            />
            <label className="form-check-label" htmlFor="selectAllCheckbox">
              Select All Tracks
            </label>
          </div>
        </div>
      )}
      <div className="track-card-grid__row row">
        {trackCards}
      </div>
    </div>
  );
};

export default React.memo(TrackCardGrid, (prevProps, nextProps) => {
  if (prevProps.tracks.length !== nextProps.tracks.length) return false;
  if (prevProps.isBulkSelectEnabled !== nextProps.isBulkSelectEnabled) return false;
  if (prevProps.selectedTrackIds.length !== nextProps.selectedTrackIds.length) return false;
  
  const tracksChanged = prevProps.tracks.some((prevTrack, index) => {
    if (index >= nextProps.tracks.length) return true;
    
    const nextTrack = nextProps.tracks[index];
    if (!nextTrack) return true;
    
    return (
      prevTrack.id !== nextTrack.id ||
      prevTrack.title !== nextTrack.title ||
      prevTrack.artist !== nextTrack.artist ||
      prevTrack.album !== nextTrack.album ||
      prevTrack.coverImage !== nextTrack.coverImage ||
      prevTrack.audioFile !== nextTrack.audioFile
    );
  });
  
  if (tracksChanged) return false;
  
  const selectedIdsChanged = prevProps.selectedTrackIds.some(
    (id, index) => id !== nextProps.selectedTrackIds[index]
  );
  
  return !selectedIdsChanged;
});
