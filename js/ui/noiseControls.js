/**
 * noiseControls.js — Wire up the noise panel UI to the audio engine.
 */

import { startNoise, stopNoise, setNoiseType, setNoiseVolume, isPlaying } from '../audio/noiseGen.js';

export function initNoiseControls() {
  const btnPlay = document.getElementById('noise-play');
  const selType = document.getElementById('noise-type');
  const sliderVol = document.getElementById('noise-volume');
  const labelVol = document.getElementById('noise-volume-label');

  btnPlay.addEventListener('click', async () => {
    if (isPlaying()) {
      stopNoise();
      btnPlay.textContent = '▶ Play';
    } else {
      await startNoise(selType.value);
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
