// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ShieldCheck, Heart, Sparkles, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <Link to="/" className="brand-logo" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              <div className="brand-icon-box">
                <Film size={20} color="#ffffff" />
              </div>
              <span>
                I<span className="brand-highlight">MOVIES</span>
              </span>
            </Link>
            <p style={{ maxWidth: '320px', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              The premiere cinematic ticketing destination. Discover groundbreaking releases, reserve precision acoustics in Dolby Atmos, and secure luxury seating in seconds.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <ShieldCheck size={16} color="var(--status-success)" />
              <span>Simulated High-Security Demo Checkout</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Discover
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li>
                <Link to="/movies?status=now_showing" style={{ color: 'var(--text-secondary)' }}>
                  Now Showing
                </Link>
              </li>
              <li>
                <Link to="/movies?status=trending" style={{ color: 'var(--text-secondary)' }}>
                  Trending Blockbusters
                </Link>
              </li>
              <li>
                <Link to="/movies?status=coming_soon" style={{ color: 'var(--text-secondary)' }}>
                  Coming Soon
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=Sci-Fi" style={{ color: 'var(--text-secondary)' }}>
                  Sci-Fi & IMAX 3D
                </Link>
              </li>
            </ul>
          </div>

          {/* Formats & Cinemas */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Cinema Tech
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <li>IMAX® with Laser 4K</li>
              <li>Dolby Cinema™ & Atmos</li>
              <li>4DX Extreme Motion</li>
              <li>VIP Leather Recliners</li>
              <li>Private Screening Suites</li>
            </ul>
          </div>

          {/* Newsletter Demo & App status */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              VIP Premiere Club
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
              Receive exclusive advance ticket drops, zero convenience fees on VIP Tuesdays, and private screener invites.
            </p>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="email"
                placeholder="Enter email..."
                className="form-input"
                style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                aria-label="Email address for cinema newsletter"
                readOnly
                value="demo-subscriber@imovies.vip"
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={() => alert('Demo: Subscribed to IMovies VIP alerts!')}
                aria-label="Subscribe"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} IMovies Cinema Network. All rights reserved. Built for developer portfolio demonstration.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
              Crafted with <Heart size={14} color="var(--primary)" fill="var(--primary)" /> & React + Vite
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
