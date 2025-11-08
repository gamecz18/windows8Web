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

// Floating Bubbles System
const bubbles = [];

function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    // Random size between 40px and 150px
    const size = Math.random() * 110 + 40;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';

    // Random starting position
    const x = Math.random() * window.innerWidth;
    const y = window.innerHeight + 100; // Start below screen
    bubble.style.left = x + 'px';
    bubble.style.top = y + 'px';

    // Random animation duration
    const duration = Math.random() * 10 + 15; // 15-25 seconds
    bubble.style.animationDuration = duration + 's';

    // Alternate animation for variety
    if (Math.random() > 0.5) {
        bubble.style.animationName = 'bubbleFloatAlt';
    }

    // Random animation delay
    const delay = Math.random() * 5;
    bubble.style.animationDelay = delay + 's';

    // Random opacity
    bubble.style.opacity = Math.random() * 0.3 + 0.3; // 0.3 to 0.6

    document.querySelector('.background').appendChild(bubble);

    bubbles.push({
        element: bubble,
        x: x,
        y: y,
        size: size,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 1 - 0.5
    });

    return bubble;
}

// Mouse interaction with bubbles
let mouseX = 0;
let mouseY = 0;

function setupInteractiveBackground() {
    // Create initial bubbles
    const bubbleCount = 15;
    for (let i = 0; i < bubbleCount; i++) {
        setTimeout(() => {
            createBubble();
        }, i * 500);
    }

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Make bubbles react to mouse
        bubbles.forEach(bubbleData => {
            const bubble = bubbleData.element;
            const rect = bubble.getBoundingClientRect();
            const bubbleCenterX = rect.left + rect.width / 2;
            const bubbleCenterY = rect.top + rect.height / 2;

            const dx = mouseX - bubbleCenterX;
            const dy = mouseY - bubbleCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // If mouse is near bubble (within 150px), push it away
            if (distance < 150) {
                const force = (150 - distance) / 150;
                const angle = Math.atan2(dy, dx);
                const moveX = -Math.cos(angle) * force * 50;
                const moveY = -Math.sin(angle) * force * 50;

                bubble.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + force * 0.2})`;
                bubble.style.transition = 'transform 0.3s ease-out';
            } else {
                bubble.style.transform = '';
            }
        });
    });

    // Create new bubbles periodically
    setInterval(() => {
        if (bubbles.length < 20) {
            createBubble();
        }
    }, 3000);

    // Remove bubbles that are off screen
    setInterval(() => {
        bubbles.forEach((bubbleData, index) => {
            const rect = bubbleData.element.getBoundingClientRect();
            if (rect.bottom < -200 || rect.top > window.innerHeight + 200) {
                bubbleData.element.remove();
                bubbles.splice(index, 1);
            }
        });
    }, 5000);
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
    console.log('🫧 Interactive bubbles - move your mouse near them!');
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
