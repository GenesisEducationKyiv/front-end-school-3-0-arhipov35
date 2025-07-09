import {
  TrackListResponse,
  Track,
  DeleteMultipleResponse,
} from "@/types/track";

export interface UploadResponse {
  success?: boolean;
  track?: Track;
  filename?: string;
  message?: string;
}

export interface TrackFileUploadResult {
  success: boolean;
  track: Track;
  message: string;
}

export interface GraphQLQuery {
  document: string;
  variables: Record<string, unknown>;
}

export interface QueryResult<T> {
  data?: T;
  error?: {
    status: string;
    error: string;
  };
}

export interface TracksResponse {
  tracks: TrackListResponse;
}

export interface TrackResponse {
  track: Track;
}

export interface CreateTrackResponse {
  createTrack: Track;
}

export interface UpdateTrackResponse {
  updateTrack: Track;
}

export interface DeleteTrackResponse {
  deleteTrack: boolean;
}

export interface DeleteTrackFileResponse {
  deleteTrackFile: Track;
}

export interface DeleteMultipleTracksResponse {
  deleteTracks: DeleteMultipleResponse;
}

export interface GenresResponse {
  genres: string[];
}

export interface UploadTrackFileResponse {
  uploadTrackFile: {
    success: boolean;
    track: Track;
    message: string;
  };
}
