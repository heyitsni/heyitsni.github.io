const circle = document.querySelector('.profile-circle');
const img = circle.querySelector('img');

circle.addEventListener('mousemove', (e) => {
    const rect = circle.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 30;  // stronger tilt
    const rotateX = ((y / rect.height) - 0.5) * -30;

    const depth = 12; // how much 3D depth you want

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
