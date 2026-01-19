import { useEffect, useRef, useState } from 'react';
import { FiHeart, FiLogOut, FiMenu, FiSearch, FiUser, FiX } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { kkphimApi } from '../services/kkphimApi';
import useAuthStore from '../stores/authStore';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const debounceTimeout = useRef(null);
  const { user, isAuthenticated, logout } = useAuthStore();

  // Close mobile menu and suggestions when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setShowSuggestions(false);
  }, [location.pathname]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (searchQuery.trim().length > 1) {
      setLoading(true);
      debounceTimeout.current = setTimeout(async () => {
        try {
          const response = await kkphimApi.searchAnime(searchQuery.trim());
          setSuggestions(response.data.slice(0, 5)); // Limit to 5 suggestions
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 300); // Debounce 300ms
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchUrl = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      navigate(searchUrl);
      setSearchQuery('');
      setShowSuggestions(false);
      // Force close mobile menu if open
      setIsMenuOpen(false);
    }
  };

  const handleSuggestionClick = (item, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const detailUrl = `/anime/${item.slug}`;
    navigate(detailUrl);
    setSearchQuery('');
    setShowSuggestions(false);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-3xl font-black bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent transform group-hover:scale-110 transition-transform duration-300">LowDetailMovies</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-all duration-300 relative group py-2">
              <span>Trang Chủ</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/movies" className="text-gray-300 hover:text-white transition-all duration-300 relative group py-2">
              <span>Phim</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/anime" className="text-gray-300 hover:text-white transition-all duration-300 relative group py-2">
              <span>Anime</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
                placeholder="Tìm kiếm phim, anime..."
                className="w-64 px-4 py-2.5 pl-10 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 backdrop-blur-sm"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full mt-2 w-full bg-dark-200 border border-dark-400 rounded-lg shadow-xl overflow-hidden z-50">
                  {loading ? (
                    <div className="px-4 py-3 text-gray-400 text-sm">Đang tìm kiếm...</div>
                  ) : suggestions.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                      {suggestions.map((item) => (
                        <button
                          key={item.id}
                          onClick={(e) => handleSuggestionClick(item, e)}
                          type="button"
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-all duration-200 text-left group">

                          <img
                            src={item.poster || item.thumb_url}
                            alt={item.name}
                            className="w-12 h-16 object-cover rounded"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium truncate">{item.name}</div>
                            <div className="text-gray-400 text-sm truncate">{item.origin_name}</div>
                            <div className="text-gray-500 text-xs flex items-center gap-2 mt-1">
                              {item.year && <span>{item.year}</span>}
                              {item.quality && <span className="px-2 py-0.5 bg-primary-600/20 text-primary-400 rounded">{item.quality}</span>}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : searchQuery.trim().length > 1 ? (
                    <div className="px-4 py-3 text-gray-400 text-sm">Không tìm thấy kết quả</div>
                  ) : null}
                </div>
              )}
            </div>
          </form>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10"
                >
                  <img
                    src={user?.avatar || 'https://via.placeholder.com/32'}
                    alt={user?.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-white">{user?.username}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-200 border border-dark-400 rounded-lg shadow-xl overflow-hidden z-50">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 text-white hover:bg-white/10 transition-all"
                    >
                      <FiUser />
                      Profile
                    </Link>
                    <Link
                      to="/favourites"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-3 text-white hover:bg-white/10 transition-all"
                    >
                      <FiHeart />
                      Favourites
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-white hover:bg-white/10 transition-all text-left"
                    >
                      <FiLogOut />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-white hover:text-red-400 transition-all duration-300 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-300">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
                  placeholder="Tìm kiếm phim, anime..."
                  className="w-full px-4 py-2 pl-10 bg-dark-300 border border-dark-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                {/* Mobile Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute top-full mt-2 w-full bg-dark-200 border border-dark-400 rounded-lg shadow-xl overflow-hidden z-50">
                    {loading ? (
                      <div className="px-4 py-3 text-gray-400 text-sm">Đang tìm kiếm...</div>
                    ) : suggestions.length > 0 ? (
                      <div className="max-h-96 overflow-y-auto">
                        {suggestions.map((item) => (
                          <button
                            key={item.id}
                            onPointerDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSuggestionClick(item, null);
                            }}
                            type="button"
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-dark-300 transition-colors text-left"
                          >
                            <img
                              src={item.poster || item.thumb_url}
                              alt={item.name}
                              className="w-12 h-16 object-cover rounded"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium truncate">{item.name}</div>
                              <div className="text-gray-400 text-sm truncate">{item.origin_name}</div>
                              <div className="text-gray-500 text-xs flex items-center gap-2 mt-1">
                                {item.year && <span>{item.year}</span>}
                                {item.quality && <span className="px-2 py-0.5 bg-primary-600/20 text-primary-400 rounded">{item.quality}</span>}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : searchQuery.trim().length > 1 ? (
                      <div className="px-4 py-3 text-gray-400 text-sm">Không tìm thấy kết quả</div>
                    ) : null}
                  </div>
                )}
              </div>
            </form>

            <div className="space-y-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-gray-300 hover:text-white"
              >
                Trang Chủ
              </Link>
              <Link
                to="/movies"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-gray-300 hover:text-white"
              >
                Phim
              </Link>
              <Link
                to="/anime"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-gray-300 hover:text-white"
              >
                Anime
              </Link>

              {/* Mobile User Menu */}
              <div className="pt-4 border-t border-dark-300">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 py-2 text-gray-300 hover:text-white"
                    >
                      <FiUser />
                      Profile
                    </Link>
                    <Link
                      to="/favourites"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 py-2 text-gray-300 hover:text-white"
                    >
                      <FiHeart />
                      Favourites
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 py-2 text-gray-300 hover:text-white w-full text-left"
                    >
                      <FiLogOut />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 text-gray-300 hover:text-white"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 text-gray-300 hover:text-white"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
