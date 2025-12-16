document.addEventListener("DOMContentLoaded", () => {
  /* ======================
     GRID TOGGLE
  ====================== */
  let gridMode = 0; // 0 = square (default), 1 = dotted, 2 = off
  const btn = document.getElementById("gridToggle");

  function updateGrid() {
    document.body.classList.remove("grid-dotted", "grid-none");

    if (gridMode === 0) {
      if (btn) btn.textContent = "Grid: Square";
    } else if (gridMode === 1) {
      document.body.classList.add("grid-dotted");
      if (btn) btn.textContent = "Grid: Dotted";
    } else {
      document.body.classList.add("grid-none");
      if (btn) btn.textContent = "Grid: Off";
    }
  }

  if (btn) {
    btn.addEventListener("click", () => {
      gridMode = (gridMode + 1) % 3;
      updateGrid();
    });
    updateGrid();
  }

  /* ======================
     PROFILE IMAGE PARALLAX (FIXED + SMOOTH)
     - listens on profile-area so clickable video doesn't break it
     - true circular hit-test (no square glitches)
     - requestAnimationFrame for smoothness
  ====================== */
  const profileArea = document.querySelector(".profile-area");
  const circle = document.querySelector(".profile-circle");
  const img = circle ? circle.querySelector("img") : null;

  if (profileArea && circle && img) {
    const maxRotate = 14;
    const scale = 1.06;

    let rafId = null;
    let lastEvent = null;

    function reset() {
      img.style.transition = "transform 0.25s ease";
      img.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)";
    }

    function insideCircle(clientX, clientY) {
      const rect = circle.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const r = Math.min(rect.width, rect.height) / 2;

      const dx = clientX - cx;
      const dy = clientY - cy;

      return (dx * dx + dy * dy) <= (r * r);
    }

    function applyTilt(e) {
      const rect = circle.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const x = (e.clientX - cx) / (rect.width / 2);   // -1..1
      const y = (e.clientY - cy) / (rect.height / 2);  // -1..1

      const rotY = x * maxRotate;
      const rotX = -y * maxRotate;

      img.style.transition = "transform 0.06s ease-out";
      img.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0) scale(${scale})`;
    }

    function onMove(e) {
      lastEvent = e;
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!lastEvent) return;

        if (!insideCircle(lastEvent.clientX, lastEvent.clientY)) {
          reset();
          return;
        }

        applyTilt(lastEvent);
      });
    }

    profileArea.addEventListener("mousemove", onMove);
    profileArea.addEventListener("mouseleave", () => {
      lastEvent = null;
      reset();
    });

    reset();
  }

  /* ======================
     AUTOCAD CROSSHAIR CURSOR
  ====================== */
  document.addEventListener("mousemove", (e) => {
    const root = document.documentElement;
    root.style.setProperty("--cursor-x", e.clientX + "px");
    root.style.setProperty("--cursor-y", e.clientY + "px");
  });

  /* ======================
     INTRO VIDEO HOVER PLAY
  ====================== */
  const introVideo = document.getElementById("introVideo");
  const introMusic = document.getElementById("introMusic");

  if (introMusic) introMusic.volume = 0.1;

  if (profileArea && introVideo && introMusic) {
    profileArea.addEventListener("mouseenter", () => {
      introVideo.currentTime = 0;
      introMusic.currentTime = 0;

      introVideo.play().catch((err) => console.log("Intro video play failed:", err));
      introMusic.play().catch((err) => console.log("Intro music play failed:", err));
    });

    profileArea.addEventListener("mouseleave", () => {
      introVideo.pause();
      introMusic.pause();
    });
  }

  /* ======================
     AUDIO ELEMENTS & VOLUMES
  ====================== */
  const turntable = document.getElementById("turntable");
  const bgMusic = document.getElementById("bg-music");
  const crackle = document.getElementById("crackle");
  const trackTitleEl = document.getElementById("trackTitle");

  if (bgMusic) bgMusic.volume = 0.2;
  if (crackle) crackle.volume = 0.2;

  /* ======================
     PLAYLIST
  ====================== */
  const playlist = [
    { title: "A Jazz Piano", url: "a-jazz-piano-110481.mp3" },
    { title: "Blues du Départ", url: "blues-du-depart-335178.mp3" },
    { title: "Gimme Gimme Jazz", url: "gimme-gimme-jazz-179073.mp3" },
    { title: "Guitar Blues", url: "guitar-blues-320298.mp3" },
    { title: "Last Blues Before Sleeping", url: "last-blues-before-sleeping-330428.mp3" },
    { title: "Ogi – Feel The Beat (Jazz Expresso)", url: "ogi-feel-the-beat-jazz-expresso-191266.mp3" },
    { title: "Romantic Blues", url: "romantic-blues-286563.mp3" },
    { title: "S_xy Blues Soul", url: "s_xy-blues-soul-286560.mp3" },
    { title: "Slow Blues", url: "slow-blues-382029.mp3" },
    { title: "That Jazz", url: "that-jazz-260655.mp3" },
    { title: "The Best Jazz Club in New Orleans", url: "the-best-jazz-club-in-new-orleans-164472.mp3" }
  ];

  let currentTrackIndex = 0;
  let isMusicPlaying = false;

  function loadTrack(index) {
    if (!bgMusic || playlist.length === 0) return;

    currentTrackIndex = (index + playlist.length) % playlist.length;
    const track = playlist[currentTrackIndex];

    bgMusic.src = track.url;
    bgMusic.load();

    if (trackTitleEl) trackTitleEl.textContent = `Now spinning: ${track.title}`;
  }

  function nextTrack(autoPlay = true) {
    if (!bgMusic) return;
    loadTrack(currentTrackIndex + 1);
    if (autoPlay) bgMusic.play().catch((err) => console.log("Autoplay blocked:", err));
  }

  function prevTrack(autoPlay = true) {
    if (!bgMusic) return;
    loadTrack(currentTrackIndex - 1);
    if (autoPlay) bgMusic.play().catch((err) => console.log("Autoplay blocked:", err));
  }

  if (bgMusic) {
    loadTrack(0);
    bgMusic.addEventListener("ended", () => nextTrack(true));
    bgMusic.addEventListener("error", () => console.log("AUDIO ERROR:", bgMusic.error));
  }

  function ensurePlayingUI() {
    isMusicPlaying = true;
    if (turntable) turntable.classList.add("playing");

    if (crackle) {
      crackle.currentTime = 0;
      crackle.play().catch((err) => console.log("Crackle play failed:", err));
    }
  }

  /* ======================
     TURNTABLE CLICK CONTROL
  ====================== */
  if (turntable && bgMusic) {
    turntable.addEventListener("click", () => {
      if (!bgMusic.src) loadTrack(currentTrackIndex);

      isMusicPlaying = !isMusicPlaying;

      if (isMusicPlaying) {
        turntable.classList.add("playing");
        bgMusic.play().catch((err) => console.log("Audio play failed:", err));

        if (crackle) {
          crackle.currentTime = 0;
          crackle.play().catch((err) => console.log("Crackle play failed:", err));
        }
      } else {
        turntable.classList.remove("playing");
        bgMusic.pause();
        if (crackle) crackle.pause();
      }
    });
  }

  /* ======================
     Prev / Next BUTTONS
  ====================== */
  const prevBtn = document.getElementById("prevTrackBtn");
  const nextBtn = document.getElementById("nextTrackBtn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      ensurePlayingUI();
      prevTrack(true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      ensurePlayingUI();
      nextTrack(true);
    });
  }

  /* ======================
     "hey, its" – TYPEWRITER on LOGO AREA HOVER
  ====================== */
  const heyEl = document.getElementById("heyItsNi");
  const logoHoverArea = document.getElementById("logoHoverArea");

  if (heyEl && logoHoverArea) {
    const fullText = (heyEl.dataset.text || heyEl.textContent || "").trim();
    heyEl.textContent = fullText;

    let typingInterval = null;
    let hasTypedThisHover = false;

    function startTyping() {
      if (hasTypedThisHover) return;
      hasTypedThisHover = true;

      if (typingInterval) clearInterval(typingInterval);

      heyEl.classList.add("typing");
      heyEl.textContent = "";

      let i = 0;
      typingInterval = setInterval(() => {
        heyEl.textContent = fullText.slice(0, i + 1);
        i++;

        if (i >= fullText.length) {
          clearInterval(typingInterval);
          typingInterval = null;
          heyEl.classList.remove("typing");
          heyEl.textContent = fullText;
        }
      }, 80);
    }

    function resetHoverState() {
      hasTypedThisHover = false;
      if (typingInterval) clearInterval(typingInterval);
      typingInterval = null;
      heyEl.classList.remove("typing");
      heyEl.textContent = fullText;
    }

    logoHoverArea.addEventListener("mouseenter", startTyping);
    logoHoverArea.addEventListener("mouseleave", resetHoverState);
  }
});
