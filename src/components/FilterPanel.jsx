// src/components/FilterPanel.jsx
import React from 'react';
import { GENRES, LANGUAGES } from '../data/movies';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'All', label: 'All Statuses' },
  { value: 'now_showing', label: 'Now Showing' },
  { value: 'trending', label: 'Trending' },
  { value: 'coming_soon', label: 'Coming Soon' },
  { value: 'watchlist', label: '♥ My Watchlist' }
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured / Popularity' },
  { value: 'rating', label: 'Highest Rated ★' },
  { value: 'releaseDate', label: 'Release Date (Newest)' },
  { value: 'duration', label: 'Runtime (Longest)' },
  { value: 'title', label: 'Title (A – Z)' }
];

export default function FilterPanel({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults = 0
}) {
  const hasActiveFilters =
    filters.genre !== 'All' ||
    filters.language !== 'All' ||
    filters.status !== 'All' ||
    (filters.search && filters.search.trim() !== '') ||
    filters.sortBy !== 'default';

  return (
    <div
      className="card-glass"
      style={{
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        marginBottom: '2rem'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <SlidersHorizontal size={18} color="var(--primary)" />
          <span style={{ fontWeight: 700, fontSize: '0.98rem', color: '#fff' }}>
            Filter & Refine
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            ({totalResults} {totalResults === 1 ? 'movie' : 'movies'} found)
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--primary)', fontSize: '0.82rem', gap: '0.35rem' }}
          >
            <RotateCcw size={13} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Select Controls Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem'
        }}
      >
        {/* Genre Selector */}
        <div>
          <label className="form-label" htmlFor="genre-select">
            Genre
          </label>
          <select
            id="genre-select"
            value={filters.genre}
            onChange={(e) => onFilterChange('genre', e.target.value)}
            className="form-input"
            style={{ padding: '0.55rem 0.85rem', fontSize: '0.88rem' }}
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Language Selector */}
        <div>
          <label className="form-label" htmlFor="lang-select">
            Language
          </label>
          <select
            id="lang-select"
            value={filters.language}
            onChange={(e) => onFilterChange('language', e.target.value)}
            className="form-input"
            style={{ padding: '0.55rem 0.85rem', fontSize: '0.88rem' }}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* Release Status Selector */}
        <div>
          <label className="form-label" htmlFor="status-select">
            Release Status
          </label>
          <select
            id="status-select"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="form-input"
            style={{ padding: '0.55rem 0.85rem', fontSize: '0.88rem' }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Selector */}
        <div>
          <label className="form-label" htmlFor="sort-select">
            Sort By
          </label>
          <select
            id="sort-select"
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="form-input"
            style={{ padding: '0.55rem 0.85rem', fontSize: '0.88rem' }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
