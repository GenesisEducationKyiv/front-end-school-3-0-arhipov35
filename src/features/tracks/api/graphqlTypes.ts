import {
  TrackListResponse,
  Track,
  DeleteMultipleResponse,
} from "@/types/track";

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
