// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import MovieCard from '../components/MovieCard';
import { getMovies } from '../services/api';
import { GENRES } from '../data/movies';
import {
  TrendingUp,
  Film,
  Sparkles,
  Calendar,
  Compass,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function Home() {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [trendingRes, nowShowingRes, comingSoonRes] = await Promise.all([
          getMovies({ status: 'trending' }),
          getMovies({ status: 'now_showing' }),
          getMovies({ status: 'coming_soon' })
        ]);

        if (nowShowingRes.data && nowShowingRes.data.length > 0) {
          // Feature Dune or Oppenheimer
          const featured = nowShowingRes.data.find((m) => m.featured) || nowShowingRes.data[0];
          setFeaturedMovie(featured);
        }

        setTrendingMovies(trendingRes.data || []);
        setNowShowingMovies(nowShowingRes.data || []);
        setComingSoonMovies(comingSoonRes.data || []);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="home-page-container">
      {/* 1. Hero Spotlight Section */}
      <HeroSection movie={featuredMovie} />

      {/* 2. Main Discovery Content */}
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {/* Value Proposition Strip */}
        <div
          className="card-glass"
          style={{
            padding: '1.25rem 2rem',
            borderRadius: 'var(--radius-md)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Film size={20} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>Laser IMAX & Dolby</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Precision laser acoustics & 4K</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} color="var(--accent-gold)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>VIP Recliner Lounges</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Motorized zero-gravity luxury</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} color="var(--status-success)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>Instant Mobile Pass</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Direct gate access with QR</div>
            </div>
          </div>
        </div>

        {/* 3. Now Showing Section */}
        <section className="section-wrapper" aria-labelledby="now-showing-heading">
          <div className="section-header">
            <div>
              <h2 id="now-showing-heading" className="section-title">
                Now Showing in Theatres
              </h2>
              <p className="section-subtitle">
                Watch the latest Hollywood blockbusters and critically acclaimed releases on the big screen
              </p>
            </div>
            <Link to="/movies?status=now_showing" className="view-all-link">
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="movie-grid">
            {nowShowingMovies.slice(0, 4).map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </section>

        {/* 4. Trending Blockbusters Section */}
        <section className="section-wrapper" aria-labelledby="trending-heading">
          <div className="section-header">
            <div>
              <h2 id="trending-heading" className="section-title">
                Trending This Week
              </h2>
              <p className="section-subtitle">
                High demand screenings filling up fast — reserve your preferred seats early
              </p>
            </div>
            <Link to="/movies?status=trending" className="view-all-link">
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="movie-grid">
            {trendingMovies.slice(0, 4).map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </section>

        {/* 5. Popular Genres Section */}
        <section className="section-wrapper" aria-labelledby="genres-heading">
          <div className="section-header">
            <div>
              <h2 id="genres-heading" className="section-title">
                Explore by Genre
              </h2>
              <p className="section-subtitle">
                Discover titles tailored to your cinematic taste
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))',
              gap: '1rem'
            }}
          >
            {GENRES.filter((g) => g !== 'All').map((genre) => (
              <Link
                key={genre}
                to={`/movies?genre=${encodeURIComponent(genre)}`}
                className="card-glass"
                style={{
                  padding: '1.15rem 1rem',
                  textAlign: 'center',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.45rem',
                  border: '1px solid var(--border-subtle)',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.background = 'var(--primary-subtle)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'var(--bg-card)';
                }}
              >
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                  {genre}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Explore titles
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. Coming Soon Section */}
        <section className="section-wrapper" aria-labelledby="coming-soon-heading">
          <div className="section-header">
            <div>
              <h2 id="coming-soon-heading" className="section-title">
                Coming Soon to IMovies
              </h2>
              <p className="section-subtitle">
                Mark your calendar for upcoming major cinematic events and premieres
              </p>
            </div>
            <Link to="/movies?status=coming_soon" className="view-all-link">
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="movie-grid">
            {comingSoonMovies.slice(0, 4).map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
