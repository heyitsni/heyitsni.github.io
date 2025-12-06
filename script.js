/* ----------------------
   GRID TOGGLE
-----------------------*/
let mode = 0;
const btn = document.getElementById("gridToggle");

btn.addEventListener("click", () => {
    mode++;

    if (mode === 1) {
        // Dotted grid
        document.body.classList.remove("grid-square");
        document.body.classList.add("grid-dotted");
        btn.textContent = "Grid: Dotted";
    }
    else if (mode === 2) {
        // No grid
        document.body.classList.remove("grid-dotted");
        btn.textContent = "Grid: Off";
    }
    else {
        // Back to square grid
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

