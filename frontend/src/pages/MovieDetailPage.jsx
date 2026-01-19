import { useEffect, useRef, useState } from 'react';
import { FiCalendar, FiClock, FiHeart, FiPlay, FiStar, FiX } from 'react-icons/fi';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import VideoPlayer from '../components/VideoPlayer';
import { kkphimApi } from '../services/kkphimApi';
import useAuthStore from '../stores/authStore';
import useFavoritesStore from '../stores/favoritesStore';

function MovieDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();
  const { favoriteMovies, addFavoriteMovie, removeFavoriteMovie, isMovieFavorited, fetchFavoriteMovies } = useFavoritesStore();

  const [movie, setMovie] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const playerRef = useRef(null);

  const isFavorited = movie ? isMovieFavorited(id) : false;

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavoriteMovies();
    }
  }, [isAuthenticated]);

  // Fetch movie data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const detail = await kkphimApi.getAnimeDetail(id);
        setMovie(detail.data || null);
        setEpisodes(detail.data?.episodes || []);
      } catch (error) {
        setMovie(null);
        setEpisodes([]);
        console.error('Error fetching movie:', error);
        toast.error('Không thể tải thông tin phim');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
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

  const handleEpisodeClick = (episode) => {
    const isAlreadyPlaying = showPlayer && selectedEpisode;
    const epParam = episode.name || episode.slug;

    // Replace URL if already playing, push if starting fresh
    if (isAlreadyPlaying) {
      navigate(`?ep=${epParam}`, { replace: true });
    } else {
      navigate(`?ep=${epParam}`);
    }

    setTimeout(() => {
      playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const closePlayer = () => {
    navigate(location.pathname, { replace: true });
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để lưu yêu thích');
      return;
    }

    if (!movie) return;

    if (isFavorited) {
      console.log('[MovieDetail] Removing from favorites:', { movieId: id });
      const result = await removeFavoriteMovie(id);
      if (result.success) {
        toast.success('Đã xóa khỏi danh sách yêu thích');
      } else {
        toast.error(result.message);
      }
    } else {
      const favoriteData = {
        movieId: id,
        title: movie.name || movie.title,
        poster: movie.poster || movie.posterUrl,
      };
      console.log('[MovieDetail] Adding to favorites:', favoriteData);
      const result = await addFavoriteMovie(favoriteData);
      if (result.success) {
        toast.success('Đã thêm vào danh sách yêu thích');
      } else {
        toast.error(result.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-dark-300 rounded-lg mb-8"></div>
          <div className="h-8 bg-dark-300 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-dark-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-dark-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-xl">Không tìm thấy phim</p>
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
            backgroundImage: `url(${movie.thumb_url || movie.poster || ''})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto flex gap-8">
            {/* Poster */}
            <img
              src={movie.poster}
              alt={movie.name}
              className="w-48 h-72 object-cover rounded-lg shadow-2xl hidden md:block"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/192x288?text=No+Image';
              }}
            />

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-5xl font-black text-white mb-3 drop-shadow-2xl">{movie.name}</h1>
              {movie.origin_name && movie.origin_name !== movie.name && (
                <p className="text-gray-300 text-xl mb-6">{movie.origin_name}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mb-6">
                {movie.quality && (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <FiStar />
                    <span className="font-semibold">{movie.quality}</span>
                  </div>
                )}
                {movie.year && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiCalendar />
                    <span>{movie.year}</span>
                  </div>
                )}
                {episodes.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiPlay />
                    <span>{episodes.length} tập</span>
                  </div>
                )}
                {movie.time && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiClock />
                    <span>{movie.time}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {movie.category && movie.category.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.category.map((genre, idx) => {
                    const categorySlug = genre.toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .replace(/\s+/g, '-')
                      .replace(/\+/g, '');

                    return (
                      <Link
                        key={idx}
                        to={`/movies/filter?categories=${categorySlug}`}
                        className="px-4 py-1.5 glass-effect text-gray-200 rounded-full text-sm font-medium backdrop-blur-md shadow-md hover:bg-white/20 hover:scale-105 transform transition-all duration-300 cursor-pointer"
                      >
                        {genre}
                      </Link>
                    );
                  })}
                </div>
              )}

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
                <p className="text-gray-300 leading-relaxed text-base">{movie.content || movie.description || 'Không có mô tả'}</p>
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
              episodeName={`${movie.name} - ${selectedEpisode.name}`}
              onClose={closePlayer}
            />

            {/* Episode navigation below video */}
            <div className="mt-8">
              <h3 className="text-xl font-black text-white mb-5 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
                <span>Chọn tập khác</span>
              </h3>

              <div className="max-h-64 overflow-y-auto glass-effect rounded-xl p-4 custom-scrollbar">
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

      {/* Episodes Section */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {episodes.length > 0 && (
          <div className="glass-effect rounded-2xl p-6">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
              <span>Danh sách tập</span>
            </h2>

            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
                {episodes.map((episode, index) => (
                  <button
                    key={index}
                    onClick={() => handleEpisodeClick(episode)}
                    className={`px-3 py-2.5 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 shadow-md ${selectedEpisode?.name === episode.name
                      ? 'bg-gradient-to-br from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30'
                      : 'bg-white/10 text-gray-300 hover:bg-gradient-to-br hover:from-red-600 hover:to-red-500 hover:text-white'
                      }`}
                  >
                    {episode.name || `${index + 1}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetailPage;
