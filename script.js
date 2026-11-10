
"use strict";

// ========================================
// 1. GET HTML ELEMENTS
// ========================================

const starCanvas = document.getElementById("starCanvas");
const starCtx = starCanvas.getContext("2d");

const heartCanvas = document.getElementById("heartCanvas");
const heartCtx = heartCanvas.getContext("2d");

const intro = document.getElementById("intro");
const galaxyScreen = document.getElementById("galaxyScreen");
const messagesScreen = document.getElementById("messagesScreen");

const enterButton = document.getElementById("enterButton");
const memoriesButton = document.getElementById("memoriesButton");
const backButton = document.getElementById("backButton");

let width = window.innerWidth;
let height = window.innerHeight;

let heartWidth = 0;
let heartHeight = 0;

let stars = [];
let particles = [];

let galaxyEntered = false;
let currentScreen = "intro";

let mouse = {
  x: 0,
  y: 0
};

// ========================================
// 2. CANVAS RESIZING
// ========================================

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  starCanvas.width = Math.round(width * pixelRatio);
  starCanvas.height = Math.round(height * pixelRatio);

  starCanvas.style.width = width + "px";
  starCanvas.style.height = height + "px";

  starCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const rect = heartCanvas.getBoundingClientRect();

  heartWidth = rect.width;
  heartHeight = rect.height;

  heartCanvas.width = Math.round(heartWidth * pixelRatio);
  heartCanvas.height = Math.round(heartHeight * pixelRatio);

  heartCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  createStars();
  createHeart();
}

window.addEventListener("resize", resizeCanvas);

// ========================================
// 3. CREATE THE MOVING STARS
// ========================================

function createStars() {
  stars = [];

  const amount = Math.min(
    300,
    Math.floor((width * height) / 3500)
  );

  for (let i = 0; i < amount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.35 + 0.05,
      twinkle: Math.random() * 0.025 + 0.005,
      phase: Math.random() * Math.PI * 2
    });
  }
}

function drawStars(time) {
  starCtx.clearRect(0, 0, width, height);

  for (const star of stars) {
    const shimmer =
      star.alpha +
      Math.sin(time * star.twinkle + star.phase) * 0.25;

    starCtx.beginPath();

    starCtx.arc(
      star.x,
      star.y,
      star.radius,
      0,
      Math.PI * 2
    );

    starCtx.fillStyle =
      `rgba(155, 220, 255, ${Math.max(0.08, shimmer)})`;

    starCtx.shadowBlur = star.radius * 7;
    starCtx.shadowColor = "#50bfff";

    starCtx.fill();

    star.y -= star.speed;

    if (star.y < -3) {
      star.y = height + 3;
      star.x = Math.random() * width;
    }
  }

  starCtx.shadowBlur = 0;
}

// ========================================
// 4. CREATE A PARTICLE HEART
// ========================================

// Mathematical heart shape
function heartPoint(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);

  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);

  return { x, y };
}

function createHeart() {
  particles = [];

  if (!heartWidth || !heartHeight) return;

  const scale = Math.min(
    heartWidth / 38,
    heartHeight / 60,
    12
  );

  const centerX = heartWidth / 2;
  const centerY = heartHeight / 2.5;

  const totalParticles = 1800;

  for (let i = 0; i < totalParticles; i++) {
    const t = Math.random() * Math.PI * 2;

    // Randomize distance from center to fill the heart
    const fill = Math.sqrt(Math.random());

    const point = heartPoint(t);

    const targetX = centerX + point.x * scale * fill;
    const targetY = centerY - point.y * scale * fill;

    particles.push({
      x: targetX,
      y: targetY,

      baseX: targetX,
      baseY: targetY,

      radius: Math.random() * 1.5 + 0.45,
      alpha: Math.random() * 0.6 + 0.4,

      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.0015 + 0.0005,

      drift: Math.random() * 2 + 0.5
    });
  }

  // Add extra particles along the outline
  for (let i = 0; i < 400; i++) {
    const t = Math.random() * Math.PI * 2;
    const point = heartPoint(t);

    const targetX = centerX + point.x * scale;
    const targetY = centerY - point.y * scale;

    particles.push({
      x: targetX,
      y: targetY,

      baseX: targetX,
      baseY: targetY,

      radius: Math.random() * 1.8 + 0.7,
      alpha: Math.random() * 0.5 + 0.5,

      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.0015 + 0.0005,

      drift: Math.random() * 1.5 + 0.5
    });
  }
}

// ========================================
// 5. DRAW THE PARTICLE HEART
// ========================================

function drawHeart(time) {
  heartCtx.clearRect(0, 0, heartWidth, heartHeight);

  drawSpiralGalaxy(time);

  // Keep the rest of your existing heart code below
  // Draw the galaxy behind the heart
  drawSpiralGalaxy(time);

  const centerX = heartWidth / 2;
  const centerY = heartHeight / 2;

  // Blue glow behind the heart
  const glow = heartCtx.createRadialGradient(
    centerX,
    centerY,
    5,
    centerX,
    centerY,
    Math.min(heartWidth, heartHeight) * 0.42
  );

  glow.addColorStop(0, "rgba(30, 120, 255, 0.13)");
  glow.addColorStop(0.5, "rgba(25, 100, 255, 0.06)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");

  heartCtx.fillStyle = glow;

  heartCtx.fillRect(
    0,
    0,
    heartWidth,
    heartHeight
  );

  // Slowly pulse the heart
  const pulse = 1 + Math.sin(time * 0.0018) * 0.025;

  for (const p of particles) {
    const floatingX =
      Math.sin(time * p.speed + p.phase) * p.drift;

    const floatingY =
      Math.cos(time * p.speed + p.phase) * p.drift;

    const x =
      centerX + (p.baseX - centerX) * pulse + floatingX;

    const y =
      centerY + (p.baseY - centerY) * pulse + floatingY;

    const shimmer =
      p.alpha *
      (0.65 + 0.35 * Math.sin(time * 0.003 + p.phase));

    // Use several shades of blue
    const colorChoice = Math.sin(p.phase);

    let color;

    if (colorChoice > 0.55) {
      color = `rgba(190, 245, 255, ${shimmer})`;
    } else if (colorChoice > -0.1) {
      color = `rgba(75, 190, 255, ${shimmer})`;
    } else {
      color = `rgba(45, 105, 255, ${shimmer})`;
    }

    heartCtx.beginPath();

    heartCtx.arc(
      x,
      y,
      p.radius,
      0,
      Math.PI * 2
    );

    heartCtx.fillStyle = color;
    heartCtx.shadowBlur = p.radius * 5;
    heartCtx.shadowColor = "#46baff";

    heartCtx.fill();
  }

  heartCtx.shadowBlur = 0;
}

