/**
 * sineComposer.js — 16 sine-wave oscillators with individual gain control.
 *
 * All oscillators feed into a sum GainNode, which feeds an AnalyserNode,
 * which then connects to the master gain.
 */

import { getContext, getMasterGain } from './audioEngine.js';

const NUM_OSCILLATORS = 16;

/** @type {OscillatorNode[]} */
const oscillators = [];

/** @type {GainNode[]} */
const gains = [];

/** @type {GainNode|null} */
let composerGain = null;

/** @type {AnalyserNode|null} */
let analyser = null;

let playing = false;

/**
 * Build the audio graph (idempotent while stopped).
 * oscillator[i] → gain[i] → composerGain → analyser → masterGain
 */
export async function startComposer() {
  if (playing) return;
  const ctx = await getContext();

  // Analyser for visualisation
  if (!analyser) {
    analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;
  }

  composerGain = ctx.createGain();
  composerGain.gain.value = 0.3;
  composerGain.connect(analyser);
  analyser.connect(getMasterGain());

  for (let i = 0; i < NUM_OSCILLATORS; i++) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 220 * (i + 1); // harmonic series default
    const g = ctx.createGain();
    g.gain.value = i === 0 ? 0.5 : 0; // only fundamental on by default
    osc.connect(g);
    g.connect(composerGain);
    osc.start();
    oscillators.push(osc);
    gains.push(g);
  }

  playing = true;
}

/**
 * Stop and tear down all oscillators.
 */
export function stopComposer() {
  oscillators.forEach((osc) => { try { osc.stop(); } catch {} });
  oscillators.length = 0;
  gains.length = 0;
  if (composerGain) { composerGain.disconnect(); composerGain = null; }
  if (analyser) { analyser.disconnect(); }
  playing = false;
}

/**
 * Set frequency of oscillator i.
 * @param {number} i
 * @param {number} freq  Hz
 */
export async function setFrequency(i, freq) {
  if (!oscillators[i]) return;
  const ctx = await getContext();
  oscillators[i].frequency.setTargetAtTime(freq, ctx.currentTime, 0.02);
}

/**
 * Set amplitude of oscillator i (0–1).
 * @param {number} i
 * @param {number} amp
 */
export async function setAmplitude(i, amp) {
  if (!gains[i]) return;
  const ctx = await getContext();
  gains[i].gain.setTargetAtTime(amp, ctx.currentTime, 0.02);
}

/**
 * Set master composer volume (0–1).
 * @param {number} v
 */
export async function setComposerVolume(v) {
  if (!composerGain) return;
  const ctx = await getContext();
  composerGain.gain.setTargetAtTime(v, ctx.currentTime, 0.02);
}

/**
 * Get the AnalyserNode for visualisations.
 * @returns {AnalyserNode|null}
 */
export function getAnalyser() {
  return analyser;
}

/** @returns {boolean} */
export function isPlaying() { return playing; }

/** @returns {number} */
export function getOscillatorCount() { return NUM_OSCILLATORS; }

/**
 * Get current parameters for all oscillators (for waveform viz).
 * @returns {{ freq: number, amp: number }[]}
 */
export function getParams() {
  return oscillators.map((osc, i) => ({
    freq: osc.frequency.value,
    amp: gains[i].gain.value,
  }));
}
