document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Hamburger Menu Toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Animations
    gsap.from('.hero-title', {
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: 'power4.out'
    });

    gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 50,
        duration: 1.5,
        delay: 0.5,
        ease: 'power4.out'
    });

    gsap.from('.btn', {
        opacity: 0,
        scale: 0.5,
        duration: 1,
        delay: 1,
        ease: 'elastic.out(1, 0.5)'
    });

    
        // Grid Animation and Batman Logo
        const gridContainer = document.querySelector('.grid-lines');
    const batmanLogo = document.querySelector('.batman-logo img');
    const messageDiv = document.querySelector('#backend-message'); // Added

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

    let highlightCircle = document.createElement('div');
    highlightCircle.classList.add('highlight-circle');
    gridContainer.appendChild(highlightCircle);

    let hasFetched = false; // To fetch only once

    document.querySelector('.hero').addEventListener('mousemove', (e) => {
        const rect = gridContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.to(highlightCircle, {
            x: x,
            y: y,
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.out'
        });

        const logoRect = batmanLogo.getBoundingClientRect();
        const logoCenterX = (logoRect.left + logoRect.right) / 2 - rect.left;
        const logoCenterY = (logoRect.top + logoRect.bottom) / 2 - rect.top;
        const distance = Math.sqrt(Math.pow(x - logoCenterX, 2) + Math.pow(y - logoCenterY, 2));
        const maxDistance = Math.max(logoRect.width, logoRect.height) / 2 + 50;

        let glowIntensity = 0;
        let logoOpacity = 0;
        if (distance < maxDistance) {
            glowIntensity = 1 - (distance / maxDistance);
            logoOpacity = glowIntensity;
            glowIntensity = Math.max(0.2, glowIntensity);
            logoOpacity = Math.max(0.1, logoOpacity);

            // Fetch from backend only once when torch is near
            if (!hasFetched) {
                fetch('http://localhost:5000/api/message') // Update this URL when deploying
                    .then(response => response.json())
                    .then(data => {
                        messageDiv.textContent = data.message;
                        hasFetched = true;
                    })
                    .catch(error => {
                        console.error('Error fetching from backend:', error);
                        messageDiv.textContent = 'Error connecting to backend';
                    });
            }
        }

        batmanLogo.style.opacity = logoOpacity;
        batmanLogo.style.filter = `drop-shadow(0 0 10px rgba(0, 255, 204, ${glowIntensity})) 
                                   drop-shadow(0 0 20px rgba(0, 255, 204, ${glowIntensity * 0.7}))`;

        const radius = 50;
        const gridSize = 25;
        const gridX = Math.floor(x / gridSize) * gridSize;
        const gridY = Math.floor(y / gridSize) * gridSize;

        gridContainer.style.background = `
            linear-gradient(to right, 
                rgba(255, 255, 255, 0.03) 1px, 
                transparent 1px, 
                ${x - radius <= gridX && x + radius >= gridX ? 'rgba(0, 255, 204, 0.7)' : 'transparent'} 1px, 
                transparent 1px),
            linear-gradient(to bottom, 
                rgba(255, 255, 255, 0.03) 1px, 
                transparent 1px, 
                ${y - radius <= gridY && y + radius >= gridY ? 'rgba(0, 255, 204, 0.7)' : 'transparent'} 1px, 
                transparent 1px)
        `;
        gridContainer.style.backgroundSize = `${gridSize}px ${gridSize}px`;
    });

    document.querySelector('.hero').addEventListener('mouseleave', () => {
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
        batmanLogo.style.filter = `drop-shadow(0 0 5px rgba(0, 255, 204, 0))`;
        messageDiv.textContent = ''; // Clear message
        hasFetched = false; // Reset fetch flag
    });
    
        

    gsap.from('.about-img', {
        scrollTrigger: {
            trigger: '#about',
            start: 'top 80%',
            toggleActions: 'play none none reset'
        },
        opacity: 0,
        scale: 0.8,
        duration: 1.5,
        delay: 0.5,
        ease: 'elastic.out(1, 0.8)'
    });

    // Tilt Effect on Mouse Move
    document.querySelector('#about').addEventListener('mousemove', (e) => {
        const rect = aboutContent.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const width = rect.width;
        const height = rect.height;

        const cornerDistance = 100;
        let rotateX = 0;
        let rotateY = 0;
        const maxTilt = 5;

        if (x < cornerDistance && y < cornerDistance) {
            rotateX = maxTilt;
            rotateY = -maxTilt;
        } else if (x > width - cornerDistance && y < cornerDistance) {
            rotateX = maxTilt;
            rotateY = maxTilt;
        } else if (x < cornerDistance && y > height - cornerDistance) {
            rotateX = -maxTilt;
            rotateY = -maxTilt;
        } else if (x > width - cornerDistance && y > height - cornerDistance) {
            rotateX = -maxTilt;
            rotateY = maxTilt;
        }

        gsap.to(aboutContent, {
            rotationX: rotateX,
            rotationY: rotateY,
            duration: 0.5,
            ease: 'power2.out',
            transformPerspective: 1000
        });
    });

    document.querySelector('#about').addEventListener('mouseleave', () => {
        gsap.to(aboutContent, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    });

    // Portfolio Section Horizontal Scroll
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const portfolioItems = gsap.utils.toArray('.portfolio-item');
    const totalWidth = portfolioItems.reduce((acc, item) => acc + item.offsetWidth + 32, 0);

    gsap.to(portfolioGrid, {
        x: () => -(totalWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
            trigger: '#portfolio',
            start: 'top top',
            end: () => `+=${totalWidth}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
        }
    });

    // Portfolio Item Animations
    portfolioItems.forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: right,
                toggleActions: 'play none none reset'
            },
            opacity: 0,
            y: 100,
            duration: 1,
            delay: i * 0.2,
            ease: 'power2.out'
        });
    });

    // Instagram Button Animation
    gsap.from('.insta-btn', {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: 'footer',
            start: 'top 90%',
            toggleActions: 'play none none reset'
        }
    });

    // Fetch data from Firestore via backend
fetch('/api/data')
.then(response => response.json())
.then(data => {
  console.log(data);
  document.body.innerHTML += `<p>Data: ${JSON.stringify(data)}</p>`;
})
.catch(error => console.error('Error:', error));

// Send data to Firestore via backend
const newData = { name: 'Example', value: 42 };
fetch('/api/data', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(newData),
})
.then(response => response.json())
.then(result => console.log(result.message))
.catch(error => console.error('Error:', error));
  
});