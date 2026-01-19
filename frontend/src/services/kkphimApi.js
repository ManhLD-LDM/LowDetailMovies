import axios from 'axios';

// PhimAPI - Anime Vietsub API
const PHIMAPI_BASE_URL = 'https://phimapi.com';
const CDN_IMAGE_URL = 'https://phimimg.com';

const phimApiClient = axios.create({
  baseURL: PHIMAPI_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Transform data to consistent format
const transformAnime = (item) => ({
  id: item._id,
  slug: item.slug,
  name: item.name,
  origin_name: item.origin_name,
  poster: item.poster_url ? `${CDN_IMAGE_URL}/${item.poster_url}` : null,
  thumb_url: item.thumb_url ? `${CDN_IMAGE_URL}/${item.thumb_url}` : null,
  year: item.year,
  quality: item.quality,
  lang: item.lang,
  time: item.time,
  episode_current: item.episode_current,
  category: item.category?.map(c => c.name) || [],
  country: item.country?.map(c => c.name) || [],
  type: item.type || 'single', // Store original type from API
});

// Predefined categories list
const CATEGORIES = [
  {"_id":"9822be111d2ccc29c7172c78b8af8ff5","name":"Hành Động","slug":"hanh-dong"},
  {"_id":"d111447ee87ec1a46a31182ce4623662","name":"Miền Tây","slug":"mien-tay"},
  {"_id":"0c853f6238e0997ee318b646bb1978bc","name":"Trẻ Em","slug":"tre-em"},
  {"_id":"f8ec3e9b77c509fdf64f0c387119b916","name":"Lịch Sử","slug":"lich-su"},
  {"_id":"3a17c7283b71fa84e5a8d76fb790ed3e","name":"Cổ Trang","slug":"co-trang"},
  {"_id":"1bae5183d681b7649f9bf349177f7123","name":"Chiến Tranh","slug":"chien-tranh"},
  {"_id":"68564911f00849030f9c9c144ea1b931","name":"Viễn Tưởng","slug":"vien-tuong"},
  {"_id":"4db8d7d4b9873981e3eeb76d02997d58","name":"Kinh Dị","slug":"kinh-di"},
  {"_id":"1645fa23fa33651cef84428b0dcc2130","name":"Tài Liệu","slug":"tai-lieu"},
  {"_id":"2fb53017b3be83cd754a08adab3e916c","name":"Bí Ẩn","slug":"bi-an"},
  {"_id":"4b4457a1af8554c282dc8ac41fd7b4a1","name":"Phim 18+","slug":"phim-18"},
  {"_id":"bb2b4b030608ca5984c8dd0770f5b40b","name":"Tình Cảm","slug":"tinh-cam"},
  {"_id":"a7b065b92ad356387ef2e075dee66529","name":"Tâm Lý","slug":"tam-ly"},
  {"_id":"591bbb2abfe03f5aa13c08f16dfb69a2","name":"Thể Thao","slug":"the-thao"},
  {"_id":"66c78b23908113d478d8d85390a244b4","name":"Phiêu Lưu","slug":"phieu-luu"},
  {"_id":"252e74b4c832ddb4233d7499f5ed122e","name":"Âm Nhạc","slug":"am-nhac"},
  {"_id":"a2492d6cbc4d58f115406ca14e5ec7b6","name":"Gia Đình","slug":"gia-dinh"},
  {"_id":"01c8abbb7796a1cf1989616ca5c175e6","name":"Học Đường","slug":"hoc-duong"},
  {"_id":"ba6fd52e5a3aca80eaaf1a3b50a182db","name":"Hài Hước","slug":"hai-huoc"},
  {"_id":"7a035ac0b37f5854f0f6979260899c90","name":"Hình Sự","slug":"hinh-su"},
  {"_id":"578f80eb493b08d175c7a0c29687cbdf","name":"Võ Thuật","slug":"vo-thuat"},
  {"_id":"0bcf4077916678de9b48c89221fcf8ae","name":"Khoa Học","slug":"khoa-hoc"},
  {"_id":"2276b29204c46f75064735477890afd6","name":"Thần Thoại","slug":"than-thoai"},
  {"_id":"37a7b38b6184a5ebd3c43015aa20709d","name":"Chính Kịch","slug":"chinh-kich"},
  {"_id":"268385d0de78827ff7bb25c35036ee2a","name":"Kinh Điển","slug":"kinh-dien"},
  {"_id":"4f02d28224c0747511790d57fbb63a62","name":"Phim Ngắn","slug":"phim-ngan"}
];

export const kkphimApi = {
  // Get latest updated anime (newest first)
  getLatestAnime: async (page = 1, limit = 24) => {
    const response = await phimApiClient.get(`/danh-sach/phim-moi-cap-nhat`, {
      params: { page, limit, type: 'hoathinh' },
    });
    const data = response.data?.items;
    return {
      data: data?.map(transformAnime) || [],
      pagination: response.data?.pagination || {},
    };
  },

  // Get latest updated movies (newest first)
  getLatestMovies: async (page = 1, limit = 24) => {
    const response = await phimApiClient.get(`/danh-sach/phim-moi-cap-nhat`, {
      params: { page, limit },
    });
    const data = response.data?.items;
    return {
      data: data?.map(transformAnime) || [],
      pagination: response.data?.pagination || {},
    };
  },

  // Get all anime (paginated)
  getAllAnime: async (page = 1, limit = 24) => {
    const response = await phimApiClient.get(`/v1/api/danh-sach/hoat-hinh`, {
      params: { page, limit },
    });
    const data = response.data?.data;
    return {
      data: data?.items?.map(transformAnime) || [],
      pagination: data?.params?.pagination || {},
    };
  },

  // Get all movies - phim lẻ (single movies)
  getAllMovies: async (page = 1, limit = 24) => {
    const response = await phimApiClient.get(`/v1/api/danh-sach/phim-le`, {
      params: { page, limit },
    });
    const data = response.data?.data;
    return {
      data: data?.items?.map(transformAnime) || [],
      pagination: data?.params?.pagination || {},
    };
  },

  // Get all TV series - phim bộ
  getAllTVSeries: async (page = 1, limit = 24) => {
    const response = await phimApiClient.get(`/v1/api/danh-sach/phim-bo`, {
      params: { page, limit },
    });
    const data = response.data?.data;
    return {
      data: data?.items?.map(transformAnime) || [],
      pagination: data?.params?.pagination || {},
    };
  },

  // Get all movies (both phim lẻ and phim bộ combined)
  getAllMoviesAndSeries: async (page = 1, limit = 24) => {
    try {
      // Fetch both movies and TV series
      const [moviesRes, seriesRes] = await Promise.all([
        phimApiClient.get(`/v1/api/danh-sach/phim-le`, { params: { page, limit: Math.ceil(limit / 2) } }),
        phimApiClient.get(`/v1/api/danh-sach/phim-bo`, { params: { page, limit: Math.ceil(limit / 2) } }),
      ]);
      
      const moviesData = moviesRes.data?.data?.items?.map(item => ({ ...transformAnime(item), type: 'single' })) || [];
      const seriesData = seriesRes.data?.data?.items?.map(item => ({ ...transformAnime(item), type: 'series' })) || [];
      
      // Combine and shuffle
      const combined = [...moviesData, ...seriesData];
      
      return {
        data: combined,
        pagination: moviesRes.data?.data?.params?.pagination || {},
      };
    } catch (error) {
      console.error('Error fetching movies and series:', error);
      return { data: [], pagination: {} };
    }
  },

  // Search anime by keyword
  searchAnime: async (keyword) => {
    const response = await phimApiClient.get(`/v1/api/tim-kiem`, {
      params: { keyword },
    });
    const data = response.data?.data;
    return {
      data: data?.items?.map(transformAnime) || [],
      pagination: data?.params?.pagination || {},
    };
  },

  // Get anime detail by slug
  getAnimeDetail: async (slug) => {
    const response = await phimApiClient.get(`/phim/${slug}`);
    const movie = response.data?.movie;
    const episodes = response.data?.episodes || [];
    
    // Transform episodes for easier use
    const transformedEpisodes = [];
    
    // Episodes is an array of server objects
    episodes.forEach(server => {
      // Each server has server_data array with episodes
      const serverData = server.server_data || [];
      serverData.forEach(ep => {
        // Avoid duplicate episodes with same name
        const exists = transformedEpisodes.find(e => e.name === ep.name);
        if (!exists) {
          transformedEpisodes.push({
            name: ep.name,
            slug: ep.slug,
            filename: ep.filename,
            link_embed: ep.link_embed,
            link_m3u8: ep.link_m3u8,
          });
        }
      });
    });

    return {
      data: movie ? {
        id: movie._id,
        slug: movie.slug,
        name: movie.name,
        origin_name: movie.origin_name,
        content: movie.content,
        type: movie.type, // Add type field to identify anime/movie/series
        poster: movie.poster_url || movie.thumb_url || null,
        thumb_url: movie.thumb_url || movie.poster_url || null,
        poster_url: movie.poster_url || movie.thumb_url || null,
        year: movie.year,
        quality: movie.quality,
        lang: movie.lang,
        time: movie.time,
        episode_current: movie.episode_current,
        episode_total: movie.episode_total,
        category: movie.category?.map(c => c.name) || [],
        country: movie.country?.map(c => c.name) || [],
        actor: movie.actor || [],
        director: movie.director || [],
        episodes: transformedEpisodes,
      } : null,
    };
  },

  // Get all categories/tags
  getAllCategories: async () => {
    try {
      // Return predefined categories list
      return [...CATEGORIES].sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Filter anime by categories
  filterAnimeByCategories: async (categoryObjects, page = 1, limit = 24) => {
    try {
      // Always use anime-specific endpoint to ensure we only get anime
      const response = await phimApiClient.get(`/v1/api/danh-sach/hoat-hinh`, {
        params: { page, limit: 50 },
      });
      
      const items = response.data?.data?.items || [];
      
      // If specific categories selected, filter by them
      if (categoryObjects.length > 0) {
        const categoryNames = categoryObjects.map(c => c.name);
        
        const filtered = items.filter(item => {
          const itemCategories = item.category?.map(c => c.name) || [];
          // Item must have ALL selected categories
          return categoryNames.every(cat => itemCategories.includes(cat));
        });
        
        const paginatedResults = filtered.slice(0, limit);
        
        return {
          data: paginatedResults.map(transformAnime),
          pagination: response.data?.data?.params?.pagination || {},
          totalFiltered: filtered.length,
        };
      }
      
      // No specific categories, return all anime
      return {
        data: items.slice(0, limit).map(transformAnime),
        pagination: response.data?.data?.params?.pagination || {},
        totalFiltered: items.length,
      };
    } catch (error) {
      console.error('Error filtering anime:', error);
      return { data: [], pagination: {}, totalFiltered: 0 };
    }
  },

  // Get all categories/tags for movies
  getAllMovieCategories: async () => {
    try {
      // Return predefined categories list
      return [...CATEGORIES].sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error fetching movie categories:', error);
      return [];
    }
  },

  // Filter movies by categories
  filterMoviesByCategories: async (categoryObjects, page = 1, limit = 24) => {
    try {
      // Fetch both phim lẻ and phim bộ (excluding anime)
      const [moviesRes, seriesRes] = await Promise.all([
        phimApiClient.get(`/v1/api/danh-sach/phim-le`, { params: { page, limit: 50 } }),
        phimApiClient.get(`/v1/api/danh-sach/phim-bo`, { params: { page, limit: 50 } }),
      ]);
      
      const moviesItems = moviesRes.data?.data?.items || [];
      const seriesItems = seriesRes.data?.data?.items || [];
      let allItems = [...moviesItems, ...seriesItems];
      
      // If specific categories selected, filter by them
      if (categoryObjects.length > 0) {
        const categoryNames = categoryObjects.map(c => c.name);
        
        allItems = allItems.filter(item => {
          const itemCategories = item.category?.map(c => c.name) || [];
          // Item must have ALL selected categories
          return categoryNames.every(cat => itemCategories.includes(cat));
        });
      }
      
      const paginatedResults = allItems.slice(0, limit);
      
      return {
        data: paginatedResults.map(transformAnime),
        pagination: moviesRes.data?.data?.params?.pagination || {},
        totalFiltered: allItems.length,
      };
    } catch (error) {
      console.error('Error filtering movies:', error);
      return { data: [], pagination: {}, totalFiltered: 0 };
    }
  },
};
