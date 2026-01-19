import { create } from 'zustand';
import { favoritesApi } from '../services/api';

const useFavoritesStore = create((set, get) => ({
  favoriteMovies: [],
  favoriteAnime: [],
  isLoading: false,
  error: null,

  // Fetch favorites
  fetchFavoriteMovies: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await favoritesApi.getFavoriteMovies();
      set({ favoriteMovies: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch favorites', isLoading: false });
    }
  },

  fetchFavoriteAnime: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await favoritesApi.getFavoriteAnime();
      set({ favoriteAnime: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch favorites', isLoading: false });
    }
  },

  // Add to favorites
  addFavoriteMovie: async (movieData) => {
    try {
      const response = await favoritesApi.addFavoriteMovie(movieData);
      set({ favoriteMovies: response.data.favorites });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add favorite';
      return { success: false, message };
    }
  },

  addFavoriteAnime: async (animeData) => {
    try {
      const response = await favoritesApi.addFavoriteAnime(animeData);
      set({ favoriteAnime: response.data.favorites });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add favorite';
      return { success: false, message };
    }
  },

  // Remove from favorites
  removeFavoriteMovie: async (movieId) => {
    try {
      const response = await favoritesApi.removeFavoriteMovie(movieId);
      set({ favoriteMovies: response.data.favorites });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove favorite';
      return { success: false, message };
    }
  },

  removeFavoriteAnime: async (animeId) => {
    try {
      const response = await favoritesApi.removeFavoriteAnime(animeId);
      set({ favoriteAnime: response.data.favorites });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove favorite';
      return { success: false, message };
    }
  },

  // Check if item is favorited
  isMovieFavorited: (movieId) => {
    const { favoriteMovies } = get();
    return favoriteMovies.some(movie => movie.movieId === movieId);
  },

  isAnimeFavorited: (animeId) => {
    const { favoriteAnime } = get();
    return favoriteAnime.some(anime => anime.animeId === animeId);
  },

  clearError: () => set({ error: null }),
}));

export default useFavoritesStore;
