require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const fs = require('fs');
const path = require('path');
const pool = require('./pool');

async function seed() {
  const sql = fs.readFileSync(
    path.join(__dirname, 'seeds/seed_challenges.sql'),
    'utf8'
  );
  await pool.query(sql);
  console.log('Seed data inserted.');
  await pool.end();
}

seed();
