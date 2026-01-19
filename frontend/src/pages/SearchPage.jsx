import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import { kkphimApi } from '../services/kkphimApi';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      fetchAnimes(query, 1);
    }
  }, [query]);

  const fetchAnimes = async (keyword, pageNum) => {
    if (!keyword.trim()) return;
    setLoading(true);
    try {
      const response = await kkphimApi.searchAnime(keyword);
      // KKPhim API does not support pagination for search, so always return all results
      setAnimes(response.data || []);
      setHasMore(false);
      setPage(1);
    } catch (error) {
      console.error('Error searching Vietsub anime:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
      setPage(1);
      setAnimes([]);
    }
  };

  const handleLoadMore = () => {
    // No load more for KKPhim search
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm anime..."
            className="w-full px-6 py-4 pl-14 bg-dark-300 border border-dark-400 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 text-lg"
          />
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
          >
            Tìm
          </button>
        </div>
      </form>

      {/* Results */}
      {query && (
        <div>
          <h1 className="text-2xl font-bold text-white mb-6">
            Kết quả tìm kiếm cho "{query}"
          </h1>
          
          <MovieGrid movies={animes} loading={loading && page === 1} />

          {/* Load More */}
          {hasMore && animes.length > 0 && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Đang tải...' : 'Tải Thêm'}
              </button>
            </div>
          )}

          {!loading && animes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Không tìm thấy kết quả cho "{query}"</p>
              <p className="text-gray-500 mt-2">Hãy thử tìm với từ khóa khác</p>
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="text-center py-12">
          <FiSearch className="mx-auto text-gray-500 mb-4" size={64} />
          <p className="text-gray-400 text-lg">Nhập từ khóa để tìm kiếm anime</p>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
