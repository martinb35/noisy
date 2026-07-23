/**
 * noiseGen.js — Noise generator using AudioWorklet.
 *
 * Creates a NoiseProcessor worklet node, connects it through
 * a dedicated GainNode to the master output.
 */

import { getContext, getMasterGain } from './audioEngine.js';

/** @type {AudioWorkletNode|null} */
let workletNode = null;

/** @type {GainNode|null} */
let noiseGain = null;

/** @type {AnalyserNode|null} */
let noiseAnalyser = null;

let playing = false;
let currentType = 'white';
let workletReady = false;

/**
 * Ensure the worklet module is loaded (idempotent).
 */
async function ensureWorklet() {
  if (workletReady) return;
  const ctx = await getContext();
  // Resolve worklet path relative to the HTML document
  await ctx.audioWorklet.addModule('worklets/noise-processor.js');
  workletReady = true;
}

/**
 * Start noise playback.
 * @param {'white'|'brown'} [type]
 */
export async function startNoise(type) {
  const ctx = await getContext();
  await ensureWorklet();

  if (type) currentType = type;

  if (!workletNode) {
    workletNode = new AudioWorkletNode(ctx, 'noise-processor');
    noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.5;
    noiseAnalyser = ctx.createAnalyser();
    noiseAnalyser.fftSize = 2048;
    noiseAnalyser.smoothingTimeConstant = 0.6;
    workletNode.connect(noiseGain);
    noiseGain.connect(noiseAnalyser);
    noiseAnalyser.connect(getMasterGain());
  }

  workletNode.port.postMessage({ type: currentType });
  playing = true;
}

/**
 * Stop noise playback (disconnect the node).
 */
export function stopNoise() {
  if (workletNode) {
    workletNode.disconnect();
    workletNode = null;
  }
  if (noiseAnalyser) {
    noiseAnalyser.disconnect();
    noiseAnalyser = null;
  }
  if (noiseGain) {
    noiseGain.disconnect();
    noiseGain = null;
  }
  playing = false;
}

/**
 * Switch noise type while playing.
 * @param {'white'|'brown'} type
 */
export function setNoiseType(type) {
  currentType = type;
  if (workletNode) {
    workletNode.port.postMessage({ type });
  }
}

/**
 * Set noise volume (0–1).
 * @param {number} v
 */
export async function setNoiseVolume(v) {
  if (!noiseGain) return;
  const ctx = await getContext();
  noiseGain.gain.setTargetAtTime(v, ctx.currentTime, 0.02);
}

/** @returns {boolean} */
export function isPlaying() {
  return playing;
}

/**
 * Get the noise AnalyserNode for live visualisation.
 * @returns {AnalyserNode|null}
 */
export function getNoiseAnalyser() {
  return noiseAnalyser;
}
