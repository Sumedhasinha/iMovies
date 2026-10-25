// src/components/MovieCard.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Ticket, Info, Heart } from 'lucide-react';
import { getFallbackPoster } from '../utils/imageFallback';
import { useWatchlist } from '../context/WatchlistContext';

export default function MovieCard({ movie }) {
  const [imgSrc, setImgSrc] = useState(movie.poster);
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useWatchlist();

  if (!movie) return null;

  const favorited = isFavorite(movie.id);

  const handleImageError = () => {
    setImgSrc(getFallbackPoster(movie.title));
  };

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'now_showing':
        return <span className="badge badge-crimson">Now Showing</span>;
      case 'trending':
        return <span className="badge badge-gold">Trending</span>;
      case 'coming_soon':
        return <span className="badge badge-cyan">Coming Soon</span>;
      default:
        return null;
    }
  };

  return (
    <article className="movie-card">
      {/* Poster Image & Overlay */}
      <div className="movie-poster-box">
        <img
          src={imgSrc}
          alt={`${movie.title} poster`}
          loading="lazy"
          className="movie-poster-img"
          onError={handleImageError}
        />

        {/* Top Badges */}
        <div className="movie-top-badges">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div className="movie-rating-badge">
              <Star size={13} className="movie-rating-star" fill="var(--accent-gold)" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
            {movie.certificate && (
              <span className="badge badge-cert">{movie.certificate}</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleHeartClick}
            aria-label={favorited ? 'Remove from Watchlist' : 'Add to Watchlist'}
            style={{
              pointerEvents: 'auto',
              background: 'rgba(10, 12, 18, 0.75)',
              backdropFilter: 'blur(8px)',
              border: favorited ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: favorited ? 'var(--primary)' : '#fff',
              transition: 'all 150ms ease'
            }}
          >
            <Heart size={15} fill={favorited ? 'var(--primary)' : 'none'} />
          </button>
        </div>

        {/* Hover Quick Actions Overlay */}
        <div className="movie-card-overlay">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
            <Link
              to={`/movies/${movie.id}`}
              className="btn btn-primary btn-sm btn-block"
              style={{ fontSize: '0.82rem', gap: '0.4rem' }}
            >
              <Ticket size={14} />
              <span>{movie.status === 'coming_soon' ? 'View Details' : 'Book Tickets'}</span>
            </Link>
            <Link
              to={`/movies/${movie.id}`}
              className="btn btn-secondary btn-sm btn-block"
              style={{ fontSize: '0.82rem', gap: '0.4rem' }}
            >
              <Info size={14} />
              <span>Details</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="movie-card-info">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
          {getStatusBadge(movie.status)}
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{movie.language}</span>
        </div>

        <h3 className="movie-card-title" title={movie.title}>
          <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
        </h3>

        <div className="movie-card-genres">
          {Array.isArray(movie.genre) ? movie.genre.join(' • ') : movie.genre}
        </div>

        <div className="movie-card-meta" style={{ marginTop: 'auto', paddingTop: '0.35rem' }}>
          <Clock size={12} />
          <span>{movie.duration}</span>
        </div>
      </div>
    </article>
  );
}
