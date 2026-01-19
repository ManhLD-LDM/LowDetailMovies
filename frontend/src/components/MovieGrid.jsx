import MovieCard from './MovieCard';

function MovieGrid({ movies, loading, contentType = 'anime' }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-[2/3] bg-dark-300 rounded-lg"></div>
            <div className="mt-2 h-4 bg-dark-300 rounded w-3/4"></div>
            <div className="mt-1 h-3 bg-dark-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No movies found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} contentType={contentType} />
      ))}
    </div>
  );
}

export default MovieGrid;
