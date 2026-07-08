// Swaps a media-placeholder for a real image once one exists at the
// conventional path, and makes it click-to-maximize via a shared lightbox.
// Mirrors narration.js's "stay a placeholder until the asset resolves"
// pattern so nothing looks broken before Jia (or whoever) drops files in.

export function mediaSrc(mediaId) {
  return `/media/${mediaId}.jpg`;
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
  el.querySelectorAll("[data-close]").forEach((n) => n.addEventListener("click", closeLightbox));
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

/**
 * Probes for a real image at mediaSrc(mediaId). If it loads, replaces
 * containerEl's placeholder content with the image (click or Enter/Space to
 * maximize). If it 404s, leaves the existing placeholder markup untouched.
 */
export function wireMedia(containerEl, mediaId, alt) {
  if (!containerEl) return;
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
  };
  probe.src = src;
}
