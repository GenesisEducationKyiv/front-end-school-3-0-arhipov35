import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  CreateTrackRequest, 
  DeleteMultipleResponse, 
  Track, 
  TrackFilters, 
  TrackListResponse, 
  UpdateTrackRequest 
} from '../../../types/track';

const buildQueryString = (filters?: TrackFilters): string => {
  if (!filters) return '';
  
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  
  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  tagTypes: ['Track', 'Genre'],
  endpoints: (builder) => ({
    checkHealth: builder.query<{ status: string }, void>({
      query: () => '/health',
    }),
    
    getTracks: builder.query<TrackListResponse, TrackFilters | undefined>({
      query: (filters) => ({
        url: `/api/tracks${buildQueryString(filters)}`,
        method: 'GET',
      }),
      providesTags: (result) => 
        result 
          ? [
              ...result.data.map(({ id }) => ({ type: 'Track' as const, id })),
              { type: 'Track', id: 'LIST' }
            ]
          : [{ type: 'Track', id: 'LIST' }],
    }),
    
    getTrackBySlug: builder.query<Track, string>({
      query: (slug) => `/api/tracks/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: 'Track', id: slug }],
    }),
    
    createTrack: builder.mutation<Track, CreateTrackRequest>({
      query: (trackData) => ({
        url: '/api/tracks',
        method: 'POST',
        body: trackData,
      }),
      invalidatesTags: [{ type: 'Track', id: 'LIST' }],
    }),
    
    updateTrack: builder.mutation<Track, UpdateTrackRequest>({
      query: ({ id, ...trackData }) => ({
        url: `/api/tracks/${id}`,
        method: 'PUT',
        body: trackData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Track', id },
        { type: 'Track', id: 'LIST' }
      ],
    }),
    
    deleteTrack: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/tracks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Track', id: 'LIST' }],
    }),
    
    uploadTrackFile: builder.mutation<Track, { id: string; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        
        return {
          url: `/api/tracks/${id}/upload`,
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Track', id },
        { type: 'Track', id: 'LIST' }
      ],
    }),
    
    deleteTrackFile: builder.mutation<Track, string>({
      query: (id) => ({
        url: `/api/tracks/${id}/file`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Track', id },
        { type: 'Track', id: 'LIST' }
      ],
    }),
    
    deleteMultipleTracks: builder.mutation<DeleteMultipleResponse, string[]>({
      query: (ids) => ({
        url: '/api/tracks/delete',
        method: 'POST',
        body: { ids },
      }),
      invalidatesTags: [{ type: 'Track', id: 'LIST' }],
    }),
    
    getGenres: builder.query<string[], void>({
      query: () => '/api/genres',
      providesTags: [{ type: 'Genre', id: 'LIST' }],
    }),
  }),
});

export const {
  useCheckHealthQuery,
  useGetTracksQuery,
  useGetTrackBySlugQuery,
  useCreateTrackMutation,
  useUpdateTrackMutation,
  useDeleteTrackMutation,
  useDeleteMultipleTracksMutation,
  useUploadTrackFileMutation,
  useDeleteTrackFileMutation,
  useGetGenresQuery,
} = apiSlice;
