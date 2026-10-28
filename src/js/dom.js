// Centralized DOM Element Accessors
export const dom = {
  // Preview and QR container
  qrContainer: document.getElementById('qrCodeContainer'),
  qrGlowAura: document.getElementById('qrGlowAura'),
  encodedPayloadPreview: document.getElementById('encodedPayloadPreview'),
  previewContentTag: document.getElementById('previewContentTag'),
  toastContainer: document.getElementById('toastContainer'),

  // History Drawer
  historyDrawer: document.getElementById('historyDrawer'),
  historyBackdrop: document.getElementById('historyBackdrop'),
  historyList: document.getElementById('historyList'),
  historyCount: document.getElementById('historyCount'),
  toggleHistoryBtn: document.getElementById('toggleHistoryBtn'),
  closeHistoryBtn: document.getElementById('closeHistoryBtn'),
  clearAllHistoryBtn: document.getElementById('clearAllHistoryBtn'),

  // Form Inputs
  urlInput: document.getElementById('urlInput'),
  urlCharCount: document.getElementById('urlCharCount'),
  wifiSsid: document.getElementById('wifiSsid'),
  wifiEnc: document.getElementById('wifiEnc'),
  wifiPass: document.getElementById('wifiPass'),
  wifiPassGroup: document.getElementById('wifiPassGroup'),
  wifiHidden: document.getElementById('wifiHidden'),
  textInput: document.getElementById('textInput'),
  textCharCount: document.getElementById('textCharCount'),
  emailTo: document.getElementById('emailTo'),
  emailSubject: document.getElementById('emailSubject'),
  emailBody: document.getElementById('emailBody'),
  vcardFirstName: document.getElementById('vcardFirstName'),
  vcardLastName: document.getElementById('vcardLastName'),
  vcardPhone: document.getElementById('vcardPhone'),
  vcardEmail: document.getElementById('vcardEmail'),
  vcardOrg: document.getElementById('vcardOrg'),
  phoneNum: document.getElementById('phoneNum'),
  smsMessage: document.getElementById('smsMessage'),

  // Color & Style Inputs
  colorDot1: document.getElementById('colorDot1'),
  colorDot2: document.getElementById('colorDot2'),
  colorBg: document.getElementById('colorBg'),
  hexDot1: document.getElementById('hexDot1'),
  hexDot2: document.getElementById('hexDot2'),
  hexBg: document.getElementById('hexBg'),
  fillSingle: document.getElementById('fillSingle'),
  fillGradient: document.getElementById('fillGradient'),
  gradientType: document.getElementById('gradientType'),
  transparentBg: document.getElementById('transparentBg'),
  gradientEndField: document.getElementById('gradientEndField'),
  gradientTypeField: document.getElementById('gradientTypeField'),

  // Tuning Inputs
  ecLevel: document.getElementById('ecLevel'),
  marginSlider: document.getElementById('marginSlider'),
  marginVal: document.getElementById('marginVal'),
  logoSizeSlider: document.getElementById('logoSizeSlider'),
  logoSizeVal: document.getElementById('logoSizeVal'),
  hideBackgroundDots: document.getElementById('hideBackgroundDots'),
  logoDropzone: document.getElementById('logoDropzone'),
  logoFileInput: document.getElementById('logoFileInput'),
  removeLogoBtn: document.getElementById('removeLogoBtn'),
  logoControls: document.getElementById('logoControls'),
  resSelect: document.getElementById('resSelect'),

  // Action Buttons
  downloadPngBtn: document.getElementById('downloadPngBtn'),
  downloadSvgBtn: document.getElementById('downloadSvgBtn'),
  copyClipboardBtn: document.getElementById('copyClipboardBtn'),
  printQrBtn: document.getElementById('printQrBtn'),
  pasteUrlBtn: document.getElementById('pasteUrlBtn'),

  // Scanner Elements
  scanFileInput: document.getElementById('scanFileInput'),
  scanDropzone: document.getElementById('scanDropzone'),
  browseScanBtn: document.getElementById('browseScanBtn'),
  scanResultCard: document.getElementById('scanResultCard'),
  scanResultData: document.getElementById('scanResultData'),
  openDecodedLinkBtn: document.getElementById('openDecodedLinkBtn'),
  copyDecodedDataBtn: document.getElementById('copyDecodedDataBtn'),
  loadInGeneratorBtn: document.getElementById('loadInGeneratorBtn'),
  clearScanResult: document.getElementById('clearScanResult'),

  // Navigation
  navGenerate: document.getElementById('navGenerate'),
  navScan: document.getElementById('navScan'),
  generatorView: document.getElementById('generatorView'),
  scanView: document.getElementById('scanView'),

  // Mobile Dock
  dockJumpPreviewBtn: document.getElementById('dockJumpPreviewBtn'),
  dockJumpText: document.getElementById('dockJumpText'),
  dockQuickDownloadBtn: document.getElementById('dockQuickDownloadBtn')
};

