import { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import MovieSection from '../components/MovieSection';
import { kkphimApi } from '../services/kkphimApi';

function HomePage() {
    const [featuredAnime, setFeaturedAnime] = useState(null);
    const [latestMovies, setLatestMovies] = useState([]);
    const [latestAnime, setLatestAnime] = useState([]);
    const [randomMovies, setRandomMovies] = useState([]);
    const [randomAnime, setRandomAnime] = useState([]);
    const [loading, setLoading] = useState(true);

    // Shuffle array helper function
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch latest movies (phim lẻ + phim bộ) - page 1
                const moviesRes = await kkphimApi.getAllMoviesAndSeries(1, 20);
                const moviesData = moviesRes.data || [];
                setLatestMovies(moviesData.slice(0, 10));

                // Fetch latest anime - page 1
                const animeRes = await kkphimApi.getAllAnime(1, 20);
                const animeData = animeRes.data || [];
                setLatestAnime(animeData.slice(0, 10));

                // Set featured anime from first anime
                if (animeData.length > 0) {
                    setFeaturedAnime(animeData[0]);
                }

                // Fetch random movies from page 2-5 for "Hôm nay xem gì"
                const randomMoviesPage = Math.floor(Math.random() * 4) + 2;
                const randomMoviesRes = await kkphimApi.getAllMoviesAndSeries(randomMoviesPage, 20);
                const randomMoviesData = shuffleArray(randomMoviesRes.data || []);
                setRandomMovies(randomMoviesData.slice(0, 10));

                // Fetch random anime from page 2-5 for "Anime hôm nay"
                const randomAnimePage = Math.floor(Math.random() * 4) + 2;
                const randomAnimeRes = await kkphimApi.getAllAnime(randomAnimePage, 20);
                const randomAnimeData = shuffleArray(randomAnimeRes.data || []);
                setRandomAnime(randomAnimeData.slice(0, 10));

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <HeroSection movie={featuredAnime} />

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4">
                {/* Latest Movies Section */}
                <MovieSection
                    title="Phim Mới Nhất"
                    movies={latestMovies}
                    loading={loading}
                    viewAllLink="/movies"
                    contentType="movie"
                />

                {/* Latest Anime Section */}
                <MovieSection
                    title="Anime Mới Nhất"
                    movies={latestAnime}
                    loading={loading}
                    viewAllLink="/anime"
                    contentType="anime"
                />

                {/* Random Movies Section - "Hôm nay xem gì" */}
                <MovieSection
                    title="Hôm Nay Xem Gì"
                    movies={randomMovies}
                    loading={loading}
                    viewAllLink="/movies"
                    contentType="movie"
                />

                {/* Random Anime Section - "Anime hôm nay" */}
                <MovieSection
                    title="Anime Đề Xuất"
                    movies={randomAnime}
                    loading={loading}
                    viewAllLink="/anime"
                    contentType="anime"
                />
            </div>
        </div>
    );
}

export default HomePage;
