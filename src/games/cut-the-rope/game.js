// Cut the Rope - Slice Puzzle (Vanilla JS)
(function () {
  'use strict';

  // --- Audio Synthesis (Web Audio API) ---
  const AudioEngine = {
    ctx: null,
    muted: false,
    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },
    playCut() {
      if (this.muted) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    },
    playStar() {
      if (this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      [880, 1320, 1760].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        gain.gain.setValueAtTime(0.25, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.25);
      });
    },
    playEat() {
      if (this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.1);
      osc.frequency.linearRampToValueAtTime(140, now + 0.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    },
  };

  // --- Helpers for Geometry & Intersections ---
  function ccw(A, B, C) {
    return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
  }
  function intersect(A, B, C, D) {
    return ccw(A, C, D) !== ccw(B, C, D) && ccw(A, B, C) !== ccw(A, B, D);
  }

  // --- Game Engine & Levels ---
  const LEVELS = [
    {
      ropes: [{ anchorRelX: 0.5, anchorRelY: 0.12, candyRelX: 0.5, candyRelY: 0.38 }],
      stars: [{ relX: 0.5, relY: 0.5 }, { relX: 0.4, relY: 0.62 }, { relX: 0.6, relY: 0.62 }],
      monster: { relX: 0.5, relY: 0.85 }
    },
    {
      ropes: [
        { anchorRelX: 0.28, anchorRelY: 0.12, candyRelX: 0.5, candyRelY: 0.32 },
        { anchorRelX: 0.72, anchorRelY: 0.12, candyRelX: 0.5, candyRelY: 0.32 }
      ],
      stars: [{ relX: 0.35, relY: 0.45 }, { relX: 0.65, relY: 0.45 }, { relX: 0.5, relY: 0.68 }],
      monster: { relX: 0.5, relY: 0.85 }
    },
    {
      ropes: [
        { anchorRelX: 0.22, anchorRelY: 0.15, candyRelX: 0.25, candyRelY: 0.4 },
        { anchorRelX: 0.78, anchorRelY: 0.2, candyRelX: 0.25, candyRelY: 0.4 }
      ],
      stars: [{ relX: 0.4, relY: 0.5 }, { relX: 0.6, relY: 0.55 }, { relX: 0.75, relY: 0.65 }],
      monster: { relX: 0.75, relY: 0.85 }
    }
  ];

  let currentLevelIdx = 0;
  let startTime = Date.now();
  let starsCollected = 0;
  let gameWon = false;
  let gameOver = false;

  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  let dpr = 1;
  let logicalW = 800;
  let logicalH = 600;

  // Blade tracking
  const bladeTrail = [];
  let isPointerDown = false;
  let lastPointerPos = null;

  // Candy state
  const candy = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 20,
    eaten: false,
    particles: []
  };

  let activeRopes = [];
  let stars = [];
  let monster = { x: 0, y: 0, mouthOpen: 0, chewing: 0 };

  // Setup Level
  function initLevel(lvlIdx) {
    currentLevelIdx = lvlIdx % LEVELS.length;
    const def = LEVELS[currentLevelIdx];
    startTime = Date.now();
    starsCollected = 0;
    gameWon = false;
    gameOver = false;
    const starEl = document.getElementById('star-count');
    if (starEl) starEl.textContent = '0/3';
    const lvlEl = document.getElementById('level-badge');
    if (lvlEl) lvlEl.textContent = `FASE ${currentLevelIdx + 1}`;

    // Setup candy & ropes
    const firstRope = def.ropes[0];
    candy.x = firstRope.candyRelX * logicalW;
    candy.y = firstRope.candyRelY * logicalH;
    candy.vx = 0;
    candy.vy = 0;
    candy.eaten = false;
    candy.particles = [];

    activeRopes = def.ropes.map((r) => {
      const ax = r.anchorRelX * logicalW;
      const ay = r.anchorRelY * logicalH;
      const dist = Math.hypot(candy.x - ax, candy.y - ay);
      return {
        anchorX: ax,
        anchorY: ay,
        length: dist,
        cut: false
      };
    });

    stars = def.stars.map((s) => ({
      x: s.relX * logicalW,
      y: s.relY * logicalH,
      collected: false,
      pulse: Math.random() * Math.PI
    }));

    monster = {
      x: def.monster.relX * logicalW,
      y: def.monster.relY * logicalH,
      mouthOpen: 0,
      chewing: 0
    };
  }

  // Display resizing
  function resize() {
    const parentRect = canvas.parentElement.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    logicalW = parentRect.width;
    logicalH = parentRect.height;

    canvas.width = Math.floor(logicalW * dpr);
    canvas.height = Math.floor(logicalH * dpr);
    canvas.style.width = `${logicalW}px`;
    canvas.style.height = `${logicalH}px`;
    ctx.scale(dpr, dpr);

    initLevel(currentLevelIdx);
  }

  const observer = new ResizeObserver(() => resize());
  observer.observe(canvas.parentElement);

  function getCoords(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  // Touch / Mouse Slice Handling
  function onPointerDown(e) {
    AudioEngine.init();
    isPointerDown = true;
    const pt = getCoords(e.clientX, e.clientY);
    lastPointerPos = pt;
    bladeTrail.length = 0;
    bladeTrail.push({ ...pt, age: 1.0 });
  }

  function onPointerMove(e) {
    if (!isPointerDown) return;
    const pt = getCoords(e.clientX, e.clientY);
    bladeTrail.push({ ...pt, age: 1.0 });

    if (lastPointerPos) {
      // Check collision with ropes
      activeRopes.forEach((rope) => {
        if (!rope.cut) {
          const ropeStart = { x: rope.anchorX, y: rope.anchorY };
          const ropeEnd = { x: candy.x, y: candy.y };
          if (intersect(lastPointerPos, pt, ropeStart, ropeEnd)) {
            rope.cut = true;
            AudioEngine.playCut();
          }
        }
      });
    }
    lastPointerPos = pt;
  }

  function onPointerUp() {
    isPointerDown = false;
    lastPointerPos = null;
  }

  canvas.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      onPointerDown(e.touches[0]);
    }
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      onPointerMove(e.touches[0]);
    }
  }, { passive: false });

  window.addEventListener('touchend', onPointerUp);

  // Physics Update
  function updatePhysics() {
    if (candy.eaten) {
      monster.chewing += 0.15;
      return;
    }

    const gravity = 0.48;
    candy.vy += gravity;

    // Apply rope constraints
    const connectedRopes = activeRopes.filter((r) => !r.cut);
    if (connectedRopes.length > 0) {
      // Solve multiple rope constraints iteratively
      for (let iter = 0; iter < 4; iter++) {
        connectedRopes.forEach((rope) => {
          const dx = candy.x - rope.anchorX;
          const dy = candy.y - rope.anchorY;
          const dist = Math.hypot(dx, dy);
          if (dist > rope.length) {
            const diff = (dist - rope.length) / dist;
            candy.x -= dx * diff;
            candy.y -= dy * diff;

            // Damp velocity along the rope vector
            const nx = dx / dist;
            const ny = dy / dist;
            const dot = candy.vx * nx + candy.vy * ny;
            if (dot > 0) {
              candy.vx -= dot * nx * 0.85;
              candy.vy -= dot * ny * 0.85;
            }
          }
        });
      }
    }

    // Air friction
    candy.vx *= 0.995;
    candy.vy *= 0.995;

    candy.x += candy.vx;
    candy.y += candy.vy;

    // Check Star Collections
    stars.forEach((star) => {
      if (!star.collected) {
        const d = Math.hypot(candy.x - star.x, candy.y - star.y);
        if (d < candy.radius + 18) {
          star.collected = true;
          starsCollected++;
          const starEl = document.getElementById('star-count');
          if (starEl) starEl.textContent = `${starsCollected}/3`;
          AudioEngine.playStar();
          createParticles(star.x, star.y, '#ffd700', 12);
        }
      }
    });

    // Monster reaction & mouth opening
    const distToMouth = Math.hypot(candy.x - monster.x, candy.y - (monster.y - 10));
    if (distToMouth < 160) {
      monster.mouthOpen = Math.min(1, monster.mouthOpen + 0.1);
    } else {
      monster.mouthOpen = Math.max(0, monster.mouthOpen - 0.05);
    }

    // Eat candy
    if (distToMouth < 38 && !candy.eaten) {
      candy.eaten = true;
      AudioEngine.playEat();
      createParticles(candy.x, candy.y, '#ff4757', 20);

      if (!gameWon) {
        gameWon = true;
        const elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
        // Official platform notification (rule of gold: no victory modal)
        window.parent.postMessage({ type: 'win', time: elapsed }, '*');

        setTimeout(() => {
          if (currentLevelIdx < LEVELS.length - 1) {
            initLevel(currentLevelIdx + 1);
          } else {
            initLevel(0);
          }
        }, 1500);
      }
    }

    // Out of bounds reset condition
    if (candy.y > logicalH + 80 || candy.x < -100 || candy.x > logicalW + 100) {
      if (!gameOver && !gameWon) {
        gameOver = true;
        setTimeout(() => initLevel(currentLevelIdx), 1000);
      }
    }
  }

  function createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      candy.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 2,
        color,
        alpha: 1
      });
    }
  }

  // --- Rendering Loop ---
  function render() {
    updatePhysics();

    ctx.clearRect(0, 0, logicalW, logicalH);

    // Subtle background wood plank lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let y = 60; y < logicalH; y += 70) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(logicalW, y);
      ctx.stroke();
    }

    // Render Ropes
    activeRopes.forEach((rope) => {
      if (!rope.cut) {
        // Shadow
        ctx.beginPath();
        ctx.moveTo(rope.anchorX + 4, rope.anchorY + 4);
        ctx.lineTo(candy.x + 4, candy.y + 4);
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 5;
        ctx.stroke();

        // Brown rope body
        ctx.beginPath();
        ctx.moveTo(rope.anchorX, rope.anchorY);
        ctx.lineTo(candy.x, candy.y);
        ctx.strokeStyle = '#c28b50';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Anchor peg
        ctx.beginPath();
        ctx.arc(rope.anchorX, rope.anchorY, 9, 0, Math.PI * 2);
        ctx.fillStyle = '#5c3a1e';
        ctx.fill();
        ctx.strokeStyle = '#d4a373';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
    });

    // Render Stars
    stars.forEach((star) => {
      if (!star.collected) {
        star.pulse += 0.05;
        const scale = 1 + Math.sin(star.pulse) * 0.08;
        drawStar(star.x, star.y, 5, 14 * scale, 7 * scale);
      }
    });

    // Render Monster
    drawMonster(monster.x, monster.y, monster.mouthOpen, monster.chewing);

    // Render Candy
    if (!candy.eaten) {
      drawCandy(candy.x, candy.y, candy.radius);
    }

    // Render Particles
    for (let i = candy.particles.length - 1; i >= 0; i--) {
      const p = candy.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.03;
      if (p.alpha <= 0) {
        candy.particles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Render Blade Trail
    if (bladeTrail.length > 1) {
      ctx.save();
      for (let i = 1; i < bladeTrail.length; i++) {
        const p1 = bladeTrail[i - 1];
        const p2 = bladeTrail[i];
        const alpha = p2.age;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.8})`;
        ctx.lineWidth = Math.max(1, 8 * alpha);
        ctx.lineCap = 'round';
        ctx.stroke();
      }
      ctx.restore();

      // Age blade trail
      for (let i = bladeTrail.length - 1; i >= 0; i--) {
        bladeTrail[i].age -= 0.08;
        if (bladeTrail[i].age <= 0) {
          bladeTrail.splice(i, 1);
        }
      }
    }

    requestAnimationFrame(render);
  }

  function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    // Contact shadow
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + outerRadius + 4, outerRadius * 0.8, outerRadius * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = '#ffd700';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawCandy(x, y, radius) {
    // Drop shadow
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(x, y + radius + 10, radius * 0.9, radius * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Candy 3D sphere gradient
    const grad = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, radius * 0.1, x, y, radius);
    grad.addColorStop(0, '#ff9ebb');
    grad.addColorStop(0.6, '#ff2e4d');
    grad.addColorStop(1, '#a30018');

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Swirl pattern
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.6, 0.4, Math.PI + 0.4);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Specular shine
    ctx.beginPath();
    ctx.ellipse(x - radius * 0.4, y - radius * 0.4, radius * 0.3, radius * 0.15, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fill();
    ctx.restore();
  }

  function drawMonster(x, y, mouthOpen, chewing) {
    ctx.save();
    ctx.translate(x, y);

    // Floor shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 36, 60, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Feet
    ctx.fillStyle = '#3a8a18';
    ctx.beginPath();
    ctx.ellipse(-32, 28, 16, 10, 0, 0, Math.PI * 2);
    ctx.ellipse(32, 28, 16, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Monster Body
    const chewOffset = Math.sin(chewing * 4) * 3;
    const bodyGrad = ctx.createRadialGradient(-10, -10 + chewOffset, 10, 0, chewOffset, 55);
    bodyGrad.addColorStop(0, '#86e646');
    bodyGrad.addColorStop(0.7, '#4caf1f');
    bodyGrad.addColorStop(1, '#26610f');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, chewOffset, 52, 42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#22520d';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Antenna
    ctx.beginPath();
    ctx.arc(-8, -45 + chewOffset, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#86e646';
    ctx.fill();

    // Mouth (opens when candy is near)
    const mouthH = 8 + mouthOpen * 24 + Math.abs(Math.sin(chewing * 3) * 6);
    ctx.fillStyle = '#420b0b';
    ctx.beginPath();
    ctx.ellipse(0, 8 + chewOffset, 32, mouthH, 0, 0, Math.PI * 2);
    ctx.fill();

    if (mouthH > 14) {
      // Tongue
      ctx.fillStyle = '#ff4757';
      ctx.beginPath();
      ctx.ellipse(0, 14 + chewOffset, 18, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sharp Teeth
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-18, 2 + chewOffset);
      ctx.lineTo(-12, 10 + chewOffset);
      ctx.lineTo(-6, 2 + chewOffset);
      ctx.lineTo(6, 2 + chewOffset);
      ctx.lineTo(12, 10 + chewOffset);
      ctx.lineTo(18, 2 + chewOffset);
      ctx.fill();
    }

    // Eyes (track candy)
    const eyeDx = (candy.x - x) * 0.04;
    const eyeDy = (candy.y - (y - 20)) * 0.04;
    const clampedDx = Math.max(-5, Math.min(5, eyeDx));
    const clampedDy = Math.max(-4, Math.min(4, eyeDy));

    [-18, 18].forEach((eyeX) => {
      // Sclera
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(eyeX, -18 + chewOffset, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#26610f';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pupil
      ctx.fillStyle = '#1b2814';
      ctx.beginPath();
      ctx.arc(eyeX + clampedDx, -18 + clampedDy + chewOffset, 6, 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(eyeX + clampedDx - 2, -20 + clampedDy + chewOffset, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  // Controls
  document.getElementById('btn-restart').addEventListener('click', () => {
    initLevel(currentLevelIdx);
  });

  document.getElementById('btn-sound').addEventListener('click', function () {
    AudioEngine.muted = !AudioEngine.muted;
    this.innerHTML = AudioEngine.muted ? '🔇' : '🔊';
  });

  requestAnimationFrame(render);
})();
