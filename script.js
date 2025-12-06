const circle = document.querySelector('.profile-circle');

circle.addEventListener('mousemove', (e) => {
    const rect = circle.getBoundingClientRect();
    const x = e.clientX - rect.left;   // mouse X inside element
    const y = e.clientY - rect.top;    // mouse Y inside element

    const rotateY = ((x / rect.width) - 0.5) * 20;  // tilt left/right
    const rotateX = ((y / rect.height) - 0.5) * -20; // tilt up/down

    circle.querySelector('img').style.transform =
        `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
});

circle.addEventListener('mouseleave', () => {
    circle.querySelector('img').style.transform =
        'rotateX(0deg) rotateY(0deg) scale(1)';
});
