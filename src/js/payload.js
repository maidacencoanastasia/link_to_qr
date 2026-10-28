import { state } from './state.js';
import { dom } from './dom.js';
import { MAX_INPUT_LENGTH } from './constants.js';

// Compute QR payload from active form
export function computePayload() {
  switch (state.type) {
    case 'url': {
      let raw = (dom.urlInput?.value || '').trim();
      if (raw.length > MAX_INPUT_LENGTH) {
        raw = raw.slice(0, MAX_INPUT_LENGTH);
        dom.urlInput.value = raw;
      }
      if (dom.urlCharCount) {
        dom.urlCharCount.textContent = raw.length;
      }
      if (!raw) {
        state.currentPayload = '';
        if (dom.previewContentTag) dom.previewContentTag.textContent = 'URL Link';
        return;
      }
      if (!/^https?:\/\//i.test(raw) && !/^mailto:/i.test(raw) && !raw.startsWith('/')) {
        raw = 'https://' + raw;
      }
      state.currentPayload = raw;
      if (dom.previewContentTag) dom.previewContentTag.textContent = 'URL Link';
      break;
    }

    case 'wifi': {
      let ssid = (dom.wifiSsid?.value || '').trim();
      if (ssid.length > MAX_INPUT_LENGTH) {
        ssid = ssid.slice(0, MAX_INPUT_LENGTH);
        dom.wifiSsid.value = ssid;
      }
      if (!ssid) {
        state.currentPayload = '';
        if (dom.previewContentTag) dom.previewContentTag.textContent = 'Wi-Fi Network';
        return;
      }
      const enc = dom.wifiEnc?.value || 'WPA';
      const pass = (dom.wifiPass?.value || '').slice(0, MAX_INPUT_LENGTH);
      const hidden = dom.wifiHidden?.checked || false;

      const escape = (str) => str.replace(/([\\;,:"])/g, '\\$1');
      state.currentPayload = `WIFI:S:${escape(ssid)};T:${enc};P:${enc !== 'nopass' ? escape(pass) : ''};H:${hidden ? 'true' : ''};;`;
      if (dom.previewContentTag) dom.previewContentTag.textContent = `Wi-Fi: ${ssid}`;
      break;
    }

    case 'text': {
      let text = dom.textInput?.value || '';
      if (text.length > MAX_INPUT_LENGTH) {
        text = text.slice(0, MAX_INPUT_LENGTH);
        dom.textInput.value = text;
      }
      if (dom.textCharCount) {
        dom.textCharCount.textContent = text.length;
      }
      state.currentPayload = text;
      if (dom.previewContentTag) {
        dom.previewContentTag.textContent = text ? `Text (${text.length} chars)` : 'Plain Text';
      }
      break;
    }

    case 'email': {
      let to = (dom.emailTo?.value || '').trim().slice(0, MAX_INPUT_LENGTH);
      let sub = (dom.emailSubject?.value || '').trim().slice(0, MAX_INPUT_LENGTH);
      let body = (dom.emailBody?.value || '').slice(0, MAX_INPUT_LENGTH);

      if (!to && !sub && !body) {
        state.currentPayload = '';
        if (dom.previewContentTag) dom.previewContentTag.textContent = 'Email';
        return;
      }

      let mailto = `mailto:${to}`;
      const params = [];
      if (sub) params.push(`subject=${encodeURIComponent(sub)}`);
      if (body) params.push(`body=${encodeURIComponent(body)}`);
      if (params.length > 0) mailto += `?${params.join('&')}`;

      state.currentPayload = mailto;
      if (dom.previewContentTag) {
        dom.previewContentTag.textContent = to ? `Email: ${to}` : 'Email';
      }
      break;
    }

    case 'vcard': {
      const first = (dom.vcardFirstName?.value || '').trim().slice(0, MAX_INPUT_LENGTH);
      const last = (dom.vcardLastName?.value || '').trim().slice(0, MAX_INPUT_LENGTH);
      const phone = (dom.vcardPhone?.value || '').trim().slice(0, MAX_INPUT_LENGTH);
      const email = (dom.vcardEmail?.value || '').trim().slice(0, MAX_INPUT_LENGTH);
      const org = (dom.vcardOrg?.value || '').trim().slice(0, MAX_INPUT_LENGTH);

      if (!first && !last && !phone && !email && !org) {
        state.currentPayload = '';
        if (dom.previewContentTag) dom.previewContentTag.textContent = 'Contact Card';
        return;
      }

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

      const fullName = `${first} ${last}`.trim();
      if (dom.previewContentTag) {
        dom.previewContentTag.textContent = fullName ? `vCard: ${fullName}` : 'Contact Card';
      }
      break;
    }

    case 'phone': {
      const phone = (dom.phoneNum?.value || '').trim().slice(0, MAX_INPUT_LENGTH);
      const msg = (dom.smsMessage?.value || '').trim().slice(0, MAX_INPUT_LENGTH);

      if (!phone) {
        state.currentPayload = '';
        if (dom.previewContentTag) dom.previewContentTag.textContent = 'Phone / SMS';
        return;
      }

      if (msg) {
        state.currentPayload = `SMSTO:${phone}:${msg}`;
        if (dom.previewContentTag) dom.previewContentTag.textContent = `SMS: ${phone}`;
      } else {
        state.currentPayload = `tel:${phone}`;
        if (dom.previewContentTag) dom.previewContentTag.textContent = `Phone: ${phone}`;
      }
      break;
    }
  }
}

