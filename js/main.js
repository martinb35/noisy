/**
 * main.js — Entry point. Wires up tab navigation and initialises all modules.
 */

import { initNoiseControls } from './ui/noiseControls.js';
import { initClockMode } from './ui/clockMode.js';
import { initComposerControls } from './ui/composerControls.js';

// ===== Tab navigation =====
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`panel-${tab.dataset.tab}`).classList.add('active');
    });
  });
}

// ===== Bootstrap =====
function init() {
  initTabs();
  initNoiseControls();
  initClockMode();
  initComposerControls();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
