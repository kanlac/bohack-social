// Sample data for hackathon participants
const hackers = [
    {
        name: "Sarah Kim",
        role: "UI/UX Designer",
        avatar: "SK",
        gradient: "linear-gradient(135deg, #FF006E, #FFBE0B)",
        bio: "Obsessed with beautiful interfaces and smooth animations. Let's make something users actually love!",
        skills: [
            { name: "Figma", type: "primary" },
            { name: "React", type: "secondary" },
            { name: "Animation", type: "tertiary" },
            { name: "Design Systems", type: "primary" }
        ],
        lookingFor: "Frontend dev who loves pixel-perfect implementation",
        matchScore: 94
    },
    {
        name: "Marcus Zhang",
        role: "Backend Engineer",
        avatar: "MZ",
        gradient: "linear-gradient(135deg, #00F5FF, #8338EC)",
        bio: "I build scalable APIs and optimize databases. Also really into AI/ML integration.",
        skills: [
            { name: "Node.js", type: "primary" },
            { name: "Python", type: "secondary" },
            { name: "PostgreSQL", type: "tertiary" },
            { name: "Docker", type: "primary" }
        ],
        lookingFor: "Frontend wizard to bring my APIs to life",
        matchScore: 87
    },
    {
        name: "Luna Rodriguez",
        role: "Full-stack Developer",
        avatar: "LR",
        gradient: "linear-gradient(135deg, #39FF14, #00F5FF)",
        bio: "Jack of all trades, master of debugging at 3 AM. Love building MVPs fast!",
        skills: [
            { name: "TypeScript", type: "primary" },
            { name: "Next.js", type: "secondary" },
            { name: "Firebase", type: "tertiary" },
            { name: "Tailwind", type: "primary" }
        ],
        lookingFor: "Designer or hardware hacker for something unique",
        matchScore: 92
    },
    {
        name: "Dev Patel",
        role: "AI/ML Engineer",
        avatar: "DP",
        gradient: "linear-gradient(135deg, #8338EC, #FF006E)",
        bio: "Training models and breaking GPUs since 2020. Let's add some AI magic to your idea!",
        skills: [
            { name: "PyTorch", type: "primary" },
            { name: "TensorFlow", type: "secondary" },
            { name: "FastAPI", type: "tertiary" },
            { name: "LangChain", type: "primary" }
        ],
        lookingFor: "Team building AI-powered products",
        matchScore: 88
    },
    {
        name: "Jordan Lee",
        role: "Product Designer",
        avatar: "JL",
        gradient: "linear-gradient(135deg, #FFBE0B, #FF006E)",
        bio: "I do user research, wireframes, prototypes—the whole shebang. Let's ship something people need.",
        skills: [
            { name: "User Research", type: "primary" },
            { name: "Prototyping", type: "secondary" },
            { name: "Webflow", type: "tertiary" },
            { name: "Adobe XD", type: "primary" }
        ],
        lookingFor: "Engineers who want to build with purpose",
        matchScore: 91
    },
    {
        name: "Riley Chen",
        role: "DevOps Wizard",
        avatar: "RC",
        gradient: "linear-gradient(135deg, #00F5FF, #39FF14)",
        bio: "I make things deploy automatically and scale infinitely. CI/CD is my love language.",
        skills: [
            { name: "Kubernetes", type: "primary" },
            { name: "AWS", type: "secondary" },
            { name: "Terraform", type: "tertiary" },
            { name: "GitHub Actions", type: "primary" }
        ],
        lookingFor: "Team that wants bulletproof infrastructure",
        matchScore: 85
    }
];

// State
let currentIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;

// DOM Elements
const cardStack = document.getElementById('cardStack');
const passBtn = document.getElementById('passBtn');
const saveBtn = document.getElementById('saveBtn');
const connectBtn = document.getElementById('connectBtn');
const matchModal = document.getElementById('matchModal');
const closeMatchBtn = document.getElementById('closeMatchBtn');
const messageBtn = document.getElementById('messageBtn');
const particleCanvas = document.getElementById('particleCanvas');

// Initialize
function init() {
    renderCards();
    setupEventListeners();
    setupParticleCanvas();
}

// Render cards
function renderCards() {
    cardStack.innerHTML = '';

    // Render up to 3 cards in the stack for depth effect
    for (let i = currentIndex; i < Math.min(currentIndex + 3, hackers.length); i++) {
        const card = createCard(hackers[i], i - currentIndex);
        cardStack.appendChild(card);
    }

    if (currentIndex >= hackers.length) {
        showNoMoreCards();
    }
}

