/**
 * fftBars.js — FFT frequency-bar visualisation using AnalyserNode data.
 */

import { getAnalyser } from '../audio/sineComposer.js';

/**
 * Draw one frame of FFT bars.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width   CSS-pixel width
 * @param {number} height  CSS-pixel height
 */
export function drawFFT(ctx, width, height) {
  if (!ctx || width === 0) return;
  const analyser = getAnalyser();
  if (!analyser) return;

  const bufLen = analyser.frequencyBinCount;
  const data = new Uint8Array(bufLen);
  analyser.getByteFrequencyData(data);

  ctx.fillStyle = '#0d0d1a';
  ctx.fillRect(0, 0, width, height);

  // Show first ~256 bins (up to ~5.6 kHz at 44.1k sample rate)
  const binsToShow = Math.min(bufLen, 256);
  const barWidth = width / binsToShow;

  for (let i = 0; i < binsToShow; i++) {
    const val = data[i] / 255;
    const barH = val * height * 0.9;
    const x = i * barWidth;

    // Gradient from accent to primary
    const r = 15 + val * 218;
    const g = 52 - val * 20;
    const b = 96 - val * 0;
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(x, height - barH, barWidth - 1, barH);
  }
}
