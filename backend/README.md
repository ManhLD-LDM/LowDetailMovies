# MovieWeb Backend API

Backend API cho ứng dụng MovieWeb - Quản lý tài khoản người dùng và phim yêu thích.

## Công nghệ sử dụng

- Node.js
- Express.js
- MongoDB (MongoDB Cloud)
- JWT Authentication
- bcryptjs

## Cài đặt

1. Di chuyển vào thư mục backend:
```bash
cd backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Cấu hình biến môi trường:
File `.env` đã được tạo sẵn với các thông tin cần thiết.

4. Chạy server:
```bash
# Development mode với nodemon
npm run dev

# Production mode
npm start
```

Server sẽ chạy trên port 5000: http://localhost:5000

## API Endpoints

### Authentication

#### Đăng ký
```
POST /api/auth/register
Body: {
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Đăng nhập
```
POST /api/auth/login
Body: {
  "email": "string",
  "password": "string"
}
```

#### Lấy thông tin user hiện tại
```
GET /api/auth/me
Headers: {
  "Authorization": "Bearer <token>"
}
```

### User Profile

#### Lấy profile
```
GET /api/users/profile
Headers: {
  "Authorization": "Bearer <token>"
}
```

#### Cập nhật profile
```
PUT /api/users/profile
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "username": "string (optional)",
  "avatar": "string (optional)",
  "bio": "string (optional)"
}
```

### Favorites

#### Lấy danh sách phim yêu thích
```
GET /api/favorites/movies
Headers: {
  "Authorization": "Bearer <token>"
}
```

#### Thêm phim vào yêu thích
```
POST /api/favorites/movies
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "movieId": "string",
  "title": "string",
  "poster": "string (optional)"
}
```

#### Xóa phim khỏi yêu thích
```
DELETE /api/favorites/movies/:movieId
Headers: {
  "Authorization": "Bearer <token>"
}
```

#### Lấy danh sách anime yêu thích
```
GET /api/favorites/anime
Headers: {
  "Authorization": "Bearer <token>"
}
```

#### Thêm anime vào yêu thích
```
POST /api/favorites/anime
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "animeId": "string",
  "title": "string",
  "poster": "string (optional)"
}
```

#### Xóa anime khỏi yêu thích
```
DELETE /api/favorites/anime/:animeId
Headers: {
  "Authorization": "Bearer <token>"
}
```

## Cấu trúc thư mục

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js   # Auth logic
│   ├── userController.js   # User profile logic
│   └── favoritesController.js # Favorites logic
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── models/
│   └── User.js            # User model
├── routes/
│   ├── auth.js            # Auth routes
│   ├── user.js            # User routes
│   └── favorites.js       # Favorites routes
├── .env                   # Environment variables
├── .gitignore
├── package.json
└── server.js              # Entry point
```

## Database Schema

### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  avatar: String (default: placeholder),
  bio: String,
  favorites: {
    movies: [{
      movieId: String,
      title: String,
      poster: String,
      addedAt: Date
    }],
    anime: [{
      animeId: String,
      title: String,
      poster: String,
      addedAt: Date
    }]
  },
  timestamps: true
}
```

## Bảo mật

- Mật khẩu được mã hóa bằng bcryptjs
- Authentication sử dụng JWT tokens
- Protected routes yêu cầu valid token
- CORS được cấu hình cho frontend

## Ghi chú

- Token có thời hạn 7 ngày (có thể thay đổi trong .env)
- Đổi `JWT_SECRET` trong production
- Avatar sử dụng link ảnh (URL)
