INSERT INTO challenges (title, slug, target_html, target_image, viewport_w, viewport_h, palette, starter_html)
VALUES
  (
    'Simply Square',
    'simply-square',
    '<html><head><style>body{margin:0;background:#5d3a3a}div{width:200px;height:200px;background:#b5e0ba}</style></head><body><div></div></body></html>',
    '/targets/001-simply-square.png',
    400,
    300,
    ARRAY['#5d3a3a', '#b5e0ba'],
    '<div></div>'
  ),
  (
    'Centered Circle',
    'centered-circle',
    '<html><head><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#62306d}div{width:150px;height:150px;border-radius:50%;background:#f7ec7d}</style></head><body><div></div></body></html>',
    '/targets/002-centered-circle.png',
    400,
    300,
    ARRAY['#62306d', '#f7ec7d'],
    '<div></div>'
  ),
  (
    'Stacked Bars',
    'stacked-bars',
    '<html><head><style>body{margin:0;display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;gap:20px;background:#222}.bar{height:30px;border-radius:4px}.bar:nth-child(1){width:300px;background:#e74c3c}.bar:nth-child(2){width:220px;background:#3498db}.bar:nth-child(3){width:140px;background:#2ecc71}</style></head><body><div class="bar"></div><div class="bar"></div><div class="bar"></div></body></html>',
    '/targets/003-stacked-bars.png',
    400,
    300,
    ARRAY['#222222', '#e74c3c', '#3498db', '#2ecc71'],
    '<div class="bar"></div><div class="bar"></div><div class="bar"></div>'
  )
ON CONFLICT (slug) DO NOTHING;
