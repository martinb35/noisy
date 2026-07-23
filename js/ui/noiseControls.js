/**
 * noiseControls.js — Wire up the noise panel UI to the audio engine.
 */

import { startNoise, stopNoise, setNoiseType, setNoiseVolume, isPlaying, getNoiseAnalyser } from '../audio/noiseGen.js';

let rafId = null;
let canvasCtx = null;
let cWidth = 0;
let cHeight = 0;

function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvasCtx = canvas.getContext('2d');
  canvasCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  cWidth = rect.width;
  cHeight = rect.height;
}

function drawLiveWaveform() {
  if (!canvasCtx || cWidth === 0) return;
  const analyser = getNoiseAnalyser();

  canvasCtx.fillStyle = '#0d0d1a';
  canvasCtx.fillRect(0, 0, cWidth, cHeight);

  if (!analyser) return;

  const bufLen = analyser.frequencyBinCount;
  const data = new Float32Array(bufLen);
  analyser.getFloatTimeDomainData(data);

  canvasCtx.strokeStyle = '#e94560';
  canvasCtx.lineWidth = 1.5;
  canvasCtx.beginPath();

  const sliceWidth = cWidth / bufLen;
  for (let i = 0; i < bufLen; i++) {
    const x = i * sliceWidth;
    const y = cHeight / 2 - data[i] * cHeight * 0.4;
    if (i === 0) canvasCtx.moveTo(x, y);
    else canvasCtx.lineTo(x, y);
  }
  canvasCtx.stroke();
}

function startVizLoop(canvas) {
  if (cWidth === 0) resizeCanvas(canvas);
  function frame() {
    drawLiveWaveform();
    rafId = requestAnimationFrame(frame);
  }
  rafId = requestAnimationFrame(frame);
}

function stopVizLoop() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  // Clear canvas
  if (canvasCtx && cWidth > 0) {
    canvasCtx.fillStyle = '#0d0d1a';
    canvasCtx.fillRect(0, 0, cWidth, cHeight);
  }
}

export function initNoiseControls() {
  const btnPlay = document.getElementById('noise-play');
  const selType = document.getElementById('noise-type');
  const sliderVol = document.getElementById('noise-volume');
  const labelVol = document.getElementById('noise-volume-label');
  const canvas = document.getElementById('noise-canvas');

  resizeCanvas(canvas);
  window.addEventListener('resize', () => resizeCanvas(canvas));

  btnPlay.addEventListener('click', async () => {
    if (isPlaying()) {
      stopNoise();
      stopVizLoop();
      btnPlay.textContent = '▶ Play';
    } else {
      await startNoise(selType.value);
      startVizLoop(canvas);
      btnPlay.textContent = '⏸ Pause';
    }
  });

  selType.addEventListener('change', () => {
    setNoiseType(selType.value);
  });

  sliderVol.addEventListener('input', () => {
    const v = parseFloat(sliderVol.value);
    setNoiseVolume(v);
    labelVol.textContent = `${Math.round(v * 100)}%`;
  });
}