// ========================================
// 6. ANIMATION LOOP
// ========================================


const galaxyDust = [];

function createGalaxyDust() {
  galaxyDust.length = 0;

  for (let i = 0; i < 900; i++) {
    galaxyDust.push({
      angle: Math.random() * Math.PI * 2,
      radius: Math.random(),
      size: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.55 + 0.15,
      speed: Math.random() * 0.00015 + 0.00003,
      drift: Math.random() * 12 + 3
    });
  }
}

function drawSpiralGalaxy(time) {
  if (!heartWidth || !heartHeight) return;

  const cx = heartWidth / 2;
  const cy = heartHeight / 2 + 130;
  const maxRadius = Math.min(heartWidth, heartHeight) * 0.46;

  heartCtx.save();
  heartCtx.globalCompositeOperation = "lighter";

  // Soft blue glow behind the heart
  const core = heartCtx.createRadialGradient(
    cx, cy, 0,
    cx, cy, maxRadius * 0.65
  );

  core.addColorStop(0, "rgba(100, 190, 255, 0.20)");
  core.addColorStop(0.4, "rgba(35, 110, 255, 0.12)");
  core.addColorStop(1, "rgba(10, 40, 150, 0)");

  heartCtx.fillStyle = core;
  heartCtx.fillRect(0, 0, heartWidth, heartHeight);

  // Four spiral arms
  const arms = 4;
  const dotsPerArm = 380;

  for (let arm = 0; arm < arms; arm++) {
    for (let i = 0; i < dotsPerArm; i++) {
      const progress = i / dotsPerArm;
      const radius = 4 + progress * maxRadius;

      const angle =
        progress * Math.PI * 4.5 +
        (arm * Math.PI * 2 / arms) +
        time * 0.00008;

      const scatter = 2 + progress * 12;

      const x =
        cx + Math.cos(angle) * radius +
        Math.sin(i * 12.7 + arm) * scatter;

      const y =
        cy + Math.sin(angle) * radius * 0.48 +
        Math.cos(i * 8.3 + arm) * scatter * 0.55;

      const alpha = (1 - progress * 0.65) * 0.45;
      const size = 0.35 + (1 - progress) * 0.8;

      heartCtx.beginPath();
      heartCtx.arc(x, y, size, 0, Math.PI * 2);
      heartCtx.fillStyle =
        `rgba(100, 190, 255, ${alpha})`;
      heartCtx.fill();
    }
  }

  // Floating dust surrounding the galaxy
  galaxyDust.forEach((dust) => {
    const angle = dust.angle + time * dust.speed;
    const radius = maxRadius * (0.65 + dust.radius * 0.85);

    const x =
      cx + Math.cos(angle) * radius +
      Math.sin(time * 0.0005 + dust.angle) * dust.drift;

    const y =
      cy + Math.sin(angle) * radius * 0.58 +
      Math.cos(time * 0.0004 + dust.angle) * dust.drift;

    const twinkle =
      0.5 + 0.5 * Math.sin(time * 0.002 + dust.angle * 4);

    heartCtx.beginPath();
    heartCtx.arc(x, y, dust.size, 0, Math.PI * 2);
    heartCtx.fillStyle =
      `rgba(170, 225, 255, ${dust.alpha * twinkle})`;
    heartCtx.fill();
  });

  heartCtx.restore();
}


function animate(time) {
  drawStars(time);

  if (galaxyEntered && currentScreen === "galaxy") {
    drawHeart(time);
  }

  requestAnimationFrame(animate);
}

// ========================================
// 7. ENTER THE UNIVERSE
// ========================================

enterButton.addEventListener("click", () => {
  galaxyEntered = true;
  currentScreen = "galaxy";

  intro.classList.add("hidden");
  galaxyScreen.classList.remove("hidden");

  // Recalculate the heart size after opening
  requestAnimationFrame(() => {
    resizeCanvas();
    createStars();
createHeart();
createGalaxyDust();
  });
});

// ========================================
// 8. OPEN THE LOVE LETTER
// ========================================

memoriesButton.addEventListener("click", () => {
  currentScreen = "letter";

  galaxyScreen.classList.add("hidden");
  messagesScreen.classList.remove("hidden");
});

// ========================================
// 9. RETURN TO THE GALAXY
// ========================================

backButton.addEventListener("click", () => {
  currentScreen = "galaxy";

  messagesScreen.classList.add("hidden");
  galaxyScreen.classList.remove("hidden");
});

// ========================================
// 10. MOUSE MOVEMENT
// ========================================

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

// ========================================
// 11. START THE WEBSITE
// ========================================

resizeCanvas();
requestAnimationFrame(animate);
