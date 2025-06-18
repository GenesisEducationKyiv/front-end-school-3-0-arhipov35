import { z } from 'zod';

// Track
export const TrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  album: z.string(),
  genres: z.array(z.string()),
  slug: z.string(),
  coverImage: z.string(),
  audioFile: z.string(),
  createdAt: z.string(), 
  updatedAt: z.string()
});

export type Track = z.infer<typeof TrackSchema>;

// CreateTrackRequest
export const CreateTrackRequestSchema = z.object({
  title: z.string(),
  artist: z.string(),
  album: z.string(),
  genres: z.array(z.string()),
  coverImage: z.string()
});

export type CreateTrackRequest = z.infer<typeof CreateTrackRequestSchema>;

// UpdateTrackRequest (extends CreateTrackRequest)
export const UpdateTrackRequestSchema = CreateTrackRequestSchema.extend({
  id: z.string()
});

export type UpdateTrackRequest = z.infer<typeof UpdateTrackRequestSchema>;

// TrackListResponse
export const TrackListResponseSchema = z.object({
  data: z.array(TrackSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number()
  })
});

export type TrackListResponse = z.infer<typeof TrackListResponseSchema>;

// DeleteMultipleResponse
export const DeleteMultipleResponseSchema = z.object({
  success: z.array(z.string()),
  failed: z.array(z.string())
});

export type DeleteMultipleResponse = z.infer<typeof DeleteMultipleResponseSchema>;

// ApiError
export const ApiErrorSchema = z.object({
  error: z.string()
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

// TrackFilters
export const TrackFiltersSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  sort: z.enum(['title', 'artist', 'album', 'createdAt']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
  genre: z.string().optional(),
  artist: z.string().optional()
});

export type TrackFilters = z.infer<typeof TrackFiltersSchema>;
