import { useEffect, useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import { kkphimApi } from '../services/kkphimApi';

function MoviesPage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [selectedType, setSelectedType] = useState('all'); // 'all', 'phim-le', 'phim-bo'
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let response;
        
        if (selectedType === 'all') {
          response = await kkphimApi.getAllMoviesAndSeries(page, 24);
        } else if (selectedType === 'phim-le') {
          response = await kkphimApi.getAllMovies(page, 24);
        } else if (selectedType === 'phim-bo') {
          response = await kkphimApi.getAllTVSeries(page, 24);
        }
        
        const newMovies = response.data || [];
        if (page === 1) {
          setMovies(newMovies);
        } else {
          setMovies(prev => [...prev, ...newMovies]);
        }
        setHasMore(newMovies.length > 0);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [selectedType, page]);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setPage(1);
    setMovies([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Phim</h1>
            <p className="text-gray-400">Tổng hợp phim lẻ và phim bộ Vietsub mới nhất</p>
          </div>
          <button
            onClick={() => navigate('/movies/filter')}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-primary-600/30"
          >
            <FiFilter size={20} />
            <span>Bộ Lọc</span>
          </button>
        </div>
      </div>

      {/* Type Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTypeChange('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-dark-300 text-gray-300 hover:bg-dark-400'
            }`}
          >
            Tất Cả
          </button>
          <button
            onClick={() => handleTypeChange('phim-le')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === 'phim-le'
                ? 'bg-primary-600 text-white'
                : 'bg-dark-300 text-gray-300 hover:bg-dark-400'
            }`}
          >
            Phim Lẻ
          </button>
          <button
            onClick={() => handleTypeChange('phim-bo')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedType === 'phim-bo'
                ? 'bg-primary-600 text-white'
                : 'bg-dark-300 text-gray-300 hover:bg-dark-400'
            }`}
          >
            Phim Bộ
          </button>
        </div>
      </div>

      {/* Movies Grid */}
      <MovieGrid movies={movies} loading={loading && page === 1} contentType="movie" />

      {/* Load More Button */}
      {hasMore && movies.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setPage(prev => prev + 1)}
            disabled={loading}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang tải...' : 'Tải Thêm'}
          </button>
        </div>
      )}
    </div>
  );
}

export default MoviesPage;
