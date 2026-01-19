import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../stores/authStore';
import useFavoritesStore from '../stores/favoritesStore';

function FavouritesPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const {
    favoriteMovies,
    favoriteAnime,
    fetchFavoriteMovies,
    fetchFavoriteAnime,
    removeFavoriteMovie,
    removeFavoriteAnime,
    isLoading
  } = useFavoritesStore();

  const [activeTab, setActiveTab] = useState('movies');

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để xem danh sách yêu thích');
      navigate('/login');
      return;
    }
    fetchFavoriteMovies();
    fetchFavoriteAnime();
  }, [isAuthenticated, navigate]);

  const handleRemoveMovie = async (movieId) => {
    const result = await removeFavoriteMovie(movieId);
    if (result.success) {
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } else {
      toast.error(result.message);
    }
  };

  const handleRemoveAnime = async (animeId) => {
    const result = await removeFavoriteAnime(animeId);
    if (result.success) {
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } else {
      toast.error(result.message);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Danh sách yêu thích</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-dark-400">
        <button
          onClick={() => setActiveTab('movies')}
          className={`px-6 py-3 font-medium transition-all ${activeTab === 'movies'
              ? 'text-primary-500 border-b-2 border-primary-500'
              : 'text-gray-400 hover:text-white'
            }`}
        >
          Phim ({favoriteMovies.length})
        </button>
        <button
          onClick={() => setActiveTab('anime')}
          className={`px-6 py-3 font-medium transition-all ${activeTab === 'anime'
              ? 'text-primary-500 border-b-2 border-primary-500'
              : 'text-gray-400 hover:text-white'
            }`}
        >
          Anime ({favoriteAnime.length})
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-white">Đang tải...</div>
        </div>
      ) : (
        <div>
          {activeTab === 'movies' && (
            <div>
              {favoriteMovies.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-400 text-lg mb-4">Chưa có phim yêu thích</p>
                  <button
                    onClick={() => navigate('/movies')}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Khám phá phim
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {favoriteMovies.map((movie) => (
                    <div key={movie.movieId} className="relative group">
                      <div
                        onClick={() => {
                          console.log('[Favorites Navigation] Navigating to movie:', {
                            movieId: movie.movieId,
                            title: movie.title,
                            targetPath: `/movies/${movie.movieId}`
                          });
                          navigate(`/movies/${movie.movieId}`);
                        }}
                        className="cursor-pointer"
                      >
                        <img
                          src={movie.poster || 'https://via.placeholder.com/200x300'}
                          alt={movie.title}
                          className="w-full rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                        />
                        <h3 className="text-white mt-2 text-sm font-medium line-clamp-2">
                          {movie.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleRemoveMovie(movie.movieId)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'anime' && (
            <div>
              {favoriteAnime.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-400 text-lg mb-4">Chưa có anime yêu thích</p>
                  <button
                    onClick={() => navigate('/anime')}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Khám phá anime
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {favoriteAnime.map((anime) => (
                    <div key={anime.animeId} className="relative group">
                      <div
                        onClick={() => {
                          console.log('[Favorites Navigation] Navigating to anime:', {
                            animeId: anime.animeId,
                            title: anime.title,
                            targetPath: `/anime/${anime.animeId}`
                          });
                          navigate(`/anime/${anime.animeId}`);
                        }}
                        className="cursor-pointer"
                      >
                        <img
                          src={anime.poster || 'https://via.placeholder.com/200x300'}
                          alt={anime.title}
                          className="w-full rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                        />
                        <h3 className="text-white mt-2 text-sm font-medium line-clamp-2">
                          {anime.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleRemoveAnime(anime.animeId)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FavouritesPage;
