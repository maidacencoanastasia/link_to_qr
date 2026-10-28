import './styles/style.css';
import { initQrCode } from './js/qr.js';
import { updateHistoryCount } from './js/history.js';
import { initScanner } from './js/scanner.js';
import { setupEvents } from './js/events.js';

let initialized = false;

function start() {
  if (initialized) return;
  initialized = true;
  initQrCode();
  updateHistoryCount();
  initScanner();
  setupEvents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
