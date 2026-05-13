CREATE TABLE IF NOT EXISTS submissions (
  id            SERIAL PRIMARY KEY,
  user_id       INT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id  INT          NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  css_code      TEXT         NOT NULL,
  score         NUMERIC(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  char_count    INT          NOT NULL,
  submitted_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  UNIQUE (user_id, challenge_id)
);

CREATE INDEX idx_submissions_challenge_score
  ON submissions (challenge_id, score DESC, char_count ASC);
