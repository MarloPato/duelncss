import './ScoreOverlay.css';

export default function ScoreOverlay({ score, charCount, onClose }) {
  if (score === null) return null;

  return (
    <div className="score-overlay" onClick={onClose}>
      <div className="score-card" onClick={(e) => e.stopPropagation()}>
        <div className="score-value">{score.toFixed(1)}%</div>
        <div className="score-label">Match</div>
        <div className="score-chars">{charCount} characters</div>
        <button className="score-close" onClick={onClose}>Continue Editing</button>
      </div>
    </div>
  );
}
