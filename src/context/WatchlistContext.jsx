// src/context/WatchlistContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { useToast } from './ToastContext';

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState(() => {
    return storage.get(STORAGE_KEYS.FAVORITES, []);
  });

  useEffect(() => {
    storage.set(STORAGE_KEYS.FAVORITES, favorites);
  }, [favorites]);

  const isFavorite = (movieId) => {
    return favorites.some((f) => (typeof f === 'string' ? f === movieId : f.id === movieId));
  };

  const toggleFavorite = (movie) => {
    const movieId = typeof movie === 'string' ? movie : movie.id;
    const movieTitle = typeof movie === 'object' ? movie.title : 'Movie';

    if (isFavorite(movieId)) {
      setFavorites((prev) => prev.filter((f) => (typeof f === 'string' ? f !== movieId : f.id !== movieId)));
      toast.info(`Removed "${movieTitle}" from Watchlist`);
    } else {
      const itemToSave = typeof movie === 'object' ? movie : { id: movieId };
      setFavorites((prev) => [...prev, itemToSave]);
      toast.success(`Saved "${movieTitle}" to Watchlist!`);
    }
  };

  return (
    <WatchlistContext.Provider
      value={{
        favorites,
        favoritesCount: favorites.length,
        isFavorite,
        toggleFavorite
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider');
  return ctx;
}
