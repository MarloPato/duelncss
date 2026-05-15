import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast/ToastContext';
import TopBar from './components/TopBar/TopBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Challenge from './pages/Challenge';
import LeaderboardPage from './pages/LeaderboardPage';
import GenerateTargets from './pages/GenerateTargets';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/challenge/:slug" element={<Challenge />} />
            <Route path="*" element={<ShellLayout />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

function ShellLayout() {
  return (
    <>
      <TopBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/generate-targets" element={<GenerateTargets />} />
      </Routes>
    </>
  );
}
