import axios from 'axios';

// Jikan API v4 - Free MyAnimeList API
const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

const jikanClient = axios.create({
  baseURL: JIKAN_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Rate limiting - Jikan has a limit of 3 requests per second
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 350; // ms between requests

const rateLimitedRequest = async (requestFn) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => 
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }
  
  lastRequestTime = Date.now();
  return requestFn();
};

// Transform Jikan anime data to our app format
const transformAnime = (anime) => ({
  id: anime.mal_id,
  title: anime.title,
  originalTitle: anime.title_japanese || anime.title,
  description: anime.synopsis || 'No description available',
  posterUrl: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
  backdropUrl: anime.images?.jpg?.large_image_url,
  trailerUrl: anime.trailer?.url,
  trailerEmbed: anime.trailer?.embed_url,
  releaseYear: anime.year || (anime.aired?.from ? new Date(anime.aired.from).getFullYear() : null),
  duration: anime.duration,
  rating: anime.score || 0,
  viewCount: anime.members || 0,
  episodes: anime.episodes || 0,
  status: anime.status,
  type: 'ANIME',
  genres: anime.genres?.map(g => ({ id: g.mal_id, name: g.name })) || [],
  studios: anime.studios?.map(s => s.name) || [],
  source: anime.source,
  airing: anime.airing,
  rank: anime.rank,
  popularity: anime.popularity,
});

export const jikanApi = {
  // Get top anime (airing, upcoming, popular, favorite)
  getTopAnime: async (filter = 'airing', page = 1, limit = 25) => {
    return rateLimitedRequest(async () => {
      const response = await jikanClient.get('/top/anime', {
        params: { filter, page, limit }
      });
      return {
        data: response.data.data.map(transformAnime),
        pagination: response.data.pagination
      };
    });
  },

  // Get anime by ID
  getAnimeById: async (id) => {
    return rateLimitedRequest(async () => {
      const response = await jikanClient.get(`/anime/${id}`);
      return { data: transformAnime(response.data.data) };
    });
  },

  // Get anime episodes
  getAnimeEpisodes: async (id, page = 1) => {
    return rateLimitedRequest(async () => {
      const response = await jikanClient.get(`/anime/${id}/episodes`, {
        params: { page }
      });
      return {
        data: response.data.data.map(ep => ({
          id: ep.mal_id,
          episodeNumber: ep.mal_id,
          title: ep.title || `Episode ${ep.mal_id}`,
          titleJapanese: ep.title_japanese,
          titleRomanji: ep.title_romanji,
          aired: ep.aired,
          filler: ep.filler,
          recap: ep.recap,
        })),
        pagination: response.data.pagination
      };
    });
  },

  // Search anime
  searchAnime: async (query, page = 1, limit = 25) => {
    return rateLimitedRequest(async () => {
      const response = await jikanClient.get('/anime', {
        params: { q: query, page, limit, sfw: true }
      });
      return {
        data: response.data.data.map(transformAnime),
        pagination: response.data.pagination
      };
    });
  },

  // Get anime by genre
  getAnimeByGenre: async (genreId, page = 1, limit = 25) => {
    return rateLimitedRequest(async () => {
      const response = await jikanClient.get('/anime', {
        params: { genres: genreId, page, limit, order_by: 'score', sort: 'desc', sfw: true }
      });
      return {
        data: response.data.data.map(transformAnime),
        pagination: response.data.pagination
      };
    });
  },

  // Get seasonal anime
  getSeasonalAnime: async (year, season) => {
    return rateLimitedRequest(async () => {
      const response = await jikanClient.get(`/seasons/${year}/${season}`);
      return {
        data: response.data.data.map(transformAnime),
        pagination: response.data.pagination
      };
    });
  },

  // Get current season anime
  getCurrentSeason: async (page = 1) => {
    return rateLimitedRequest(async () => {
      const response = await jikanClient.get('/seasons/now', {
        params: { page }
      });
      return {
        data: response.data.data.map(transformAnime),
        pagination: response.data.pagination
      };
    });
  },

  // Get upcoming anime
  getUpcomingAnime: async (page = 1) => {
    return rateLimitedRequest(async () => {
      const response = await jikanClient.get('/seasons/upcoming', {
        params: { page }
      });
      return {
        data: response.data.data.map(transformAnime),
        pagination: response.data.pagination
      };
    });
  },

  // Get all genres
  getGenres: async () => {
    return rateLimitedRequest(async () => {
      const response = await jikanClient.get('/genres/anime');
      return {
        data: response.data.data.map(g => ({
          id: g.mal_id,
          name: g.name,
          count: g.count
        }))
      };
    });
  },

  // Get anime recommendations
  getAnimeRecommendations: async (id) => {
    return rateLimitedRequest(async () => {
      const response = await jikanClient.get(`/anime/${id}/recommendations`);
      return {
        data: response.data.data.slice(0, 10).map(rec => ({
          ...transformAnime(rec.entry),
          votes: rec.votes
        }))
      };
    });
  },

  // Get random anime
  getRandomAnime: async () => {
    return rateLimitedRequest(async () => {
      const response = await jikanClient.get('/random/anime');
      return { data: transformAnime(response.data.data) };
    });
  },

  // Get anime streaming links (external)
  getAnimeStreaming: async (id) => {
    return rateLimitedRequest(async () => {
      const response = await jikanClient.get(`/anime/${id}/streaming`);
      return { data: response.data.data };
    });
  },

  // Get anime videos (trailers, promos, episodes)
  getAnimeVideos: async (id) => {
    return rateLimitedRequest(async () => {
      const response = await jikanClient.get(`/anime/${id}/videos`);
      return { 
        data: {
          promos: response.data.data.promo || [],
          episodes: response.data.data.episodes || [],
          musicVideos: response.data.data.music_videos || []
        }
      };
    });
  },
};

export default jikanApi;
