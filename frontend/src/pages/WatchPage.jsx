import { useEffect, useState } from 'react';
import { FiArrowLeft, FiChevronLeft, FiChevronRight, FiList } from 'react-icons/fi';
import ReactPlayer from 'react-player';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { episodeApi, movieApi } from '../services/api';

function WatchPage() {
  const { id, episodeNumber } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const [videoSource, setVideoSource] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const movieRes = await movieApi.getById(id);
        setMovie(movieRes.data);
        
        // Try to fetch episodes, but they might not exist for newly synced anime
        try {
          const episodesRes = await episodeApi.getByMovieId(id);
          setEpisodes(episodesRes.data);
        } catch (err) {
          console.warn('No episodes found for anime, creating default episode');
          // Create a default episode for anime without episode data
          setEpisodes([{
            id: 1,
            episodeNumber: 1,
            title: `${movieRes.data.title} - Full Movie`,
            description: movieRes.data.description
          }]);
        }

        // Increment view count
        movieApi.incrementView(id);

        // Set current episode
        if (episodes.length > 0) {
          const ep = episodes.find(e => e.episodeNumber === (parseInt(episodeNumber) || 1));
          setCurrentEpisode(ep || episodes[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, episodeNumber]);

  const getVideoUrl = () => {
    if (currentEpisode?.videoUrl) {
      return currentEpisode.videoUrl;
    }
    if (movie?.videoUrl) {
      return movie.videoUrl;
    }
    return null;
  };

  const currentEpNum = currentEpisode?.episodeNumber || parseInt(episodeNumber) || 1;
  const hasPrevEpisode = episodes.some((ep) => ep.episodeNumber === currentEpNum - 1);
  const hasNextEpisode = episodes.some((ep) => ep.episodeNumber === currentEpNum + 1);

  const goToPrevEpisode = () => {
    if (hasPrevEpisode) {
      navigate(`/watch/${id}/episode/${currentEpNum - 1}`);
    }
  };

  const goToNextEpisode = () => {
    if (hasNextEpisode) {
      navigate(`/watch/${id}/episode/${currentEpNum + 1}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Video not found</p>
      </div>
    );
  }

  const videoUrl = getVideoUrl();

  return (
    <div className="min-h-screen bg-black">
      {/* Video Player */}
      <div className="relative aspect-video max-h-[80vh] bg-black">
        {videoUrl ? (
          <ReactPlayer
            url={videoUrl}
            width="100%"
            height="100%"
            controls
            playing
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload',
                },
              },
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <p className="text-xl mb-4">Video not available</p>
            <p className="text-sm">The video URL has not been set for this content</p>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-dark-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Back Button & Title */}
            <div className="flex items-center gap-4">
              <Link
                to={`/movie/${id}`}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <FiArrowLeft />
                <span>Back</span>
              </Link>
              <div>
                <h1 className="text-white font-medium">{movie.title}</h1>
                {currentEpisode && (
                  <p className="text-gray-400 text-sm">
                    Episode {currentEpisode.episodeNumber}: {currentEpisode.title || ''}
                  </p>
                )}
              </div>
            </div>

            {/* Episode Navigation */}
            {episodes.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevEpisode}
                  disabled={!hasPrevEpisode}
                  className="flex items-center gap-1 px-4 py-2 bg-dark-300 text-white rounded-lg hover:bg-dark-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <button
                  onClick={() => setShowEpisodeList(!showEpisodeList)}
                  className="flex items-center gap-1 px-4 py-2 bg-dark-300 text-white rounded-lg hover:bg-dark-400 transition-colors"
                >
                  <FiList />
                  <span className="hidden sm:inline">Episodes</span>
                </button>

                <button
                  onClick={goToNextEpisode}
                  disabled={!hasNextEpisode}
                  className="flex items-center gap-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Next</span>
                  <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Episode List (collapsible) */}
      {showEpisodeList && episodes.length > 0 && (
        <div className="bg-dark-100 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl font-bold text-white mb-4">All Episodes</h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {episodes.map((episode) => (
                <Link
                  key={episode.id}
                  to={`/watch/${id}/episode/${episode.episodeNumber}`}
                  className={`px-3 py-2 rounded text-center transition-colors ${
                    episode.episodeNumber === currentEpNum
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-300 text-gray-300 hover:bg-dark-400'
                  }`}
                >
                  {episode.episodeNumber}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Movie Info */}
      <div className="bg-dark-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-4">{movie.title}</h2>
          <p className="text-gray-400 leading-relaxed">{movie.description}</p>
        </div>
      </div>
    </div>
  );
}

export default WatchPage;
