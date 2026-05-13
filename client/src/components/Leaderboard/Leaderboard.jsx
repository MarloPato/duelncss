import './Leaderboard.css';

export default function Leaderboard({ entries, type }) {
  return (
    <table className="leaderboard-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Player</th>
          <th>Score</th>
          {type === 'challenge' && <th>Chars</th>}
          {type === 'overall' && <th>Challenges</th>}
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, i) => (
          <tr key={entry.username + i}>
            <td>{i + 1}</td>
            <td>{entry.username}</td>
            <td>{Number(type === 'overall' ? entry.total_score : entry.score).toFixed(1)}</td>
            {type === 'challenge' && <td>{entry.char_count}</td>}
            {type === 'overall' && <td>{entry.challenges_completed}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
