export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  genres: string[];
  slug: string;
  coverImage: string;
  audioFile: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTrackRequest {
  title: string;
  artist: string;
  album: string;
  genres: string[];
  coverImage: string;
}

export interface UpdateTrackRequest extends CreateTrackRequest {
  id: string;
}

export interface TrackListResponse {
  data: Track[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DeleteMultipleResponse {
  success: string[];
  failed: string[];
}

export interface ApiError {
  error: string;
}

export interface TrackFilters {
  page?: number;
  limit?: number;
  sort?: 'title' | 'artist' | 'album' | 'createdAt';
  order?: 'asc' | 'desc';
  search?: string;
  genre?: string;
  artist?: string;
}
