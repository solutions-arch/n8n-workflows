// Swaps a media-placeholder for a real image OR video once one exists at the
// conventional path, and makes images click-to-maximize via a shared lightbox.
// Probes for an .mp4 first, then falls back to the .jpg behaviour. Mirrors
// narration.js's "stay a placeholder until the asset resolves" pattern so
// nothing looks broken before Jia (or whoever) drops files in.

export function mediaSrc(mediaId) {
  return `/media/${mediaId}.jpg`;
}

export function mediaSrcVideo(mediaId) {
  return `/media/${mediaId}.mp4`;
}

let lightboxEl = null;

function ensureLightbox() {
  if (lightboxEl) return lightboxEl;

  const el = document.createElement("div");
  el.className = "media-lightbox";
  el.hidden = true;

  el.innerHTML = `
    <div class="media-lightbox-backdrop" data-close></div>
    <button class="media-lightbox-close" type="button" aria-label="Close image" data-close>&times;</button>
    <img class="media-lightbox-img" alt="" />
  `;

  document.body.appendChild(el);

  el.querySelectorAll("[data-close]").forEach((n) =>
    n.addEventListener("click", closeLightbox)
  );

  document.addEventListener("keydown", (e) => {
    if (!el.hidden && e.key === "Escape") closeLightbox();
  });

  lightboxEl = el;
  return el;
}

function openLightbox(src, alt) {
  const el = ensureLightbox();
  const img = el.querySelector(".media-lightbox-img");

  img.src = src;
  img.alt = alt || "";

  el.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightboxEl) return;

  lightboxEl.hidden = true;
  document.body.style.overflow = "";
}

// Existing behaviour: probe for a real image and, if it loads, swap in a
// maximizable thumbnail. If it 404s, leave the placeholder markup untouched.
function wireImage(containerEl, mediaId, alt, onMissing, onFound) {
  const src = mediaSrc(mediaId);
  const probe = new Image();

  probe.onload = () => {
    containerEl.innerHTML = `
      <img src="${src}" alt="${alt || ""}" />
      <span class="media-zoom-badge"><svg viewBox="0 0 24 24" width="14" height="14"><use href="#icon-expand"></use></svg></span>
    `;

    containerEl.classList.add("has-media");

    containerEl.setAttribute("role", "button");
    containerEl.setAttribute("tabindex", "0");
    containerEl.setAttribute("aria-label", "View larger image");

    // stopPropagation: on the overview cards this placeholder sits inside an
    // <a> that navigates on click — maximizing the image shouldn't also navigate.
    containerEl.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openLightbox(src, alt);
    });

    containerEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        openLightbox(src, alt);
      }
    });

    if (onFound) onFound();
  };

  probe.onerror = () => {
    if (onMissing) onMissing();
  };

  probe.src = src;
}

// Probe for a real video. If its metadata loads, swap in an inline <video>
// with native controls. If it 404s or errors, run onMissing() so callers can
// fall back to the image.
function wireVideo(containerEl, mediaId, onMissing, onFound, opts = {}) {
  const vsrc = mediaSrcVideo(mediaId);

  // Autoplay every real video by default.
  // Passing { autoplay: false } still allows a caller to opt out later.
  const shouldAutoplay = opts.autoplay !== false;

  const v = document.createElement("video");
  v.src = vsrc;
  v.controls = true;
  v.playsInline = true;
  v.preload = "auto";

  // Do not mute. Videos should autoplay with sound when the browser allows it.
  v.autoplay = shouldAutoplay;
  v.muted = false;
  v.defaultMuted = false;

  v.onloadedmetadata = () => {
    containerEl.innerHTML = "";

    containerEl.appendChild(v);
    containerEl.classList.add("has-media", "has-video");

    // Keep control clicks from bubbling to an ancestor <a> on overview cards.
    containerEl.addEventListener("click", (e) => e.stopPropagation());

    if (onFound) onFound();
  };

  v.onerror = () => {
    if (onMissing) onMissing();
  };

  if (shouldAutoplay) {
    v.currentTime = 0;

    v.play().catch(() => {
      // Some browsers may block autoplay with sound.
      // Controls remain visible, so the user can press play manually.
    });
  }
}

/**
 * Resolves a media-placeholder: tries an .mp4 first, then the .jpg. If neither
 * exists, the dashed placeholder is left untouched.
 */
export function wireMedia(containerEl, mediaId, alt, opts = {}) {
  if (!containerEl) return;

  wireVideo(
    containerEl,
    mediaId,
    () => wireImage(containerEl, mediaId, alt, opts.onMissing, opts.onFound),
    opts.onFound,
    opts
  );
}
