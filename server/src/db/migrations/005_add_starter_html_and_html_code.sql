ALTER TABLE challenges ADD COLUMN starter_html TEXT NOT NULL DEFAULT '<div></div>';

ALTER TABLE submissions ADD COLUMN html_code TEXT NOT NULL DEFAULT '';
