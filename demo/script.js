// Global mouse position
let mouseX = 0;
let mouseY = 0;

// Update mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Magnetic Buttons
function setupMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-button');

    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Magnetic strength
            const strength = 0.3;
            const moveX = x * strength;
            const moveY = y * strength;

            button.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0) scale(1)';
        });

        button.addEventListener('click', () => {
            button.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                button.style.animation = '';
            }, 500);
        });
    });
}

// Tilt Cards
function setupTiltCards() {
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        const shine = card.querySelector('.card-shine');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale3d(1.05, 1.05, 1.05)
            `;

            // Move shine
            if (shine) {
                shine.style.left = (x - rect.width) + 'px';
                shine.style.top = (y - rect.height) + 'px';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// Repel Effect
function setupRepelEffect() {
    const container = document.querySelector('.repel-container');
    const circles = document.querySelectorAll('.repel-circle');

    if (!container) return;

    // Store initial positions
    const initialPositions = Array.from(circles).map(circle => {
        const rect = circle.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        return {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2
        };
    });

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        circles.forEach((circle, index) => {
            const initialPos = initialPositions[index];
            const dx = mouseX - initialPos.x;
            const dy = mouseY - initialPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Repel if mouse is within 150px
            if (distance < 150) {
                const force = (150 - distance) / 150;
                const angle = Math.atan2(dy, dx);
                const moveX = -Math.cos(angle) * force * 60;
                const moveY = -Math.sin(angle) * force * 60;

                circle.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + force * 0.3})`;
            } else {
                circle.style.transform = 'translate(0, 0) scale(1)';
            }
        });
    });

    container.addEventListener('mouseleave', () => {
        circles.forEach(circle => {
            circle.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

// Spotlight Effect
function setupSpotlightEffect() {
    const items = document.querySelectorAll('.spotlight-item');

    items.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            item.style.setProperty('--x', x + '%');
            item.style.setProperty('--y', y + '%');
        });
    });
}

// Parallax Background
function setupParallaxBackground() {
    const grid = document.querySelector('.background-grid');

    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        grid.style.transform = `translate(${x}px, ${y}px)`;
    });
}

// Random floating animation for repel circles
function animateRepelCircles() {
    const circles = document.querySelectorAll('.repel-circle');

    circles.forEach((circle, index) => {
        setInterval(() => {
            if (circle.style.transform === 'translate(0, 0) scale(1)' || !circle.style.transform) {
                const randomX = (Math.random() - 0.5) * 10;
                const randomY = (Math.random() - 0.5) * 10;

                circle.style.transition = 'transform 2s ease-in-out';
                circle.style.transform = `translate(${randomX}px, ${randomY}px)`;

                setTimeout(() => {
                    circle.style.transform = 'translate(0, 0)';
                }, 2000);
            }
        }, (index + 1) * 3000);
    });
}

// Add ripple effect on click
function setupRippleEffect() {
    const buttons = document.querySelectorAll('.magnetic-button');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.pointerEvents = 'none';
            ripple.style.animation = 'ripple 0.6s ease-out';

            button.style.position = 'relative';
            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    setupMagneticButtons();
    setupTiltCards();
    setupRepelEffect();
    setupSpotlightEffect();
    setupParallaxBackground();
    animateRepelCircles();
    setupRippleEffect();

    console.log('🎮 Interactive Mouse Framework - Initialized');
    console.log('✨ All effects are active!');
});

// Performance optimization
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const style = document.createElement('style');
    style.textContent = `
        * {
            animation: none !important;
            transition: none !important;
        }
    `;
    document.head.appendChild(style);
}
