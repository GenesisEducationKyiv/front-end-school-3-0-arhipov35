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
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            {isBulkSelectEnabled && (
              <th style={{ width: '40px' }}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={tracks.length > 0 && selectedTrackIds.length === tracks.length}
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
            <th style={{ width: isBulkSelectEnabled ? '100px' : '140px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track) => (
            <TrackItem
              key={track.id}
              track={track}
              isBulkSelectEnabled={isBulkSelectEnabled}
              isSelected={selectedTrackIds.includes(track.id)}
              toggleSelectTrack={toggleSelectTrack}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
              onUploadClick={onUploadClick}
              getDefaultCoverImage={getDefaultCoverImage}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackTable;
