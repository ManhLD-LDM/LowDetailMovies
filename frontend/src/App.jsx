import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AnimeDetailPage from './pages/AnimeDetailPage'
import AnimeFilterPage from './pages/AnimeFilterPage'
import AnimePage from './pages/AnimePage'
import FavouritesPage from './pages/FavouritesPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MovieDetailPage from './pages/MovieDetailPage'
import MovieFilterPage from './pages/MovieFilterPage'
import MoviesPage from './pages/MoviesPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import SearchPage from './pages/SearchPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="favourites" element={<FavouritesPage />} />
        <Route path="movies" element={<MoviesPage />} />
        <Route path="movies/filter" element={<MovieFilterPage />} />
        <Route path="movies/:id" element={<MovieDetailPage />} />
        <Route path="anime" element={<AnimePage />} />
        <Route path="anime/filter" element={<AnimeFilterPage />} />
        <Route path="anime/:id" element={<AnimeDetailPage />} />
        <Route path="search" element={<SearchPage />} />
      </Route>
    </Routes>
  )
}

export default App
