import { useState, useEffect } from 'react';
import { apiFetch } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import ChallengeCard from '../components/ChallengeCard/ChallengeCard';
import Skeleton from '../components/Skeleton/Skeleton';
import './Home.css';

export default function Home() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState(null);
  const [bestScores, setBestScores] = useState({});

  useEffect(() => {
    apiFetch('/challenges').then(setChallenges);
  }, []);

  useEffect(() => {
    if (user) {
      apiFetch('/submissions/me').then((rows) => {
        const map = {};
        for (const r of rows) {
          map[r.challenge_id] = r.score;
        }
        setBestScores(map);
      });
    }
  }, [user]);

  return (
    <div className="home">
      <h1 className="home-title">DuelNCss</h1>
      <p className="home-subtitle">Replicate the target using pure CSS. How close can you get?</p>

      {challenges === null ? (
        <div className="challenge-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card-skeleton">
              <Skeleton width="100%" height={0} style={{ paddingBottom: '75%' }} />
              <div className="card-skeleton-body">
                <Skeleton width="60%" height={16} />
                <Skeleton width="40%" height={12} style={{ marginTop: 6 }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="challenge-grid">
          {challenges.map((c) => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              bestScore={bestScores[c.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
