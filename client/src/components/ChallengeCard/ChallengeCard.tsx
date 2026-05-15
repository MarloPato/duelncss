import { Link } from 'react-router-dom';
import type { ChallengeSummary } from '../../types';
import './ChallengeCard.css';

interface ChallengeCardProps {
  challenge: ChallengeSummary;
  bestScore?: number;
}

export default function ChallengeCard({ challenge, bestScore }: ChallengeCardProps) {
  return (
    <Link to={`/challenge/${challenge.slug}`} className="card">
      <div className="card-thumb">
        <img src={challenge.target_image} alt={challenge.title} />
      </div>
      <div className="card-body">
        <span className="card-title">{challenge.title}</span>
        <span className="card-size">
          {challenge.viewport_w} × {challenge.viewport_h}
        </span>
      </div>
      {bestScore !== undefined && (
        <div className="card-badge">
          Your best: {Number(bestScore).toFixed(1)}%
        </div>
      )}
    </Link>
  );
}
