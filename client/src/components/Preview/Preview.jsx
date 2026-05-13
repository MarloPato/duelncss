import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import './Preview.css';

const Preview = forwardRef(function Preview({ css, viewportW, viewportH }, ref) {
  const iframeRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getIframe: () => iframeRef.current,
  }));

  const srcdoc = `<!DOCTYPE html>
<html>
<head><style>${css}</style></head>
<body></body>
</html>`;

  return (
    <div className="preview-container">
      <div className="preview-label">Your Output</div>
      <div className="preview-frame" style={{ width: viewportW, height: viewportH }}>
        <iframe
          ref={iframeRef}
          srcDoc={srcdoc}
          title="preview"
          sandbox="allow-same-origin"
          width={viewportW}
          height={viewportH}
        />
      </div>
    </div>
  );
});

export default Preview;
