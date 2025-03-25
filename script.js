document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.grid-lines');
    const batmanLogo = document.querySelector('.batman-logo img');
    const messageDiv = document.querySelector('#backend-message');
    const heroSection = document.querySelector('.hero');
    const heroTitle = document.querySelector('.hero-title');

    // GSAP Animations for Grid and Logo
    gsap.from(gridContainer, {
        opacity: 0,
        scale: 0.8,
        duration: 2,
        ease: 'power3.out'
    });

    gsap.from('.batman-logo', {
        opacity: 0,
        scale: 0.8,
        duration: 2,
        ease: 'power3.out',
        delay: 0.2
    });

    // Create Highlight Circle (Torch)
    let highlightCircle = document.createElement('div');
    highlightCircle.classList.add('highlight-circle');
    gridContainer.appendChild(highlightCircle);

    let hasFetched = false;
    let isTouching = false;
    let isGlowing = false;

    // Function to Update Torch Position and Effects
    const updateTorch = (x, y) => {
        const rect = gridContainer.getBoundingClientRect();
        const posX = x - rect.left;
        const posY = y - rect.top;

        // Move the torch
        gsap.to(highlightCircle, {
            x: posX,
            y: posY,
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.out'
        });

        // Calculate distance from torch to logo center
        const logoRect = batmanLogo.getBoundingClientRect();
        const logoCenterX = (logoRect.left + logoRect.right) / 2 - rect.left;
        const logoCenterY = (logoRect.top + logoRect.bottom) / 2 - rect.top;
        const distance = Math.sqrt(Math.pow(posX - logoCenterX, 2) + Math.pow(posY - logoCenterY, 2));

        // Adjust maxDistance based on screen size
        const screenWidth = window.innerWidth;
        let maxDistance = Math.max(logoRect.width, logoRect.height) / 2 + (screenWidth <= 480 ? 30 : screenWidth <= 768 ? 40 : 50);

        // Update logo opacity
        let glowIntensity = 0;
        let logoOpacity = 0;
        if (distance < maxDistance) {
            glowIntensity = 1 - (distance / maxDistance);
            logoOpacity = glowIntensity;
            logoOpacity = Math.max(0.1, logoOpacity);

            // Start glow animation on logo if not already glowing
            if (!isGlowing) {
                isGlowing = true;
                gsap.to(batmanLogo, {
                    filter: `drop-shadow(0 0 20px rgba(0, 255, 204, 1)) drop-shadow(0 0 40px rgba(0, 255, 204, 0.7))`,
                    duration: 0.8,
                    ease: 'power2.out'
                });

                // Make COSMITTO text fade out and move downward
                gsap.to(heroTitle, {
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            }

            // Fetch backend message only once
            if (!hasFetched) {
                fetch('https://cosmitto-backend.onrender.com/api/message')
                    .then(response => response.json())
                    .then(data => {
                        messageDiv.textContent = data.message;
                        console.log('Backend message:', data.message);
                        hasFetched = true;
                    })
                    .catch(error => {
                        console.error('Error fetching from backend:', error);
                        messageDiv.textContent = 'Error connecting to backend';
                    });
            }
        } else {
            // Reset glow and text opacity if torch moves away
            if (isGlowing) {
                isGlowing = false;
                gsap.to(batmanLogo, {
                    filter: `drop-shadow(0 0 5px rgba(0, 255, 204, 0))`,
                    duration: 2,
                    ease: 'power2.out'
                });

                // Make COSMITTO text fade in and move back up
                gsap.to(heroTitle, {
                    opacity: 1,
                    y: 0,
                    duration: 2,
                    ease: 'power2.out'
                });
            }
        }

        // Apply base opacity (no inline filter updates)
        batmanLogo.style.opacity = logoOpacity;

        // Update grid lines
        const radius = screenWidth <= 480 ? 30 : screenWidth <= 768 ? 40 : 50;
        const gridSize = screenWidth <= 480 ? 10 : screenWidth <= 768 ? 15 : 25;
        const gridX = Math.floor(posX / gridSize) * gridSize;
        const gridY = Math.floor(posY / gridSize) * gridSize;

        gridContainer.style.background = `
            linear-gradient(to right, 
                rgba(255, 255, 255, 0.03) 1px, 
                transparent 1px, 
                ${posX - radius <= gridX && posX + radius >= gridX ? 'rgba(0, 255, 204, 0.7)' : 'transparent'} 1px, 
                transparent 1px),
            linear-gradient(to bottom, 
                rgba(255, 255, 255, 0.03) 1px, 
                transparent 1px, 
                ${posY - radius <= gridY && posY + radius >= gridY ? 'rgba(0, 255, 204, 0.7)' : 'transparent'} 1px, 
                transparent 1px)
        `;
        gridContainer.style.backgroundSize = `${gridSize}px ${gridSize}px`;
    };

    // Reset Function
    const resetTorch = () => {
        gridContainer.style.background = `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `;
        gridContainer.style.backgroundSize = '25px 25px';
        gsap.to(highlightCircle, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
        batmanLogo.style.opacity = 0;

        // Reset glow and text opacity on reset
        if (isGlowing) {
            isGlowing = false;
            gsap.to(batmanLogo, {
                filter: `drop-shadow(0 0 5px rgba(0, 255, 204, 0))`,
                duration: 0.8,
                ease: 'power2.out'
            });

            // Make COSMITTO text fade in and move back up
            gsap.to(heroTitle, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out'
            });
        }

        messageDiv.textContent = '';
        hasFetched = false;
        isTouching = false;
    };

    // Mouse Events
    heroSection.addEventListener('mousemove', (e) => {
        updateTorch(e.clientX, e.clientY);
    });

    heroSection.addEventListener('mouseleave', () => {
        resetTorch();
    });

    // Touch Events
    heroSection.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isTouching = true;
        const touch = e.touches[0];
        updateTorch(touch.clientX, touch.clientY);
    });

    heroSection.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (isTouching) {
            const touch = e.touches[0];
            updateTorch(touch.clientX, touch.clientY);
        }
    });

    heroSection.addEventListener('touchend', () => {
        resetTorch();
    });
});