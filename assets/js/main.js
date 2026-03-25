/* ============================================
   PORTFOLIO — Data Scientist & AI Engineer
   main.js
   ============================================ */

/* ---------- CUSTOM CURSOR (LIQUID MORPHING) ---------- */
const cursor    = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
let velX = 0, velY = 0;
let lastX = 0, lastY = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  
  // Calculate velocity for morphing
  velX = Math.abs(mx - lastX);
  velY = Math.abs(my - lastY);
  lastX = mx;
  lastY = my;

  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  
  // Stretch cursor based on velocity
  const scale = 1 + Math.min(velX + velY, 100) / 100;
  const rotate = Math.atan2(my - lastY, mx - lastX) * (180 / Math.PI);
  cursor.style.transform = `translate(-50%, -50%) scaleX(${scale})`;
});

(function animRing() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

/* ---------- CINEMATIC FOUNDATION (GSAP & SFX) ---------- */
gsap.registerPlugin(ScrollTrigger);

class AudioController {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.enabled = false;
  }
  
  beep(freq = 440, duration = 0.1, type = 'sine') {
    if (!this.enabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  whoosh() {
    this.beep(200, 0.3, 'triangle');
  }
}

const sfx = new AudioController();
const audioToggle = document.getElementById('audioToggle');
if (audioToggle) {
  audioToggle.addEventListener('click', () => {
    sfx.enabled = !sfx.enabled;
    audioToggle.classList.toggle('active', sfx.enabled);
    const icon = sfx.enabled 
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>';
    audioToggle.querySelector('.audio-icon').innerHTML = icon;
    if (sfx.enabled) sfx.ctx.resume();
  });
}

const interactables = 'a, button, .theme-toggle, .project-card, .cert-card, .contact-link, .ai-chat-trigger, .audio-toggle';
document.querySelectorAll(interactables).forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width    = '40px';
    cursor.style.height   = '40px';
    cursor.style.opacity  = '0.3';
    cursorRing.style.width  = '80px';
    cursorRing.style.height = '80px';
    cursorRing.style.borderColor = 'var(--red)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width    = '12px';
    cursor.style.height   = '12px';
    cursor.style.opacity  = '1';
    cursorRing.style.width  = '36px';
    cursorRing.style.height = '36px';
    cursorRing.style.borderColor = 'rgba(232, 25, 44, 0.5)';
  });
});

/* ---------- THEME TOGGLE (ECLIPSE TRANSITION) ---------- */
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', (e) => {
  sfx.beep(600, 0.2, 'square');
  
  const rect = themeToggle.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  
  // Create expansion layer
  const expansion = document.createElement('div');
  expansion.className = 'theme-expansion';
  expansion.style.left = x + 'px';
  expansion.style.top  = y + 'px';
  expansion.style.background = next === 'dark' ? '#0a0a0a' : '#faf7f5';
  document.body.appendChild(expansion);
  
  gsap.to(expansion, {
    scale: 500, // Large enough to cover screen
    duration: 1.2,
    ease: "power4.inOut",
    onComplete: () => {
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      expansion.remove();
      // Scramble all titles again for effect
      document.querySelectorAll('.section-title').forEach(st => {
         const fx = new TextScramble(st);
         fx.setText(st.innerText);
      });
    }
  });
});

// Restore saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

/* ---------- SCROLL PROGRESS ---------- */
const scrollProgressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  scrollProgressBar.style.width = pct + '%';
});

/* ---------- GSAP ORCHESTRATED REVEALS ---------- */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  document.querySelectorAll('.reveal').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none reverse"
      },
      y: 50,
      opacity: 0,
      scale: 0.98,
      duration: 1,
      ease: "power2.out"
    });
  });
  
  // Refresh ScrollTrigger after dynamic content loads
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

// Skill bars integration with GSAP
document.querySelectorAll('.skill-bar-fill').forEach(bar => {
  gsap.to(bar, {
    scrollTrigger: {
      trigger: bar,
      start: "top 90%"
    },
    scaleX: 1,
    duration: 1.5,
    ease: "power4.out"
  });
});

