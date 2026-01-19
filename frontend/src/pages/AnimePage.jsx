import { useEffect, useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import { kkphimApi } from '../services/kkphimApi';

function AnimePage() {
  const navigate = useNavigate();
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchAnimes = async () => {
      setLoading(true);
      try {
        const response = await kkphimApi.getAllAnime(page);
        if (page === 1) {
          setAnimes(response.data || []);
        } else {
          setAnimes(prev => [...prev, ...(response.data || [])]);
        }
        setHasMore(response.data && response.data.length > 0);
      } catch (error) {
        console.error('Error fetching Vietsub anime:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimes();
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Anime Vietsub</h1>
            <p className="text-gray-400">Tổng hợp anime Vietsub mới nhất từ KKPhim</p>
          </div>
          <button
            onClick={() => navigate('/anime/filter')}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-primary-600/30"
          >
            <FiFilter size={20} />
            <span>Bộ Lọc</span>
          </button>
        </div>
      </div>

      {/* Anime Grid */}
      <MovieGrid movies={animes} loading={loading && page === 1} contentType="anime" />

      {/* Load More Button */}
      {hasMore && animes.length > 0 && (
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

export default AnimePage;
