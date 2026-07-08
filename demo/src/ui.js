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

/** Joins meta-row segments with the standard dot separator, dropping any falsy ones. */
export function joinMetaParts(parts) {
  return parts.filter(Boolean).join('<span class="dot">·</span>');
}

/**
 * Subtle inline stat line — station/workflow counts, AI badge, key metric.
 * `keyMetricText` defaults to the static meta.keyMetric (used on overview
 * cards, which have no selection state). The detail page rebuilds this
 * content itself as scenarios are selected — see updateMetaRow in detail.js.
 */
export function metaRow(meta, keyMetricText = meta.keyMetric) {
  const parts = [
    `${meta.stationCount} stations`,
    `${meta.workflowCount} workflows`,
    meta.aiPowered ? `<span class="meta-ai">AI-powered</span>` : null,
    `<span class="meta-hours">${keyMetricText}</span>`,
  ];
  return `<div class="meta-row">${joinMetaParts(parts)}</div>`;
}

/** Sum of hoursSaved30d across a system's scenarios (skips ones without a reliable rate, e.g. Error Monitor). */
export function systemHoursSaved30d(system) {
  return system.scenarios.reduce((sum, s) => sum + (typeof s.hoursSaved30d === "number" ? s.hoursSaved30d : 0), 0);
}

export function hoursSavedLabel(hours) {
  return `~${hours.toFixed(1)} hrs saved / 30 days`;
}