/* ---------- NAV ACTIVE STATE ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 200) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// Legay typewriter removed in favor of TextScramble

/* ---------- 3D NEURAL VISUALIZATION (THREE.JS) ---------- */
const heroCanvas = document.getElementById('hero-canvas');
if (heroCanvas && typeof THREE !== 'undefined') {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, heroCanvas.offsetWidth / heroCanvas.offsetHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
  
  renderer.setSize(heroCanvas.offsetWidth, heroCanvas.offsetHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Particles
  const particlesCount = 120;
  const positions = new Float32Array(particlesCount * 3);
  const velocity = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    velocity[i] = (Math.random() - 0.5) * 0.01;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xe8192c,
    size: 0.1,
    transparent: true,
    opacity: 0.6
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Lines
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xe8192c, transparent: true, opacity: 0.15 });
  let lines;

  function updateLines() {
    if (lines) scene.remove(lines);
    
    const linePositions = [];
    const pos = geometry.attributes.position.array;
    
    for (let i = 0; i < particlesCount; i++) {
      for (let j = i + 1; j < particlesCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist < 2.5) {
          linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
          linePositions.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
        }
      }
    }
    
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);
  }

  camera.position.z = 5;

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate() {
    requestAnimationFrame(animate);
    
    const pos = geometry.attributes.position.array;
    for (let i = 0; i < particlesCount * 3; i++) {
      pos[i] += velocity[i];
      if (Math.abs(pos[i]) > 5) velocity[i] *= -1;
    }
    geometry.attributes.position.needsUpdate = true;
    
    updateLines();
    
    points.rotation.y += 0.002;
    points.rotation.x += 0.001;
    
    // Mouse interaction
    scene.rotation.y += (mouseX * 0.5 - scene.rotation.y) * 0.05;
    scene.rotation.x += (mouseY * -0.5 - scene.rotation.x) * 0.05;

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    camera.aspect = heroCanvas.offsetWidth / heroCanvas.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(heroCanvas.offsetWidth, heroCanvas.offsetHeight);
  });

  animate();
}

/* ---------- CONTACT FORM (EMAILJS ENABLED) ---------- */
function handleSubmit(e) {
  if (e) e.preventDefault();
  
  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmessage').value.trim();

  if (!name || !email || !message) {
    alert('Please fill in all required fields.');
    return;
  }

  const btn = document.querySelector('.form-submit');
  sfx.beep(800, 0.1, 'square');
  btn.textContent = 'TRANSMITTING...';
  btn.disabled = true;
  btn.style.opacity = '0.5';

  // PYTHON BACKEND UPLINK (smtplib)
    console.log("UPLINK_INIT: Transmitting to Python Backend...");
    
    // Safety Timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.error("UPLINK_TIMEOUT: Backend took too long to respond.");
      resetBtn(btn, "UPLINK_TIMEOUT_ERR");
    }, 10000); // 10 second timeout

    fetch('http://127.0.0.1:5000/send-api', {
      method: 'POST',
      signal: controller.signal,
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ name, email, message })
    })
    .then(response => {
      clearTimeout(timeoutId);
      console.log("UPLINK_RESPONSE:", response.status);
      return response.json();
    })
    .then(data => {
      if (data.status === 'success') {
        showSuccess();
      } else {
        console.error("UPLINK_SERVER_ERR:", data);
        alert("Backend Error: " + data.message);
        resetBtn(btn);
      }
    })
    .catch(err => {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') return; // Handled by timeout
      console.error("UPLINK_NETWORK_ERR:", err);
      // Fallback: Simulation if backend is not running
      pushThought("Backend offline/error. Simulating transmission for preview...");
      setTimeout(showSuccess, 1500);
    });
}

function resetBtn(btn, text = "SEND MESSAGE") {
  btn.textContent = text;
  btn.disabled = false;
  btn.style.opacity = '1';
}

function showSuccess() {
  const btn = document.querySelector('.form-submit');
  btn.style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
  pushThought("Message received. Uplink confirmed.");
}

/* ---------- PROJECT DEMOS ---------- */
// LifeOS Log Simulation
const lifeosLog = document.getElementById('lifeosLog');
if (lifeosLog) {
  const logs = [
    "Optimizing NLP tokens...",
    "LifeOS: Syncing with neural engine",
    "Agent 01: Task extraction complete",
    "Agent 02: Memory consolidated",
    "Analyzing productivity patterns...",
    "Health check: All systems nominal"
  ];
  let logIdx = 0;
  setInterval(() => {
    lifeosLog.innerText = logs[logIdx];
    logIdx = (logIdx + 1) % logs.length;
  }, 3000);
}

