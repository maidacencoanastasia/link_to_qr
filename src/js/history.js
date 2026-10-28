import { state } from './state.js';
import { dom } from './dom.js';
import { showToast } from './toast.js';
import { requestQrUpdate } from './qr.js';

export function saveHistoryItem() {
  if (!state.currentPayload) return;

  try {
    const canvas = dom.qrContainer?.querySelector('canvas');
    const thumb = canvas ? canvas.toDataURL('image/png', 0.5) : null;

    const item = {
      id: Date.now(),
      type: state.type,
      title: dom.previewContentTag?.textContent || 'QR Code',
      payload: state.currentPayload,
      thumb: thumb,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Prepend & limit to 10
    state.history = [item, ...state.history.filter(h => h.payload !== item.payload)].slice(0, 10);
    localStorage.setItem('qr_studio_history', JSON.stringify(state.history));
    updateHistoryCount();
  } catch (err) {
    console.warn('History save issue:', err);
  }
}

export function updateHistoryCount() {
  if (dom.historyCount) {
    dom.historyCount.textContent = state.history.length;
  }
}

export function renderHistory() {
  if (!dom.historyList) return;

  if (!state.history.length) {
    dom.historyList.innerHTML = `
      <div class="history-empty">
        <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" stroke-width="1.5" fill="none"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        <p>No QR codes saved yet.<br>Export or generate one to see it here!</p>
      </div>
    `;
    return;
  }

  dom.historyList.innerHTML = state.history.map(item => `
    <div class="history-item" data-id="${item.id}">
      <div class="history-thumb">
        <img src="${item.thumb || ''}" alt="QR">
      </div>
      <div class="history-info">
        <div class="history-title">${item.title}</div>
        <div class="history-time">${item.timestamp}</div>
      </div>
      <div class="history-item-actions">
        <button class="icon-button-small restore-btn" title="Restore to Editor">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
        </button>
        <button class="icon-button-small delete-btn" title="Delete">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  `).join('');

  // Attach handlers
  dom.historyList.querySelectorAll('.restore-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemEl = e.target.closest('.history-item');
      const item = state.history.find(h => h.id === Number(itemEl.dataset.id));
      if (item) {
        restoreHistoryItem(item);
        dom.historyDrawer?.classList.remove('open');
        dom.historyBackdrop?.classList.remove('open');
      }
    });
  });

  dom.historyList.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemEl = e.target.closest('.history-item');
      state.history = state.history.filter(h => h.id !== Number(itemEl.dataset.id));
      localStorage.setItem('qr_studio_history', JSON.stringify(state.history));
      renderHistory();
      updateHistoryCount();
      showToast('Item removed from history', 'info');
    });
  });
}

export function restoreHistoryItem(item) {
  const pill = document.querySelector(`.pill[data-type="${item.type}"]`);
  if (pill) pill.click();

  if (item.type === 'url' && dom.urlInput) {
    dom.urlInput.value = item.payload;
  } else if (item.type === 'text' && dom.textInput) {
    dom.textInput.value = item.payload;
  }

  requestQrUpdate();
  showToast('Restored QR code settings', 'success');
}

export function clearAllHistory() {
  state.history = [];
  localStorage.removeItem('qr_studio_history');
  renderHistory();
  updateHistoryCount();
  showToast('History cleared', 'info');
}

