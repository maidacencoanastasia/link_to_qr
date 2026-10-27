import QRCodeStyling from 'qr-code-styling';
import jsQR from 'jsqr';

// Built-in Icon Presets (Clean SVGs converted to Data URIs)
const PRESET_ICONS = {
  link: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%234f46e5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  github: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="%23181717"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`,
  twitter: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="%23000000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  youtube: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="%23FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  instagram: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%23E4405F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
  wifi: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%2306b6d4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>`
};

// Theme presets
const PALETTES = {
  midnight: { dot1: '#0f172a', dot2: '#000000', bg: '#ffffff', aura: 'rgba(15, 23, 42, 0.5)' },
  cyber: { dot1: '#06b6d4', dot2: '#3b82f6', bg: '#ffffff', aura: 'rgba(6, 182, 212, 0.45)' },
  violet: { dot1: '#8b5cf6', dot2: '#ec4899', bg: '#ffffff', aura: 'rgba(139, 92, 246, 0.45)' },
  sunset: { dot1: '#f97316', dot2: '#ef4444', bg: '#ffffff', aura: 'rgba(249, 115, 22, 0.45)' },
  emerald: { dot1: '#10b981', dot2: '#065f46', bg: '#ffffff', aura: 'rgba(16, 185, 129, 0.45)' },
  royal: { dot1: '#4f46e5', dot2: '#7c3aed', bg: '#ffffff', aura: 'rgba(79, 70, 229, 0.45)' }
};

// State
const state = {
  type: 'url',
  fillType: 'gradient',
  colorDot1: '#6366f1',
  colorDot2: '#a855f7',
  colorBg: '#ffffff',
  transparentBg: false,
  gradientType: 'linear',
  dotsType: 'rounded',
  cornerSquareType: 'extra-rounded',
  cornerDotType: 'dot',
  logoUrl: null,
  logoSize: 0.35,
  hideBackgroundDots: true,
  errorCorrectionLevel: 'H',
  margin: 15,
  currentPayload: 'https://antigravity.google',
  history: JSON.parse(localStorage.getItem('qr_studio_history') || '[]')
};

// DOM References
const qrContainer = document.getElementById('qrCodeContainer');
const qrGlowAura = document.getElementById('qrGlowAura');
const encodedPayloadPreview = document.getElementById('encodedPayloadPreview');
const previewContentTag = document.getElementById('previewContentTag');
const toastContainer = document.getElementById('toastContainer');
const historyDrawer = document.getElementById('historyDrawer');
const historyBackdrop = document.getElementById('historyBackdrop');
const historyList = document.getElementById('historyList');
const historyCount = document.getElementById('historyCount');

// Form inputs
const urlInput = document.getElementById('urlInput');
const wifiSsid = document.getElementById('wifiSsid');
const wifiEnc = document.getElementById('wifiEnc');
const wifiPass = document.getElementById('wifiPass');
const wifiPassGroup = document.getElementById('wifiPassGroup');
const wifiHidden = document.getElementById('wifiHidden');
const textInput = document.getElementById('textInput');
const textCharCount = document.getElementById('textCharCount');
const emailTo = document.getElementById('emailTo');
const emailSubject = document.getElementById('emailSubject');
const emailBody = document.getElementById('emailBody');
const vcardFirstName = document.getElementById('vcardFirstName');
const vcardLastName = document.getElementById('vcardLastName');
const vcardPhone = document.getElementById('vcardPhone');
const vcardEmail = document.getElementById('vcardEmail');
const vcardOrg = document.getElementById('vcardOrg');
const phoneNum = document.getElementById('phoneNum');
const smsMessage = document.getElementById('smsMessage');

// Color inputs
const colorDot1 = document.getElementById('colorDot1');
const colorDot2 = document.getElementById('colorDot2');
const colorBg = document.getElementById('colorBg');
const hexDot1 = document.getElementById('hexDot1');
const hexDot2 = document.getElementById('hexDot2');
const hexBg = document.getElementById('hexBg');
const fillSingle = document.getElementById('fillSingle');
const fillGradient = document.getElementById('fillGradient');
const gradientType = document.getElementById('gradientType');
const transparentBg = document.getElementById('transparentBg');
const gradientEndField = document.getElementById('gradientEndField');
const gradientTypeField = document.getElementById('gradientTypeField');