// Pass Pro Simulation
const passInput = document.getElementById('passInput');
const passFill  = document.getElementById('passStrengthFill');
const passLabel = document.getElementById('passLabel');

if (passInput) {
  passInput.addEventListener('input', (e) => {
    const val = e.target.value;
    let strength = 0;
    if (val.length > 5) strength += 25;
    if (/[A-Z]/.test(val)) strength += 25;
    if (/[0-9]/.test(val)) strength += 25;
    if (/[^A-Za-z0-9]/.test(val)) strength += 25;

    passFill.style.width = strength + '%';
    if (strength < 30) {
      passFill.style.background = '#ff4444';
      passLabel.innerHTML = 'Strength: <span style="color:#ff4444">WEAK</span>';
    } else if (strength < 70) {
      passFill.style.background = '#ffbb33';
      passLabel.innerHTML = 'Strength: <span style="color:#ffbb33">MEDIUM</span>';
    } else {
      passFill.style.background = '#00c851';
      passLabel.innerHTML = 'Strength: <span style="color:#00c851">STRONG</span>';
    }
    if (!val) {
      passFill.style.width = '0';
      passLabel.innerHTML = 'Strength: <span>NULL</span>';
    }
  });
}

/* ---------- AMAN-AI MINI-CHAT (CLI UPGRADE) ---------- */
const aiTrigger = document.getElementById('aiTrigger');
const aiChat    = document.getElementById('aiChat');
const aiClose    = document.getElementById('aiClose');
const aiInput    = document.getElementById('aiInput');
const aiChatBody = document.getElementById('aiChatBody');

// EmailJS Initialization (Placeholder - requires User Keys)
if (typeof emailjs !== 'undefined') {
  emailjs.init("YOUR_PUBLIC_KEY"); 
}

if (aiTrigger && aiChat) {
  aiTrigger.addEventListener('click', () => {
    sfx.beep(500, 0.1, 'sine');
    aiChat.classList.add('active');
    aiTrigger.style.transform = 'scale(0)';
    setTimeout(() => aiInput.focus(), 400);
  });

  aiClose.addEventListener('click', () => {
    aiChat.classList.remove('active');
    aiTrigger.style.transform = 'scale(1)';
  });

  aiInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const val = aiInput.value.trim().toLowerCase();
      if (!val) return;

      appendMsg(`> ${aiInput.value}`, 'ai-msg');
      aiInput.value = '';

      setTimeout(() => {
        const response = getAIResponse(val);
        appendMsg(response, 'ai-response');
      }, 200);
    }
  });
}

function appendMsg(text, className) {
  if (!text) return;
  const div = document.createElement('div');
  div.className = className;
  div.innerHTML = text; // Allow HTML for CLI colors
  aiChatBody.appendChild(div);
  aiChatBody.scrollTop = aiChatBody.scrollHeight;
}

function getAIResponse(query) {
  const q = query.trim().split(' ');
  const cmd = q[0];

  // PRIORITY COMMANDS (Local/Static)
  if (cmd === 'help') return "CMDS: cd [loc], ls, whoami, status, clear, sudo [arg]";
  if (cmd === 'ls') return "LOCATIONS: hero, about, projects, contact, lab";
  if (cmd === 'whoami') return "Aman Thakur :: AI Engineer :: Level 99 Agent.";
  if (cmd === 'clear') { aiChatBody.innerHTML = ''; return "Buffer cleared."; }
  if (cmd === 'status') return "All systems nominal. Neural nodes at 100%.";
  
  if (cmd === 'cd') {
    const loc = q[1];
    if (['hero','about','projects','contact'].includes(loc)) {
      document.getElementById(loc).scrollIntoView({ behavior: 'smooth' });
      sfx.whoosh();
      return `Navigating to ${loc.toUpperCase()}...`;
    }
    return `[ERROR] Directory '${loc}' not found.`;
  }

  if (query === 'sudo activate-agent') {
    activateSecretMode();
    return "[CRITICAL] AGENT_MODE_ACTIVATED. System reconfiguring...";
  }

  // AI LLM UPLINK (Groq Integration)
  const lastLine = aiChatBody.lastElementChild;
  if (lastLine) lastLine.innerHTML += ' <span style="color:var(--red);opacity:0.5">[THINKING...]</span>';

  fetch('http://127.0.0.1:5000/ai-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: query })
  })
  .then(res => res.json())
  .then(data => {
    // Remove thinking indicator
    const loaders = aiChatBody.querySelectorAll('span');
    loaders.forEach(l => { if(l.innerText === '[THINKING...]') l.remove(); });
    
    if (data.response) {
      appendMsg(data.response, 'ai-response');
    } else {
      appendMsg("[ERROR] Neural link unstable. Using local fallback.", 'ai-response');
    }
  })
  .catch(err => {
     console.error("AI Link Failure:", err);
     appendMsg("[OFFLINE] Cannot reach local LLM host.", 'ai-response');
  });

  return null; // Response will be appended asynchronously
}

