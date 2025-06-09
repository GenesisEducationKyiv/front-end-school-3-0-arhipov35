import { useState, useCallback, useMemo, useEffect } from 'react';
import { O } from '@mobily/ts-belt';
import { filtersFromQueryString, filtersToQueryString } from '../utils/urlFilters';
import { TrackFilters } from '../../../types/track';
import { useGetTracksQuery, useGetGenresQuery } from '../api/apiSlice';

export function useTrackFilters(initialFilters: TrackFilters = {
  page: 1,
  limit: 10,
  sort: 'createdAt',
  order: 'desc'
}) {

  const getFiltersFromUrl = (): TrackFilters => {
    const opt = filtersFromQueryString(window.location.search);
    return O.getWithDefault(opt, initialFilters);
  };

  const [filters, setFilters] = useState<TrackFilters>(getFiltersFromUrl());
  
  const { 
    data, 
    error, 
    isLoading, 
    refetch 
  } = useGetTracksQuery(filters);
  
  const { data: genres = [] } = useGetGenresQuery();
  
  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  useEffect(() => {
    const query = filtersToQueryString(filters);
    const url = `${window.location.pathname}${query ? `?${query}` : ''}`;
    window.history.replaceState({}, '', url);
  }, [filters]);
  
  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sort, order] = e.target.value.split('-');
    setFilters(prev => ({ 
      ...prev, 
      sort: sort as TrackFilters['sort'], 
      order: order as TrackFilters['order'],
      page: 1
    }));
  }, []);
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: value, page: 1 }));
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleGenreFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const genreValue = e.target.value === 'all' ? undefined : e.target.value;
    setFilters(prev => ({
      ...prev,
      genre: genreValue,
      page: 1,
    }));
  }, []);
  
  const handleArtistFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const artistValue = e.target.value === 'all' ? undefined : e.target.value;
    setFilters(prev => ({
      ...prev,
      artist: artistValue,
      page: 1,
    }));
  }, []);
  
  const uniqueArtists = useMemo(() => {
    if (!data?.data) return [];
    const artistsSet = new Set<string>();
    data.data.forEach(track => {
      if (track.artist) artistsSet.add(track.artist);
    });
    return Array.from(artistsSet).sort();
  }, [data?.data]);
  
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);
  
  return {
    filters,
    setFilters,
    data,
    error,
    isLoading,
    refetch,
    genres,
    uniqueArtists,
    handlePageChange,
    handleSortChange,
    handleSearchChange,
    handleGenreFilterChange,
    handleArtistFilterChange,
    resetFilters
  };
}
