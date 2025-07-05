import { ChangeEvent } from 'react';
import { TrackFilters } from '@/types/track';

interface FilterBarProps {
  filters: TrackFilters;
  genres: string[];
  uniqueArtists: string[];
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSortChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleGenreFilterChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleArtistFilterChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const FilterBar = ({
  filters,
  genres,
  uniqueArtists,
  handleSearchChange,
  handleSortChange,
  handleGenreFilterChange,
  handleArtistFilterChange
}: FilterBarProps) => {
  return (
    <div className="filters-container mb-4">
      <div className="row g-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, artist or album..."
            onChange={handleSearchChange}
            data-testid="search-input"
          />
        </div>
        <div className="col-md-3">
          <select 
            className="form-select" 
            onChange={handleSortChange}
            value={`${filters.sort ?? 'createdAt'}-${filters.order ?? 'desc'}`}
            data-testid="sort-select"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="artist-asc">Artist (A-Z)</option>
            <option value="artist-desc">Artist (Z-A)</option>
            <option value="album-asc">Album (A-Z)</option>
            <option value="album-desc">Album (Z-A)</option>
          </select>
        </div>
        <div className="col-md-2">
          <select 
            className="form-select" 
            onChange={handleGenreFilterChange}
            value={filters.genre ?? 'all'}
            data-testid="filter-genre"
            aria-label="Filter tracks by genre"
          >
            <option value="all">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select 
            className="form-select" 
            onChange={handleArtistFilterChange}
            value={filters.artist ?? 'all'}
            data-testid="filter-artist"
            aria-label="Filter tracks by artist"
          >
            <option value="all">All Artists</option>
            {uniqueArtists.map(artist => (
              <option key={artist} value={artist}>{artist}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
