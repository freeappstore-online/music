export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

// Curated biographies allow emphasis; metadata always receives plain text.
export const plainText = (value) => String(value).replace(/<\/?em>/gi, '');
export const richText = (value) => escapeHtml(value)
  .replace(/&lt;em&gt;/gi, '<em>').replace(/&lt;\/em&gt;/gi, '</em>');

export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (char) =>
    `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`);
}
