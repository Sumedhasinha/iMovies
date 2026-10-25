// src/components/HeroSection.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Ticket, Star, Clock, Calendar, Film, Heart } from 'lucide-react';
import Modal from './Modal';
import { getFallbackBackdrop } from '../utils/imageFallback';
import { useWatchlist } from '../context/WatchlistContext';

export default function HeroSection({ movie }) {
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [backdropSrc, setBackdropSrc] = useState(movie?.backdrop);
  const { isFavorite, toggleFavorite } = useWatchlist();

  if (!movie) return null;

  const favorited = isFavorite(movie.id);

  const handleBackdropError = () => {
    setBackdropSrc(getFallbackBackdrop(movie.title));
  };

  return (
    <section className="hero-wrapper" aria-label="Featured Movie Spotlight">
      {/* Background Cinematic Poster/Backdrop */}
      <img
        src={backdropSrc || movie.backdrop}
        alt={`${movie.title} backdrop`}
        className="hero-backdrop-img"
        onError={handleBackdropError}
      />
      <div className="hero-gradient-overlay" />

      {/* Main Content */}
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="hero-content">
          {/* Badges Row */}
          <div className="hero-badge-row">
            <span className="badge badge-crimson">Exclusive Premiere</span>
            {movie.certificate && (
              <span className="badge badge-cert">{movie.certificate}</span>
            )}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#fff'
              }}
            >
              <Star size={15} color="var(--accent-gold)" fill="var(--accent-gold)" />
              <span>{movie.rating.toFixed(1)}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.78rem' }}>
                ({movie.voteCount} reviews)
              </span>
            </div>
          </div>

          {/* Title & Tagline */}
          <h1 className="hero-title">{movie.title}</h1>
          {movie.tagline && (
            <p
              style={{
                fontStyle: 'italic',
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '1.05rem',
                marginBottom: '0.85rem'
              }}
            >
              "{movie.tagline}"
            </p>
          )}

          {/* Metadata Row */}
          <div className="hero-meta-row">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={15} />
              {movie.duration}
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Film size={15} />
              {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={15} />
              {movie.releaseDate}
            </span>
          </div>

          {/* Synopsis */}
          <p className="hero-synopsis">{movie.synopsis}</p>

          {/* Action CTAs */}
          <div className="hero-actions">
            <Link
              to={`/movies/${movie.id}`}
              className="btn btn-primary btn-lg"
              style={{ gap: '0.65rem' }}
            >
              <Ticket size={20} />
              <span>Book Tickets</span>
            </Link>

            {movie.trailerUrl && (
              <button
                type="button"
                onClick={() => setTrailerModalOpen(true)}
                className="btn btn-secondary btn-lg"
                style={{ gap: '0.65rem' }}
              >
                <Play size={18} fill="currentColor" />
                <span>Watch Trailer</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => toggleFavorite(movie)}
              className="btn btn-secondary btn-lg"
              style={{
                gap: '0.5rem',
                borderColor: favorited ? 'var(--primary)' : 'var(--border-light)',
                color: favorited ? 'var(--primary)' : '#fff'
              }}
            >
              <Heart size={18} fill={favorited ? 'var(--primary)' : 'none'} />
              <span>{favorited ? 'In Watchlist' : 'Watchlist'}</span>
            </button>

            <Link
              to={`/movies/${movie.id}`}
              className="btn btn-ghost btn-lg"
              style={{ color: '#ffffff' }}
            >
              <span>More Details</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      <Modal
        isOpen={trailerModalOpen}
        onClose={() => setTrailerModalOpen(false)}
        title={`${movie.title} — Official Trailer`}
        size="lg"
      >
        <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0 }}>
          {trailerModalOpen && (
            <iframe
              src={`${movie.trailerUrl}?autoplay=1`}
              title={`${movie.title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '8px'
              }}
            />
          )}
        </div>
      </Modal>
    </section>
  );
}
