import html2canvas from 'html2canvas';

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

export async function captureIframeToCanvas(iframeEl, width, height) {
  const doc = iframeEl.contentDocument;
  if (!doc) throw new Error('Cannot access iframe document');

  const canvas = await html2canvas(doc.documentElement, {
    width,
    height,
    logging: false,
    windowWidth: width,
    windowHeight: height,
  });

  return canvas;
}
