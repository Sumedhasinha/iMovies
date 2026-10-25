// src/components/MovieGrid.jsx
import React from 'react';
import MovieCard from './MovieCard';
import { Film, RefreshCw } from 'lucide-react';

export default function MovieGrid({
  movies = [],
  loading = false,
  emptyTitle = 'No movies found',
  emptyDescription = 'Try adjusting your search query or removing filters to discover more titles.',
  onResetFilters = null
}) {
  if (loading) {
    return (
      <div className="movie-grid" aria-busy="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="movie-card"
            style={{ pointerEvents: 'none', minHeight: '340px' }}
          >
            <div
              className="movie-poster-box"
              style={{
                background: 'linear-gradient(90deg, #131722 0%, #1c2233 50%, #131722 100%)',
                backgroundSize: '200% 100%',
                animation: 'skeletonShimmer 1.5s infinite linear'
              }}
            />
            <div className="movie-card-info" style={{ gap: '0.65rem' }}>
              <div style={{ height: '14px', width: '40%', background: '#1c2233', borderRadius: '4px' }} />
              <div style={{ height: '18px', width: '85%', background: '#232b40', borderRadius: '4px' }} />
              <div style={{ height: '12px', width: '60%', background: '#1c2233', borderRadius: '4px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div
        className="card-glass"
        style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(229, 9, 20, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(229, 9, 20, 0.3)'
          }}
        >
          <Film size={32} color="var(--primary)" />
        </div>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff' }}>
          {emptyTitle}
        </h3>
        <p style={{ maxWidth: '420px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {emptyDescription}
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="btn btn-outline-crimson btn-sm"
            style={{ marginTop: '0.5rem' }}
          >
            <RefreshCw size={14} />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
