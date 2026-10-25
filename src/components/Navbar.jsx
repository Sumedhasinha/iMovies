// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { MOVIES } from '../data/movies';
import {
  Film,
  Search,
  Ticket,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  Sparkles,
  ChevronDown,
  Heart,
  Star
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, quickDemoLogin } = useAuth();
  const { favoritesCount } = useWatchlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  // Compute live search suggestions
  const searchSuggestions = navSearch.trim().length > 0
    ? MOVIES.filter((m) =>
        m.title.toLowerCase().includes(navSearch.toLowerCase()) ||
        m.genre.some((g) => g.toLowerCase().includes(navSearch.toLowerCase()))
      ).slice(0, 4)
    : [];

  // Close profile dropdown & search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/movies?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
      setSearchFocused(false);
      setMobileMenuOpen(false);
    }
  };

  const handleSelectSuggestion = (movieId) => {
    navigate(`/movies/${movieId}`);
    setNavSearch('');
    setSearchFocused(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" aria-label="IMovies Home">
          <div className="brand-icon-box">
            <Film size={20} color="#ffffff" />
          </div>
          <span>
            I<span className="brand-highlight">MOVIES</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Primary Navigation">
          <ul className="nav-links">
            <li className="nav-link-item">
              <NavLink to="/" end>
                <Compass size={16} />
                <span>Home</span>
              </NavLink>
            </li>
            <li className="nav-link-item">
              <NavLink to="/movies">
                <Film size={16} />
                <span>Movies</span>
              </NavLink>
            </li>
            <li className="nav-link-item">
              <NavLink to="/bookings">
                <Ticket size={16} />
                <span>My Bookings</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Right Actions: Search Bar, Watchlist, Auth & Mobile Menu */}
        <div className="nav-right-actions">
          {/* Quick Search Container with Live Suggestions */}
          <div style={{ position: 'relative' }} ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search blockbusters..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                aria-label="Search movies"
                style={{
                  background: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.45rem 1rem 0.45rem 2.2rem',
                  color: '#fff',
                  fontSize: '0.84rem',
                  width: searchFocused ? '240px' : '180px',
                  transition: 'width 200ms ease, border-color 200ms ease'
                }}
              />
              <Search
                size={14}
                color="var(--text-muted)"
                style={{
                  position: 'absolute',
                  left: '0.8rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}
              />
            </form>

            {/* Live Autocomplete Suggestions Dropdown */}
            {searchFocused && searchSuggestions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '300px',
                  background: '#131724',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.5rem',
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}
              >
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', padding: '0.25rem 0.5rem' }}>
                  Movie Suggestions
                </div>
                {searchSuggestions.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleSelectSuggestion(m.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background 120ms ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <img
                      src={m.poster}
                      alt={m.title}
                      style={{ width: '32px', height: '46px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {m.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-gold)' }}>
                          <Star size={11} fill="var(--accent-gold)" />
                          {m.rating}
                        </span>
                        <span>•</span>
                        <span>{m.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Watchlist Quick Pill */}
          <Link
            to="/movies?status=watchlist"
            className="btn btn-secondary btn-sm hide-mobile"
            title="View Saved Watchlist"
            style={{
              padding: '0.4rem 0.7rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem'
            }}
          >
            <Heart size={14} color="var(--primary)" fill={favoritesCount > 0 ? 'var(--primary)' : 'none'} />
            <span>Watchlist</span>
            {favoritesCount > 0 && (
              <span
                style={{
                  background: 'var(--primary)',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '0.1rem 0.45rem',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}
              >
                {favoritesCount}
              </span>
            )}
          </Link>

          {/* User Profile or Login */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem'
                }}
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'}
                  alt={user.name}
                  style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                  {user.name?.split(' ')[0]}
                </span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {profileDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '210px',
                    background: '#131724',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.5rem',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}
                >
                  <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                    <div style={{ marginTop: '0.35rem' }}>
                      <span className="badge badge-crimson" style={{ fontSize: '0.65rem' }}>VIP Cinema Pass</span>
                    </div>
                  </div>

                  <Link
                    to="/bookings"
                    onClick={() => setProfileDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem',
                      fontSize: '0.85rem',
                      color: 'var(--text-primary)',
                      borderRadius: '4px'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Ticket size={16} color="var(--primary)" />
                    <span>My Bookings</span>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem',
                      fontSize: '0.85rem',
                      color: 'var(--status-error)',
                      borderRadius: '4px',
                      width: '100%',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={quickDemoLogin}
                className="btn btn-secondary btn-sm"
                title="Log in instantly as Demo VIP user"
                style={{ fontSize: '0.78rem', gap: '0.35rem' }}
              >
                <Sparkles size={13} color="var(--accent-gold)" />
                <span className="hide-mobile">Demo VIP</span>
              </button>
              <Link to="/login" className="btn btn-primary btn-sm">
                <User size={15} />
                <span>Sign In</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            className="mobile-menu-toggle btn-icon"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              borderRadius: '6px',
              color: isActive ? 'var(--primary)' : '#fff',
              background: isActive ? 'var(--primary-subtle)' : 'transparent',
              fontWeight: 600
            })}
          >
            <Compass size={18} />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/movies"
            onClick={() => setMobileMenuOpen(false)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              borderRadius: '6px',
              color: isActive ? 'var(--primary)' : '#fff',
              background: isActive ? 'var(--primary-subtle)' : 'transparent',
              fontWeight: 600
            })}
          >
            <Film size={18} />
            <span>Movies</span>
          </NavLink>

          <NavLink
            to="/bookings"
            onClick={() => setMobileMenuOpen(false)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              borderRadius: '6px',
              color: isActive ? 'var(--primary)' : '#fff',
              background: isActive ? 'var(--primary-subtle)' : 'transparent',
              fontWeight: 600
            })}
          >
            <Ticket size={18} />
            <span>My Bookings</span>
          </NavLink>

          {!isAuthenticated && (
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link
                to="/login"
                className="btn btn-primary btn-block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
