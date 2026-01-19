# 🎬 MovieWeb - Personal Movie & Anime Streaming Platform

A self-hosted movie and anime streaming platform for personal home use. Built with Node.js + Express backend and React (Vite) frontend.

## 📋 Features

- 🎥 Browse movies and anime series
- 🔍 Search functionality with live suggestions
- 📺 Video player with episode navigation
- 👤 User authentication (Login/Register) with JWT
- 👤 User profile management (edit avatar, username, bio)
- ❤️ Save favorite movies and anime
- 📱 Responsive design (works on desktop, tablet, mobile)
- 🌙 Dark theme for comfortable viewing

## 🏗️ Project Structure

```
MovieWeb/
├── backend/          # Node.js + Express API
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # JWT auth middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── .env             # Environment variables
│   ├── package.json
│   └── server.js        # Entry point
│
└── frontend/         # React + Vite
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── pages/         # Page components
    │   ├── services/      # API services
    │   ├── stores/        # Zustand state management
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    ├── package.json
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- **Java 21** (JDK)
- **Node.js 18+** and npm
- **Maven 3.8+**

**Backend:**
- Node.js (v18 or higher)
- MongoDB Cloud account

**Frontend:**
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment variables (`.env` file đã được tạo sẵn):
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. Run the application:
   ```bash
   npm run dev
   ```

   The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment variables (`.env` file đã được tạo sẵn):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:3000`

## 🔐 Usage

1. **Đăng ký tài khoản mới** tại `/register`
2. **Đăng nhập** tại `/login`
3. **Xem và chỉnh sửa profile** - Click vào avatar trên navbar → Profile
4. **Lưu phim/anime yêu thích** - Click icon tim trên trang chi tiết
5. **Xem favorites** - Vào trang Profile

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - Login (email + password)
- `POST /api/auth/register` - Register (username, email, password)
- `GET /api/auth/me` - Get current user info

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile (username, avatar, bio)

### Favorites
- `GET /api/favorites/movies` - Get favorite movies
- `POST /api/favorites/movies` - Add movie to favorites
- `DELETE /api/favorites/movies/:movieId` - Remove movie from favorites
- `GET /api/favorites/anime` - Get favorite anime
- `POST /api/favorites/anime` - Add anime to favorites
- `DELETE /api/favorites/anime/:animeId` - Remove anime from favorites

### Movies
- `GET /api/movies` - Get all movies (paginated)
- `GET /api/movies/{id}` - Get movie by ID
- `GET /api/movies/type/{type}` - Get by type (MOVIE, ANIME, TV_SERIES)
- `GET /api/movies/search?keyword=` - Search movies
- `GET /api/movies/top-viewed` - Get trending movies
- `GET /api/movies/latest` - Get latest movies
- `GET /api/movies/top-rated` - Get top rated movies

### Episodes
- `GET /api/episodes/movie/{movieId}` - Get episodes by movie
- `GET /api/episodes/{id}` - Get episode by ID

### Comments
- `GET /api/comments/movie/{movieId}` - Get comments by movie
- `POST /api/comments/movie/{movieId}` - Add comment (auth required)
- `DELETE /api/comments/{id}` - Delete comment (auth required)

### Genres
- `GET /api/genres` - Get all genres
- 
### Video Sources

You can use:
- Direct video URLs (MP4, WebM)
- YouTube URLs
- Vimeo URLs
- Any URL supported by react-player

## 🏠 Home Network Setup

For home use, you can access the app from other devices on your network:

1. Find your computer's local IP:
   ```bash
   # Windows
   ipconfig
   
   # Linux/Mac
   ifconfig
   ```

2. Access from other devices using:
   - Frontend: `http://YOUR_IP:3000`
   - Backend: `http://YOUR_IP:8080`

3. Update CORS in `application.properties`:
   ```properties
   cors.allowed-origins=http://localhost:3000,http://YOUR_IP:3000
   ```

## 🛠️ Production Build

### Backend
```bash
cd backend
mvn clean package -DskipTests
java -jar target/movie-backend-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 📝 Configuration

### Backend (`application.properties`)

```properties
# Server port
server.port=8080

# Database (switch to MySQL/PostgreSQL for production)
spring.datasource.url=jdbc:h2:file:./data/moviedb
spring.jpa.hibernate.ddl-auto=update

# JWT settings
jwt.secret=YourSecretKey256BitsLong
jwt.expiration=86400000
```

### Frontend (`vite.config.js`)

```javascript
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0', // Allow network access
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
})
```

## 📄 License

This project is for personal/educational use only.

---

Made with ❤️ for home entertainment
