// Per-scenario narration playback — a small scrubbable player (play/pause +
// seek track + time), not just a toggle. The whole control stays hidden
// until its audio file actually resolves, so nothing looks broken while a
// scenario's narration hasn't been recorded yet.

export function narrationSrc(systemKey, scenarioKey) {
  return `/audio/${systemKey}/${scenarioKey}.mp3`;
}

function formatTime(totalSeconds) {
  if (!isFinite(totalSeconds)) return "0:00";
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

/**
 * Wires a persistent player rooted at `rootEl` (it lives in the map shell,
 * not the per-scenario panel markup, so it survives scenario switches).
 * Returns { load(src), reset(), stop() }.
 */
export function createNarrationControl(rootEl) {
  const toggleBtn = rootEl.querySelector(".narration-toggle");
  const iconUse = toggleBtn.querySelector("use");
  const track = rootEl.querySelector(".narration-track");
  const timeEl = rootEl.querySelector(".narration-time");

  let audio = null;
  let scrubbing = false;

  function setIcon(name, label) {
    iconUse.setAttribute("href", `#icon-${name}`);
    toggleBtn.setAttribute("aria-label", label);
  }

  function setProgress(pct) {
    track.style.setProperty("--progress", `${pct}%`);
    track.setAttribute("aria-valuenow", String(Math.round(pct)));
  }

  function renderTime(current, duration) {
    timeEl.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
  }

  function reset() {
    if (audio) audio.pause();
    audio = null;
    scrubbing = false;
    rootEl.classList.remove("ready");
    setIcon("play", "Play narration");
    setProgress(0);
    renderTime(0, 0);
  }

  function load(src) {
    reset();
    const a = new Audio(src);
    a.addEventListener("loadedmetadata", () => {
      if (a !== audio) return;
      rootEl.classList.add("ready");
      renderTime(0, a.duration);
    });
    a.addEventListener("timeupdate", () => {
      if (a !== audio || scrubbing) return;
      setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
      renderTime(a.currentTime, a.duration);
    });
    a.addEventListener("ended", () => {
      setIcon("play", "Play narration");
      a.currentTime = 0;
      setProgress(0);
      renderTime(0, a.duration);
    });
    a.addEventListener("error", () => {
      if (a === audio) rootEl.classList.remove("ready");
    });
    audio = a;
  }

  toggleBtn.addEventListener("click", () => {
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setIcon("pause", "Pause narration");
    } else {
      audio.pause();
      setIcon("play", "Play narration");
    }
  });

  function pctFromEvent(e) {
    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    return Math.min(1, Math.max(0, rect.width ? x / rect.width : 0));
  }

  track.addEventListener("pointerdown", (e) => {
    if (!audio || !audio.duration) return;
    scrubbing = true;
    track.setPointerCapture(e.pointerId);
    const pct = pctFromEvent(e);
    setProgress(pct * 100);
    renderTime(pct * audio.duration, audio.duration);
  });
  track.addEventListener("pointermove", (e) => {
    if (!scrubbing || !audio) return;
    const pct = pctFromEvent(e);
    setProgress(pct * 100);
    renderTime(pct * audio.duration, audio.duration);
  });
  function commitScrub(e) {
    if (!scrubbing || !audio) return;
    scrubbing = false;
    audio.currentTime = pctFromEvent(e) * audio.duration;
  }
  track.addEventListener("pointerup", commitScrub);
  track.addEventListener("pointercancel", commitScrub);

  track.addEventListener("keydown", (e) => {
    if (!audio || !audio.duration) return;
    if (e.key === "ArrowRight") audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    else if (e.key === "ArrowLeft") audio.currentTime = Math.max(0, audio.currentTime - 5);
    else return;
    e.preventDefault();
  });

  return { load, reset, stop: () => audio && audio.pause() };
}