// Tuning inputs
const ecLevel = document.getElementById('ecLevel');
const marginSlider = document.getElementById('marginSlider');
const marginVal = document.getElementById('marginVal');
const logoSizeSlider = document.getElementById('logoSizeSlider');
const logoSizeVal = document.getElementById('logoSizeVal');
const hideBackgroundDots = document.getElementById('hideBackgroundDots');
const logoDropzone = document.getElementById('logoDropzone');
const logoFileInput = document.getElementById('logoFileInput');
const removeLogoBtn = document.getElementById('removeLogoBtn');
const logoControls = document.getElementById('logoControls');
const resSelect = document.getElementById('resSelect');

// Actions
const downloadPngBtn = document.getElementById('downloadPngBtn');
const downloadSvgBtn = document.getElementById('downloadSvgBtn');
const copyClipboardBtn = document.getElementById('copyClipboardBtn');
const printQrBtn = document.getElementById('printQrBtn');
const pasteUrlBtn = document.getElementById('pasteUrlBtn');

// Scanner Elements
const scanFileInput = document.getElementById('scanFileInput');
const scanDropzone = document.getElementById('scanDropzone');
const browseScanBtn = document.getElementById('browseScanBtn');
const scanResultCard = document.getElementById('scanResultCard');
const scanResultData = document.getElementById('scanResultData');
const openDecodedLinkBtn = document.getElementById('openDecodedLinkBtn');
const copyDecodedDataBtn = document.getElementById('copyDecodedDataBtn');
const loadInGeneratorBtn = document.getElementById('loadInGeneratorBtn');
const clearScanResult = document.getElementById('clearScanResult');

// Initialize QRCodeStyling Instance
let qrCode = null;
let updateTimer = null;

function buildQrOptions(customSize = 300) {
  const isGradient = state.fillType === 'gradient';
  
  const dotsOptions = {
    type: state.dotsType
  };

  if (isGradient) {
    dotsOptions.gradient = {
      type: state.gradientType,
      rotation: Math.PI / 4,
      colorStops: [
        { offset: 0, color: state.colorDot1 },
        { offset: 1, color: state.colorDot2 }
      ]
    };
  } else {
    dotsOptions.color = state.colorDot1;
  }

  const cornersSquareOptions = {
    type: state.cornerSquareType,
    color: state.colorDot1
  };

  const cornersDotOptions = {
    type: state.cornerDotType,
    color: isGradient ? state.colorDot2 : state.colorDot1
  };

  const backgroundOptions = {
    color: state.transparentBg ? 'transparent' : state.colorBg
  };

  const imageOptions = {
    crossOrigin: 'anonymous',
    margin: 6,
    imageSize: state.logoSize,
    hideBackgroundDots: state.hideBackgroundDots
  };

  return {
    width: customSize,
    height: customSize,
    type: 'canvas',
    data: state.currentPayload || 'https://antigravity.google',
    image: state.logoUrl || undefined,
    dotsOptions,
    cornersSquareOptions,
    cornersDotOptions,
    backgroundOptions,
    imageOptions,
    qrOptions: {
      errorCorrectionLevel: state.errorCorrectionLevel
    },
    margin: state.margin
  };
}

function initQrCode() {
  qrContainer.innerHTML = '';
  qrCode = new QRCodeStyling(buildQrOptions(280));
  qrCode.append(qrContainer);
  updateAuraGlow();
  updateHistoryCount();
}

function updateQrCodeNow() {
  computePayload();
  const options = buildQrOptions(280);
  if (qrCode) {
    qrCode.update(options);
  }
  encodedPayloadPreview.textContent = state.currentPayload || '(Empty)';
  updateAuraGlow();
}

function requestQrUpdate() {
  clearTimeout(updateTimer);
  updateTimer = setTimeout(() => {
    updateQrCodeNow();
  }, 100);
}

function updateAuraGlow() {
  const color1 = state.colorDot1;
  const color2 = state.fillType === 'gradient' ? state.colorDot2 : state.colorDot1;
  qrGlowAura.style.background = `linear-gradient(135deg, ${color1}66, ${color2}66)`;
}

