// Dark Mode Toggle
function setupDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Check for saved preference
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        body.classList.add('dark-mode');
    }

    // Toggle dark mode
    toggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        // Save preference
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}

// Interactive Particle System
function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 5 + 3;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';

    document.querySelector('.background').appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 3000);
}

// Mouse move particle effect
let lastParticleTime = 0;
function setupInteractiveBackground() {
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastParticleTime > 50) { // Throttle particle creation
            createParticle(e.clientX, e.clientY);
            lastParticleTime = now;
        }
    });

    // Click creates multiple particles
    document.addEventListener('click', (e) => {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const offsetX = (Math.random() - 0.5) * 20;
                const offsetY = (Math.random() - 0.5) * 20;
                createParticle(e.clientX + offsetX, e.clientY + offsetY);
            }, i * 50);
        }
    });
}

// Update time and date
function updateTime() {
    const now = new Date();

    // Format time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    // Format date in Czech
    const days = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
    const months = ['ledna', 'února', 'března', 'dubna', 'května', 'června',
                    'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];

    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const dateString = `${dayName}, ${day}. ${month}`;

    // Update DOM
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');

    if (timeElement) timeElement.textContent = timeString;
    if (dateElement) dateElement.textContent = dateString;
}

// Tile click animation
function setupTileInteractions() {
    const tiles = document.querySelectorAll('.tile');

    tiles.forEach(tile => {
        tile.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.pointerEvents = 'none';
            ripple.style.animation = 'ripple 0.6s ease-out';

            const rect = tile.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            tile.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax effect for background orbs
function setupParallax() {
    const orbs = document.querySelectorAll('.gradient-orb');

    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;

            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// Tile hover effect with tilt
function setupTiltEffect() {
    const tiles = document.querySelectorAll('.tile');

    tiles.forEach(tile => {
        tile.addEventListener('mousemove', function(e) {
            const rect = tile.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            tile.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });

        tile.addEventListener('mouseleave', function() {
            tile.style.transform = '';
        });
    });
}

// Animate live info updates
function animateLiveInfo() {
    const liveInfoElements = document.querySelectorAll('.live-info');

    setInterval(() => {
        liveInfoElements.forEach(element => {
            element.style.animation = 'none';
            setTimeout(() => {
                element.style.animation = 'pulse 0.5s ease';
            }, 10);
        });
    }, 5000);
}

// Add pulse animation CSS
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.05);
            opacity: 0.8;
        }
    }
`;
document.head.appendChild(pulseStyle);

// Keyboard navigation
function setupKeyboardNavigation() {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    let currentIndex = -1;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            currentIndex = (currentIndex + 1) % tiles.length;
            tiles[currentIndex].focus();
        }

        if (e.key === 'Enter' && currentIndex >= 0) {
            tiles[currentIndex].click();
        }
    });

    // Make tiles focusable
    tiles.forEach((tile, index) => {
        tile.setAttribute('tabindex', '0');
        tile.addEventListener('focus', function() {
            currentIndex = index;
        });
    });
}

// Random tile content updates (simulating live tiles)
function setupLiveTiles() {
    const taskTile = document.querySelector('.tile-red .live-info');
    const statsTile = document.querySelector('.tile-scarlet .live-info');

    if (taskTile) {
        setInterval(() => {
            const tasks = Math.floor(Math.random() * 15) + 5;
            taskTile.textContent = `${tasks} aktivních`;
        }, 10000);
    }

    if (statsTile) {
        setInterval(() => {
            const change = (Math.random() * 50 - 10).toFixed(0);
            const arrow = change >= 0 ? '↑' : '↓';
            statsTile.textContent = `${arrow} ${Math.abs(change)}%`;
        }, 8000);
    }
}

// Smooth scroll for better experience
function setupSmoothScroll() {
    document.documentElement.style.scrollBehavior = 'smooth';
}

// Notification badge animation
function animateNotifications() {
    const badges = document.querySelectorAll('.notification-badge');

    badges.forEach(badge => {
        setInterval(() => {
            badge.style.animation = 'none';
            setTimeout(() => {
                badge.style.animation = 'bounce 0.5s ease';
            }, 10);
        }, 3000);
    });
}

const bounceStyle = document.createElement('style');
bounceStyle.textContent = `
    @keyframes bounce {
        0%, 100% {
            transform: scale(1);
        }
        25% {
            transform: scale(1.2);
        }
        50% {
            transform: scale(0.9);
        }
        75% {
            transform: scale(1.1);
        }
    }
`;
document.head.appendChild(bounceStyle);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup dark mode first (before anything else)
    setupDarkMode();

    // Setup interactive background
    setupInteractiveBackground();

    // Update time immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);

    // Setup all interactions
    setupTileInteractions();
    setupParallax();
    setupTiltEffect();
    animateLiveInfo();
    setupKeyboardNavigation();
    setupLiveTiles();
    setupSmoothScroll();
    animateNotifications();

    // Add loaded class for animations
    document.body.classList.add('loaded');

    console.log('🪟 Windows 8 + Liquid Glass - Initialized');
    console.log('✨ Enjoy the glassmorphism experience!');
    console.log('🌓 Dark mode available - click the toggle in the header');
    console.log('✨ Interactive background - move your mouse!');
});

// Performance optimization - reduce animations on low-end devices
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const allAnimations = document.querySelectorAll('*');
    allAnimations.forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}

// Handle visibility change to pause animations when tab is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause heavy animations
        document.querySelectorAll('.gradient-orb').forEach(orb => {
            orb.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations
        document.querySelectorAll('.gradient-orb').forEach(orb => {
            orb.style.animationPlayState = 'running';
        });
    }
});
