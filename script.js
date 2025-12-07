document.addEventListener("DOMContentLoaded", () => {
    /* ======================
       GRID TOGGLE
    ====================== */

    let gridMode = 0; // 0 = square (default), 1 = dotted, 2 = off
    const btn = document.getElementById("gridToggle");

    function updateGrid() {
        document.body.classList.remove("grid-dotted", "grid-none");

        if (gridMode === 0) {
            // default square grid: base <body> style
            if (btn) btn.textContent = "Grid: Square";
        } else if (gridMode === 1) {
            document.body.classList.add("grid-dotted");
            if (btn) btn.textContent = "Grid: Dotted";
        } else if (gridMode === 2) {
            document.body.classList.add("grid-none");
            if (btn) btn.textContent = "Grid: Off";
        }
    }

    if (btn) {
        btn.addEventListener("click", () => {
            gridMode = (gridMode + 1) % 3;
            updateGrid();
        });
        // initial state
        updateGrid();
    }

    /* ======================
       PROFILE IMAGE PARALLAX
    ====================== */

    const circle = document.querySelector(".profile-circle");
    const img = circle ? circle.querySelector("img") : null;

    if (circle && img) {
        circle.addEventListener("mousemove", (e) => {
            const rect = circle.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateY = ((x / rect.width) - 0.5) * 30;
            const rotateX = ((y / rect.height) - 0.5) * -30;
            const depth = 12;

            img.style.transform = `
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(${depth}px)
                scale(1.08)
            `;
        });

        circle.addEventListener("mouseleave", () => {
            img.style.transform = `
                rotateX(0deg)
                rotateY(0deg)
                translateZ(0)
                scale(1)
            `;
        });
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
       JAZZ PLAYLIST for TURNTABLE
    ====================== */

    const playlist = [
        {
            title: "Soulful Vintage Piano Blues",
            url: "https://cdn.pixabay.com/audio/2022/04/08/audio_44df01f84f.mp3",
        },
        {
            title: "Old-School Jazz Piano Swing",
            url: "https://cdn.pixabay.com/audio/2022/04/20/audio_a6e8dfcade.mp3",
        },
        {
            title: "Slow Soul Jazz",
            url: "https://cdn.pixabay.com/audio/2023/02/07/audio_4b3b858727.mp3",
        },
        {
            title: "Ragtime Piano (Dee Yan-Key)",
            url: "https://files.freemusicarchive.org/storage-fmz/freemusicarchive.org/music/Dee_Yan-Key/New_York_Ragtime_Band/Dee_Yan-Key_-_01_-_Ragtime_Piano.mp3",
        },
        {
            title: "Vintage Soul / Gospel Jazz",
            url: "https://cdn.pixabay.com/audio/2023/09/12/audio_314ab3f588.mp3",
        },
    ];

    let currentTrackIndex = 0;

    const turntable = document.getElementById("turntable");
    const bgMusic = document.getElementById("bg-music");
    const trackTitleEl = document.getElementById("trackTitle");
    let isMusicPlaying = false;

    function loadTrack(index) {
        if (!bgMusic || playlist.length === 0) return;

        currentTrackIndex = index % playlist.length;
        const track = playlist[currentTrackIndex];

        bgMusic.src = track.url;
        bgMusic.load();

        if (trackTitleEl) {
            trackTitleEl.textContent = `Now spinning: ${track.title}`;
        }
    }

    function nextTrack(autoPlay = true) {
        if (!bgMusic) return;
        const nextIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(nextIndex);

        if (autoPlay) {
            bgMusic
                .play()
                .then(() => {
                    // track playing
                })
                .catch((err) => {
                    console.log("Autoplay blocked on next track:", err);
                });
        }
    }

    if (bgMusic) {
        loadTrack(0);

        bgMusic.addEventListener("ended", () => {
            nextTrack(true);
        });
    }
    bgMusic.addEventListener("error", () => {
    console.log("AUDIO ERROR:", bgMusic.error);
});


    /* ======================
       TURNTABLE CLICK CONTROL
    ====================== */

    if (turntable && bgMusic) {
        turntable.addEventListener("click", () => {
            console.log("Turntable clicked");

            // ensure a track is loaded
            if (!bgMusic.src) {
                loadTrack(currentTrackIndex);
            }

            // toggle state
            isMusicPlaying = !isMusicPlaying;

            if (isMusicPlaying) {
                turntable.classList.add("playing");
                bgMusic.play().catch((err) => {
                    console.log("Audio play failed:", err);
                });
            } else {
                turntable.classList.remove("playing");
                bgMusic.pause();
            }
        });
    }
});

