import { TrackFilters } from '@/types/track';

export const originalFilters: TrackFilters = {
  page: 2,
  limit: 20,
  search: 'track',
  genre: 'rock',
  artist: 'Queen',
  sort: 'title',
  order: 'asc'
};

export const partialFilters: TrackFilters = {
  page: 3,
  search: 'jazz'
};
