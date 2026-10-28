import { state } from './state.js';
import { dom } from './dom.js';
import { PALETTES, PRESET_ICONS, MAX_INPUT_LENGTH } from './constants.js';
import { requestQrUpdate } from './qr.js';
import { exportQRCode, copyToClipboard, printQRCode } from './export.js';
import { renderHistory, clearAllHistory } from './history.js';
import { showToast } from './toast.js';

export function setupEvents() {
  // Navigation view switcher
  dom.navGenerate?.addEventListener('click', () => {
    dom.navGenerate.classList.add('active');
    dom.navScan?.classList.remove('active');
    dom.generatorView?.classList.add('active');
    dom.scanView?.classList.remove('active');
    const dock = document.getElementById('mobileBottomDock');
    if (dock) dock.style.display = '';
  });

  dom.navScan?.addEventListener('click', () => {
    dom.navScan.classList.add('active');
    dom.navGenerate?.classList.remove('active');
    dom.scanView?.classList.add('active');
    dom.generatorView?.classList.remove('active');
    const dock = document.getElementById('mobileBottomDock');
    if (dock) dock.style.display = 'none';
  });

  // History Drawer Controls
  dom.toggleHistoryBtn?.addEventListener('click', () => {
    renderHistory();
    dom.historyDrawer?.classList.add('open');
    dom.historyBackdrop?.classList.add('open');
  });

  dom.closeHistoryBtn?.addEventListener('click', () => {
    dom.historyDrawer?.classList.remove('open');
    dom.historyBackdrop?.classList.remove('open');
  });

  dom.historyBackdrop?.addEventListener('click', () => {
    dom.historyDrawer?.classList.remove('open');
    dom.historyBackdrop?.classList.remove('open');
  });

  dom.clearAllHistoryBtn?.addEventListener('click', () => {
    clearAllHistory();
  });

  // Type Pills Selection
  document.querySelectorAll('.type-pills .pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.type-pills .pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const type = pill.dataset.type;
      state.type = type;

      document.querySelectorAll('.type-form').forEach(f => f.classList.remove('active'));
      const activeForm = document.getElementById(`form-${type}`);
      if (activeForm) activeForm.classList.add('active');

      requestQrUpdate();
    });
  });

  // Live input listeners for forms
  [
    dom.urlInput, dom.wifiSsid, dom.wifiPass, dom.textInput,
    dom.emailTo, dom.emailSubject, dom.emailBody,
    dom.vcardFirstName, dom.vcardLastName, dom.vcardPhone, dom.vcardEmail, dom.vcardOrg,
    dom.phoneNum, dom.smsMessage
  ].forEach(el => {
    if (el) {
      el.addEventListener('input', () => {
        if (el.value.length > MAX_INPUT_LENGTH) {
          el.value = el.value.slice(0, MAX_INPUT_LENGTH);
        }
        requestQrUpdate();
      });
    }
  });

  // Wi-Fi security toggle
  dom.wifiEnc?.addEventListener('change', () => {
    if (dom.wifiEnc.value === 'nopass') {
      if (dom.wifiPassGroup) dom.wifiPassGroup.style.display = 'none';
    } else {
      if (dom.wifiPassGroup) dom.wifiPassGroup.style.display = 'block';
    }
    requestQrUpdate();
  });

  dom.wifiHidden?.addEventListener('change', requestQrUpdate);

  // Character counter for URL
  dom.urlInput?.addEventListener('input', () => {
    if (dom.urlCharCount) {
      dom.urlCharCount.textContent = dom.urlInput.value.length;
    }
  });

  // Character counter for Text
  dom.textInput?.addEventListener('input', () => {
    if (dom.textCharCount) {
      dom.textCharCount.textContent = dom.textInput.value.length;
    }
  });

  // Paste URL button with 150 char limit
  dom.pasteUrlBtn?.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && dom.urlInput) {
        dom.urlInput.value = text.trim().slice(0, MAX_INPUT_LENGTH);
        if (dom.urlCharCount) {
          dom.urlCharCount.textContent = dom.urlInput.value.length;
        }
        requestQrUpdate();
        showToast('Link pasted from clipboard', 'success');
      }
    } catch {
      dom.urlInput?.focus();
      showToast('Please press Ctrl+V to paste', 'info');
    }
  });

  // Accordion Tabs
  document.querySelectorAll('.accordion-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.accordion-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('active'));
      const targetContent = document.getElementById(`tab-${tab.dataset.tab}`);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // Color Presets
  document.querySelectorAll('.palette-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.palette-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const preset = PALETTES[btn.dataset.preset];
      if (preset) {
        state.colorDot1 = preset.dot1;
        state.colorDot2 = preset.dot2;
        if (dom.colorDot1) dom.colorDot1.value = preset.dot1;
        if (dom.colorDot2) dom.colorDot2.value = preset.dot2;
        if (dom.hexDot1) dom.hexDot1.textContent = preset.dot1;
        if (dom.hexDot2) dom.hexDot2.textContent = preset.dot2;
        if (dom.fillGradient) dom.fillGradient.checked = true;
        state.fillType = 'gradient';
        if (dom.gradientEndField) dom.gradientEndField.style.display = 'block';
        if (dom.gradientTypeField) dom.gradientTypeField.style.display = 'block';
        requestQrUpdate();
      }
    });
  });

  // Fill Type Radio
  [dom.fillSingle, dom.fillGradient].forEach(radio => {
    radio?.addEventListener('change', () => {
      state.fillType = dom.fillSingle?.checked ? 'single' : 'gradient';
      if (state.fillType === 'single') {
        if (dom.gradientEndField) dom.gradientEndField.style.display = 'none';
        if (dom.gradientTypeField) dom.gradientTypeField.style.display = 'none';
      } else {
        if (dom.gradientEndField) dom.gradientEndField.style.display = 'block';
        if (dom.gradientTypeField) dom.gradientTypeField.style.display = 'block';
      }
      requestQrUpdate();
    });
  });

  // Color Pickers
  dom.colorDot1?.addEventListener('input', (e) => {
    state.colorDot1 = e.target.value;
    if (dom.hexDot1) dom.hexDot1.textContent = e.target.value;
    requestQrUpdate();
  });

  dom.colorDot2?.addEventListener('input', (e) => {
    state.colorDot2 = e.target.value;
    if (dom.hexDot2) dom.hexDot2.textContent = e.target.value;
    requestQrUpdate();
  });

  dom.colorBg?.addEventListener('input', (e) => {
    state.colorBg = e.target.value;
    if (dom.hexBg) dom.hexBg.textContent = e.target.value;
    requestQrUpdate();
  });

  dom.gradientType?.addEventListener('change', (e) => {
    state.gradientType = e.target.value;
    requestQrUpdate();
  });

  dom.transparentBg?.addEventListener('change', (e) => {
    state.transparentBg = e.target.checked;
    requestQrUpdate();
  });

  // Dot Shapes
  document.querySelectorAll('#dotTypeGrid .shape-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#dotTypeGrid .shape-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.dotsType = btn.dataset.dots;
      requestQrUpdate();
    });
  });

  // Corner Square Shapes
  document.querySelectorAll('#cornerSquareGrid .shape-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#cornerSquareGrid .shape-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.cornerSquareType = btn.dataset.corner;
      state.cornerDotType = btn.dataset.corner === 'square' ? 'square' : 'dot';
      requestQrUpdate();
    });
  });

  // Preset Icon Buttons
  document.querySelectorAll('.icon-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.icon-preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const icon = btn.dataset.icon;
      if (icon === 'none') {
        state.logoUrl = null;
        if (dom.removeLogoBtn) dom.removeLogoBtn.style.display = 'none';
        if (dom.logoControls) dom.logoControls.style.display = 'none';
      } else {
        state.logoUrl = PRESET_ICONS[icon] || null;
        if (dom.removeLogoBtn) dom.removeLogoBtn.style.display = 'inline-block';
        if (dom.logoControls) dom.logoControls.style.display = 'block';
      }
      requestQrUpdate();
    });
  });

  // Logo Upload Dropzone
  dom.logoDropzone?.addEventListener('click', () => dom.logoFileInput?.click());
  dom.logoFileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) handleCustomLogoUpload(file);
  });

  dom.logoDropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dom.logoDropzone.classList.add('dragover');
  });
  dom.logoDropzone?.addEventListener('dragleave', () => dom.logoDropzone.classList.remove('dragover'));
  dom.logoDropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dom.logoDropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleCustomLogoUpload(e.dataTransfer.files[0]);
    }
  });

  dom.removeLogoBtn?.addEventListener('click', () => {
    state.logoUrl = null;
    if (dom.removeLogoBtn) dom.removeLogoBtn.style.display = 'none';
    if (dom.logoControls) dom.logoControls.style.display = 'none';
    if (dom.logoFileInput) dom.logoFileInput.value = '';
    document.querySelectorAll('.icon-preset-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.icon-preset-btn[data-icon="none"]')?.classList.add('active');
    requestQrUpdate();
    showToast('Logo removed', 'info');
  });

  function handleCustomLogoUpload(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      state.logoUrl = event.target.result;
      document.querySelectorAll('.icon-preset-btn').forEach(b => b.classList.remove('active'));
      if (dom.removeLogoBtn) dom.removeLogoBtn.style.display = 'inline-block';
      if (dom.logoControls) dom.logoControls.style.display = 'block';
      requestQrUpdate();
      showToast('Custom logo applied', 'success');
    };
    reader.readAsDataURL(file);
  }

  // Logo tuning sliders
  dom.logoSizeSlider?.addEventListener('input', (e) => {
    state.logoSize = Number(e.target.value) / 100;
    if (dom.logoSizeVal) dom.logoSizeVal.textContent = `${e.target.value}%`;
    requestQrUpdate();
  });

  dom.hideBackgroundDots?.addEventListener('change', (e) => {
    state.hideBackgroundDots = e.target.checked;
    requestQrUpdate();
  });

  // Error Correction Level
  dom.ecLevel?.addEventListener('change', (e) => {
    state.errorCorrectionLevel = e.target.value;
    requestQrUpdate();
  });

  // Outer Margin Slider (default 5px)
  dom.marginSlider?.addEventListener('input', (e) => {
    state.margin = Number(e.target.value);
    if (dom.marginVal) dom.marginVal.textContent = `${e.target.value}px`;
    requestQrUpdate();
  });

  // Export buttons
  dom.downloadPngBtn?.addEventListener('click', () => exportQRCode('png'));
  dom.downloadSvgBtn?.addEventListener('click', () => exportQRCode('svg'));
  dom.copyClipboardBtn?.addEventListener('click', copyToClipboard);
  dom.printQrBtn?.addEventListener('click', printQRCode);

  // Mobile Floating Dock Actions
  if (dom.dockJumpPreviewBtn) {
    dom.dockJumpPreviewBtn.addEventListener('click', () => {
      const previewCard = document.querySelector('.preview-card');
      const configCard = document.querySelector('.config-column');
      if (!previewCard || !configCard) return;

      const previewRect = previewCard.getBoundingClientRect();
      if (Math.abs(previewRect.top) < 220) {
        configCard.scrollIntoView({ behavior: 'smooth' });
        if (dom.dockJumpText) dom.dockJumpText.textContent = 'View QR Code';
      } else {
        previewCard.scrollIntoView({ behavior: 'smooth' });
        if (dom.dockJumpText) dom.dockJumpText.textContent = 'Edit Controls';
      }
    });
  }

  if (dom.dockQuickDownloadBtn) {
    dom.dockQuickDownloadBtn.addEventListener('click', () => {
      exportQRCode('png');
    });
  }
}

