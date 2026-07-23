/**
 * clockMode.js — Night-mode full-screen digital clock.
 *
 * Uses CSS custom property --clock-brightness for dimming.
 * Audio continues playing in background while clock is visible.
 */

let clockInterval = null;

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
  btnFS.addEventListener('click', () => {
    overlay.classList.remove('hidden');
    updateClock(display);
    clockInterval = setInterval(() => updateClock(display), 1000);

    // Try native fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  });

  // Exit on tap/click
  overlay.addEventListener('click', () => {
    overlay.classList.add('hidden');
    if (clockInterval) clearInterval(clockInterval);
    clockInterval = null;

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
}

function updateClock(el) {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  el.textContent = `${h}:${m}`;
}
