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
