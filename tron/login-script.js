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

// Matter.js Physics Setup
let physicsEngine, physicsWorld, physicsRender;
const fallingFragments = [];

function setupPhysics() {
    const { Engine, World, Bodies, Render, Runner } = Matter;

    physicsEngine = Engine.create();
    physicsWorld = physicsEngine.world;
    physicsWorld.gravity.y = 3.5; // Stronger gravity for more dramatic fall

    // Create invisible renderer (we'll render fragments ourselves)
    Runner.run(physicsEngine);
}

function engraveUsername(username) {
    setupPhysics();

    const text = username.toUpperCase();

    // Split text into individual letters
    engravedUsername.innerHTML = '';
    const letters = text.split('').map(char => {
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'letter';
        span.style.opacity = '0';
        engravedUsername.appendChild(span);
        return span;
    });

    // Create laser beam element
    const laserBeam = document.createElement('div');
    laserBeam.className = 'laser-beam';
    document.body.appendChild(laserBeam);

    // Create laser impact point
    const laserImpact = document.createElement('div');
    laserImpact.className = 'laser-impact';
    document.body.appendChild(laserImpact);

    // Show the container first
    setTimeout(() => {
        engravedUsername.classList.add('active');
    }, 100);

    // Animate laser across the text
    const duration = 2500;
    const startDelay = 300;

    setTimeout(() => {
        // Start laser from left side
        laserBeam.style.display = 'block';
        laserImpact.style.display = 'block';

        const textRect = engravedUsername.getBoundingClientRect();
        const startX = textRect.left - 200;
        const endX = textRect.right + 200;
        const centerY = textRect.top + textRect.height / 2;

        let progress = 0;
        const animationDuration = duration;
        const startTime = Date.now();

        function animateLaser() {
            const elapsed = Date.now() - startTime;
            progress = Math.min(elapsed / animationDuration, 1);

            // Calculate laser position
            const currentX = startX + (endX - startX) * progress;

            // Update laser beam position
            laserBeam.style.left = currentX + 'px';
            laserBeam.style.top = (centerY - 300) + 'px';
            laserBeam.style.bottom = '0';

            // Update impact point
            laserImpact.style.left = currentX + 'px';
            laserImpact.style.top = centerY + 'px';

            // Cut letters as laser passes over them
            letters.forEach((letter, index) => {
                const letterRect = letter.getBoundingClientRect();
                const letterCenter = letterRect.left + letterRect.width / 2;

                if (currentX >= letterCenter - 20 && letter.style.opacity === '0') {
                    // Burn in the letter
                    letter.style.opacity = '1';
                    letter.classList.add('burning');

                    // Create falling fragment from center of letter
                    createFallingFragment(letterRect, letter.textContent);

                    // Create sparks at letter position
                    createSparks(letterCenter, centerY);

                    setTimeout(() => {
                        letter.classList.remove('burning');
                        letter.classList.add('burned');
                    }, 200);
                }
            });

            if (progress < 1) {
                requestAnimationFrame(animateLaser);
            } else {
                // Laser finished, fade it out
                laserBeam.style.opacity = '0';
                laserImpact.style.opacity = '0';

                setTimeout(() => {
                    laserBeam.remove();
                    laserImpact.remove();
                }, 500);
            }
        }

        animateLaser();

        // Start physics update loop
        updatePhysicsFragments();
    }, startDelay);
}

