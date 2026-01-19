import { FiPlay, FiStar, FiTv } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function MovieCard({ movie, contentType = 'anime' }) {
    const {
        id,
        slug,
        name,
        poster,
        thumb_url,
        year,
        episodes,
        quality,
        time,
    } = movie;

    const linkPath = contentType === 'movie' ? `/movies/${slug || id}` : `/anime/${slug || id}`;

    return (
        <Link
            to={linkPath}
            className="group block cursor-pointer"
        >
            {/* Card Container with Netflix-style hover */}
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-dark-100 shadow-card hover-card">
                {/* Poster Image */}
                {(poster || thumb_url) ? (
                    <img
                        src={poster || thumb_url}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 bg-dark-200">
                        <FiTv size={48} />
                    </div>
                )}

                {/* Gradient Overlay - Always visible at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Hover Overlay with Play Button */}
                <div className="absolute inset-0 bg-primary-600/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center shadow-glow transform scale-75 group-hover:scale-100 transition-all duration-300">
                        <FiPlay className="text-white ml-1" size={24} />
                    </div>
                </div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    {/* Type Badge */}
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-primary-600/90 backdrop-blur-sm shadow-glow-sm">
                        {movie.type === 'hoathinh' ? 'Anime' : (movie.type === 'series' ? 'Series' : 'Movie')}
                    </span>

                    {/* Quality Badge */}
                    {quality && (
                        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-accent-gold/90 text-dark-500 flex items-center gap-1 backdrop-blur-sm">
                            <FiStar size={10} />
                            {quality}
                        </span>
                    )}
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                    {/* Episode Count */}
                    {episodes > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg glass-effect">
                            <FiTv size={12} />
                            {episodes} tập
                        </span>
                    )}
                </div>
            </div>

            {/* Title & Info */}
            <div className="mt-3 px-1">
                <h3 className="text-white font-semibold line-clamp-2 group-hover:text-primary-400 transition-colors duration-200">
                    {name}
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                    {year && (
                        <span className="text-gray-500 text-sm">{year}</span>
                    )}
                    {time && year && (
                        <span className="text-gray-600">•</span>
                    )}
                    {time && (
                        <span className="text-gray-500 text-sm">{time}</span>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default MovieCard;