// Compute Payload from Active Form
function computePayload() {
  switch (state.type) {
    case 'url': {
      let raw = (urlInput.value || '').trim();
      if (!raw) raw = 'https://antigravity.google';
      if (!/^https?:\/\//i.test(raw) && !/^mailto:/i.test(raw) && !raw.startsWith('/')) {
        raw = 'https://' + raw;
      }
      state.currentPayload = raw;
      previewContentTag.textContent = 'URL Link';
      break;
    }
    case 'wifi': {
      const ssid = wifiSsid.value.trim() || 'My_WiFi';
      const enc = wifiEnc.value;
      const pass = wifiPass.value;
      const hidden = wifiHidden.checked;
      
      const escape = (str) => str.replace(/([\\;,:"])/g, '\\$1');
      state.currentPayload = `WIFI:S:${escape(ssid)};T:${enc};P:${enc !== 'nopass' ? escape(pass) : ''};H:${hidden ? 'true' : ''};;`;
      previewContentTag.textContent = `Wi-Fi: ${ssid}`;
      break;
    }
    case 'text': {
      const text = textInput.value || 'Hello World';
      state.currentPayload = text;
      previewContentTag.textContent = `Text (${text.length} chars)`;
      break;
    }
    case 'email': {
      const to = emailTo.value.trim();
      const sub = emailSubject.value.trim();
      const body = emailBody.value;
      let mailto = `mailto:${to}`;
      const params = [];
      if (sub) params.push(`subject=${encodeURIComponent(sub)}`);
      if (body) params.push(`body=${encodeURIComponent(body)}`);
      if (params.length > 0) mailto += `?${params.join('&')}`;
      state.currentPayload = mailto;
      previewContentTag.textContent = to ? `Email: ${to}` : 'Email';
      break;
    }
    case 'vcard': {
      const first = vcardFirstName.value.trim();
      const last = vcardLastName.value.trim();
      const phone = vcardPhone.value.trim();
      const email = vcardEmail.value.trim();
      const org = vcardOrg.value.trim();

      state.currentPayload = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${last};${first};;;`,
        `FN:${first} ${last}`.trim(),
        org ? `ORG:${org}` : null,
        phone ? `TEL;TYPE=CELL:${phone}` : null,
        email ? `EMAIL:${email}` : null,
        'END:VCARD'
      ].filter(Boolean).join('\n');
      previewContentTag.textContent = `vCard: ${first} ${last}`.trim() || 'Contact Card';
      break;
    }
    case 'phone': {
      const phone = phoneNum.value.trim();
      const msg = smsMessage.value.trim();
      if (msg) {
        state.currentPayload = `SMSTO:${phone}:${msg}`;
        previewContentTag.textContent = `SMS: ${phone}`;
      } else {
        state.currentPayload = `tel:${phone}`;
        previewContentTag.textContent = `Phone: ${phone}`;
      }
      break;
    }
  }
}

// Toast Notifications
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="20 6 9 17 4 12"/></svg>';
  } else if (type === 'error') {
    iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
  } else {
    iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
  }

  toast.innerHTML = `${iconSvg}<span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.95)';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

// Save to History
function saveHistoryItem() {
  try {
    const canvas = qrContainer.querySelector('canvas');
    const thumb = canvas ? canvas.toDataURL('image/png', 0.5) : null;
    
    const item = {
      id: Date.now(),
      type: state.type,
      title: previewContentTag.textContent,
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

function updateHistoryCount() {
  historyCount.textContent = state.history.length;
}

function renderHistory() {
  if (!state.history.length) {
    historyList.innerHTML = `
      <div class="history-empty">
        <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" stroke-width="1.5" fill="none"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        <p>No QR codes saved yet.<br>Export or generate one to see it here!</p>
      </div>
    `;
    return;
  }

  historyList.innerHTML = state.history.map(item => `
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
  historyList.querySelectorAll('.restore-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemEl = e.target.closest('.history-item');
      const item = state.history.find(h => h.id === Number(itemEl.dataset.id));
      if (item) {
        restoreHistoryItem(item);
        historyDrawer.classList.remove('open');
        historyBackdrop.classList.remove('open');
      }
    });
  });

  historyList.querySelectorAll('.delete-btn').forEach(btn => {
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

function restoreHistoryItem(item) {
  // Set type
  const pill = document.querySelector(`.pill[data-type="${item.type}"]`);
  if (pill) pill.click();

  if (item.type === 'url') {
    urlInput.value = item.payload;
  } else if (item.type === 'text') {
    textInput.value = item.payload;
  }

  requestQrUpdate();
  showToast('Restored QR code settings', 'success');
}

// High-Res Export
async function exportQRCode(format = 'png') {
  saveHistoryItem();
  const resolution = parseInt(resSelect.value, 10) || 1024;
  showToast(`Generating ${resolution}×${resolution} ${format.toUpperCase()}...`, 'info');

  try {
    if (format === 'svg') {
      const svgOptions = { ...buildQrOptions(resolution), type: 'svg' };
      const exporter = new QRCodeStyling(svgOptions);
      await exporter.download({ name: 'qr-code', extension: 'svg' });
      showToast('SVG Vector downloaded successfully!', 'success');
      return;
    }

    // High-Res PNG
    const exportOptions = { ...buildQrOptions(resolution), type: 'canvas' };
    const exporter = new QRCodeStyling(exportOptions);
    await exporter.download({ name: `qr-code-${resolution}px`, extension: 'png' });
    showToast(`High-Res ${format.toUpperCase()} downloaded!`, 'success');
  } catch (err) {
    console.error('Export error:', err);
    showToast('Failed to export. Please try again.', 'error');
  }
}

// Copy to Clipboard
async function copyToClipboard() {
  const canvas = qrContainer.querySelector('canvas');
  if (!canvas) {
    showToast('Canvas not ready to copy', 'error');
    return;
  }

  try {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        showToast('Failed to create image blob', 'error');
        return;
      }
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        showToast('QR code copied to clipboard!', 'success');
        saveHistoryItem();
      } else {
        showToast('Clipboard image copying not supported in this browser', 'error');
      }
    });
  } catch (err) {
    console.error('Clipboard error:', err);
    showToast('Could not copy image to clipboard', 'error');
  }
}

// Print QR
function printQRCode() {
  const canvas = qrContainer.querySelector('canvas');
  if (!canvas) return;
  const dataUrl = canvas.toDataURL('image/png');
  const printWindow = window.open('', '_blank', 'width=600,height=600');
  if (!printWindow) {
    showToast('Please allow popups to print', 'error');
    return;
  }
  printWindow.document.write(`
    <html>
      <head>
        <title>Print QR Code - ${previewContentTag.textContent}</title>
        <style>
          body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            font-family: system-ui, sans-serif;
            text-align: center;
          }
          img {
            max-width: 320px;
            margin-bottom: 1.5rem;
          }
          h2 { margin: 0 0 0.5rem 0; font-size: 1.25rem; }
          p { color: #666; font-size: 0.9rem; word-break: break-all; max-width: 450px; }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" alt="QR Code">
        <h2>${previewContentTag.textContent}</h2>
        <p>${state.currentPayload}</p>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() { window.close(); };
          };
        <\/script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

// Scanner Engine using jsQR
function processScanImage(imageElement) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = imageElement.naturalWidth || imageElement.width;
  canvas.height = imageElement.naturalHeight || imageElement.height;
  ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'attemptBoth'
  });

  if (code && code.data) {
    displayScanSuccess(code.data);
  } else {
    showToast('No QR code detected in this image. Try a clearer image.', 'error');
  }
}

function displayScanSuccess(data) {
  scanResultData.textContent = data;
  scanResultCard.style.display = 'block';

  // Check if URL
  const isUrl = /^https?:\/\//i.test(data.trim());
  if (isUrl) {
    openDecodedLinkBtn.href = data.trim();
    openDecodedLinkBtn.style.display = 'inline-flex';
  } else {
    openDecodedLinkBtn.style.display = 'none';
  }

  showToast('QR Code decoded successfully!', 'success');
}

function handleFileScan(file) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('Please select a valid image file', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => processScanImage(img);
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Setup Event Listeners
function setupEvents() {
  // Navigation switch
  const navGenerate = document.getElementById('navGenerate');
  const navScan = document.getElementById('navScan');
  const generatorView = document.getElementById('generatorView');
  const scanView = document.getElementById('scanView');

  navGenerate.addEventListener('click', () => {
    navGenerate.classList.add('active');
    navScan.classList.remove('active');
    generatorView.classList.add('active');
    scanView.classList.remove('active');
  });

  navScan.addEventListener('click', () => {
    navScan.classList.add('active');
    navGenerate.classList.remove('active');
    scanView.classList.add('active');
    generatorView.classList.remove('active');
  });

  // History Drawer Toggle
  document.getElementById('toggleHistoryBtn').addEventListener('click', () => {
    renderHistory();
    historyDrawer.classList.add('open');
    historyBackdrop.classList.add('open');
  });

  document.getElementById('closeHistoryBtn').addEventListener('click', () => {
    historyDrawer.classList.remove('open');
    historyBackdrop.classList.remove('open');
  });

  historyBackdrop.addEventListener('click', () => {
    historyDrawer.classList.remove('open');
    historyBackdrop.classList.remove('open');
  });

  document.getElementById('clearAllHistoryBtn').addEventListener('click', () => {
    state.history = [];
    localStorage.removeItem('qr_studio_history');
    renderHistory();
    updateHistoryCount();
    showToast('History cleared', 'info');
  });

  // Type Pills
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

  // Form Inputs live listeners
  [urlInput, wifiSsid, wifiPass, textInput, emailTo, emailSubject, emailBody,
   vcardFirstName, vcardLastName, vcardPhone, vcardEmail, vcardOrg, phoneNum, smsMessage].forEach(el => {
    if (el) el.addEventListener('input', requestQrUpdate);
  });

  wifiEnc.addEventListener('change', () => {
    if (wifiEnc.value === 'nopass') {
      wifiPassGroup.style.display = 'none';
    } else {
      wifiPassGroup.style.display = 'block';
    }
    requestQrUpdate();
  });

  wifiHidden.addEventListener('change', requestQrUpdate);

  textInput.addEventListener('input', () => {
    textCharCount.textContent = textInput.value.length;
  });

  // Paste URL button
  pasteUrlBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        urlInput.value = text.trim();
        requestQrUpdate();
        showToast('Link pasted from clipboard', 'success');
      }
    } catch {
      urlInput.focus();
      showToast('Please press Ctrl+V to paste', 'info');
    }
  });

  // Sample quick link chips
  document.querySelectorAll('.chip[data-sample]').forEach(chip => {
    chip.addEventListener('click', () => {
      urlInput.value = chip.dataset.sample;
      requestQrUpdate();
      showToast(`Applied ${chip.textContent}`, 'info');
    });
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
        colorDot1.value = preset.dot1;
        colorDot2.value = preset.dot2;
        hexDot1.textContent = preset.dot1;
        hexDot2.textContent = preset.dot2;
        fillGradient.checked = true;
        state.fillType = 'gradient';
        gradientEndField.style.display = 'block';
        gradientTypeField.style.display = 'block';
        requestQrUpdate();
      }
    });
  });

  // Fill Type Radio
  [fillSingle, fillGradient].forEach(radio => {
    radio.addEventListener('change', () => {
      state.fillType = fillSingle.checked ? 'single' : 'gradient';
      if (state.fillType === 'single') {
        gradientEndField.style.display = 'none';
        gradientTypeField.style.display = 'none';
      } else {
        gradientEndField.style.display = 'block';
        gradientTypeField.style.display = 'block';
      }
      requestQrUpdate();
    });
  });

  // Color Pickers
  colorDot1.addEventListener('input', (e) => {
    state.colorDot1 = e.target.value;
    hexDot1.textContent = e.target.value;
    requestQrUpdate();
  });

  colorDot2.addEventListener('input', (e) => {
    state.colorDot2 = e.target.value;
    hexDot2.textContent = e.target.value;
    requestQrUpdate();
  });

  colorBg.addEventListener('input', (e) => {
    state.colorBg = e.target.value;
    hexBg.textContent = e.target.value;
    requestQrUpdate();
  });

  gradientType.addEventListener('change', (e) => {
    state.gradientType = e.target.value;
    requestQrUpdate();
  });

  transparentBg.addEventListener('change', (e) => {
    state.transparentBg = e.target.checked;
    requestQrUpdate();
  });

  // Dot Types
  document.querySelectorAll('#dotTypeGrid .shape-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#dotTypeGrid .shape-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.dotsType = btn.dataset.dots;
      requestQrUpdate();
    });
  });

  // Corner Squares
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
        removeLogoBtn.style.display = 'none';
        logoControls.style.display = 'none';
      } else {
        state.logoUrl = PRESET_ICONS[icon] || null;
        removeLogoBtn.style.display = 'inline-block';
        logoControls.style.display = 'block';
      }
      requestQrUpdate();
    });
  });

  // Logo Upload Dropzone
  logoDropzone.addEventListener('click', () => logoFileInput.click());
  logoFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleCustomLogoUpload(file);
  });

  logoDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    logoDropzone.classList.add('dragover');
  });
  logoDropzone.addEventListener('dragleave', () => logoDropzone.classList.remove('dragover'));
  logoDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    logoDropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleCustomLogoUpload(e.dataTransfer.files[0]);
    }
  });

  removeLogoBtn.addEventListener('click', () => {
    state.logoUrl = null;
    removeLogoBtn.style.display = 'none';
    logoControls.style.display = 'none';
    logoFileInput.value = '';
    document.querySelectorAll('.icon-preset-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.icon-preset-btn[data-icon="none"]').classList.add('active');
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
      removeLogoBtn.style.display = 'inline-block';
      logoControls.style.display = 'block';
      requestQrUpdate();
      showToast('Custom logo applied', 'success');
    };
    reader.readAsDataURL(file);
  }

  // Logo tuning sliders
  logoSizeSlider.addEventListener('input', (e) => {
    state.logoSize = Number(e.target.value) / 100;
    logoSizeVal.textContent = `${e.target.value}%`;
    requestQrUpdate();
  });

  hideBackgroundDots.addEventListener('change', (e) => {
    state.hideBackgroundDots = e.target.checked;
    requestQrUpdate();
  });

  // Advanced settings
  ecLevel.addEventListener('change', (e) => {
    state.errorCorrectionLevel = e.target.value;
    requestQrUpdate();
  });

  marginSlider.addEventListener('input', (e) => {
    state.margin = Number(e.target.value);
    marginVal.textContent = `${e.target.value}px`;
    requestQrUpdate();
  });

  // Export buttons
  downloadPngBtn.addEventListener('click', () => exportQRCode('png'));
  downloadSvgBtn.addEventListener('click', () => exportQRCode('svg'));
  copyClipboardBtn.addEventListener('click', copyToClipboard);
  printQrBtn.addEventListener('click', printQRCode);

  // Scanner Drag & Drop
  browseScanBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    scanFileInput.click();
  });
  scanDropzone.addEventListener('click', () => scanFileInput.click());
  scanFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileScan(e.target.files[0]);
    }
  });

  scanDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    scanDropzone.classList.add('dragover');
  });
  scanDropzone.addEventListener('dragleave', () => scanDropzone.classList.remove('dragover'));
  scanDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    scanDropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileScan(e.dataTransfer.files[0]);
    }
  });

  // Global Clipboard paste listener for scanning anywhere in Scanner view
  window.addEventListener('paste', (e) => {
    if (scanView.classList.contains('active')) {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const blob = item.getAsFile();
          handleFileScan(blob);
          showToast('Scanning pasted image...', 'info');
          break;
        }
      }
    }
  });

  clearScanResult.addEventListener('click', () => {
    scanResultCard.style.display = 'none';
    scanResultData.textContent = '';
  });

  copyDecodedDataBtn.addEventListener('click', async () => {
    const text = scanResultData.textContent;
    if (text) {
      await navigator.clipboard.writeText(text);
      showToast('Decoded text copied to clipboard!', 'success');
    }
  });

  loadInGeneratorBtn.addEventListener('click', () => {
    const text = scanResultData.textContent.trim();
    if (!text) return;

    navGenerate.click();
    if (/^https?:\/\//i.test(text)) {
      document.querySelector('.pill[data-type="url"]').click();
      urlInput.value = text;
    } else {
      document.querySelector('.pill[data-type="text"]').click();
      textInput.value = text;
    }
    requestQrUpdate();
    showToast('Loaded into Generator!', 'success');
  });
}

// Initial Run
initQrCode();
setupEvents();
