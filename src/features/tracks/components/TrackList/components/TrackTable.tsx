import React, { useMemo, useCallback } from 'react';
import { Track } from '@/types/track';
import TrackItem from './TrackItem';
import '@/styles/track-list.scss';

interface TrackTableProps {
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

const TrackTable = ({
  tracks,
  isBulkSelectEnabled,
  selectedTrackIds,
  toggleSelectTrack,
  toggleSelectAll,
  onEditClick,
  onDeleteClick,
  onUploadClick,
  getDefaultCoverImage
}: TrackTableProps) => {
  const allSelected = useMemo(() => 
    tracks.length > 0 && selectedTrackIds.length === tracks.length,
    [tracks.length, selectedTrackIds.length]
  );
  
  const actionColumnWidth = { width: isBulkSelectEnabled ? '100px' : '140px' };
  
  const isTrackSelected = useCallback(
    (trackId: string) => selectedTrackIds.includes(trackId),
    [selectedTrackIds]
  );
  
  const trackItems = useMemo(() => {
    return tracks.map((track) => (
      <TrackItem
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
  
  const tableHeader = useMemo(() => (
    <thead>
      <tr>
        {isBulkSelectEnabled && (
          <th style={{ width: '40px' }}>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                id="selectAllCheckbox"
                data-testid="select-all"
              />
            </div>
          </th>
        )}
        <th style={{ width: '70px' }}>Cover</th>
        <th>Title</th>
        <th>Artist</th>
        <th>Album</th>
        <th>Genres</th>
        <th style={{ width: '120px' }}>Audio</th>
        <th style={actionColumnWidth}>Actions</th>
      </tr>
    </thead>
  ), [isBulkSelectEnabled, allSelected, toggleSelectAll, actionColumnWidth]);

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        {tableHeader}
        <tbody>
          {trackItems}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(TrackTable, (prevProps, nextProps) => {
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
