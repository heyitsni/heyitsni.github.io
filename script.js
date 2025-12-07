/* ----------------------
   GRID TOGGLE
-----------------------*/
let mode = 0;
const btn = document.getElementById("gridToggle");

// Apply default square grid on load
document.body.classList.add("grid-square");
btn.textContent = "Grid: Square";

btn.addEventListener("click", () => {
    // Remove all grid classes first
    document.body.classList.remove("grid-square", "grid-dotted", "grid-none");

    mode++;

    if (mode === 1) {
        document.body.classList.add("grid-dotted");
        btn.textContent = "Grid: Dotted";
    } else if (mode === 2) {
        document.body.classList.add("grid-none");
        btn.textContent = "Grid: Off";
    } else {
        document.body.classList.add("grid-square");
        btn.textContent = "Grid: Square";
        mode = 0;
    }
});

/* ----------------------
   PROFILE IMAGE PARALLAX
-----------------------*/
const circle = document.querySelector('.profile-circle');
const img = circle.querySelector('img');

circle.addEventListener('mousemove', (e) => {
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

circle.addEventListener('mouseleave', () => {
    img.style.transform = `
        rotateX(0deg)
        rotateY(0deg)
        translateZ(0)
        scale(1)
    `;
});

document.addEventListener("mousemove", (e) => {
    const root = document.documentElement;
    root.style.setProperty("--cursor-x", e.clientX + "px");
    root.style.setProperty("--cursor-y", e.clientY + "px");
});

/* ======================
   JAZZ PLAYLIST for TURNTABLE
====================== */

/* Ray-Charles-ish VIBE – royalty-free jazz/blues style */
const playlist = [
    {
        title: "Soulful Vintage Piano Blues",
        url: "https://cdn.pixabay.com/audio/2022/04/08/audio_44df01f84f.mp3"
    },
    {
        title: "Old-School Jazz Piano Swing",
        url: "https://cdn.pixabay.com/audio/2022/04/20/audio_a6e8dfcade.mp3"
    },
    {
        title: "Slow Soul Jazz",
        url: "https://cdn.pixabay.com/audio/2023/02/07/audio_4b3b858727.mp3"
    },
    {
        title: "Ragtime Piano (Dee Yan-Key)",
        url: "https://files.freemusicarchive.org/storage-fmz/freemusicarchive.org/music/Dee_Yan-Key/New_York_Ragtime_Band/Dee_Yan-Key_-_01_-_Ragtime_Piano.mp3"
    },
    {
        title: "Vintage Soul / Gospel Jazz",
        url: "https://cdn.pixabay.com/audio/2023/09/12/audio_314ab3f588.mp3"
    }
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

// go to next track (auto when one ends)
function nextTrack(autoPlay = true) {
    if (!bgMusic) return;
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(nextIndex);

    if (autoPlay) {
        bgMusic.play().catch(err => {
            console.log("Autoplay blocked on next track:", err);
        });
    }
}

// Initialize first track
if (bgMusic) {
    loadTrack(0);

    // When track ends → next one
    bgMusic.addEventListener("ended", () => {
        nextTrack(true);
    });
}

/* ======================
   TURNTABLE CLICK CONTROL
====================== */

if (turntable && bgMusic) {
    turntable.addEventListener("click", async () => {
        try {
            if (!isMusicPlaying) {
                // If no src loaded for any reason, ensure we have the current track set
                if (!bgMusic.src) {
                    loadTrack(currentTrackIndex);
                }
                await bgMusic.play();
                isMusicPlaying = true;
                turntable.classList.add("playing");
            } else {
                bgMusic.pause();
                isMusicPlaying = false;
                turntable.classList.remove("playing");
            }
        } catch (err) {
            console.log("Audio play might be blocked by browser:", err);
        }
    });
}



