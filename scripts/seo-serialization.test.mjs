import assert from 'node:assert/strict';
import { test } from 'node:test';
import { escapeHtml, plainText, richText, serializeJsonLd } from './seo-serialization.mjs';

test('keeps quotes, ampersands and angle brackets inside HTML attribute/text contexts', () => {
  assert.equal(escapeHtml('No. 9 "Choral" & <music>'), 'No. 9 &quot;Choral&quot; &amp; &lt;music&gt;');
  assert.equal(escapeHtml("Duke's music"), 'Duke&#39;s music');
});

test('serializes original text, including truncation at an escape boundary', () => {
  const text = 'a'.repeat(199) + '"\\\n🎵';
  const value = { name: 'Symphony No. 9 "Choral"', description: text.slice(0, 200) };
  assert.deepEqual(JSON.parse(serializeJsonLd(value)), value);
});

test('cannot close the structured-data script through a data field', () => {
  const value = { name: '</script><script>alert("x")</script>', description: '<&>\u2028\u2029' };
  const json = serializeJsonLd(value);
  assert.ok(!json.includes('<') && !json.includes('>') && !json.includes('&'));
  assert.deepEqual(JSON.parse(json), value);
});

test('preserves only the explicitly supported biography emphasis markup', () => {
  assert.equal(plainText('The <em>Ring</em> & music'), 'The Ring & music');
  assert.equal(richText('<em>Ring</em><script>x</script>'), '<em>Ring</em>&lt;script&gt;x&lt;/script&gt;');
});
