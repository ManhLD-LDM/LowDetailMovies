import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import MovieCard from './MovieCard';

function MovieSection({ title, movies, loading, viewAllLink, contentType = 'anime' }) {
    if (loading) {
        return (
            <section className="py-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="h-8 bg-dark-200 rounded-lg w-48 skeleton" />
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="flex-none w-44">
                            <div className="aspect-[2/3] bg-dark-200 rounded-xl skeleton" />
                            <div className="mt-3 h-4 bg-dark-200 rounded w-3/4 skeleton" />
                            <div className="mt-2 h-3 bg-dark-200 rounded w-1/2 skeleton" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (!movies || movies.length === 0) {
        return null;
    }

    return (
        <section className="py-8">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full" />
                    {title}
                </h2>
                {viewAllLink && (
                    <Link
                        to={viewAllLink}
                        className="flex items-center gap-1 text-gray-400 hover:text-primary-400 transition-colors duration-200 group"
                    >
                        <span className="text-sm font-medium">Xem tất cả</span>
                        <FiChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                )}
            </div>

            {/* Horizontal Scroll Movie Cards */}
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar-horizontal snap-x snap-mandatory">
                {movies.map((movie) => (
                    <div key={movie.id} className="flex-none w-40 sm:w-44 md:w-48 snap-start">
                        <MovieCard movie={movie} contentType={contentType} />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default MovieSection;
