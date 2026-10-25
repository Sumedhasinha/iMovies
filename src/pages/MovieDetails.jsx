// src/pages/MovieDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMovieById, getShowtimes } from '../services/api';
import { useBooking } from '../context/BookingContext';
import { useWatchlist } from '../context/WatchlistContext';
import ShowtimeSelector from '../components/ShowtimeSelector';
import Modal from '../components/Modal';
import { getAvailableDates } from '../utils/dates';
import { getFallbackBackdrop, getFallbackPoster } from '../utils/imageFallback';
import {
  Star,
  Clock,
  Calendar,
  Globe,
  Film,
  Play,
  User,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Heart
} from 'lucide-react';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { startBooking } = useBooking();
  const { isFavorite, toggleFavorite } = useWatchlist();

  const dates = getAvailableDates(7);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [movie, setMovie] = useState(null);
  const [theatresSchedule, setTheatresSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [backdropSrc, setBackdropSrc] = useState('');
  const [posterSrc, setPosterSrc] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadMovieDetails() {
      setLoading(true);
      setError(null);
      try {
        const res = await getMovieById(id);
        if (!res.success || !res.data) {
          setError('Movie not found');
          return;
        }

        if (isMounted) {
          setMovie(res.data);
          setBackdropSrc(res.data.backdrop);
          setPosterSrc(res.data.poster);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load movie details');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadMovieDetails();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Load / refresh showtimes when movie or selected date changes
  useEffect(() => {
    let isMounted = true;
    async function loadSchedule() {
      if (!movie) return;
      setLoadingSchedule(true);
      try {
        const scheduleRes = await getShowtimes(movie.id || id, selectedDate.isoDate);
        if (isMounted && scheduleRes.success) {
          setTheatresSchedule(scheduleRes.data || []);
        }
      } catch (err) {
        console.error('Failed to load schedule for date:', err);
      } finally {
        if (isMounted) setLoadingSchedule(false);
      }
    }

    loadSchedule();
    return () => {
      isMounted = false;
    };
  }, [id, movie?.id, selectedDate.isoDate]);

  const handleConfirmShowtime = ({ theatre, date, showtime }) => {
    // Save to context and navigate to seat selection
    startBooking({
      movie,
      theatre,
      date,
      showtime
    });
    navigate(`/booking/${movie.id}`);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '48px', height: '48px', border: '3px solid rgba(229,9,20,0.3)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading cinematic experience...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="card-glass" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <Film size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.75rem' }}>
            Movie Not Found
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            The requested movie title could not be located in our current schedule.
          </p>
          <Link to="/movies" className="btn btn-primary">
            Back to Movie Catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-details-page">
      {/* 1. Cinematic Backdrop Banner Header */}
      <div
        style={{
          position: 'relative',
          minHeight: '480px',
          background: '#08090d',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
          paddingBottom: '3rem'
        }}
      >
        <img
          src={backdropSrc || movie.backdrop}
          alt={`${movie.title} backdrop`}
          onError={() => setBackdropSrc(getFallbackBackdrop(movie.title))}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            opacity: 0.35,
            filter: 'saturate(1.2)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(8, 9, 13, 0.4) 0%, rgba(8, 9, 13, 0.95) 85%, #08090d 100%)'
          }}
        />

        {/* Back Link Breadcrumb */}
        <div
          className="container"
          style={{
            position: 'absolute',
            top: '1.5rem',
            left: 0,
            right: 0,
            zIndex: 10
          }}
        >
          <Link
            to="/movies"
            className="btn btn-ghost btn-sm"
            style={{ color: '#fff', gap: '0.4rem', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
          >
            <ArrowLeft size={16} />
            <span>All Movies</span>
          </Link>
        </div>

        {/* Backdrop Content Preview */}
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div
            style={{
              display: 'flex',
              gap: '2.5rem',
              alignItems: 'flex-end',
              flexWrap: 'wrap'
            }}
          >
            {/* Poster Card */}
            <div
              style={{
                width: '240px',
                flexShrink: 0,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg), 0 0 30px rgba(0,0,0,0.8)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-tertiary)',
                position: 'relative'
              }}
            >
              <img
                src={posterSrc || movie.poster}
                alt={movie.title}
                onError={() => setPosterSrc(getFallbackPoster(movie.title))}
                style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Movie Title & Badges */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span className="badge badge-crimson" style={{ fontSize: '0.78rem' }}>
                  {movie.status === 'coming_soon' ? 'Coming Soon' : 'Now Showing'}
                </span>
                {movie.certificate && (
                  <span className="badge badge-cert" style={{ fontSize: '0.78rem' }}>
                    {movie.certificate}
                  </span>
                )}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'rgba(0,0,0,0.6)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: '#fff'
                  }}
                >
                  <Star size={15} color="var(--accent-gold)" fill="var(--accent-gold)" />
                  <span>{movie.rating.toFixed(1)}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({movie.voteCount})</span>
                </div>
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: '0.45rem', lineHeight: 1.15 }}>
                {movie.title}
              </h1>

              {movie.tagline && (
                <p style={{ fontStyle: 'italic', color: 'var(--primary)', fontWeight: 600, fontSize: '1.05rem', marginBottom: '1rem' }}>
                  "{movie.tagline}"
                </p>
              )}

              {/* Meta strip */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  flexWrap: 'wrap',
                  marginBottom: '1.5rem'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={16} />
                  {movie.duration}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Globe size={16} />
                  {movie.language}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={16} />
                  {movie.releaseDate}
                </span>
                <span>•</span>
                <span>Director: <strong style={{ color: '#fff' }}>{movie.director}</strong></span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                {movie.trailerUrl && (
                  <button
                    type="button"
                    onClick={() => setTrailerOpen(true)}
                    className="btn btn-secondary"
                    style={{ gap: '0.5rem' }}
                  >
                    <Play size={16} fill="currentColor" />
                    <span>Watch Trailer</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => toggleFavorite(movie)}
                  className="btn btn-secondary"
                  style={{
                    gap: '0.5rem',
                    borderColor: isFavorite(movie.id) ? 'var(--primary)' : 'var(--border-light)',
                    color: isFavorite(movie.id) ? 'var(--primary)' : '#fff'
                  }}
                >
                  <Heart size={16} fill={isFavorite(movie.id) ? 'var(--primary)' : 'none'} />
                  <span>{isFavorite(movie.id) ? 'In Watchlist' : 'Add to Watchlist'}</span>
                </button>
                <a href="#showtimes-section" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                  <span>View Showtimes</span>
                  <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Synopsis & Cast Section */}
      <div className="container" style={{ padding: '3.5rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
              Storyline
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#cbd5e1', marginBottom: '2.5rem' }}>
              {movie.synopsis}
            </p>

            {/* Top Cast List */}
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>
              Leading Cast & Crew
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                gap: '1rem'
              }}
            >
              {(movie.cast || []).map((actor, idx) => (
                <div
                  key={idx}
                  className="card-glass"
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <img
                    src={actor.avatar}
                    alt={actor.name}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop';
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>
                      {actor.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {actor.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Specs & Formats */}
          <div>
            <div
              className="card-glass"
              style={{ padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}
            >
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
                Cinema Experience Specifications
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Genre</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{movie.genre.join(', ')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Runtime</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{movie.duration}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Audio Formats</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Dolby Atmos, IMAX 12-Track</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Aspect Ratio</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>1.90:1 (IMAX Expanded)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Certification</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{movie.certificate} (Verified)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Showtime Selector Section */}
        <section id="showtimes-section" style={{ marginTop: '4rem' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">
                Book Tickets for {movie.title}
              </h2>
              <p className="section-subtitle">
                Select your preferred date, venue format, and showtime to proceed with interactive seat reservation
              </p>
            </div>
          </div>

          <ShowtimeSelector
            theatresData={theatresSchedule}
            onConfirmSelection={handleConfirmShowtime}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            loading={loadingSchedule}
          />
        </section>
      </div>

      {/* Trailer Modal */}
      <Modal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        title={`${movie.title} — Official Trailer`}
        size="lg"
      >
        <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0 }}>
          {trailerOpen && (
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
    </div>
  );
}
