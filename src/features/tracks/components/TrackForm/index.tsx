import { useState, useEffect } from 'react';
import { useCreateTrackMutation, useUpdateTrackMutation, useGetGenresQuery } from '../../api/apiSlice';
import TagsInput from '../../../../shared/components/Form/TagsInput';
import Loader from '../../../../shared/components/Loader';
import { Track } from '../../../../types/track';
import '../../../../styles/track-form.scss';

interface TrackFormProps {
  track?: Track;
  onClose: () => void;
}

interface FormData {
  title: string;
  artist: string;
  album: string;
  genres: string[];
  coverImage: string;
}

interface FormErrors {
  title?: string;
  artist?: string;
  album?: string;
  genres?: string;
  coverImage?: string;
}

const TrackForm = ({ track, onClose }: TrackFormProps) => {
  const { data: genres, isLoading: genresLoading } = useGetGenresQuery();
  const [createTrack, { isLoading: isCreating }] = useCreateTrackMutation();
  const [updateTrack, { isLoading: isUpdating }] = useUpdateTrackMutation();
  
  const [formData, setFormData] = useState<FormData>({
    title: track?.title || '',
    artist: track?.artist || '',
    album: track?.album || '',
    genres: track?.genres || [],
    coverImage: track?.coverImage || '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const isSubmitting = isCreating || isUpdating;
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.artist.trim()) {
      newErrors.artist = 'Artist is required';
    }
    
    if (formData.genres.length === 0) {
      newErrors.genres = 'At least one genre is required';
    }
    
    if (formData.coverImage && !isValidImageUrl(formData.coverImage)) {
      newErrors.coverImage = 'Please enter a valid image URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const isValidImageUrl = (url: string): boolean => {
    if (!url) return true;
    
    try {
      const parsedUrl = new URL(url);
      
      const trustedDomains = [
        'picsum.photos',
        'placeholder.com',
        'placehold.co',
        'placekitten.com',
        'loremflickr.com',
        'unsplash.com',
        'unsplash.it',
        'source.unsplash.com',
        'cloudinary.com',
        'imgix.net',
        'images.pexels.com',
        'img.youtube.com'
      ];
      
      if (trustedDomains.some(domain => parsedUrl.hostname.includes(domain))) {
        return true;
      }
      
      return /^(https?:\/\/.*\.(jpeg|jpg|gif|png|webp|svg|bmp|tiff|avif)((\?|#).*)?$)/i.test(url);
    } catch (error) {
      return false;
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleGenresChange = (newGenres: string[]) => {
    setFormData(prev => ({ ...prev, genres: newGenres }));
    
    if (errors.genres) {
      setErrors(prev => ({ ...prev, genres: undefined }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (track) {
        await updateTrack({ 
          id: track.id,
          ...formData
        }).unwrap();
      } else {
        await createTrack(formData).unwrap();
      }
      onClose();
    } catch (error) {
      // Помилку можна обробити через UI, наприклад через систему сповіщень
    }
  };
  
  if (genresLoading) {
    return <Loader text="Loading genres..." />;
  }
  
  return (
    <form onSubmit={handleSubmit} className="track-form" data-testid="track-form">
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title *</label>
        <input
          type="text"
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          disabled={isSubmitting}
          aria-disabled={isSubmitting ? "true" : "false"}
          data-loading={isSubmitting ? "true" : "false"}
          data-testid="input-title"
        />
        {errors.title && <div className="invalid-feedback" data-testid="error-title">{errors.title}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="artist" className="form-label">Artist *</label>
        <input
          type="text"
          className={`form-control ${errors.artist ? 'is-invalid' : ''}`}
          id="artist"
          name="artist"
          value={formData.artist}
          onChange={handleInputChange}
          disabled={isSubmitting}
          aria-disabled={isSubmitting ? "true" : "false"}
          data-loading={isSubmitting ? "true" : "false"}
          data-testid="input-artist"
        />
        {errors.artist && <div className="invalid-feedback" data-testid="error-artist">{errors.artist}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="album" className="form-label">Album</label>
        <input
          type="text"
          className="form-control"
          id="album"
          name="album"
          value={formData.album}
          onChange={handleInputChange}
          disabled={isSubmitting}
          aria-disabled={isSubmitting ? "true" : "false"}
          data-loading={isSubmitting ? "true" : "false"}
          data-testid="input-album"
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="genres" className="form-label">Genres *</label>
        <TagsInput
          tags={formData.genres}
          suggestions={genres || []}
          onChange={handleGenresChange}
          placeholder="Add a genre..."
          disabled={isSubmitting}
          error={errors.genres}
          data-testid="genre-selector"
        />
        {errors.genres && <div className="invalid-feedback d-block" data-testid="error-genre">{errors.genres}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="coverImage" className="form-label">Cover Image URL</label>
        <input
          type="text"
          className={`form-control ${errors.coverImage ? 'is-invalid' : ''}`}
          id="coverImage"
          name="coverImage"
          value={formData.coverImage}
          onChange={handleInputChange}
          placeholder="https://example.com/image.jpg"
          disabled={isSubmitting}
          aria-disabled={isSubmitting ? "true" : "false"}
          data-loading={isSubmitting ? "true" : "false"}
          data-testid="input-cover-image"
        />
        {errors.coverImage && <div className="invalid-feedback" data-testid="error-cover-image">{errors.coverImage}</div>}
        
        {formData.coverImage && (
          <div className="cover-preview mt-2">
            <img 
              src={formData.coverImage} 
              alt="Cover preview" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Invalid+URL';
              }}
            />
          </div>
        )}
      </div>
      
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onClose}
          disabled={isSubmitting}
          aria-disabled={isSubmitting ? "true" : "false"}
          data-loading={isSubmitting ? "true" : "false"}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={isSubmitting}
          aria-disabled={isSubmitting ? "true" : "false"}
          data-loading={isSubmitting ? "true" : "false"}
          data-testid="submit-button"
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {track ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            track ? 'Update Track' : 'Create Track'
          )}
        </button>
      </div>
    </form>
  );
};

export default TrackForm;
