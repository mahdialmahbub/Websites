import assert from 'node:assert/strict';
import { test } from 'node:test';
import { SHARE_TARGETS, buildShareText, emailShareUrl, facebookShareUrl, telegramShareUrl, whatsappShareUrl, xShareUrl } from './share.js';

const url = 'https://hireme.com/r/abc123?x=1&y=2';

test('every link carries the page address, encoded', () => {
  for (const link of [facebookShareUrl(url), xShareUrl(url, 'hi'), telegramShareUrl(url, 'hi'), whatsappShareUrl(url, 'hi'), emailShareUrl(url)]) {
    assert.ok(link.includes(encodeURIComponent(url)) || link.includes(encodeURIComponent(`hi ${url}`)) || link.includes(encodeURIComponent(`\n\n${url}`)) || decodeURIComponent(link).includes(url), link);
  }
});

test('whatsapp / email put the text and the link together', () => {
  assert.equal(decodeURIComponent(whatsappShareUrl(url, 'My resume')), `https://wa.me/?text=My resume ${url}`);
  assert.equal(decodeURIComponent(emailShareUrl(url, { subject: 'Hello', text: 'Look:' })), `mailto:?subject=Hello&body=Look:\n\n${url}`);
});

test('the six targets of the share modal, in order', () => {
  assert.deepEqual(SHARE_TARGETS.map((t) => t.id), ['facebook', 'linkedin', 'x', 'whatsapp', 'telegram', 'email']);
  for (const target of SHARE_TARGETS) assert.match(target.href(url, 'text'), /^(https:\/\/|mailto:)/);
});

test('buildShareText', () => {
  assert.equal(buildShareText({ personalInformation: { fullName: 'Ada', professionalTitle: 'Engineer' } }), 'Ada - Engineer | my resume');
  assert.equal(buildShareText({}), 'My resume');
});
