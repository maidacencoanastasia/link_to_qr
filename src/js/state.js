import { DEFAULT_MARGIN } from './constants.js';

export const state = {
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
  margin: DEFAULT_MARGIN, // 5px by default
  currentPayload: '',     // Clean empty initial state
  history: JSON.parse(localStorage.getItem('qr_studio_history') || '[]')
};

