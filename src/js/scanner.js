import jsQR from 'jsqr';
import { dom } from './dom.js';
import { showToast } from './toast.js';
import { requestQrUpdate } from './qr.js';

export function processScanImage(imageElement) {
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

export function displayScanSuccess(data) {
  if (dom.scanResultData) dom.scanResultData.textContent = data;
  if (dom.scanResultCard) dom.scanResultCard.style.display = 'block';

  const isUrl = /^https?:\/\//i.test(data.trim());
  if (dom.openDecodedLinkBtn) {
    if (isUrl) {
      dom.openDecodedLinkBtn.href = data.trim();
      dom.openDecodedLinkBtn.style.display = 'inline-flex';
    } else {
      dom.openDecodedLinkBtn.style.display = 'none';
    }
  }

  showToast('QR Code decoded successfully!', 'success');
}

export function handleFileScan(file) {
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

export function initScanner() {
  if (dom.browseScanBtn) {
    dom.browseScanBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dom.scanFileInput?.click();
    });
  }

  if (dom.scanDropzone) {
    dom.scanDropzone.addEventListener('click', () => dom.scanFileInput?.click());
    dom.scanDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dom.scanDropzone.classList.add('dragover');
    });
    dom.scanDropzone.addEventListener('dragleave', () => dom.scanDropzone.classList.remove('dragover'));
    dom.scanDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dom.scanDropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileScan(e.dataTransfer.files[0]);
      }
    });
  }

  if (dom.scanFileInput) {
    dom.scanFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileScan(e.target.files[0]);
      }
    });
  }

  // Global Clipboard paste listener for scanning anywhere in Scanner view
  window.addEventListener('paste', (e) => {
    if (dom.scanView?.classList.contains('active')) {
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

  if (dom.clearScanResult) {
    dom.clearScanResult.addEventListener('click', () => {
      if (dom.scanResultCard) dom.scanResultCard.style.display = 'none';
      if (dom.scanResultData) dom.scanResultData.textContent = '';
    });
  }

  if (dom.copyDecodedDataBtn) {
    dom.copyDecodedDataBtn.addEventListener('click', async () => {
      const text = dom.scanResultData?.textContent;
      if (text) {
        await navigator.clipboard.writeText(text);
        showToast('Decoded text copied to clipboard!', 'success');
      }
    });
  }

  if (dom.loadInGeneratorBtn) {
    dom.loadInGeneratorBtn.addEventListener('click', () => {
      const text = dom.scanResultData?.textContent.trim();
      if (!text) return;

      dom.navGenerate?.click();
      if (/^https?:\/\//i.test(text)) {
        document.querySelector('.pill[data-type="url"]')?.click();
        if (dom.urlInput) dom.urlInput.value = text.slice(0, 150);
      } else {
        document.querySelector('.pill[data-type="text"]')?.click();
        if (dom.textInput) dom.textInput.value = text.slice(0, 150);
      }
      requestQrUpdate();
      showToast('Loaded into Generator!', 'success');
    });
  }
}

