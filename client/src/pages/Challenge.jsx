import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { apiFetch } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import TopBar from '../components/TopBar/TopBar';
import CssEditor from '../components/Editor/CssEditor';
import Preview from '../components/Preview/Preview';
import SlideShow from '../components/SlideShow/SlideShow';
import ColorPalette from '../components/ColorPalette/ColorPalette';
import SignInBanner from '../components/SignInBanner/SignInBanner';
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog';
import Skeleton from '../components/Skeleton/Skeleton';
import { compareCanvases, loadImageToCanvas, captureIframeToCanvas } from '../scoring/pixelDiff';
import './Challenge.css';

const EDITOR_SPLIT_KEY = 'duelncss-editor-split';

function getEditorLayout() {
  try {
    const saved = localStorage.getItem(EDITOR_SPLIT_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignored */ }
  return [70, 30];
}

export default function Challenge() {
  const { slug } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const previewRef = useRef(null);

  const [challenge, setChallenge] = useState(null);
  const [css, setCss] = useState('');
  const [html, setHtml] = useState('');
  const [lastScore, setLastScore] = useState(null);
  const [highScore, setHighScore] = useState(null);
  const [comparing, setComparing] = useState(false);
  const [slideShow, setSlideShow] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    apiFetch(`/challenges/${slug}`).then((c) => {
      setChallenge(c);
      setHtml(c.starter_html || '<div></div>');
    });
  }, [slug]);

  useEffect(() => {
    if (challenge && user) {
      apiFetch(`/submissions/me/${challenge.id}`).then((sub) => {
        if (sub) {
          setHighScore({ score: sub.score, chars: sub.char_count });
          setCss(sub.css_code);
          if (sub.html_code) setHtml(sub.html_code);
        }
      });
    }
  }, [challenge, user]);

  const charCount = css.length;

  const handleSubmit = useCallback(async () => {
    if (!challenge || !previewRef.current) return;
    setComparing(true);

    try {
      const iframe = previewRef.current.getIframe();
      const [userCanvas, targetCanvas] = await Promise.all([
        captureIframeToCanvas(iframe, challenge.viewport_w, challenge.viewport_h),
        loadImageToCanvas(challenge.target_image, challenge.viewport_w, challenge.viewport_h),
      ]);

      const pct = compareCanvases(userCanvas, targetCanvas);
      const rounded = Math.round(pct * 100) / 100;
      setLastScore({ score: rounded, chars: charCount });

      if (user) {
        const res = await apiFetch('/submissions', {
          method: 'POST',
          body: JSON.stringify({
            challengeId: challenge.id,
            cssCode: css,
            htmlCode: html,
            score: rounded,
            charCount,
          }),
        });
        if (res.improved) {
          setHighScore({ score: res.submission.score, chars: res.submission.char_count });
        }
      }

      toast(`Match: ${rounded.toFixed(1)}%`, 'success');
    } catch (err) {
      toast(err.message || 'Compare failed', 'error');
    } finally {
      setComparing(false);
    }
  }, [challenge, css, html, charCount, user, toast]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit]);

  const handleLoadHS = useCallback(async () => {
    if (!challenge || !user) return;

    const doLoad = async () => {
      try {
        const sub = await apiFetch(`/submissions/me/${challenge.id}`);
        if (!sub) {
          toast('No high score found', 'info');
          return;
        }
        setCss(sub.css_code);
        if (sub.html_code) setHtml(sub.html_code);
        toast('Loaded high score code', 'success');
      } catch (err) {
        toast(err.message || 'Failed to load', 'error');
      }
    };

    if (css.length > 0) {
      setConfirmAction(() => () => {
        doLoad();
        setConfirmAction(null);
      });
    } else {
      doLoad();
    }
  }, [challenge, user, css, toast]);

  const handleEditorLayoutChange = (sizes) => {
    try {
      localStorage.setItem(EDITOR_SPLIT_KEY, JSON.stringify(sizes));
    } catch { /* ignored */ }
  };

  if (!challenge) {
    return (
      <div className="challenge-page">
        <TopBar />
        <div className="challenge-loading">
          <Skeleton width="100%" height="100%" />
        </div>
      </div>
    );
  }

  return (
    <div className="challenge-page">
      <TopBar />

      {!user && (
        <div className="challenge-banner">
          <SignInBanner />
        </div>
      )}

      <div className="challenge-columns">
        {/* Left column: Editor */}
        <div className="col col-editor">
          <div className="col-header">
            <span className="col-header-label">Editor</span>
            <span className="col-header-right">{charCount} characters</span>
          </div>
          <PanelGroup
            direction="vertical"
            onLayout={handleEditorLayoutChange}
            className="editor-panels"
          >
            <Panel defaultSize={getEditorLayout()[0]} minSize={20}>
              <div className="editor-pane">
                <div className="editor-pane-label">CSS</div>
                <CssEditor value={css} onChange={(val) => setCss(val || '')} language="css" />
              </div>
            </Panel>
            <PanelResizeHandle className="editor-resize-handle">
              <div className="editor-resize-grip" />
            </PanelResizeHandle>
            <Panel defaultSize={getEditorLayout()[1]} minSize={20}>
              <div className="editor-pane">
                <div className="editor-pane-label">HTML</div>
                <CssEditor value={html} onChange={(val) => setHtml(val || '')} language="html" />
              </div>
            </Panel>
          </PanelGroup>
        </div>

        {/* Middle column: Output */}
        <div className="col col-output">
          <div className="col-header">
            <span className="col-header-label">Output</span>
            <button
              className={`slideshow-toggle ${slideShow ? 'slideshow-toggle--active' : ''}`}
              onClick={() => setSlideShow((s) => !s)}
            >
              Slide show
            </button>
          </div>
          <div className="output-body">
            <SlideShow
              targetSrc={challenge.target_image}
              viewportW={challenge.viewport_w}
              viewportH={challenge.viewport_h}
              enabled={slideShow}
            >
              <Preview
                ref={previewRef}
                css={css}
                html={html}
                viewportW={challenge.viewport_w}
                viewportH={challenge.viewport_h}
              />
            </SlideShow>

            <div className="output-actions">
              <button
                className="action-btn action-btn--primary"
                onClick={handleSubmit}
                disabled={comparing}
              >
                {comparing ? 'Submitting…' : 'Submit'}
              </button>
              {user && (
                <button
                  className="action-btn action-btn--secondary"
                  onClick={handleLoadHS}
                >
                  Load HS Code
                </button>
              )}
            </div>

            <div className="score-box">
              <div className="score-row">
                <span className="score-row-label">Last Score:</span>
                <span className="score-row-value">
                  {lastScore
                    ? `${lastScore.chars} (${Number(lastScore.score).toFixed(1)}%)`
                    : '—'}
                </span>
              </div>
              <div className="score-row">
                <span className="score-row-label">High Score:</span>
                <span className="score-row-value">
                  {highScore
                    ? `${highScore.chars} (${Number(highScore.score).toFixed(1)}%)`
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Target */}
        <div className="col col-target">
          <div className="col-header">
            <span className="col-header-label">Target {challenge.id}</span>
            <span className="col-header-right">
              {challenge.viewport_w}px x {challenge.viewport_h}px
            </span>
          </div>
          <div className="target-body">
            <div
              className="target-frame"
              style={{ width: challenge.viewport_w, height: challenge.viewport_h }}
            >
              <img
                src={challenge.target_image}
                alt="target"
                width={challenge.viewport_w}
                height={challenge.viewport_h}
              />
            </div>
            <ColorPalette colors={challenge.palette} />
          </div>
        </div>
      </div>

      {confirmAction && (
        <ConfirmDialog
          message="Replace your current code with your high score submission?"
          onConfirm={confirmAction}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}
