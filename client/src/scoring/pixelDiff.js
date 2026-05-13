export function compareCanvases(canvasA, canvasB) {
  const w = canvasA.width;
  const h = canvasA.height;
  const ctxA = canvasA.getContext('2d');
  const ctxB = canvasB.getContext('2d');
  const dataA = ctxA.getImageData(0, 0, w, h).data;
  const dataB = ctxB.getImageData(0, 0, w, h).data;
  const totalPixels = w * h;
  let totalDiff = 0;

  for (let i = 0; i < dataA.length; i += 4) {
    const dr = Math.abs(dataA[i] - dataB[i]);
    const dg = Math.abs(dataA[i + 1] - dataB[i + 1]);
    const db = Math.abs(dataA[i + 2] - dataB[i + 2]);
    totalDiff += (dr + dg + db) / (255 * 3);
  }

  return (1 - totalDiff / totalPixels) * 100;
}

export function loadImageToCanvas(src, width, height) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = src;
  });
}

export function captureIframeToCanvas(iframeEl, width, height) {
  return new Promise((resolve, reject) => {
    const doc = iframeEl.contentDocument;
    if (!doc) {
      reject(new Error('Cannot access iframe document'));
      return;
    }

    const serializer = new XMLSerializer();
    let html = serializer.serializeToString(doc);

    html = html.replace(/xmlns="[^"]*"/g, '');
    html = `<html xmlns="http://www.w3.org/1999/xhtml">${html.slice(html.indexOf('<head'))}`;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <foreignObject width="100%" height="100%">
          ${html}
        </foreignObject>
      </svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to render SVG foreignObject'));
    };

    img.src = url;
  });
}
