import { useEffect, useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import { kkphimApi } from '../services/kkphimApi';

function MovieFilterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const categories = await kkphimApi.getAllMovieCategories();
        setAllCategories(categories);

        // Load selected categories from URL after categories are loaded
        const categoriesParam = searchParams.get('categories');
        if (categoriesParam) {
          const slugs = categoriesParam.split(',');
          const cats = categories.filter(c => slugs.includes(c.slug));
          if (cats.length > 0) {
            setSelectedCategories(cats);
            // Automatically trigger search
            handleSearchWithCategories(cats);
          }
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [searchParams]);

  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      const exists = prev.find(c => c.slug === category.slug);
      if (exists) {
        return prev.filter(c => c.slug !== category.slug);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSearchWithCategories = async (categories) => {
    if (categories.length === 0) {
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await kkphimApi.filterMoviesByCategories(categories, 1, 500);
      setFilteredMovies(response.data || []);
    } catch (error) {
      console.error('Error filtering movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (categories = selectedCategories) => {
    if (categories.length === 0) {
      alert('Vui lòng chọn ít nhất 1 thể loại');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await kkphimApi.filterMoviesByCategories(categories, 1, 500);
      setFilteredMovies(response.data || []);

      // Update URL with slugs
      const slugs = categories.map(c => c.slug).join(',');
      navigate(`/movies/filter?categories=${slugs}`, { replace: true });
    } catch (error) {
      console.error('Error filtering movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setFilteredMovies([]);
    setHasSearched(false);
    navigate('/movies/filter', { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <FiFilter className="text-primary-500" />
              Bộ Lọc Phim
            </h1>
            <p className="text-gray-400">Chọn các thể loại để tìm phim phù hợp</p>
          </div>
          <button
            onClick={() => navigate('/movies')}
            className="px-4 py-2 bg-dark-300 hover:bg-dark-400 text-white rounded-lg transition-colors"
          >
            Quay Lại
          </button>
        </div>

        {/* Selected Categories Summary */}
        {selectedCategories.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap p-4 bg-dark-300 rounded-lg">
            <span className="text-gray-300 font-medium">Đã chọn ({selectedCategories.length}):</span>
            {selectedCategories.map(cat => (
              <span
                key={cat.slug}
                className="px-3 py-1 bg-primary-600 text-white rounded-full text-sm flex items-center gap-2"
              >
                {cat.name}
                <button
                  onClick={() => toggleCategory(cat)}
                  className="hover:bg-primary-700 rounded-full"
                >
                  <FiX size={16} />
                </button>
              </span>
            ))}
            <button
              onClick={clearAll}
              className="ml-auto px-4 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
            >
              Xóa Tất Cả
            </button>
          </div>
        )}
      </div>

      {/* Categories Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Chọn Thể Loại</h2>
        {categoriesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="h-12 bg-dark-300 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {allCategories.map((category) => {
                const isSelected = selectedCategories.some(c => c.slug === category.slug);
                return (
                  <button
                    key={category.slug}
                    onClick={() => toggleCategory(category)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${isSelected
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/50'
                      : 'bg-dark-300 text-gray-300 hover:bg-dark-400'
                      }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Search Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => handleSearch()}
          disabled={selectedCategories.length === 0 || loading}
          className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
        >
          {loading ? 'Đang tìm kiếm...' : `Tìm Kiếm${selectedCategories.length > 0 ? ` (${selectedCategories.length} thể loại)` : ''}`}
        </button>
      </div>

      {/* Results */}
      {hasSearched && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Kết Quả</h2>
            <p className="text-gray-400">
              Tìm thấy {filteredMovies.length} phim phù hợp
            </p>
          </div>

          {loading ? (
            <MovieGrid movies={[]} loading={true} contentType="movie" />
          ) : filteredMovies.length > 0 ? (
            <MovieGrid movies={filteredMovies} loading={false} contentType="movie" />
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">😢</div>
              <p className="text-gray-400 text-lg">
                Không tìm thấy phim nào với các thể loại đã chọn
              </p>
              <button
                onClick={clearAll}
                className="mt-4 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Thử Lại
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MovieFilterPage;