// Create a fragment that falls with physics - laser cuts letter into TOP and BOTTOM halves
function createFallingFragment(letterRect, char) {
    const { Bodies, World } = Matter;

    const centerX = letterRect.left + letterRect.width / 2;
    const centerY = letterRect.top + letterRect.height / 2;

    // Create cut line visualization
    createCutLine(letterRect.left, centerY, letterRect.right, centerY);

    // Create TOP HALF of the letter
    const topHalf = document.createElement('div');
    topHalf.className = 'falling-fragment top-half';
    topHalf.textContent = char;
    topHalf.style.left = letterRect.left + 'px';
    topHalf.style.top = letterRect.top + 'px';
    topHalf.style.width = letterRect.width + 'px';
    topHalf.style.height = letterRect.height + 'px';
    topHalf.style.clipPath = 'inset(0 0 50% 0)'; // Show only top half
    document.body.appendChild(topHalf);

    // Create BOTTOM HALF of the letter
    const bottomHalf = document.createElement('div');
    bottomHalf.className = 'falling-fragment bottom-half';
    bottomHalf.textContent = char;
    bottomHalf.style.left = letterRect.left + 'px';
    bottomHalf.style.top = letterRect.top + 'px';
    bottomHalf.style.width = letterRect.width + 'px';
    bottomHalf.style.height = letterRect.height + 'px';
    bottomHalf.style.clipPath = 'inset(50% 0 0 0)'; // Show only bottom half
    document.body.appendChild(bottomHalf);

    // Physics for TOP HALF - flies upward and to the left
    const topBody = Bodies.rectangle(
        centerX,
        letterRect.top + letterRect.height / 4,
        letterRect.width,
        letterRect.height / 2,
        {
            restitution: 0.5,
            friction: 0.4,
            density: 0.003,
            angle: (Math.random() - 0.5) * 0.5,
            angularVelocity: (Math.random() - 1) * 0.4, // Spin counter-clockwise
        }
    );

    // Apply strong upward and leftward force to top half
    Matter.Body.applyForce(topBody, topBody.position, {
        x: -(Math.random() * 0.15 + 0.1),
        y: -(Math.random() * 0.2 + 0.15)
    });

    World.add(physicsWorld, topBody);

    // Physics for BOTTOM HALF - flies downward and to the right
    const bottomBody = Bodies.rectangle(
        centerX,
        letterRect.top + letterRect.height * 3 / 4,
        letterRect.width,
        letterRect.height / 2,
        {
            restitution: 0.5,
            friction: 0.4,
            density: 0.003,
            angle: (Math.random() - 0.5) * 0.5,
            angularVelocity: Math.random() * 0.4, // Spin clockwise
        }
    );

    // Apply strong downward and rightward force to bottom half
    Matter.Body.applyForce(bottomBody, bottomBody.position, {
        x: Math.random() * 0.15 + 0.1,
        y: Math.random() * 0.1 + 0.05
    });

    World.add(physicsWorld, bottomBody);

    // Store both fragments
    fallingFragments.push({
        element: topHalf,
        body: topBody,
        createdAt: Date.now(),
        isTopHalf: true
    });

    fallingFragments.push({
        element: bottomHalf,
        body: bottomBody,
        createdAt: Date.now(),
        isBottomHalf: true
    });

    // Create intense sparks at cut point
    createSparks(centerX, centerY, 30);
}

// Visualize the laser cut line
function createCutLine(x1, y, x2, yEnd) {
    const cutLine = document.createElement('div');
    cutLine.className = 'cut-line';
    cutLine.style.left = x1 + 'px';
    cutLine.style.top = y + 'px';
    cutLine.style.width = (x2 - x1) + 'px';
    document.body.appendChild(cutLine);

    // Animate cut line
    setTimeout(() => {
        cutLine.classList.add('active');
    }, 10);

    // Remove after animation
    setTimeout(() => {
        cutLine.remove();
    }, 500);
}

