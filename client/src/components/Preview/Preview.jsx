import { useRef, useImperativeHandle, forwardRef } from 'react';
import './Preview.css';

const Preview = forwardRef(function Preview({ css, html, viewportW, viewportH }, ref) {
  const iframeRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getIframe: () => iframeRef.current,
  }));

  const srcdoc = `<!DOCTYPE html>
<html>
<head><style>${css}</style></head>
<body>${html || ''}</body>
</html>`;

  return (
    <iframe
      ref={iframeRef}
      className="preview-iframe"
      srcDoc={srcdoc}
      title="preview"
      sandbox="allow-same-origin"
      width={viewportW}
      height={viewportH}
    />
  );
});

export default Preview;
