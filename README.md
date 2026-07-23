# Noisy

A browser-based white noise generator and Fourier-style sine wave composer, built with pure HTML, CSS, and JavaScript. Designed to be wrapped as a standalone iOS/iPadOS app using Capacitor.

**[Live Demo →](https://martinb35.github.io/noisy)**

---

## Features

### 🎧 Noise Generator
- **White noise** — flat spectral density, classic sleep/focus sound
- **Brown noise** — deeper, rumbling tone with rolled-off highs
- Play/pause and volume controls
- Runs on an `AudioWorkletProcessor` for glitch-free, off-main-thread audio

### 🎹 Sine Wave Composer
- Up to **16 independent sine wave oscillators**
- Per-oscillator **frequency** (20–4000 Hz) and **amplitude** sliders
- Real-time audio output while adjusting parameters
- Two visualization modes:
  - **Composite waveform** — mathematically computed sum of all active sines
  - **FFT bar chart** — live frequency-domain analysis via `AnalyserNode`

### 🌙 Night Mode Clock
- Full-screen digital clock overlay
- Adjustable brightness via CSS custom property
- Audio continues playing in the background
- Tap or press Escape to exit

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Audio | Web Audio API (`AudioWorkletProcessor`, `OscillatorNode`, `AnalyserNode`) |
| Visuals | HTML5 Canvas (HiDPI-aware) |
| UI | Vanilla HTML/CSS/JS with ES modules |
| Dependencies | **None** — zero npm packages |

---

## Project Structure

```
noisy/
├── index.html                  ← App shell with tab navigation
├── css/
│   └── styles.css              ← Dark theme, responsive layout, clock overlay
├── js/
│   ├── main.js                 ← Entry point, bootstraps all modules
│   ├── audio/
│   │   ├── audioEngine.js      ← AudioContext singleton, master gain
│   │   ├── noiseGen.js         ← White/brown noise via AudioWorklet
│   │   └── sineComposer.js     ← 16 oscillators → AnalyserNode → master
│   ├── viz/
│   │   ├── waveform.js         ← Computed composite sine waveform
│   │   └── fftBars.js          ← Live FFT frequency bar chart
│   └── ui/
│       ├── noiseControls.js    ← Noise play/pause, volume, type selector
│       ├── clockMode.js        ← Night-mode clock with brightness
│       └── composerControls.js ← Sine slider grid, viz toggle
└── worklets/
    └── noise-processor.js      ← AudioWorkletProcessor (white + brown)
```

---

## Getting Started

The app uses ES modules and AudioWorklet, which require a local HTTP server:

```bash
# Python
python -m http.server 8000

# or Node.js
npx serve .
```

Then open [http://localhost:8000](http://localhost:8000).

---

## Roadmap

### Near-term
- [ ] **Pink noise** — 1/f spectral slope, popular for masking
- [ ] **Preset system** — save and recall composer configurations (localStorage)
- [ ] **Mix mode** — play noise and sine composer simultaneously with independent volumes
- [ ] **Timer / auto-stop** — set a duration for noise playback (e.g., 30 min, 1 hr)
- [ ] **Keyboard shortcuts** — spacebar for play/pause, arrow keys for volume

### Medium-term
- [ ] **Additional waveform types** — square, sawtooth, and triangle oscillators in the composer
- [ ] **Envelope controls** — attack/decay/sustain/release per oscillator for shaping tones
- [ ] **Export audio** — record the composed signal to WAV/MP3 via `MediaRecorder`
- [ ] **Import/export presets** — share composer configurations as JSON files
- [ ] **Responsive canvas** — debounced resize observer for smoother layout transitions
- [ ] **Accessibility** — ARIA labels, screen reader announcements, high-contrast theme

### iOS / iPadOS App
- [ ] **Capacitor integration** — wrap as a native app (`npx cap init` → `npx cap add ios`)
- [ ] **Background audio** — configure `UIBackgroundModes` for uninterrupted playback
- [ ] **Lock screen controls** — `MediaSession` API for play/pause from Control Center
- [ ] **Haptic feedback** — subtle haptics on button presses via Capacitor Haptics plugin
- [ ] **App icon and splash screen** — branded assets for the App Store

### Stretch goals
- [ ] **Binaural beats** — stereo oscillators with configurable frequency offset per ear
- [ ] **Spatial audio** — pan individual oscillators in the stereo field
- [ ] **Microphone input** — visualize live audio from the mic on the FFT display
- [ ] **MIDI control** — map MIDI CC knobs to oscillator parameters
- [ ] **Shareable URLs** — encode composer state in URL hash for instant sharing

---

## Contributing

This is a personal project, but issues and PRs are welcome. Keep it dependency-free — the goal is a single static site that runs anywhere.

---

## License

MIT