// Update physics fragments positions
function updatePhysicsFragments() {
    const currentTime = Date.now();

    fallingFragments.forEach((frag, index) => {
        const pos = frag.body.position;
        const angle = frag.body.angle;

        // Update DOM element position
        frag.element.style.transform = `translate(${pos.x - frag.body.bounds.max.x + frag.body.bounds.min.x}px, ${pos.y - frag.body.bounds.max.y + frag.body.bounds.min.y}px) rotate(${angle}rad)`;

        // Add fade out effect
        const age = currentTime - frag.createdAt;
        if (age > 2000) {
            const opacity = Math.max(0, 1 - (age - 2000) / 1000);
            frag.element.style.opacity = opacity;

            if (opacity <= 0) {
                frag.element.remove();
                World.remove(physicsWorld, frag.body);
                fallingFragments.splice(index, 1);
            }
        }

        // Check if fragment hits ground and shatter it
        if (pos.y > window.innerHeight - 50 && !frag.shattered) {
            frag.shattered = true;
            shatterFragment(frag);
        }
    });

    if (fallingFragments.length > 0) {
        requestAnimationFrame(updatePhysicsFragments);
    }
}

// Shatter fragment into smaller pieces on impact
function shatterFragment(frag) {
    const { Bodies, World } = Matter;
    const pos = frag.body.position;
    const velocity = frag.body.velocity;
    const rect = frag.element.getBoundingClientRect();

    // Create 5-8 smaller shards for more dramatic effect
    const shardCount = Math.floor(Math.random() * 4) + 5;

    for (let i = 0; i < shardCount; i++) {
        const shard = document.createElement('div');
        shard.className = 'fragment-shard';
        shard.style.left = rect.left + 'px';
        shard.style.top = rect.top + 'px';
        shard.style.width = (rect.width / 3) + 'px';
        shard.style.height = (rect.height / 3) + 'px';
        document.body.appendChild(shard);

        // Random angle for shard ejection
        const angle = (Math.random() * 180 + 180) * Math.PI / 180; // Spray upward
        const speed = Math.random() * 0.3 + 0.2;

        const shardBody = Bodies.rectangle(
            pos.x + (Math.random() - 0.5) * 30,
            pos.y,
            rect.width / 3,
            rect.height / 3,
            {
                restitution: 0.6,
                friction: 0.5,
                density: 0.001,
                angle: Math.random() * Math.PI * 2,
                angularVelocity: (Math.random() - 0.5) * 0.8, // More rotation
            }
        );

        // Apply explosive force based on impact velocity
        Matter.Body.applyForce(shardBody, shardBody.position, {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        });

        World.add(physicsWorld, shardBody);

        fallingFragments.push({
            element: shard,
            body: shardBody,
            createdAt: Date.now(),
            shattered: true
        });
    }

    // Create massive impact sparks
    createSparks(pos.x, pos.y, 25);
}

// Create spark particles at laser impact
function createSparks(x, y, count = 8) {
    const sparkCount = count;

    for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        spark.style.left = x + 'px';
        spark.style.top = y + 'px';

        // Random angle and velocity
        const angle = (Math.random() * 360) * Math.PI / 180;
        const velocity = Math.random() * 100 + 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        spark.style.setProperty('--vx', vx + 'px');
        spark.style.setProperty('--vy', vy + 'px');

        document.body.appendChild(spark);

        // Remove spark after animation
        setTimeout(() => {
            spark.remove();
        }, 800);
    }
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

// Create floating bubbles
function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    // Random size between 40px and 120px
    const size = Math.random() * 80 + 40;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';

    // Random starting position
    const x = Math.random() * window.innerWidth;
    const y = window.innerHeight + 50;
    bubble.style.left = x + 'px';
    bubble.style.top = y + 'px';

    // Random animation duration
    const duration = Math.random() * 12 + 18;
    bubble.style.animationDuration = duration + 's';

    // Random animation delay
    const delay = Math.random() * 5;
    bubble.style.animationDelay = delay + 's';

    // Random opacity
    bubble.style.opacity = Math.random() * 0.4 + 0.2;

    document.querySelector('.background').appendChild(bubble);

    // Remove bubble after animation
    setTimeout(() => {
        bubble.remove();
    }, (duration + delay) * 1000);
}

// Create initial bubbles
for (let i = 0; i < 12; i++) {
    setTimeout(() => createBubble(), i * 400);
}

// Create new bubbles periodically
setInterval(() => {
    createBubble();
}, 3500);
