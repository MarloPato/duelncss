import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './TopBar.css';

interface TopBarProps {
  challengeName?: string;
  score?: number | null;
  charCount?: number;
  onCompare?: () => void;
  comparing?: boolean;
}

export default function TopBar({ challengeName, score, charCount, onCompare, comparing }: TopBarProps) {
  const { user, logout } = useAuth();
  const isChallenge = !!challengeName;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <Link to="/" className="topbar-logo">DuelNCss</Link>
      </div>

      {isChallenge && (
        <div className="topbar-center">
          <span className="topbar-challenge">{challengeName}</span>
        </div>
      )}

      <div className="topbar-right">
        {isChallenge && (
          <div className="topbar-stats">
            {score !== null && score !== undefined && (
              <span className="topbar-score">{Number(score).toFixed(1)}%</span>
            )}
            <span className="topbar-chars">{charCount} chars</span>
            <button
              className="topbar-submit"
              onClick={onCompare}
              disabled={comparing}
            >
              {comparing ? 'Comparing…' : 'Compare'}
            </button>
          </div>
        )}

        {!isChallenge && (
          <nav className="topbar-nav">
            <Link to="/leaderboard" className="topbar-link">Leaderboard</Link>
            {user ? (
              <>
                <span className="topbar-user">{user.username}</span>
                <button onClick={logout} className="topbar-logout">Log out</button>
              </>
            ) : (
              <Link to="/login" className="topbar-link">Log in</Link>
            )}
          </nav>
        )}

        {isChallenge && (
          <nav className="topbar-nav topbar-nav--challenge">
            {user ? (
              <span className="topbar-user">{user.username}</span>
            ) : (
              <Link to="/login" className="topbar-link">Log in</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
