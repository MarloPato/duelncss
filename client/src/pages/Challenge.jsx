import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import CssEditor from '../components/Editor/CssEditor';
import Preview from '../components/Preview/Preview';
import ScoreOverlay from '../components/ScoreOverlay/ScoreOverlay';
import { compareCanvases, loadImageToCanvas, captureIframeToCanvas } from '../scoring/pixelDiff';
import './Challenge.css';

export default function Challenge() {
  const { slug } = useParams();
  const { user } = useAuth();
  const previewRef = useRef(null);

  const [challenge, setChallenge] = useState(null);
  const [css, setCss] = useState('');
  const [score, setScore] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [bestScore, setBestScore] = useState(null);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    apiFetch(`/challenges/${slug}`).then(setChallenge);
  }, [slug]);

  useEffect(() => {
    if (challenge && user) {
      apiFetch(`/submissions/me/${challenge.id}`).then((sub) => {
        if (sub) {
          setBestScore(sub.score);
          setCss(sub.css_code);
        }
      });
    }
  }, [challenge, user]);

  const handleCompare = async () => {
    if (!challenge || !previewRef.current) return;
    setComparing(true);

    try {
      const iframe = previewRef.current.getIframe();
      const [userCanvas, targetCanvas] = await Promise.all([
        captureIframeToCanvas(iframe, challenge.viewport_w, challenge.viewport_h),
        loadImageToCanvas(challenge.target_image, challenge.viewport_w, challenge.viewport_h),
      ]);

      const result = compareCanvases(userCanvas, targetCanvas);
      const chars = css.length;
      setScore(result);
      setCharCount(chars);

      if (user) {
        const res = await apiFetch('/submissions', {
          method: 'POST',
          body: JSON.stringify({
            challengeId: challenge.id,
            cssCode: css,
            score: Math.round(result * 100) / 100,
            charCount: chars,
          }),
        });
        if (res.improved) {
          setBestScore(res.submission.score);
        }
      }
    } finally {
      setComparing(false);
    }
  };

  if (!challenge) return <div className="loading">Loading...</div>;

  return (
    <div className="challenge-page">
      <div className="challenge-header">
        <h2>{challenge.title}</h2>
        <div className="challenge-meta">
          {challenge.viewport_w} x {challenge.viewport_h}
          {bestScore !== null && <span className="best-score">Best: {Number(bestScore).toFixed(1)}%</span>}
        </div>
      </div>

      <div className="challenge-layout">
        <div className="challenge-left">
          <CssEditor value={css} onChange={(val) => setCss(val || '')} />
        </div>

        <div className="challenge-right">
          <div className="previews">
            <div className="target-preview">
              <div className="preview-label">Target</div>
              <div className="preview-frame" style={{ width: challenge.viewport_w, height: challenge.viewport_h }}>
                <img
                  src={challenge.target_image}
                  alt="target"
                  width={challenge.viewport_w}
                  height={challenge.viewport_h}
                />
              </div>
            </div>

            <Preview
              ref={previewRef}
              css={css}
              viewportW={challenge.viewport_w}
              viewportH={challenge.viewport_h}
            />
          </div>

          <button
            className="compare-btn"
            onClick={handleCompare}
            disabled={comparing}
          >
            {comparing ? 'Comparing...' : 'Compare'}
          </button>
        </div>
      </div>

      <ScoreOverlay
        score={score}
        charCount={charCount}
        onClose={() => setScore(null)}
      />
    </div>
  );
}
