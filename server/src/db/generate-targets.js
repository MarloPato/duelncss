const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../../../client/public/targets');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

function save(canvas, filename) {
  const out = path.join(targetDir, filename);
  fs.writeFileSync(out, canvas.toBuffer('image/png'));
  console.log(`Created: ${out}`);
}

// 1. Simply Square — brown bg, green square top-left
{
  const c = createCanvas(400, 300);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#5d3a3a';
  ctx.fillRect(0, 0, 400, 300);
  ctx.fillStyle = '#b5e0ba';
  ctx.fillRect(0, 0, 200, 200);
  save(c, '001-simply-square.png');
}

// 2. Centered Circle — purple bg, yellow circle centered
{
  const c = createCanvas(400, 300);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#62306d';
  ctx.fillRect(0, 0, 400, 300);
  ctx.fillStyle = '#f7ec7d';
  ctx.beginPath();
  ctx.arc(200, 150, 75, 0, Math.PI * 2);
  ctx.fill();
  save(c, '002-centered-circle.png');
}

// 3. Stacked Bars — dark bg, 3 rounded bars centered
{
  const c = createCanvas(400, 300);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#222222';
  ctx.fillRect(0, 0, 400, 300);

  const bars = [
    { w: 300, color: '#e74c3c' },
    { w: 220, color: '#3498db' },
    { w: 140, color: '#2ecc71' },
  ];
  const barH = 30;
  const gap = 20;
  const totalH = bars.length * barH + (bars.length - 1) * gap;
  let y = (300 - totalH) / 2;

  for (const bar of bars) {
    const x = (400 - bar.w) / 2;
    ctx.fillStyle = bar.color;
    ctx.beginPath();
    ctx.roundRect(x, y, bar.w, barH, 4);
    ctx.fill();
    y += barH + gap;
  }
  save(c, '003-stacked-bars.png');
}

console.log('All targets generated.');
