// Small shared HTML-building helpers used by both overview.js and detail.js.

export function mediaPlaceholder(mediaId, captureNote, helperText) {
  return `
    <!-- MEDIA: ${mediaId}
         Capture: ${captureNote}
         Recommended size: 800x450
         Type: screenshot or short video -->
    <div class="media-placeholder" data-media-id="${mediaId}">
      <svg viewBox="0 0 24 24" width="26" height="26"><use href="#icon-image"></use></svg>
      <span>${helperText}</span>
    </div>`;
}

/** Subtle inline stat line — station/workflow counts, AI badge, key metric. */
export function metaRow(meta) {
  const parts = [`${meta.stationCount} stations`, `${meta.workflowCount} workflows`];
  if (meta.aiPowered) parts.push(`<span class="meta-ai">AI-powered</span>`);
  parts.push(meta.keyMetric);
  return `<div class="meta-row">${parts.join('<span class="dot">·</span>')}</div>`;
}
