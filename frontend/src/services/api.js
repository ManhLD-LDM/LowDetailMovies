import axios from 'axios';

// Sử dụng /api để proxy qua Vite, hoặc full URL nếu được set
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const movieApi = {
  getAll: (page = 0, size = 20) => api.get(`/movies?page=${page}&size=${size}`),
  getById: (id) => api.get(`/movies/${id}`),
  getByType: (type, page = 0, size = 20) => api.get(`/movies/type/${type}?page=${page}&size=${size}`),
  getByGenre: (genreId, page = 0, size = 20) => api.get(`/movies/genre/${genreId}?page=${page}&size=${size}`),
  search: (keyword, page = 0, size = 20) => api.get(`/movies/search?keyword=${keyword}&page=${page}&size=${size}`),
  getTopViewed: () => api.get('/movies/top-viewed'),
  getLatest: () => api.get('/movies/latest'),
  getTopRated: () => api.get('/movies/top-rated'),
  incrementView: (id) => api.post(`/movies/${id}/view`),
};

export const genreApi = {
  getAll: () => api.get('/genres'),
  getById: (id) => api.get(`/genres/${id}`),
};

export const episodeApi = {
  getByMovieId: (movieId) => api.get(`/episodes/movie/${movieId}`),
  getById: (id) => api.get(`/episodes/${id}`),
  getByMovieAndNumber: (movieId, episodeNumber) =>
    api.get(`/episodes/movie/${movieId}/episode/${episodeNumber}`),
  incrementView: (id) => api.post(`/episodes/${id}/view`),
};



export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
};

export const favoritesApi = {
  // Movies
  getFavoriteMovies: () => api.get('/favorites/movies'),
  addFavoriteMovie: (movieData) => api.post('/favorites/movies', movieData),
  removeFavoriteMovie: (movieId) => api.delete(`/favorites/movies/${movieId}`),
  // Anime
  getFavoriteAnime: () => api.get('/favorites/anime'),
  addFavoriteAnime: (animeData) => api.post('/favorites/anime', animeData),
  removeFavoriteAnime: (animeId) => api.delete(`/favorites/anime/${animeId}`),
};

export const animeApi = {
  searchJikan: (query) => api.get(`/anime/search/jikan?query=${query}`),
  syncAnime: (limit = 50) => api.post(`/anime/sync?limit=${limit}`),
  getJikanAnime: (animeId) => api.get(`/anime/jikan/${animeId}`),
  getTopAnime: (type = 'tv', limit = 25) => api.get(`/anime/top?type=${type}&limit=${limit}`),
  getSeasonalAnime: (season, year = 2024) => api.get(`/anime/seasonal?season=${season}&year=${year}`),
  // Video sources
  getOphimVideoSource: (slug) => api.get(`/anime/video/ophim/${slug}`),
  getKkphimVideoSource: (slug) => api.get(`/anime/video/kkphim/${slug}`),
  getOphimLatest: (page = 1) => api.get(`/anime/latest/ophim?page=${page}`),
  getKkphimByType: (type = 'anime', page = 1) => api.get(`/anime/list/kkphim?type=${type}&page=${page}`),
};

export default api;
