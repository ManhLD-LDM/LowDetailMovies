import { useEffect, useRef, useState } from 'react';
import { FiCalendar, FiClock, FiHeart, FiStar, FiTv, FiX } from 'react-icons/fi';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import VideoPlayer from '../components/VideoPlayer';
import { kkphimApi } from '../services/kkphimApi';
import useAuthStore from '../stores/authStore';
import useFavoritesStore from '../stores/favoritesStore';

// CDN Image URL
const CDN_IMAGE_URL = 'https://phimimg.com';

function AnimeDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const playerRef = useRef(null);

  // Auth and Favorites
  const { isAuthenticated } = useAuthStore();
  const {
    favoriteAnime, addFavoriteAnime, removeFavoriteAnime, isAnimeFavorited, fetchFavoriteAnime,
    favoriteMovies, addFavoriteMovie, removeFavoriteMovie, isMovieFavorited, fetchFavoriteMovies
  } = useFavoritesStore();

  // Detect if this is anime or movie based on URL path
  const isAnime = location.pathname.startsWith('/anime');

  // Check content type from API:
  // - type === 'hoathinh' → Hoạt Hình (Anime) → Save to anime favorites
  // - type === 'series' → Phim Bộ (Series) → Save to movie favorites
  // - type === 'single' → Phim Lẻ (Movie) → Save to movie favorites
  const isTrueAnime = anime?.type === 'hoathinh';

  // Determine if favorited based on content type
  const isFavorited = anime ? (isTrueAnime ? isAnimeFavorited(id) : isMovieFavorited(id)) : false;

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavoriteAnime();
      fetchFavoriteMovies();
    }
  }, [isAuthenticated]);

  // Fetch anime data
  useEffect(() => {
    const fetchAnimeData = async () => {
      setLoading(true);
      try {
        // Fetch anime detail from KKPhim (id is slug)
        const detail = await kkphimApi.getAnimeDetail(id);
        setAnime(detail.data || null);
        setEpisodes(detail.data?.episodes || []);
      } catch (error) {
        setAnime(null);
        setEpisodes([]);
        console.error('Error fetching anime:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchAnimeData();
    }
  }, [id]);

  // Sync player state with URL (handles back/forward + reload)
  useEffect(() => {
    const episodeParam = searchParams.get('ep');

    if (episodeParam && episodes.length > 0) {
      const urlEpisode = episodes.find(ep => ep.name === episodeParam || ep.slug === episodeParam);
      if (urlEpisode) {
        setSelectedEpisode(urlEpisode);
        setShowPlayer(true);
      }
    } else if (!episodeParam && episodes.length > 0) {
      setShowPlayer(false);
      setSelectedEpisode(null);
    }
  }, [searchParams, episodes]);

  // Handle episode click
  const handleEpisodeClick = (episode) => {
    const isAlreadyPlaying = showPlayer && selectedEpisode;
    const epParam = episode.name || episode.slug;

    // Replace URL if already playing, push if starting fresh
    if (isAlreadyPlaying) {
      navigate(`?ep=${epParam}`, { replace: true });
    } else {
      navigate(`?ep=${epParam}`);
    }

    // Scroll to player
    setTimeout(() => {
      playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Close player
  const closePlayer = () => {
    navigate(location.pathname, { replace: true });
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để lưu yêu thích');
      return;
    }

    if (!anime) return;

    // Determine whether to save as anime or movie based on content type
    if (isTrueAnime) {
      // Save as anime
      if (isFavorited) {
        console.log('[AnimeDetail] Removing anime from favorites:', { animeId: id });
        const result = await removeFavoriteAnime(id);
        if (result.success) {
          toast.success('Đã xóa khỏi danh sách yêu thích');
        } else {
          toast.error(result.message);
        }
      } else {
        const favoriteData = {
          animeId: id,
          title: anime.name,
          poster: anime.poster_url || anime.thumb_url,
        };
        console.log('[AnimeDetail] Adding anime to favorites:', favoriteData);
        const result = await addFavoriteAnime(favoriteData);
        if (result.success) {
          toast.success('Đã thêm vào danh sách yêu thích');
        } else {
          toast.error(result.message);
        }
      }
    } else {
      // Save as movie/series
      if (isFavorited) {
        console.log('[AnimeDetail] Removing movie/series from favorites:', { movieId: id });
        const result = await removeFavoriteMovie(id);
        if (result.success) {
          toast.success('Đã xóa khỏi danh sách yêu thích');
        } else {
          toast.error(result.message);
        }
      } else {
        const favoriteData = {
          movieId: id,
          title: anime.name,
          poster: anime.poster_url || anime.thumb_url,
        };
        console.log('[AnimeDetail] Adding movie/series to favorites:', favoriteData);
        const result = await addFavoriteMovie(favoriteData);
        if (result.success) {
          toast.success('Đã thêm vào danh sách yêu thích');
        } else {
          toast.error(result.message);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-xl">Không tìm thấy anime Vietsub</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[65vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 animate-slow-zoom"
          style={{
            backgroundImage: `url(${anime.thumb_url || anime.poster || ''})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto flex gap-8">
            {/* Poster */}
            <img
              src={anime.poster || anime.thumb_url}
              alt={anime.name}
              className="w-48 h-72 object-cover rounded-lg shadow-2xl hidden md:block"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/192x288?text=No+Image';
              }}
            />

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-5xl font-black text-white mb-3 drop-shadow-2xl">{anime.name}</h1>
              {anime.origin_name && anime.origin_name !== anime.name && (
                <p className="text-gray-300 text-xl mb-6">{anime.origin_name}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-yellow-400">
                  <FiStar />
                  <span className="font-semibold">{anime.quality || 'HD'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <FiCalendar />
                  <span>{anime.year || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <FiTv />
                  <span>{episodes.length || '?'} tập</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <FiClock />
                  <span>{anime.time || 'N/A'}</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {anime.category?.map((genre, idx) => {
                  // Find matching slug from CATEGORIES constant
                  const categorySlug = genre.toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/\+/g, '');

                  // Determine filter path based on content type
                  const filterPath = isAnime ? '/anime/filter' : '/movies/filter';

                  return (
                    <Link
                      key={idx}
                      to={`${filterPath}?categories=${categorySlug}`}
                      className="px-4 py-1.5 glass-effect text-gray-200 rounded-full text-sm font-medium backdrop-blur-md shadow-md hover:bg-white/20 hover:scale-105 transform transition-all duration-300 cursor-pointer"
                    >
                      {genre}
                    </Link>
                  );
                })}
              </div>

              {/* Favorite Button */}
              <div className="mb-6">
                <button
                  onClick={handleFavoriteToggle}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${isFavorited
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-dark-300 text-gray-300 hover:bg-dark-400'
                    }`}
                >
                  <FiHeart className={isFavorited ? 'fill-current' : ''} size={20} />
                  {isFavorited ? 'Đã thích' : 'Yêu thích'}
                </button>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-2xl font-black text-white mb-3 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
                  <span>Nội dung</span>
                </h2>
                <p className="text-gray-300 leading-relaxed text-base">{anime.content || anime.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Section */}
      {showPlayer && selectedEpisode && (
        <div ref={playerRef} className="max-w-7xl mx-auto px-4 py-10">
          <div className="glass-effect rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">
                Đang xem: {selectedEpisode.name || 'Tập phim'}
              </h2>
              <button
                onClick={closePlayer}
                className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <FiX size={24} />
              </button>
            </div>
            <VideoPlayer
              videoUrl={selectedEpisode.link_embed || selectedEpisode.link_m3u8}
              episodeName={`${anime.name} - ${selectedEpisode.name}`}
              onClose={closePlayer}
            />

            {/* Episode navigation below video */}
            <div className="mt-8">
              <h3 className="text-xl font-black text-white mb-5 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
                <span>Chọn tập khác</span>
              </h3>

              {/* Vertical scrollable episode box */}
              <div
                className="max-h-64 overflow-y-auto glass-effect rounded-xl p-4 custom-scrollbar"
              >
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                  {episodes.map((ep, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleEpisodeClick(ep)}
                      className={`px-3 py-2.5 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 shadow-md ${selectedEpisode?.name === ep.name
                        ? 'bg-gradient-to-br from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30'
                        : 'bg-white/10 text-gray-300 hover:bg-gradient-to-br hover:from-red-600 hover:to-red-500 hover:text-white'
                        }`}
                    >
                      {ep.name || `${idx + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Episodes List - Only show when player is NOT active */}
      {!showPlayer && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
            <span>Danh Sách Tập Vietsub</span>
          </h2>
          {episodes.length > 0 ? (
            <>
              {/* Vertical scrollable episode box for many episodes */}
              {episodes.length > 24 ? (
                <div
                  className="max-h-96 overflow-y-auto glass-effect rounded-xl p-5 custom-scrollbar"
                >
                  <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-11 xl:grid-cols-13 gap-3">
                    {episodes.map((ep, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleEpisodeClick(ep)}
                        className={`px-4 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md ${selectedEpisode?.name === ep.name
                          ? 'bg-gradient-to-br from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30'
                          : 'glass-effect text-gray-300 hover:bg-gradient-to-br hover:from-red-600 hover:to-red-500 hover:text-white'
                          }`}
                      >
                        {ep.name || `Tập ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-11 xl:grid-cols-13 gap-3">
                  {episodes.map((ep, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleEpisodeClick(ep)}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md ${selectedEpisode?.name === ep.name
                        ? 'bg-gradient-to-br from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30'
                        : 'glass-effect text-gray-300 hover:bg-gradient-to-br hover:from-red-600 hover:to-red-500 hover:text-white'
                        }`}
                    >
                      {ep.name || `Tập ${idx + 1}`}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-400 text-center py-8">
              Chưa có video Vietsub nào
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default AnimeDetailPage;
