// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard, Home, Film } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - var(--navbar-height))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center'
      }}
    >
      <div className="card-glass" style={{ maxWidth: '480px', padding: '3.5rem 2rem', borderRadius: 'var(--radius-lg)' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(229, 9, 20, 0.1)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            border: '1px solid rgba(229, 9, 20, 0.3)'
          }}
        >
          <Clapperboard size={32} color="var(--primary)" />
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '0.75rem' }}>
          Cut! Scene Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '2rem' }}>
          The scene or page you are looking for has been trimmed from the final reel. Let's get you back to the main feature.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary" style={{ gap: '0.4rem' }}>
            <Home size={16} />
            <span>Return Home</span>
          </Link>
          <Link to="/movies" className="btn btn-secondary" style={{ gap: '0.4rem' }}>
            <Film size={16} />
            <span>Browse Catalogue</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
