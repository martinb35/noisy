/**
 * waveform.js — Draw the composite waveform of all active sine waves.
 *
 * This is a *computed* waveform (sum of sines at their current params),
 * not a live time-domain capture. It updates whenever slider values change.
 */

import { getParams } from '../audio/sineComposer.js';

/**
 * Draw the composite waveform once.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width   CSS-pixel width
 * @param {number} height  CSS-pixel height
 */
export function drawWaveform(ctx, width, height) {
  if (!ctx || width === 0) return;
  const params = getParams();

  ctx.fillStyle = '#0d0d1a';
  ctx.fillRect(0, 0, width, height);

  const activeFreqs = params.filter((p) => p.amp > 0.001).map((p) => p.freq);
  if (activeFreqs.length === 0) return;

  const lowestFreq = Math.min(...activeFreqs);
  const periodsToShow = 2;
  const totalTime = periodsToShow / lowestFreq; // seconds

  ctx.strokeStyle = '#e94560';
  ctx.lineWidth = 1.5;
  ctx.beginPath();

  for (let x = 0; x < width; x++) {
    const t = (x / width) * totalTime;
    let y = 0;
    for (const p of params) {
      y += p.amp * Math.sin(2 * Math.PI * p.freq * t);
    }
    // Normalise: map [-maxAmp, maxAmp] → [height*0.9, height*0.1]
    const maxAmp = params.reduce((s, p) => s + p.amp, 0) || 1;
    const py = height / 2 - (y / maxAmp) * (height * 0.4);
    if (x === 0) ctx.moveTo(x, py);
    else ctx.lineTo(x, py);
  }

  ctx.stroke();
}
