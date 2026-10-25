// src/pages/Movies.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import { getMovies } from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';
import { Film } from 'lucide-react';

export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isFavorite } = useWatchlist();

  // Read initial query params
  const initialSearch = searchParams.get('search') || '';
  const initialGenre = searchParams.get('genre') || 'All';
  const initialLanguage = searchParams.get('language') || 'All';
  const initialStatus = searchParams.get('status') || 'All';
  const initialSortBy = searchParams.get('sortBy') || 'default';

  const [filters, setFilters] = useState({
    search: initialSearch,
    genre: initialGenre,
    language: initialLanguage,
    status: initialStatus,
    sortBy: initialSortBy
  });

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state if URL search parameters change externally
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      genre: searchParams.get('genre') || 'All',
      language: searchParams.get('language') || 'All',
      status: searchParams.get('status') || 'All',
      sortBy: searchParams.get('sortBy') || 'default'
    });
  }, [searchParams]);

  // Fetch movies whenever filters change
  useEffect(() => {
    let isMounted = true;
    async function fetchFilteredMovies() {
      setLoading(true);
      try {
        const queryFilters = { ...filters };
        if (queryFilters.status === 'watchlist') {
          queryFilters.status = 'All'; // fetch all, filter client-side with Watchlist
        }
        const res = await getMovies(queryFilters);
        if (isMounted) {
          let list = res.data || [];
          if (filters.status === 'watchlist') {
            list = list.filter((m) => isFavorite(m.id));
          }
          setMovies(list);
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchFilteredMovies();
    return () => {
      isMounted = false;
    };
  }, [filters]);

  // Update specific filter & update URL
  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);

    const newParams = new URLSearchParams();
    if (updated.search) newParams.set('search', updated.search);
    if (updated.genre !== 'All') newParams.set('genre', updated.genre);
    if (updated.language !== 'All') newParams.set('language', updated.language);
    if (updated.status !== 'All') newParams.set('status', updated.status);
    if (updated.sortBy !== 'default') newParams.set('sortBy', updated.sortBy);
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    const reset = {
      search: '',
      genre: 'All',
      language: 'All',
      status: 'All',
      sortBy: 'default'
    };
    setFilters(reset);
    setSearchParams({});
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Page Title & Search Bar */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <Film size={26} color="var(--primary)" />
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff' }}>
            Cinema Catalogue
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', maxWidth: '600px' }}>
          Browse our curated line-up of global premieres, IMAX 70mm re-releases, and cutting-edge cinema showings.
        </p>

        {/* Global Search */}
        <SearchBar
          value={filters.search}
          onChange={(val) => handleFilterChange('search', val)}
          onClear={() => handleFilterChange('search', '')}
        />
      </div>

      {/* Filter & Sort Controls */}
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResults={movies.length}
      />

      {/* Movies Grid */}
      <MovieGrid
        movies={movies}
        loading={loading}
        emptyTitle={filters.search ? `No results for "${filters.search}"` : 'No movies match selected filters'}
        emptyDescription="Try selecting a different genre or clearing language filters to see available titles."
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}
