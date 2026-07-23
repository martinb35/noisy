/**
 * clockMode.js — Night-mode full-screen digital clock.
 *
 * Uses CSS custom property --clock-brightness for dimming.
 * Audio continues playing in background while clock is visible.
 * Acquires a Screen Wake Lock to prevent the display from sleeping.
 */

let clockInterval = null;
/** @type {WakeLockSentinel|null} */
let wakeLock = null;

async function acquireWakeLock() {
  if (!('wakeLock' in navigator)) return;
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    // Re-acquire if the page regains visibility (e.g., after tab switch)
    wakeLock.addEventListener('release', () => { wakeLock = null; });
  } catch { /* user denied or not supported */ }
}

async function releaseWakeLock() {
  if (wakeLock) {
    await wakeLock.release().catch(() => {});
    wakeLock = null;
  }
}

export function initClockMode() {
  const overlay = document.getElementById('clock-overlay');
  const display = document.getElementById('clock-display');
  const btnFS = document.getElementById('clock-fullscreen');
  const sliderBrightness = document.getElementById('clock-brightness');

  // Brightness slider updates CSS variable
  sliderBrightness.addEventListener('input', () => {
    document.documentElement.style.setProperty(
      '--clock-brightness',
      sliderBrightness.value
    );
  });

  // Enter clock mode
  btnFS.addEventListener('click', async () => {
    overlay.classList.remove('hidden');
    updateClock(display);
    clockInterval = setInterval(() => updateClock(display), 1000);

    await acquireWakeLock();

    // Try native fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  });

  // Exit on tap/click
  overlay.addEventListener('click', async () => {
    overlay.classList.add('hidden');
    if (clockInterval) clearInterval(clockInterval);
    clockInterval = null;

    await releaseWakeLock();

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  });

  // Also exit on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
      overlay.click();
    }
  });

  // Re-acquire wake lock when returning to the app (iOS releases it on visibility change)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !overlay.classList.contains('hidden')) {
      acquireWakeLock();
    }
  });
}

function updateClock(el) {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  el.textContent = `${h}:${m}`;
}
