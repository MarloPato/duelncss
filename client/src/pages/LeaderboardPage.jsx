import { useState, useEffect } from 'react';
import { apiFetch } from '../api/client';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import './LeaderboardPage.css';

export default function LeaderboardPage() {
  const [challenges, setChallenges] = useState([]);
  const [selected, setSelected] = useState('overall');
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    apiFetch('/challenges').then(setChallenges);
  }, []);

  useEffect(() => {
    const path =
      selected === 'overall'
        ? '/submissions/overall'
        : `/submissions/challenge/${selected}`;
    apiFetch(path).then(setEntries);
  }, [selected]);

  return (
    <div className="leaderboard-page">
      <h1>Leaderboard</h1>
      <div className="leaderboard-tabs">
        <button
          className={selected === 'overall' ? 'active' : ''}
          onClick={() => setSelected('overall')}
        >
          Overall
        </button>
        {challenges.map((c) => (
          <button
            key={c.id}
            className={selected === String(c.id) ? 'active' : ''}
            onClick={() => setSelected(String(c.id))}
          >
            {c.title}
          </button>
        ))}
      </div>
      <Leaderboard
        entries={entries}
        type={selected === 'overall' ? 'overall' : 'challenge'}
      />
    </div>
  );
}
