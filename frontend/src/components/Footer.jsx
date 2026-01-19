import { FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-dark-100 border-t border-dark-300 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo & Description */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <span className="text-2xl font-black bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">LowDetailMovies</span>
                        </Link>
                        <p className="text-gray-400 text-sm">
                            Nền tảng xem phim và anime trực tuyến.
                            Thưởng thức nội dung yêu thích mọi lúc, mọi nơi.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/anime" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Anime
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Info */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Info</h3>
                        <ul className="space-y-2">
                            <li className="text-gray-400 text-sm">
                                For personal use only
                            </li>
                            <li className="text-gray-400 text-sm">
                                Self-hosted streaming
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-dark-300 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        © 2024 LowDetailMovies. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0 text-gray-400 text-sm">
                        <span>Made with</span>
                        <FiHeart className="text-primary-500" />
                        <span>for home use</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
