const { Router } = require('express');
const pool = require('../db/pool');

const router = Router();

router.get('/', async (req, res) => {
  const result = await pool.query(
    'SELECT id, title, slug, target_image, viewport_w, viewport_h, created_at FROM challenges ORDER BY id'
  );
  res.json(result.rows);
});

router.get('/:slug', async (req, res) => {
  const result = await pool.query(
    'SELECT id, title, slug, target_html, target_image, viewport_w, viewport_h FROM challenges WHERE slug = $1',
    [req.params.slug]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Challenge not found' });
  }

  res.json(result.rows[0]);
});

module.exports = router;
