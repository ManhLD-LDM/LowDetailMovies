import { FiClock, FiPlay, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import useWatchHistoryStore from '../stores/watchHistoryStore';

function ContinueWatching() {
    const { getRecentItems, removeFromHistory } = useWatchHistoryStore();
    const items = getRecentItems(10);

    if (items.length === 0) {
        return null;
    }

    // Format time ago
    const formatTimeAgo = (timestamp) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return 'Vừa xong';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} phút trước`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} giờ trước`;
        const days = Math.floor(hours / 24);
        return `${days} ngày trước`;
    };

    // Calculate progress percentage
    const getProgressPercent = (item) => {
        if (item.duration > 0) {
            return Math.round((item.progress / item.duration) * 100);
        }
        return 0;
    };

    return (
        <section className="py-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full" />
                    Xem tiếp
                </h2>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <FiClock size={16} />
                    <span>Tiếp tục từ nơi bạn dừng lại</span>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {items.map((item) => (
                    <div key={`${item.slug}-${item.episodeName}`} className="group relative">
                        <Link
                            to={`/${item.type === 'movie' ? 'movies' : 'anime'}/${item.slug}`}
                            className="block"
                        >
                            {/* Thumbnail */}
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-dark-200 shadow-card hover-card cursor-pointer">
                                <img
                                    src={item.poster}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Play Button */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-14 h-14 rounded-full bg-primary-600 flex items-center justify-center shadow-glow">
                                        <FiPlay className="text-white ml-1" size={24} />
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-dark-300">
                                    <div
                                        className="h-full bg-primary-500 transition-all duration-300"
                                        style={{ width: `${getProgressPercent(item)}%` }}
                                    />
                                </div>

                                {/* Episode Badge */}
                                <div className="absolute top-2 left-2 px-2 py-1 glass-effect rounded-md text-xs font-semibold">
                                    {item.episodeName}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="mt-3">
                                <h3 className="text-white font-semibold line-clamp-1 group-hover:text-primary-400 transition-colors">
                                    {item.name}
                                </h3>
                                <p className="text-gray-500 text-xs mt-1">
                                    {formatTimeAgo(item.watchedAt)}
                                </p>
                            </div>
                        </Link>

                        {/* Remove Button */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeFromHistory(item.slug, item.episodeName);
                            }}
                            className="absolute top-2 right-2 p-1.5 glass-effect rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-500/50"
                            aria-label="Xóa khỏi lịch sử"
                        >
                            <FiX size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ContinueWatching;
