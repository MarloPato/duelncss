CREATE TABLE IF NOT EXISTS challenges (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(120) NOT NULL,
  slug          VARCHAR(120) NOT NULL UNIQUE,
  target_html   TEXT         NOT NULL,
  target_image  VARCHAR(255) NOT NULL,
  viewport_w    INT          NOT NULL DEFAULT 400,
  viewport_h    INT          NOT NULL DEFAULT 300,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);
