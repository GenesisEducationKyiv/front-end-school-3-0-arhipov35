import { createApi } from "@reduxjs/toolkit/query/react";
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import {
  CreateTrackRequest,
  DeleteMultipleResponse,
  Track,
  TrackFilters,
  TrackListResponse,
  UpdateTrackRequest,
} from "@/types/track";
import {
  TracksResponse,
  TrackResponse,
  CreateTrackResponse,
  UpdateTrackResponse,
  DeleteTrackResponse,
  UploadTrackFileResponse,
  DeleteTrackFileResponse,
  DeleteMultipleTracksResponse,
  GenresResponse,
  UploadResponse,
  TrackFileUploadResult,
  GraphQLQuery,
  QueryResult,
} from "./graphqlTypes";


export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: graphqlRequestBaseQuery({
    url: "http://localhost:4000/graphql",
  }),
  tagTypes: ["Track", "Genre"],
  endpoints: (builder) => ({
    getTracks: builder.query<TrackListResponse, TrackFilters | undefined>({
      query: (filters) => ({
        document: `
          query GetTracks($page: Int, $limit: Int, $search: String, $genre: String, $artist: String, $sort: String, $order: String) {
            tracks(page: $page, limit: $limit, search: $search, genre: $genre, artist: $artist, sort: $sort, order: $order) {
              data {
                id
                title
                artist
                album
                genres
                slug
                coverImage
                audioFile
                createdAt
                updatedAt
              }
              meta {
                total
                page
                limit
                totalPages
              }
            }
          }
        `,
        variables: filters
          ? {
              page: filters.page,
              limit: filters.limit,
              search: filters.search,
              genre: filters.genre,
              artist: filters.artist,
              sort: filters.sort,
              order: filters.order,
            }
          : {},
      }),
      transformResponse: (response: TracksResponse) => response.tracks,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }: { id: string }) => ({
                type: "Track" as const,
                id,
              })),
              { type: "Track", id: "LIST" },
            ]
          : [{ type: "Track", id: "LIST" }],
    }),

    getTrackBySlug: builder.query<Track, string>({
      query: (slug) => ({
        document: `
          query GetTrack($slug: String!) {
            track(slug: $slug) {
              id
              title
              artist
              album
              genres
              slug
              coverImage
              audioFile
              createdAt
              updatedAt
            }
          }
        `,
        variables: { slug },
      }),
      transformResponse: (response: TrackResponse) => response.track,
      providesTags: (_result, _error, slug) => [{ type: "Track", id: slug }],
    }),

    createTrack: builder.mutation<Track, CreateTrackRequest>({
      query: (trackData) => ({
        document: `
          mutation CreateTrack($input: CreateTrackInput!) {
            createTrack(input: $input) {
              id
              title
              artist
              album
              genres
              slug
              coverImage
              audioFile
              createdAt
              updatedAt
            }
          }
        `,
        variables: { input: trackData },
      }),
      transformResponse: (response: CreateTrackResponse) =>
        response.createTrack,
      invalidatesTags: [{ type: "Track", id: "LIST" }],
    }),

    updateTrack: builder.mutation<Track, UpdateTrackRequest>({
      query: ({ id, ...trackData }) => ({
        document: `
          mutation UpdateTrack($id: ID!, $input: UpdateTrackInput!) {
            updateTrack(id: $id, input: $input) {
              id
              title
              artist
              album
              genres
              slug
              coverImage
              audioFile
              createdAt
              updatedAt
            }
          }
        `,
        variables: { id, input: trackData },
      }),
      transformResponse: (response: UpdateTrackResponse) =>
        response.updateTrack,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Track", id },
        { type: "Track", id: "LIST" },
      ],
    }),

    deleteTrack: builder.mutation<boolean, string>({
      query: (id) => ({
        document: `
          mutation DeleteTrack($id: ID!) {
            deleteTrack(id: $id)
          }
        `,
        variables: { id },
      }),
      transformResponse: (response: DeleteTrackResponse) =>
        response.deleteTrack,
      invalidatesTags: [{ type: "Track", id: "LIST" }],
    }),

    uploadTrackFile: builder.mutation<
      { success: boolean; track: Track; message: string },
      { id: string; file: File }
    >({
      async queryFn({ id, file }, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          console.log("RTK Query uploadTrackFile called with:", {
            id,
            fileName: file.name,
          });

          const formData = new FormData();
          formData.append("file", file);

          const uploadResponse = await fetch(
            `http://localhost:4000/api/tracks/${id}/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error(
              "Upload response not OK:",
              uploadResponse.status,
              errorText
            );
            try {
              const errorData = JSON.parse(errorText) as { message?: string };
              throw new Error(
                errorData.message ??
                  `Failed to upload file: ${uploadResponse.status}`
              );
            } catch (_e) {
              throw new Error(
                `Failed to upload file: ${uploadResponse.status} - ${errorText}`
              );
            }
          }

          const uploadData = (await uploadResponse.json()) as UploadResponse;
          console.log("Upload response data:", uploadData);

          const filename = uploadData.filename || (uploadData.track?.audioFile || "");

          if (!filename) {
            throw new Error("No filename in response");
          }

          console.log("Using filename for GraphQL request:", filename);

          const graphqlQuery: GraphQLQuery = {
            document: `
              mutation UploadTrackFile($id: ID!, $filename: String!) {
                uploadTrackFile(id: $id, filename: $filename) {
                  success
                  message
                  track {
                    id
                    title
                    artist
                    album
                    genres
                    slug
                    coverImage
                    audioFile
                    createdAt
                    updatedAt
                  }
                }
              }
            `,
            variables: { id, filename },
          };

          const result = (await fetchWithBQ(
            graphqlQuery
          )) as QueryResult<UploadTrackFileResponse>;

          if (result.error) {
            return { error: result.error };
          }

          const responseData = result.data as UploadTrackFileResponse;

          if (!responseData?.uploadTrackFile) {
            return {
              error: {
                status: "CUSTOM_ERROR",
                error: "Invalid response from server",
              },
            };
          }

          const uploadResult: TrackFileUploadResult = responseData.uploadTrackFile;
          return { data: uploadResult };
        } catch (error: unknown) {
          console.error("Error in uploadTrackFile:", error);
          return { error: { status: "CUSTOM_ERROR", error: String(error) } };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Track", id },
        { type: "Track", id: "LIST" },
      ],
    }),

    deleteTrackFile: builder.mutation<Track, string>({
      query: (id) => ({
        document: `
          mutation DeleteTrackFile($id: ID!) {
            deleteTrackFile(id: $id) {
              id
              title
              artist
              album
              genres
              slug
              coverImage
              audioFile
              createdAt
              updatedAt
            }
          }
        `,
        variables: { id },
      }),
      transformResponse: (response: DeleteTrackFileResponse) =>
        response.deleteTrackFile,
      invalidatesTags: (_result, _error, id) => [
        { type: "Track", id },
        { type: "Track", id: "LIST" },
      ],
    }),

    deleteMultipleTracks: builder.mutation<DeleteMultipleResponse, string[]>({
      query: (ids) => ({
        document: `
          mutation DeleteTracks($ids: [ID!]!) {
            deleteTracks(ids: $ids) {
              success
              failed
            }
          }
        `,
        variables: { ids },
      }),
      transformResponse: (response: DeleteMultipleTracksResponse) =>
        response.deleteTracks,
      invalidatesTags: [{ type: "Track", id: "LIST" }],
    }),

    getGenres: builder.query<string[], void>({
      query: () => ({
        document: `
          query GetGenres {
            genres
          }
        `,
      }),
      transformResponse: (response: GenresResponse) => response.genres,
      providesTags: [{ type: "Genre", id: "LIST" }],
    }),
  }),
});

export const {
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
