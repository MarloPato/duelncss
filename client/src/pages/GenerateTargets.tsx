import { useState, useEffect } from 'react';
import { apiFetch } from '../api/client';
import type { Challenge } from '../types';

export default function GenerateTargets() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    apiFetch<Challenge[]>('/challenges').then((data) => {
      setChallenges(data.map(c => ({ ...c })));
      return apiFetch(`/challenges/${data[0]?.slug}`);
    }).then(() => {
      return apiFetch<{ slug: string }[]>('/challenges').then(async (summaries) => {
        const full: Challenge[] = [];
        for (const s of summaries) {
          const c = await apiFetch<Challenge>(`/challenges/${s.slug}`);
          full.push(c);
        }
        setChallenges(full);
      });
    });
  }, []);

  const generate = async (challenge: Challenge) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '-9999px';
    iframe.width = String(challenge.viewport_w);
    iframe.height = String(challenge.viewport_h);
    document.body.appendChild(iframe);
    iframe.srcdoc = challenge.target_html;

    await new Promise(r => { iframe.onload = r; });
    await new Promise(r => setTimeout(r, 200));

    const doc = iframe.contentDocument!;
    const serializer = new XMLSerializer();
    let html = serializer.serializeToString(doc);
    html = html.replace(/xmlns="[^"]*"/g, '');
    html = `<html xmlns="http://www.w3.org/1999/xhtml">${html.slice(html.indexOf('<head'))}`;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${challenge.viewport_w}" height="${challenge.viewport_h}">
      <foreignObject width="100%" height="100%">${html}</foreignObject>
    </svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = challenge.viewport_w;
    canvas.height = challenge.viewport_h;
    canvas.getContext('2d')!.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    const a = document.createElement('a');
    a.download = challenge.target_image.split('/').pop()!;
    a.href = canvas.toDataURL('image/png');
    a.click();

    document.body.removeChild(iframe);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2 style={{ color: '#e0e0e0' }}>Generate Target PNGs</h2>
      <p style={{ color: '#888' }}>Click each button to download the target PNG.</p>
      {challenges.map(c => (
        <div key={c.id} style={{ marginBottom: 12 }}>
          <button onClick={() => generate(c)} style={{ padding: '8px 16px', cursor: 'pointer' }}>
            Download {c.title} ({c.target_image})
          </button>
        </div>
      ))}
    </div>
  );
}
