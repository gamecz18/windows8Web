// Login Form Handler
const loginForm = document.getElementById('loginForm');
const loginContainer = document.getElementById('loginContainer');
const successOverlay = document.getElementById('successOverlay');
const successUser = document.getElementById('successUser');
const engravedUsername = document.getElementById('engravedUsername');
const loginStatus = document.getElementById('loginStatus');
const loginButton = loginForm.querySelector('.login-button');

// Handle form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Validate that fields are not empty
    if (!username || !password) {
        showStatus('Please fill in all fields', 'error');
        return;
    }

    // Start login process
    await performLogin(username);
});

async function performLogin(username) {
    // Show processing status
    showStatus('Authenticating...', 'processing');
    loginButton.classList.add('loading');
    loginButton.disabled = true;

    // Simulate authentication delay
    await delay(1500);

    // All credentials are valid for now
    const success = true;

    if (success) {
        // Hide processing status
        loginStatus.classList.remove('show');

        // Short delay before showing success
        await delay(300);

        // Show success overlay
        successUser.textContent = `Welcome, ${username}`;
        successOverlay.classList.add('active');

        // Wait for success animation
        await delay(2000);

        // Hide success overlay
        successOverlay.classList.remove('active');

        // Engrave username in background
        engraveUsername(username);

        // Hide login container
        loginContainer.classList.add('hidden');

        // After 3 seconds, redirect to main tron page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    }

    loginButton.classList.remove('loading');
    loginButton.disabled = false;
}

function engraveUsername(username) {
    // Set the username text
    engravedUsername.textContent = username.toUpperCase();

    // Trigger the engraving animation
    setTimeout(() => {
        engravedUsername.classList.add('active');
    }, 100);
}

function showStatus(message, type) {
    loginStatus.textContent = message;
    loginStatus.className = 'login-status show ' + type;

    if (type === 'error') {
        setTimeout(() => {
            loginStatus.classList.remove('show');
        }, 3000);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Input field focus effects
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
    });

    // Add typing sound effect (visual feedback)
    input.addEventListener('input', (e) => {
        const inputWrapper = input.parentElement;
        inputWrapper.style.animation = 'none';
        setTimeout(() => {
            inputWrapper.style.animation = 'inputFlash 0.1s ease';
        }, 10);
    });
});

// Add input flash animation
const inputFlashStyle = document.createElement('style');
inputFlashStyle.textContent = `
    @keyframes inputFlash {
        0% {
            filter: brightness(1);
        }
        50% {
            filter: brightness(1.2);
        }
        100% {
            filter: brightness(1);
        }
    }
`;
document.head.appendChild(inputFlashStyle);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to clear form
    if (e.key === 'Escape') {
        if (!loginContainer.classList.contains('hidden')) {
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('username').focus();
        }
    }
});

// Auto-focus username field on load
window.addEventListener('load', () => {
    document.getElementById('username').focus();
    console.log('⚡ TRON LOGIN SYSTEM - ONLINE');
    console.log('🔐 All credentials accepted for testing');
    console.log('⌨️  Press ESC to clear form');
});

// Glitch effect on logo occasionally
const logo = document.querySelector('.logo-login');
setInterval(() => {
    logo.style.animation = 'none';
    setTimeout(() => {
        logo.style.animation = 'logoPulse 3s ease-in-out infinite';
    }, 10);
}, 15000);

// Random background interference effect
function createInterference() {
    const interference = document.createElement('div');
    interference.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            ${Math.random() > 0.5 ? '0deg' : '90deg'},
            transparent ${Math.random() * 40}%,
            rgba(0, 229, 255, 0.03) ${Math.random() * 50 + 25}%,
            transparent ${Math.random() * 40 + 60}%
        );
        pointer-events: none;
        z-index: 1;
        animation: interferenceFlash 0.3s ease-out;
    `;

    document.body.appendChild(interference);

    setTimeout(() => {
        interference.remove();
    }, 300);
}

// Add interference animation
const interferenceStyle = document.createElement('style');
interferenceStyle.textContent = `
    @keyframes interferenceFlash {
        0% {
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
`;
document.head.appendChild(interferenceStyle);

// Trigger interference occasionally
setInterval(() => {
    if (Math.random() > 0.7 && !loginContainer.classList.contains('hidden')) {
        createInterference();
    }
}, 8000);

// Particle system (minimal, subtle)
class LoginParticle {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.3 + 0.1;
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
        this.ctx.fillStyle = `rgba(0, 229, 255, ${this.opacity})`;
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = '#00e5ff';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

function setupParticles() {
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
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        particles.push(new LoginParticle(canvas, ctx));
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

// Initialize particles
setupParticles();
