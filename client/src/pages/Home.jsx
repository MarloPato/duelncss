import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import './Home.css';

export default function Home() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    apiFetch('/challenges').then(setChallenges);
  }, []);

  return (
    <div className="home">
      <h1>DuelNCss</h1>
      <p className="home-subtitle">Replicate the target using pure CSS. How close can you get?</p>
      <div className="challenge-grid">
        {challenges.map((c) => (
          <Link to={`/challenge/${c.slug}`} key={c.id} className="challenge-card">
            <div className="challenge-thumb">
              <img src={c.target_image} alt={c.title} />
            </div>
            <div className="challenge-title">{c.title}</div>
            <div className="challenge-size">{c.viewport_w} x {c.viewport_h}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
