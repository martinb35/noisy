/**
 * composerControls.js — Build 16 sine-wave slider rows and wire them up.
 */

import {
  startComposer, stopComposer, isPlaying,
  setFrequency, setAmplitude, setComposerVolume,
  getOscillatorCount,
} from '../audio/sineComposer.js';
import { drawWaveform } from '../viz/waveform.js';
import { drawFFT } from '../viz/fftBars.js';

let vizMode = 'waveform'; // 'waveform' | 'fft'
let rafId = null;

/** @type {HTMLCanvasElement} */
let canvas = null;
/** @type {CanvasRenderingContext2D} */
let canvasCtx = null;
let cWidth = 0;
let cHeight = 0;

/** Measure canvas and set backing-store size for HiDPI. */
function resizeCanvas() {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0) return; // still hidden
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvasCtx = canvas.getContext('2d');
  canvasCtx.setTransform(dpr, 0, 0, dpr, 0, 0); // reset then apply DPR
  cWidth = rect.width;
  cHeight = rect.height;
}

export function initComposerControls() {
  const container = document.getElementById('sine-sliders');
  canvas = document.getElementById('viz-canvas');
  canvasCtx = canvas.getContext('2d');
  const btnPlay = document.getElementById('composer-play');
  const btnWave = document.getElementById('viz-waveform');
  const btnFFT = document.getElementById('viz-fft');
  const sliderVol = document.getElementById('composer-volume');
  const labelVol = document.getElementById('composer-volume-label');
  const n = getOscillatorCount();

  // Build slider rows
  for (let i = 0; i < n; i++) {
    const row = document.createElement('div');
    row.className = 'sine-row';

    const defaultFreq = 220 * (i + 1);
    const defaultAmp = i === 0 ? 0.5 : 0;

    row.innerHTML = `
      <span class="label">${i + 1}</span>
      <label>Hz</label>
      <input type="range" class="freq-slider" data-i="${i}"
             min="20" max="4000" step="1" value="${defaultFreq}">
      <span class="value freq-val">${defaultFreq} Hz</span>
      <label>Amp</label>
      <input type="range" class="amp-slider" data-i="${i}"
             min="0" max="1" step="0.01" value="${defaultAmp}">
      <span class="value amp-val">${defaultAmp.toFixed(2)}</span>
    `;
    container.appendChild(row);
  }

  // Slider events (delegated)
  container.addEventListener('input', (e) => {
    const target = e.target;
    const i = parseInt(target.dataset.i, 10);
    if (isNaN(i)) return;
    const row = target.closest('.sine-row');

    if (target.classList.contains('freq-slider')) {
      const freq = parseFloat(target.value);
      setFrequency(i, freq);
      row.querySelector('.freq-val').textContent = `${freq} Hz`;
    } else if (target.classList.contains('amp-slider')) {
      const amp = parseFloat(target.value);
      setAmplitude(i, amp);
      row.querySelector('.amp-val').textContent = amp.toFixed(2);
    }
  });

  // Play/pause
  btnPlay.addEventListener('click', async () => {
    if (isPlaying()) {
      stopComposer();
      cancelAnimationFrame(rafId);
      btnPlay.textContent = '▶ Play';
    } else {
      await startComposer();
      btnPlay.textContent = '⏸ Pause';
      startVizLoop();
    }
  });

  // Volume
  sliderVol.addEventListener('input', () => {
    const v = parseFloat(sliderVol.value);
    setComposerVolume(v);
    labelVol.textContent = `${Math.round(v * 100)}%`;
  });

  // Viz toggle
  btnWave.addEventListener('click', () => {
    vizMode = 'waveform';
    btnWave.classList.add('active');
    btnFFT.classList.remove('active');
  });
  btnFFT.addEventListener('click', () => {
    vizMode = 'fft';
    btnFFT.classList.add('active');
    btnWave.classList.remove('active');
  });

  // Listen for window resize to re-measure canvas
  window.addEventListener('resize', resizeCanvas);
}

function startVizLoop() {
  function frame() {
    // Re-measure canvas on first frame and when size changes
    if (cWidth === 0) resizeCanvas();

    if (vizMode === 'waveform') {
      drawWaveform(canvasCtx, cWidth, cHeight);
    } else {
      drawFFT(canvasCtx, cWidth, cHeight);
    }
    rafId = requestAnimationFrame(frame);
  }
  resizeCanvas(); // measure now (panel is visible at this point)
  rafId = requestAnimationFrame(frame);
}
