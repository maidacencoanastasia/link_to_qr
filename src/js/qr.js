import QRCodeStyling from 'qr-code-styling';
import { state } from './state.js';
import { dom } from './dom.js';
import { computePayload } from './payload.js';

let qrCode = null;
let updateTimer = null;

export function buildQrOptions(customSize = 300) {
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
    data: state.currentPayload || '',
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

function renderPlaceholder() {
  if (!dom.qrContainer) return;
  dom.qrContainer.innerHTML = `
    <div class="qr-empty-placeholder">
      <div class="empty-icon-wrap">
        <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" stroke-width="1.6" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
          <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
          <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
          <rect x="14" y="14" width="3" height="3"></rect>
          <rect x="18" y="14" width="3" height="3"></rect>
          <rect x="14" y="18" width="3" height="3"></rect>
          <rect x="18" y="18" width="3" height="3"></rect>
        </svg>
      </div>
      <p class="empty-hint-text">Enter URL or text to generate QR</p>
      <span class="empty-sub-hint">Instant real-time preview (max 150 chars)</span>
    </div>
  `;
}

export function initQrCode() {
  computePayload();
  if (!state.currentPayload) {
    renderPlaceholder();
    if (dom.encodedPayloadPreview) {
      dom.encodedPayloadPreview.textContent = 'Waiting for input...';
    }
  } else {
    dom.qrContainer.innerHTML = '';
    qrCode = new QRCodeStyling(buildQrOptions(280));
    qrCode.append(dom.qrContainer);
    if (dom.encodedPayloadPreview) {
      dom.encodedPayloadPreview.textContent = state.currentPayload;
    }
  }
  updateAuraGlow();
}

export function updateQrCodeNow() {
  computePayload();

  if (!state.currentPayload) {
    qrCode = null;
    renderPlaceholder();
    if (dom.encodedPayloadPreview) {
      dom.encodedPayloadPreview.textContent = 'Waiting for input...';
    }
    updateAuraGlow();
    return;
  }

  const options = buildQrOptions(280);
  if (!qrCode || dom.qrContainer.querySelector('.qr-empty-placeholder')) {
    dom.qrContainer.innerHTML = '';
    qrCode = new QRCodeStyling(options);
    qrCode.append(dom.qrContainer);
  } else {
    qrCode.update(options);
  }

  if (dom.encodedPayloadPreview) {
    dom.encodedPayloadPreview.textContent = state.currentPayload;
  }
  updateAuraGlow();
}

export function requestQrUpdate() {
  clearTimeout(updateTimer);
  updateTimer = setTimeout(() => {
    updateQrCodeNow();
  }, 100);
}

export function updateAuraGlow() {
  if (!dom.qrGlowAura) return;
  const color1 = state.colorDot1;
  const color2 = state.fillType === 'gradient' ? state.colorDot2 : state.colorDot1;
  dom.qrGlowAura.style.background = `linear-gradient(135deg, ${color1}66, ${color2}66)`;
}

export function getQrCodeInstance() {
  return qrCode;
}