function activateSecretMode() {
  sfx.beep(200, 1, 'sawtooth');
  document.documentElement.setAttribute('data-theme', 'ghost');
  document.getElementById('secret-lab').style.display = 'block';
  document.getElementById('glitch-overlay').style.display = 'block';
  document.body.classList.add('glitch-anim');
  pushThought("CRITICAL_OVERRIDE: Agent Mode Enabled.");
  
  setTimeout(() => {
    document.getElementById('glitch-overlay').style.display = 'none';
    document.body.classList.remove('glitch-anim');
  }, 2000);
}

// Konami Code listener
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let kIdx = 0;
document.addEventListener('keydown', (e) => {
  if (e.key === konami[kIdx]) {
    kIdx++;
    if (kIdx === konami.length) {
      activateSecretMode();
      kIdx = 0;
    }
  } else {
    kIdx = 0;
  }
});

/* ---------- MAGNETIC HOVER EFFECTS ---------- */
document.querySelectorAll(interactables).forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Pull factor (adjust for "stickiness")
    const pull = 0.35;
    el.style.transform = `translate(${x * pull}px, ${y * pull}px)`;
    if (el.classList.contains('project-card')) {
       el.style.transform += ` translateY(-8px)`; // Maintain card hover lift
    }
  });
  
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

/* ---------- TEXT SCRAMBLE EFFECT ---------- */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        // Preserve spaces as non-breaking to prevent collapse
        if (to === ' ' || to === '\n') {
          output += '&nbsp;';
        } else {
          output += `<span class="scramble-char">${char}</span>`;
        }
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

/* ---------- INITIALIZE SCRAMBLE ---------- */
function initScramble() {
  const elements = [
    ...document.querySelectorAll('.section-title'),
    document.getElementById('typewriter')
  ].filter(Boolean);

  elements.forEach(el => {
    const fx = new TextScramble(el);
    const originalText = el.innerText;
    
    // Scramble on reveal
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fx.setText(originalText);
        observer.unobserve(el);
      }
    }, { threshold: 0.1 });
    observer.observe(el);

    // Scramble on hover
    el.addEventListener('mouseenter', () => fx.setText(originalText));
  });
}
initScramble();

/* ---------- COGNITIVE LOG TRACE ---------- */
const cogLogContainer = document.getElementById('cognitiveLog');
const thoughts = [
  "Detecting viewport movement...",
  "Analyzing scroll velocity...",
  "Parsing project dependencies...",
  "Optimizing glassmorphism saturation...",
  "Syncing neural background nodes...",
  "Evaluating user interest spikes...",
  "Checking local model availability...",
  "Memory consolidated: 84 MB cached"
];

function pushThought(text) {
  if (!cogLogContainer) return;
  const entry = document.createElement('div');
  entry.className = 'log-trace';
  entry.innerText = `[LOG] ${text}`;
  
  cogLogContainer.appendChild(entry);
  setTimeout(() => entry.classList.add('active'), 100);
  
  setTimeout(() => {
    entry.classList.remove('active');
    entry.classList.add('fade');
    setTimeout(() => entry.remove(), 1000);
  }, 4000);

  // Keep max 5 logs
  if (cogLogContainer.children.length > 5) {
    cogLogContainer.children[0].remove();
  }
}

