import QRCodeStyling from 'qr-code-styling';
import { state } from './state.js';
import { dom } from './dom.js';
import { buildQrOptions } from './qr.js';
import { showToast } from './toast.js';
import { saveHistoryItem } from './history.js';

// High-Res Export (PNG / SVG)
export async function exportQRCode(format = 'png') {
  if (!state.currentPayload) {
    showToast('Please enter a link or text first', 'error');
    return;
  }

  saveHistoryItem();
  const resolution = parseInt(dom.resSelect?.value, 10) || 1024;
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
export async function copyToClipboard() {
  if (!state.currentPayload) {
    showToast('Please enter a link or text first', 'error');
    return;
  }

  const canvas = dom.qrContainer?.querySelector('canvas');
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
export function printQRCode() {
  if (!state.currentPayload) {
    showToast('Please enter a link or text first', 'error');
    return;
  }

  const canvas = dom.qrContainer?.querySelector('canvas');
  if (!canvas) return;
  const dataUrl = canvas.toDataURL('image/png');
  const printWindow = window.open('', '_blank', 'width=600,height=600');
  if (!printWindow) {
    showToast('Please allow popups to print', 'error');
    return;
  }
  const title = dom.previewContentTag?.textContent || 'QR Code';
  printWindow.document.write(`
    <html>
      <head>
        <title>Print QR Code - ${title}</title>
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
        <h2>${title}</h2>
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

