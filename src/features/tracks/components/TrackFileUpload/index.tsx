import { useState, useRef, ChangeEvent, useCallback } from 'react';
import { useUploadTrackFileMutation, useDeleteTrackFileMutation, useGetTrackBySlugQuery } from '../../api/apiSlice';
import { useAudioManager } from '../../../audio/hooks/useAudioManager';
import { Track } from '../../../../types/track';
import '../../../../styles/track-file-upload.scss';

interface TrackFileUploadProps {
  track: Track;
  onClose: () => void;
}

const TrackFileUpload = ({ track, onClose }: TrackFileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const [uploadTrackFile, { isLoading: isUploadLoading }] = useUploadTrackFileMutation();
  const [deleteTrackFile, { isLoading: isDeleteLoading }] = useDeleteTrackFileMutation();

  const isLoading = isUploadLoading || isDeleteLoading;
  const hasAudioFile = !!track.audioFile;

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/x-m4a'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Invalid file type. Please select an audio file (MP3, WAV, OGG, M4A).');
        return;
      }
      
      const maxSize = 20 * 1024 * 1024;
      if (file.size > maxSize) {
        setUploadError('File size exceeds 20MB limit.');
        return;
      }
      
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/x-m4a'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Invalid file type. Please select an audio file (MP3, WAV, OGG, M4A).');
        return;
      }
      
      const maxSize = 20 * 1024 * 1024;
      if (file.size > maxSize) {
        setUploadError('File size exceeds 20MB limit.');
        return;
      }
      
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const simulateProgress = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);
    
    return () => clearInterval(interval);
  };

  const { generateCacheBustingUrl, forceReloadAudioElements, clearMediaCache } = useAudioManager();

  const { refetch: refetchTrack } = useGetTrackBySlugQuery(track.slug, {
    skip: !track.slug,
  });

  const handleUploadSuccess = useCallback(async () => {
    setUploadProgress(100);
    setUploadError(null);
    setIsUploading(false);

    await clearMediaCache();
    
    forceReloadAudioElements();

    await refetchTrack();

    onClose();
    
    setUploadProgress(0);
    setSelectedFile(null);
  }, [forceReloadAudioElements, clearMediaCache, refetchTrack, onClose]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      const stopSimulation = simulateProgress();
      
      await uploadTrackFile({ 
        id: track.id, 
        file: selectedFile 
      }).unwrap();
      
      clearTimeout(stopSimulation as unknown as number);
      
      handleUploadSuccess();
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadError('Failed to upload file. Please try again.');
      
      const errorMessage = error instanceof Error ? error.message : 
        typeof error === 'object' && error !== null ? JSON.stringify(error) : 
        'Unknown error';
      
      alert(`Failed to upload file: ${errorMessage}`);
    }
  };

  const handleRemoveFile = async () => {
    if (!track.audioFile) return;
    
    if (!window.confirm('Are you sure you want to remove this audio file?')) return;
    
    try {
      await deleteTrackFile(track.id).unwrap();

      await clearMediaCache();
      
      forceReloadAudioElements();

      await refetchTrack();

      onClose();
    } catch (error) {
      
      const errorMessage = error instanceof Error ? error.message : 
        typeof error === 'object' && error !== null ? JSON.stringify(error) : 
        'Unknown error';
      alert(`Failed to remove file: ${errorMessage}`);
    }
  };

  const getFileIcon = () => {
    if (selectedFile) {
      return '🎵';
    } else if (track.audioFile) {
      return '🎵';
    }
    
    return '📁';
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="track-file-upload">
      <h3 className="track-file-upload__title">
        {hasAudioFile ? 'Update Audio File' : 'Upload Audio File'}
      </h3>
      
      <p className="track-file-upload__info">
        Track: <strong>{track.title}</strong> by <strong>{track.artist}</strong>
      </p>
      
      {hasAudioFile && (
        <div className="track-file-upload__current-file">
          <div className="track-file-upload__file-info">
            <span className="track-file-upload__file-icon">🎵</span>
            <span className="track-file-upload__file-name">
              {track.audioFile.split('/').pop() || 'audio file'}
            </span>
          </div>
          
          <audio
            controls
            className="track-file-upload__audio-preview"
            src={generateCacheBustingUrl(track.audioFile)}
            key={`audio-${track.id}-${new Date().getTime()}`}
          />
          
          {!isLoading && !selectedFile && (
            <button 
              type="button" 
              className="track-file-upload__remove-btn"
              onClick={handleRemoveFile}
              disabled={isLoading}
            >
              Remove
            </button>
          )}
        </div>
      )}
      
      {!isUploading ? (
        <div 
          className={`track-file-upload__dropzone ${isHovering ? 'track-file-upload__dropzone--active' : ''} ${selectedFile ? 'track-file-upload__dropzone--has-file' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            accept="audio/mpeg,audio/wav,audio/ogg,audio/mp3,audio/x-m4a"
          />
          
          <div className="track-file-upload__dropzone-content">
            <div className="track-file-upload__icon">{getFileIcon()}</div>
            
            {selectedFile ? (
              <div className="track-file-upload__file-details">
                <p className="track-file-upload__file-name">{selectedFile.name}</p>
                <p className="track-file-upload__file-size">{getFileSize(selectedFile.size)}</p>
              </div>
            ) : (
              <>
                <p className="track-file-upload__dropzone-text">
                  Drag and drop your audio file here or click to browse
                </p>
                <p className="track-file-upload__dropzone-hint">
                  Supports MP3, WAV, OGG, M4A (max 20MB)
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="track-file-upload__progress">
          <div className="track-file-upload__progress-bar">
            <div 
              className="track-file-upload__progress-fill" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="track-file-upload__progress-text">
            {uploadProgress < 100 ? `Uploading: ${uploadProgress}%` : 'Upload complete!'}
          </p>
        </div>
      )}
      
      {uploadError && (
        <div className="track-file-upload__error">
          {uploadError}
        </div>
      )}
      
      <div className="track-file-upload__actions">
        <button 
          type="button" 
          className="track-file-upload__cancel-btn" 
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </button>
        
        {selectedFile && !isUploading && (
          <button 
            type="button" 
            className="track-file-upload__upload-btn" 
            onClick={handleUpload}
            disabled={isLoading}
          >
            {isUploadLoading ? 'Uploading...' : 'Upload'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TrackFileUpload;
