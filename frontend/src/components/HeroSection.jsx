import { FiInfo, FiPlay } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function HeroSection({ movie }) {
  if (!movie) {
    return (
      <div className="relative h-[70vh] bg-dark-200 animate-pulse">
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="h-12 bg-dark-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-dark-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-dark-300 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  // Support both old format and new KKPhim format
  const {
    slug,
    name,
    origin_name,
    poster,
    thumb_url,
    year,
    quality,
    lang,
    category,
    episode_current,
  } = movie;

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={thumb_url || poster}
          alt={name}
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50"></div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-black text-white mb-3 drop-shadow-lg">
              {name}
            </h1>
            {origin_name && origin_name !== name && (
              <p className="text-xl text-gray-300 mb-6">{origin_name}</p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-gray-300 mb-6">
              {quality && (
                <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg text-sm font-bold shadow-lg">
                  {quality}
                </span>
              )}
              {lang && (
                <span className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm font-bold shadow-lg">
                  {lang}
                </span>
              )}
              {year && <span className="font-semibold">{year}</span>}
              {episode_current && (
                <span className="text-green-400">{episode_current}</span>
              )}
            </div>

            {/* Genres */}
            {category && category.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {category.map((genre, idx) => (
                  <span key={idx} className="px-4 py-1.5 glass-effect text-gray-200 rounded-full text-sm font-medium backdrop-blur-md">
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <Link
                to={`/anime/${slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                <FiPlay size={20} />
                <span>Xem Ngay</span>
              </Link>
              <Link
                to={`/anime/${slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 glass-effect text-white rounded-lg hover:bg-white/20 transition-all font-medium"
              >
                <FiInfo size={20} />
                <span>Chi Tiết</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
