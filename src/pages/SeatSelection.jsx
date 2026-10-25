// src/pages/SeatSelection.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { getMovieById, getOccupiedSeats } from '../services/api';
import SeatGrid from '../components/SeatGrid';
import BookingSummary from '../components/BookingSummary';
import ConcessionsSelector from '../components/ConcessionsSelector';
import { ArrowLeft, MapPin, Calendar, Clock, Film, AlertTriangle } from 'lucide-react';

export default function SeatSelection() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const {
    activeBooking,
    seats,
    snacks,
    pricing,
    toggleSeat,
    clearSeats,
    removeSnack,
    startBooking
  } = useBooking();

  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [movieData, setMovieData] = useState(activeBooking.movie);

  // If user navigated directly via URL or refreshed without active booking
  useEffect(() => {
    async function initPage() {
      let currentMovie = activeBooking.movie;

      if (!currentMovie || currentMovie.id !== movieId) {
        const res = await getMovieById(movieId);
        if (res.success && res.data) {
          currentMovie = res.data;
          setMovieData(currentMovie);

          // If no theatre/showtime was set, pick default first available
          if (!activeBooking.theatre || !activeBooking.showtime) {
            const firstTheatre = currentMovie.theatres?.[0];
            const firstShowtime = firstTheatre?.showtimes?.[0];
            const today = new Date();
            const dateObj = {
              isoDate: today.toISOString().split('T')[0],
              dayName: 'Today',
              month: today.toLocaleDateString('en-US', { month: 'short' }),
              dayNumber: today.getDate()
            };

            startBooking({
              movie: currentMovie,
              theatre: {
                id: firstTheatre?.theatreId || 'th-1',
                name: 'Starlight IMAX Cinema & Lounge',
                location: 'Downtown Cultural Hub, Screen 1'
              },
              date: dateObj,
              showtime: firstShowtime || {
                time: '06:30 PM',
                format: 'Laser IMAX',
                priceStandard: 16.0,
                pricePremium: 21.0,
                priceVIP: 28.0
              }
            });
          }
        }
      } else {
        setMovieData(currentMovie);
      }

      // Fetch occupied seats for this showtime combination
      const showtimeKey = `${movieId}_${activeBooking.theatre?.id || 'th-1'}_${activeBooking.date?.isoDate || 'today'}_${activeBooking.showtime?.time || 'slot'}`;
      const showtimeId = activeBooking.showtime?._id || activeBooking.showtime?.id || null;
      try {
        const occRes = await getOccupiedSeats(showtimeKey, showtimeId);
        if (occRes.success) {
          setOccupiedSeats(occRes.data || []);
        }
      } catch (err) {
        console.error('Error fetching occupied seats:', err);
      } finally {
        setLoadingSeats(false);
      }
    }

    initPage();
  }, [movieId, activeBooking.theatre?.id, activeBooking.showtime?.time]);

  const handleProceedToCheckout = () => {
    if (seats.length > 0) {
      navigate('/checkout');
    }
  };

  const currentTheatre = activeBooking.theatre || {
    name: 'Starlight IMAX Cinema & Lounge',
    location: 'Downtown Cultural Hub, Screen 1'
  };

  const currentDate = activeBooking.date || {
    dayName: 'Today',
    month: 'Oct',
    dayNumber: 24
  };

  const currentShowtime = activeBooking.showtime || {
    time: '06:30 PM',
    format: 'Laser IMAX',
    priceStandard: 16.0,
    pricePremium: 21.0,
    priceVIP: 28.0
  };

  return (
    <div className="seat-booking-view">
      <div className="container">
        {/* Back and Title Navigation Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              to={`/movies/${movieId}`}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.4rem' }}
            >
              <ArrowLeft size={16} />
              <span>Back to Showtimes</span>
            </Link>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
                Select Seats — {movieData?.title || 'Cinema Screening'}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.82rem', color: 'var(--text-muted)', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fff', fontWeight: 600 }}>
                  <MapPin size={13} color="var(--primary)" />
                  {currentTheatre.name}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={13} />
                  {currentDate.dayName}, {currentDate.month} {currentDate.dayNumber}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-gold)' }}>
                  <Clock size={13} />
                  {currentShowtime.time} ({currentShowtime.format})
                </span>
              </div>
            </div>
          </div>

          {seats.length > 0 && (
            <button
              onClick={clearSeats}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--primary)', fontSize: '0.82rem' }}
            >
              Clear Selected ({seats.length})
            </button>
          )}
        </div>

        {/* 2-Column Layout: Interactive Seat Grid & Sticky Summary */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 360px',
            gap: '2.5rem',
            alignItems: 'start'
          }}
        >
          {/* Main Seat Map Area & Concessions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div
              className="card-glass"
              style={{
                padding: '2rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                overflow: 'hidden'
              }}
            >
              <SeatGrid
                selectedSeats={seats}
                occupiedSeats={occupiedSeats}
                onToggleSeat={toggleSeat}
                showtimePrices={currentShowtime}
              />
            </div>

            {/* Optional Cinema Concessions Bar */}
            <ConcessionsSelector />
          </div>

          {/* Sticky Booking Summary Panel */}
          <div style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 1.5rem)' }}>
            <BookingSummary
              movie={movieData}
              theatre={currentTheatre}
              date={currentDate}
              showtime={currentShowtime}
              selectedSeats={seats}
              snacks={snacks}
              pricing={pricing}
              onRemoveSeat={toggleSeat}
              onRemoveSnack={removeSnack}
              onProceed={handleProceedToCheckout}
              isProceedDisabled={seats.length === 0}
              ctaText={`Checkout (${seats.length} Seats)`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