// Push thoughts occasionally
setInterval(() => {
  if (Math.random() > 0.7) {
    pushThought(thoughts[Math.floor(Math.random() * thoughts.length)]);
  }
}, 5000);

// Interaction-based thoughts
window.addEventListener('scroll', () => {
  if (Math.random() > 0.98) pushThought("Detecting deep scroll: User engaged.");
}, { passive: true });

document.querySelectorAll(interactables).forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (Math.random() > 0.6) pushThought(`Interest detected: ${el.innerText.substring(0, 15)}...`);
  });
});

/* ---------- RADAR SKILL CHART ---------- */
const radarCanvas = document.getElementById('radarChart');
if (radarCanvas) {
  const ctx = radarCanvas.getContext('2d');
  const skills = [
    { name: 'ML/AI', value: 0.85 },
    { name: 'Python', value: 0.90 },
    { name: 'Data Viz', value: 0.80 },
    { name: 'Web/App', value: 0.75 },
    { name: 'Theory', value: 0.82 },
    { name: 'Deployment', value: 0.70 }
  ];

  function drawRadar() {
    const size = radarCanvas.offsetWidth;
    radarCanvas.width = size * window.devicePixelRatio;
    radarCanvas.height = size * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size / 2) * 0.8;
    const angleStep = (Math.PI * 2) / skills.length;

    // Background polygons
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim();
    ctx.lineWidth = 1;
    for (let j = 1; j <= 4; j++) {
      ctx.beginPath();
      const r = (radius / 4) * j;
      for (let i = 0; i < skills.length; i++) {
        const x = centerX + r * Math.cos(i * angleStep - Math.PI / 2);
        const y = centerY + r * Math.sin(i * angleStep - Math.PI / 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Axes
    skills.forEach((s, i) => {
      const x = centerX + radius * Math.cos(i * angleStep - Math.PI / 2);
      const y = centerY + radius * Math.sin(i * angleStep - Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Labels
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim();
      ctx.font = '8px JetBrains Mono';
      ctx.textAlign = 'center';
      const lx = centerX + (radius + 15) * Math.cos(i * angleStep - Math.PI / 2);
      const ly = centerY + (radius + 15) * Math.sin(i * angleStep - Math.PI / 2);
      ctx.fillText(s.name, lx, ly);
    });

    // Value shape
    ctx.beginPath();
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--red').trim() + '33';
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--red').trim();
    ctx.lineWidth = 2;
    skills.forEach((s, i) => {
      const r = radius * s.value;
      const x = centerX + r * Math.cos(i * angleStep - Math.PI / 2);
      const y = centerY + r * Math.sin(i * angleStep - Math.PI / 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Data points
    ctx.fillStyle = '#fff';
    skills.forEach((s, i) => {
      const r = radius * s.value;
      const x = centerX + r * Math.cos(i * angleStep - Math.PI / 2);
      const y = centerY + r * Math.sin(i * angleStep - Math.PI / 2);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }

  window.addEventListener('resize', drawRadar);
  setTimeout(drawRadar, 500); // Initial draw
}

/* ---------- CASE STUDY MODALS ---------- */
function openCase(id) {
  const modal = document.getElementById('caseModal');
  const body  = document.getElementById('modalBody');
  
  const content = {
    lifeos: `
      <div style="font-family:'JetBrains Mono'; color:var(--red); font-size:10px; margin-bottom:20px">CASE_STUDY:01</div>
      <h2 style="font-family:'DM Serif Display'; font-size:48px; margin-bottom:30px">LifeOS Middleware</h2>
      <p style="font-size:18px; line-height:1.8; color:var(--text-muted); margin-bottom:40px">
        LifeOS was built to solve the fragmentation of digital focus. The core challenge was integrating a local neural engine with a high-velocity web interface. 
        <br><br>
        <strong>Architecture:</strong> Using a multi-agent framework, we decoupled the task planner from the executor, allowing for 98% lower latency in user interactions.
      </p>
      <div class="radar-chart-wrap" style="height:300px; width:300px; margin:auto">
         <canvas id="modalRadar"></canvas>
      </div>
    `,
    nexus: `
       <div style="font-family:'JetBrains Mono'; color:var(--red); font-size:10px; margin-bottom:20px">CASE_STUDY:02</div>
       <h2 style="font-family:'DM Serif Display'; font-size:48px; margin-bottom:30px">Nexus Multi-Agent System</h2>
       <p style="font-size:18px; line-height:1.8; color:var(--text-muted); margin-bottom:40px">
         Automating complex workflows across localized LLMs. Nexus agents communicate via a secure RPC layer, ensuring privacy-first intelligence.
       </p>
    `
  };

  body.innerHTML = content[id] || "Content loading...";
  modal.classList.add('active');
  sfx.beep(400, 0.2, 'sine');
  pushThought(`Loading deep-dive: ${id.toUpperCase()}`);
}

function closeCase() {
  document.getElementById('caseModal').classList.remove('active');
}

/* ---------- SYSTEM DASHBOARD 2.0 ---------- */
function updateDashboard() {
  const nodes   = document.getElementById('nodeCount');
  const latency = document.getElementById('latencyVal');
  const temp    = document.getElementById('tempVal');
  const load    = document.getElementById('loadVal');

  // Backend Connectivity Check
  fetch('http://localhost:5000/send-api', { method: 'OPTIONS' })
    .then(() => {
      if (load) {
         load.innerText = "UPLINK_STABLE";
         load.style.color = "#0f0"; // Green in Ghost, or consistent
      }
    })
    .catch(() => {
      if (load) {
         load.innerText = "STDBY_LOCAL";
         load.style.color = "var(--red)";
      }
    });

  if (nodes) nodes.innerText = `0${Math.floor(Math.random() * 2) + 3}/04`;
  if (latency) latency.innerText = `${Math.floor(Math.random() * 15) + 5}ms`;
  if (temp) temp.innerText = `${Math.floor(Math.random() * 10) + 35}°C`;
}
setInterval(updateDashboard, 4000);

/* ---------- INTENT ENGINE (MOCKED TFJS PATTERN) ---------- */
class IntentEngine {
  constructor() {
    this.intentEl = document.getElementById('intentVal');
    this.confEl   = document.getElementById('intentConf');
    this.intents  = ['SYSTEM_RESEARCH', 'PROJECT_DISCOVERY', 'CONTACT_INTENT', 'IDLE_BROWSING'];
  }

  update(x, y, scroll) {
    if (!this.intentEl) return;
    
    let intent = 'IDLE_BROWSING';
    let conf = 40 + Math.random() * 20;

    if (scroll > 2000) intent = 'CONTACT_INTENT';
    else if (scroll > 500) intent = 'PROJECT_DISCOVERY';
    else if (Math.abs(x - window.innerWidth / 2) < 200) intent = 'SYSTEM_RESEARCH';

    this.intentEl.innerText = intent;
    this.confEl.innerText = `${Math.floor(conf)}%`;
    
    if (Math.random() > 0.99) pushThought(`Inferred Intent: ${intent} (${Math.floor(conf)}%)`);
  }
}

const intentEngine = new IntentEngine();
window.addEventListener('scroll', () => intentEngine.update(mx, my, window.scrollY));
window.addEventListener('mousemove', () => intentEngine.update(mx, my, window.scrollY));

/* ---------- ATOMIC SENTIMENT ANALYZER (GROQ POWERED) ---------- */
const sentInput = document.getElementById('sentInput');
const sentFill  = document.getElementById('sentimentFill');
const sentLabel = document.getElementById('sentimentLabel');

if (sentInput) {
  let debounceTimeout;
  sentInput.addEventListener('input', (e) => {
    negative.forEach(w => { if (val.includes(w)) score -= 10; });
    
    score = Math.max(0, Math.min(100, score));
    sentFill.style.width = `${score}%`;
    sentFill.style.background = score > 60 ? '#00c851' : (score < 40 ? '#ff4444' : 'var(--red)');
    sentLabel.innerText = `SCORE: ${score}%`;
  });
}

/* ---------- DOWNLOAD RESUME ---------- */
function downloadResume() {
  const content = document.getElementById('resumeContent').innerText;
  const blob = new Blob([content], { type: 'text/plain' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = 'Alex_Morgan_Resume_2025.txt';
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ---------- OPEN EXTERNAL LINKS IN NEW TAB ---------- */
document.querySelectorAll('a').forEach(link => {
  const href = link.getAttribute('href');
  if (href && !href.startsWith('#')) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  }
});
