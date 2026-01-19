import { FiClock, FiPlay, FiRotateCcw, FiX } from 'react-icons/fi';

function ResumeModal({ isOpen, onClose, onResume, onRestart, episodeName, savedProgress, duration }) {
    if (!isOpen) return null;

    // Format time (seconds to mm:ss or hh:mm:ss)
    const formatTime = (seconds) => {
        if (!seconds || seconds <= 0) return '0:00';
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate progress percentage
    const progressPercent = duration > 0 ? Math.round((savedProgress / duration) * 100) : 0;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative glass-effect-strong rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-fade-in-up">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                >
                    <FiX size={20} />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary-600/20 flex items-center justify-center">
                        <FiClock size={32} className="text-primary-400" />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white text-center mb-2">
                    Tiếp tục xem?
                </h3>

                {/* Episode name */}
                <p className="text-gray-400 text-center mb-4 text-sm">
                    {episodeName}
                </p>

                {/* Progress info */}
                <div className="glass-effect rounded-xl p-4 mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Đã xem</span>
                        <span className="text-white font-medium">
                            {formatTime(savedProgress)} / {formatTime(duration)}
                        </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <p className="text-gray-500 text-xs mt-2 text-center">
                        {progressPercent}% hoàn thành
                    </p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onRestart}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 glass-effect text-white rounded-xl font-medium hover:bg-white/10 transition-all"
                    >
                        <FiRotateCcw size={18} />
                        <span>Xem lại từ đầu</span>
                    </button>
                    <button
                        onClick={onResume}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-500 transition-all shadow-glow-sm"
                    >
                        <FiPlay size={18} />
                        <span>Tiếp tục</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ResumeModal;
