import { useState, useEffect } from 'react';
import { apiFetch } from '../api/client';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import type { ChallengeSummary, LeaderboardEntry } from '../types';
import './LeaderboardPage.css';

export default function LeaderboardPage() {
  const [challenges, setChallenges] = useState<ChallengeSummary[]>([]);
  const [selected, setSelected] = useState('overall');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    apiFetch<ChallengeSummary[]>('/challenges').then(setChallenges);
  }, []);

  useEffect(() => {
    const path =
      selected === 'overall'
        ? '/submissions/overall'
        : `/submissions/challenge/${selected}`;
    apiFetch<LeaderboardEntry[]>(path).then(setEntries);
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
