import { Track } from '../../../../../types/track';
import AudioPlayer from '../../../../audio/components/AudioPlayer';

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
  return (
    <tr data-testid={`track-item-${track.id}`}>
      {isBulkSelectEnabled && (
        <td>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleSelectTrack(track.id)}
              id={`checkbox-${track.id}`}
              data-testid={`track-checkbox-${track.id}`}
            />
          </div>
        </td>
      )}
      <td>
        <img 
          src={track.coverImage || getDefaultCoverImage()} 
          alt={track.title}
          className="track-cover-thumbnail"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getDefaultCoverImage();
          }}
        />
      </td>
      <td data-testid={`track-item-${track.id}-title`}>{track.title}</td>
      <td data-testid={`track-item-${track.id}-artist`}>{track.artist}</td>
      <td>{track.album || '-'}</td>
      <td>
        <div className="track-genres">
          {track.genres.map((genre: string, index: number) => (
            <span key={index} className="genre-tag">
              {genre}
            </span>
          ))}
        </div>
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
            onClick={() => onUploadClick(track)}
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
            onClick={() => onEditClick(track)}
            title="Edit track"
            data-testid={`edit-track-${track.id}`}
          >
            Edit
          </button>
          <button 
            className="btn btn-sm btn-outline-info" 
            onClick={() => onUploadClick(track)}
            title="Upload audio file"
            data-testid={`upload-track-${track.id}`}
          >
            {track.audioFile ? 'Change Audio' : 'Upload Audio'}
          </button>
          {!isBulkSelectEnabled && (
            <button 
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDeleteClick(track.id)}
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

export default TrackItem;