function createCard(hacker, stackPosition) {
    const card = document.createElement('div');
    card.className = 'hacker-card';
    card.style.zIndex = 100 - stackPosition;
    card.style.transform = `translateY(${stackPosition * 10}px) scale(${1 - stackPosition * 0.05})`;
    card.style.opacity = stackPosition === 0 ? 1 : 0.5;

    if (stackPosition === 0) {
        // Only make the top card interactive
        card.addEventListener('mousedown', handleDragStart);
        card.addEventListener('touchstart', handleDragStart);
    }

    card.innerHTML = `
        <div class="card-header">
            <div class="card-avatar" style="background: ${hacker.gradient};">
                <span>${hacker.avatar}</span>
            </div>
            <div class="card-info">
                <h3 class="card-name">${hacker.name}</h3>
                <p class="card-role">${hacker.role}</p>
            </div>
            <div class="match-score">
                <span class="score-number">${hacker.matchScore}%</span>
                <span class="score-label">Match</span>
            </div>
        </div>
        <p class="card-bio">${hacker.bio}</p>
        <div class="skills-section">
            <h4>Skills</h4>
            <div class="skills-grid">
                ${hacker.skills.map(skill =>
                    `<span class="skill-badge ${skill.type}">${skill.name}</span>`
                ).join('')}
            </div>
        </div>
        <div class="looking-for">
            <h4>Looking for</h4>
            <p>${hacker.lookingFor}</p>
        </div>
    `;

    return card;
}

function showNoMoreCards() {
    cardStack.innerHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            gap: 1rem;
            opacity: 0.7;
        ">
            <div style="font-size: 4rem;">🎉</div>
            <h3 style="font-family: 'Orbitron', sans-serif;">You've seen everyone!</h3>
            <p style="color: var(--text-secondary);">Check back later for more hackers</p>
        </div>
    `;
}

// Drag handlers
function handleDragStart(e) {
    if (currentIndex >= hackers.length) return;

    isDragging = true;
    const card = e.currentTarget;
    card.classList.add('dragging');

    startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDragMove);
    document.addEventListener('touchend', handleDragEnd);
}

function handleDragMove(e) {
    if (!isDragging) return;

    currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const diff = currentX - startX;
    const rotation = diff / 20;

    const card = cardStack.querySelector('.hacker-card');
    card.style.setProperty('--rotate-angle', `${rotation}deg`);
    card.style.transform = `translateX(${diff}px) rotate(${rotation}deg)`;
}

function handleDragEnd(e) {
    if (!isDragging) return;

    isDragging = false;
    const diff = currentX - startX;
    const card = cardStack.querySelector('.hacker-card');

    card.classList.remove('dragging');

    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('touchend', handleDragEnd);

    // Determine swipe direction
    if (Math.abs(diff) > 100) {
        if (diff > 0) {
            swipeRight(card);
        } else {
            swipeLeft(card);
        }
    } else {
        // Reset position
        card.style.transform = '';
    }
}

function swipeRight(card) {
    card.classList.add('swiped-right');
    setTimeout(() => {
        showMatch(hackers[currentIndex]);
        currentIndex++;
        renderCards();
    }, 500);
}

function swipeLeft(card) {
    card.classList.add('swiped-left');
    setTimeout(() => {
        currentIndex++;
        renderCards();
    }, 500);
}

// Button actions
function handlePass() {
    if (currentIndex >= hackers.length) return;
    const card = cardStack.querySelector('.hacker-card');
    swipeLeft(card);
}

function handleSave() {
    if (currentIndex >= hackers.length) return;
    // In a real app, this would save to favorites
    alert(`Saved ${hackers[currentIndex].name} to your favorites! ⭐`);
}

function handleConnect() {
    if (currentIndex >= hackers.length) return;
    const card = cardStack.querySelector('.hacker-card');
    swipeRight(card);
}

// Match modal
function showMatch(hacker) {
    const matchedAvatar = document.getElementById('matchedAvatar');
    matchedAvatar.innerHTML = `
        <div class="avatar-circle" style="background: ${hacker.gradient};">
            <span>${hacker.avatar}</span>
        </div>
        <p>${hacker.name}</p>
    `;

    matchModal.classList.remove('hidden');

    // Trigger confetti
    createConfetti();
}

function closeMatch() {
    matchModal.classList.add('hidden');
}

// Particle effects
function setupParticleCanvas() {
    const ctx = particleCanvas.getContext('2d');
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    });
}

function createConfetti() {
    const ctx = particleCanvas.getContext('2d');
    const particles = [];
    const colors = ['#FF006E', '#00F5FF', '#8338EC', '#39FF14', '#FFBE0B'];

    // Create particles
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * particleCanvas.width,
            y: -20,
            vx: (Math.random() - 0.5) * 5,
            vy: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10
        });
    }

    // Animate particles
    function animate() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        let allDone = true;

        particles.forEach(p => {
            if (p.y < particleCanvas.height) {
                allDone = false;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();

                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;
                p.vy += 0.1; // Gravity
            }
        });

        if (!allDone) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        }
    }

    animate();
}

// Event listeners
function setupEventListeners() {
    passBtn.addEventListener('click', handlePass);
    saveBtn.addEventListener('click', handleSave);
    connectBtn.addEventListener('click', handleConnect);
    closeMatchBtn.addEventListener('click', closeMatch);
    messageBtn.addEventListener('click', () => {
        alert('Message feature coming soon! 💬');
        closeMatch();
    });
}

// Initialize app
init();
