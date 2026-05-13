import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Challenge from './pages/Challenge';
import LeaderboardPage from './pages/LeaderboardPage';
import GenerateTargets from './pages/GenerateTargets';
import './App.css';

function Nav() {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">DuelNCss</Link>
      <div className="nav-links">
        <Link to="/leaderboard">Leaderboard</Link>
        {user ? (
          <>
            <span className="nav-user">{user.username}</span>
            <button onClick={logout} className="nav-logout">Log out</button>
          </>
        ) : (
          <Link to="/login">Log in</Link>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/challenge/:slug" element={<Challenge />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/generate-targets" element={<GenerateTargets />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
