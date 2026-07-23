/**
 * audioEngine.js — AudioContext lifecycle and master gain.
 *
 * Singleton-style: import and call getContext() to get the shared AudioContext.
 * The context is created lazily on the first user gesture (required by browsers).
 */

/** @type {AudioContext|null} */
let ctx = null;

/** @type {GainNode|null} */
let masterGain = null;

/**
 * Initialise (or resume) the AudioContext.
 * Must be called from a user-gesture handler the first time.
 * @returns {Promise<AudioContext>}
 */
export async function getContext() {
  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = 1;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  return ctx;
}

/**
 * Returns the master GainNode (connects sources here).
 * @returns {GainNode}
 */
export function getMasterGain() {
  if (!masterGain) throw new Error('Call getContext() first');
  return masterGain;
}

/**
 * Set master volume (0–1).
 * @param {number} v
 */
export function setMasterVolume(v) {
  if (masterGain) {
    masterGain.gain.setTargetAtTime(v, ctx.currentTime, 0.02);
  }
}
