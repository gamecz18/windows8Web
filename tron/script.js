// Update system time
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    const timeElement = document.getElementById('time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// 3D Tilt Effect for Grid Items
function setup3DTilt() {
    const items = document.querySelectorAll('[data-tilt]');

    items.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            item.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-5px)
                scale3d(1.02, 1.02, 1.02)
            `;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale3d(1, 1, 1)';
        });
    });
}

// Glowing particle system
class Particle {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > this.canvas.width ||
            this.y < 0 || this.y > this.canvas.height) {
            this.reset();
        }
    }

    draw() {
        this.ctx.fillStyle = `rgba(0, 217, 255, ${this.opacity})`;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#00d9ff';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

function setupParticleSystem() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas, ctx));
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Interactive grid lines
function setupInteractiveGrid() {
    const gridBackground = document.querySelector('.grid-background');
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        const x = (mouseX / window.innerWidth - 0.5) * 30;
        const y = (mouseY / window.innerHeight - 0.5) * 30;

        gridBackground.style.transform = `
            rotateX(${y}deg)
            rotateY(${x}deg)
            translateZ(0)
        `;
    });
}

// Ripple effect on click
function setupRippleEffect() {
    const items = document.querySelectorAll('.grid-item');

    items.forEach(item => {
        item.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            const rect = item.getBoundingClientRect();

            const size = Math.max(rect.width, rect.height) * 2;
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.border = '2px solid var(--tron-cyan)';
            ripple.style.pointerEvents = 'none';
            ripple.style.animation = 'rippleExpand 0.8s ease-out';

            item.style.position = 'relative';
            item.appendChild(ripple);

            setTimeout(() => ripple.remove(), 800);
        });
    });
}

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleExpand {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(1);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Dynamic status bar animation
function animateStatusBars() {
    const statusBars = document.querySelectorAll('.status-fill');

    statusBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';

        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 500);
    });
}

// Glitch effect on random intervals
function setupRandomGlitch() {
    const glitchElements = document.querySelectorAll('.glitch');

    setInterval(() => {
        glitchElements.forEach(el => {
            el.style.animation = 'none';
            setTimeout(() => {
                el.style.animation = 'glitch 0.3s ease';
            }, 10);
        });
    }, 8000);
}

// Live metrics update
function updateLiveMetrics() {
    const metricsElements = document.querySelectorAll('.metric');

    setInterval(() => {
        metricsElements.forEach(el => {
            if (el.textContent.includes('%')) {
                const currentValue = parseInt(el.textContent);
                const change = Math.floor(Math.random() * 10) - 5;
                const newValue = Math.max(0, Math.min(100, currentValue + change));

                if (el.textContent.includes('↑') || el.textContent.includes('↓')) {
                    const arrow = newValue >= currentValue ? '↑' : '↓';
                    el.textContent = `${arrow} ${newValue}%`;
                } else {
                    el.textContent = `${newValue}% ACTIVE`;
                }
            }
        });
    }, 5000);
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // ESC to go back
        if (e.key === 'Escape') {
            window.location.href = '../index.html';
        }

        // G for grid toggle (placeholder)
        if (e.key === 'g' || e.key === 'G') {
            const gridBg = document.querySelector('.grid-background');
            gridBg.style.opacity = gridBg.style.opacity === '0' ? '1' : '0';
        }

        // S for scanlines toggle
        if (e.key === 's' || e.key === 'S') {
            const scanlines = document.querySelector('.scanlines');
            scanlines.style.opacity = scanlines.style.opacity === '0' ? '1' : '0';
        }
    });
}

// Connection lines between items (decorative)
function drawConnectionLines() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const items = document.querySelectorAll('.grid-item');

    function drawLines() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(0, 217, 255, 0.1)';
        ctx.lineWidth = 1;

        const itemsArray = Array.from(items);

        // Draw lines between adjacent items
        for (let i = 0; i < itemsArray.length - 1; i++) {
            if (Math.random() > 0.7) { // Only some connections
                const rect1 = itemsArray[i].getBoundingClientRect();
                const rect2 = itemsArray[i + 1].getBoundingClientRect();

                const x1 = rect1.left + rect1.width / 2;
                const y1 = rect1.top + rect1.height / 2;
                const x2 = rect2.left + rect2.width / 2;
                const y2 = rect2.top + rect2.height / 2;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        }
    }

    drawLines();
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawLines();
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Start time update
    updateTime();
    setInterval(updateTime, 1000);

    // Setup all interactive features
    setup3DTilt();
    setupParticleSystem();
    setupInteractiveGrid();
    setupRippleEffect();
    animateStatusBars();
    setupRandomGlitch();
    updateLiveMetrics();
    setupKeyboardShortcuts();
    drawConnectionLines();

    // Add loaded class for animations
    document.body.classList.add('loaded');

    console.log('⚡ TRON LEGACY SYSTEM - ONLINE');
    console.log('🔵 All systems operational');
    console.log('⌨️  Keyboard shortcuts: ESC (exit), G (grid), S (scanlines)');
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

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations
        document.querySelectorAll('*').forEach(el => {
            if (el.style.animationPlayState) {
                el.style.animationPlayState = 'paused';
            }
        });
    } else {
        // Resume animations
        document.querySelectorAll('*').forEach(el => {
            if (el.style.animationPlayState) {
                el.style.animationPlayState = 'running';
            }
        });
    }
});
