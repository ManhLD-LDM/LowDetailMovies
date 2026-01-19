import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/auth.js';
import favoritesRoutes from './routes/favorites.js';
import userRoutes from './routes/user.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://ribbonlike-frailly-jaydon.ngrok-free.dev',
  'https://movieweb-frontend.nport.link',
  'https://LowDetailMovies.nport.link',
  'https://ldmovies.mydrpet.io.vn',
  'http://ldmovies.mydrpet.io.vn',
  // Add more origins if needed
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if the origin is in the allowed list or matches ngrok/nport/mydrpet pattern
      if (allowedOrigins.indexOf(origin) !== -1 || 
          origin.includes('.ngrok-free.dev') || 
          origin.includes('.nport.link') ||
          origin.includes('.mydrpet.io.vn')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoritesRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'MovieWeb API is running...' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`);
});
