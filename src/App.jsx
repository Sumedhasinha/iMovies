// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { WatchlistProvider } from './context/WatchlistContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import Checkout from './pages/Checkout';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';

import './styles/global.css';
import './styles/components.css';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <WatchlistProvider>
          <BookingProvider>
            <Router>
              <ScrollToTop />
              <div className="app-container">
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/movies/:id" element={<MovieDetails />} />
                    <Route path="/booking/:movieId" element={<SeatSelection />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
                    <Route path="/bookings" element={<MyBookings />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <Toast />
              </div>
            </Router>
          </BookingProvider>
        </WatchlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
