const { Router } = require('express');
const pool = require('../db/pool');
const authMiddleware = require('../middleware/auth');

const router = Router();

router.post('/', authMiddleware, async (req, res) => {
  const { challengeId, cssCode, score, charCount } = req.body;
  const userId = req.user.id;

  if (challengeId == null || !cssCode || score == null || charCount == null) {
    return res.status(400).json({ error: 'challengeId, cssCode, score, and charCount are required' });
  }

  const result = await pool.query(
    `INSERT INTO submissions (user_id, challenge_id, css_code, score, char_count)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id, challenge_id)
     DO UPDATE SET css_code = $3, score = $4, char_count = $5, submitted_at = now()
       WHERE submissions.score < $4 OR (submissions.score = $4 AND submissions.char_count > $5)
     RETURNING id, score, char_count`,
    [userId, challengeId, cssCode, score, charCount]
  );

  const row = result.rows[0];
  if (!row) {
    const existing = await pool.query(
      'SELECT id, score, char_count FROM submissions WHERE user_id = $1 AND challenge_id = $2',
      [userId, challengeId]
    );
    return res.json({ improved: false, submission: existing.rows[0] });
  }

  res.status(201).json({ improved: true, submission: row });
});

router.get('/challenge/:challengeId', async (req, res) => {
  const result = await pool.query(
    `SELECT s.score, s.char_count, s.submitted_at, u.username
     FROM submissions s
     JOIN users u ON u.id = s.user_id
     WHERE s.challenge_id = $1
     ORDER BY s.score DESC, s.char_count ASC
     LIMIT 50`,
    [req.params.challengeId]
  );
  res.json(result.rows);
});

router.get('/overall', async (req, res) => {
  const result = await pool.query(
    `SELECT u.username, SUM(s.score) AS total_score, COUNT(s.id) AS challenges_completed
     FROM submissions s
     JOIN users u ON u.id = s.user_id
     GROUP BY u.id, u.username
     ORDER BY total_score DESC
     LIMIT 50`
  );
  res.json(result.rows);
});

router.get('/me/:challengeId', authMiddleware, async (req, res) => {
  const result = await pool.query(
    'SELECT id, score, char_count, css_code, submitted_at FROM submissions WHERE user_id = $1 AND challenge_id = $2',
    [req.user.id, req.params.challengeId]
  );
  res.json(result.rows[0] || null);
});

module.exports = router;
