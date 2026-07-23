/**
 * noise-processor.js — AudioWorkletProcessor for white & brown noise.
 *
 * Runs on the audio thread. Receives noise-type messages from the main thread.
 */

class NoiseProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.type = 'white'; // 'white' | 'brown'
    this.brownState = 0;

    this.port.onmessage = (e) => {
      if (e.data.type) {
        this.type = e.data.type;
        this.brownState = 0;
      }
    };
  }

  process(_inputs, outputs) {
    const output = outputs[0];
    for (let channel = 0; channel < output.length; channel++) {
      const buf = output[channel];
      if (this.type === 'brown') {
        this._fillBrown(buf);
      } else {
        this._fillWhite(buf);
      }
    }
    return true; // keep alive
  }

  _fillWhite(buf) {
    for (let i = 0; i < buf.length; i++) {
      buf[i] = Math.random() * 2 - 1;
    }
  }

  _fillBrown(buf) {
    // Brown noise: integrate white noise with leak factor
    const leak = 0.98;
    for (let i = 0; i < buf.length; i++) {
      const white = Math.random() * 2 - 1;
      this.brownState = leak * this.brownState + white * 0.1;
      // Clamp to prevent drift
      if (this.brownState > 1) this.brownState = 1;
      if (this.brownState < -1) this.brownState = -1;
      buf[i] = this.brownState;
    }
  }
}

registerProcessor('noise-processor', NoiseProcessor);
