function completeGame(gameName) {
    localStorage.setItem(
        `tinyTots.${gameName}Complete`,
        "true"
    );
}


// Shared background music across every app page.
(() => {
  if (window.tinyTotsMusic) return;
  const music = new Audio(new URL("assets/sounds/Carefree.mp3", document.currentScript.src).href);
  window.tinyTotsMusic = music;
  music.loop = true;
  music.volume = 0.15;
  function syncMusicMute() {
  music.muted = localStorage.getItem("tinyTots.soundMuted") === "true";
}

syncMusicMute();
window.addEventListener("pageshow", syncMusicMute);
  music.preload = "auto";
  let pending = false;
  let position = 0;
  try { position = Number(sessionStorage.getItem("tinyTots.musicPosition")) || 0; } catch (error) {}
  music.addEventListener("loadedmetadata", () => {
    if (Number.isFinite(music.duration) && music.duration > 0) music.currentTime = position % music.duration;
  }, { once: true });
  function startMusic() {
    if (pending || !music.paused) return;
    pending = true;
    music.play().catch(error => {
      if (error.name !== "NotAllowedError" && error.name !== "AbortError") console.warn("Music:", error);
    }).finally(() => { pending = false; });
  }
  function startAppAudio() {
    startMusic();
    if (typeof userStartAudio === "function") userStartAudio().catch(error => console.warn("Audio:", error));
  }
  document.addEventListener("pointerdown", startAppAudio, true);
  document.addEventListener("keydown", startAppAudio, true);
  window.addEventListener("pageshow", startMusic);
  window.addEventListener("pagehide", () => {
    try { sessionStorage.setItem("tinyTots.musicPosition", String(music.currentTime)); } catch (error) {}
    music.pause();
  });
  startMusic();
})();
document.addEventListener("DOMContentLoaded", () => {
  const frame = document.querySelector("#hud-preview, .playroom-frame, .game-wrapper")
    || document.querySelector("main");
  const music = window.tinyTotsMusic;
  if (!frame || !music) return;

  if (getComputedStyle(frame).position === "static") {
    frame.style.position = "relative";
  }

  const button = document.createElement("button");
  button.type = "button";
  button.style.cssText = `
    position: absolute;
    top: 24px;
    right: 24px;
    z-index: 20;
    box-sizing: border-box;
    width: 126px;
    height: 52px;
    min-height: 52px;
    padding: 0;
    border: 3px solid #7b584b;
    border-radius: 18px;
    background: #ffd45a;
    color: #513b33;
    font-size: 20px;
    cursor: pointer;
  `;

  function updateSpeaker() {
    music.muted = localStorage.getItem("tinyTots.soundMuted") === "true";
    const label = music.muted ? "Unmute music" : "Mute music";
    button.textContent = music.muted ? "🔇" : "🔊";
    button.setAttribute("aria-label", label);
    button.title = label;
  }

  button.addEventListener("click", () => {
    localStorage.setItem("tinyTots.soundMuted", String(!music.muted));
    updateSpeaker();

    if (!music.muted && music.paused) {
      music.play().catch(console.warn);
    }
  });

  frame.appendChild(button);
  window.addEventListener("pageshow", updateSpeaker);
  updateSpeaker();
});
