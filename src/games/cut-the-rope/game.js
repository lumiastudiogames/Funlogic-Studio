// Cut the Rope - Slice & Bounce Puzzle (Vanilla JS)
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
    playBounce() {
      if (this.muted) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
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

  // --- Geometry & Intersections ---
  function ccw(A, B, C) {
    return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
  }
  function intersect(A, B, C, D) {
    return ccw(A, C, D) !== ccw(B, C, D) && ccw(A, B, C) !== ccw(A, B, D);
  }

  // --- 20 Procedural / Calculated Bounce Stages ---
  const TOTAL_STAGES = 20;
  const LEVELS = [
    // Stage 1: Single Angled Ramp to Monster
    {
      ropes: [{ anchorRelX: 0.25, anchorRelY: 0.12, candyRelX: 0.25, candyRelY: 0.3 }],
      platforms: [
        { relX1: 0.15, relY1: 0.58, relX2: 0.45, relY2: 0.68, bounciness: 0.88 }
      ],
      stars: [{ relX: 0.25, relY: 0.45 }, { relX: 0.5, relY: 0.62 }, { relX: 0.7, relY: 0.76 }],
      monster: { relX: 0.78, relY: 0.86 }
    },
    // Stage 2: Dual Alternating Ricochet
    {
      ropes: [{ anchorRelX: 0.75, anchorRelY: 0.12, candyRelX: 0.75, candyRelY: 0.3 }],
      platforms: [
        { relX1: 0.6, relY1: 0.52, relX2: 0.88, relY2: 0.62, bounciness: 0.9 },
        { relX1: 0.2, relY1: 0.72, relX2: 0.48, relY2: 0.66, bounciness: 0.92 }
      ],
      stars: [{ relX: 0.75, relY: 0.42 }, { relX: 0.45, relY: 0.58 }, { relX: 0.65, relY: 0.75 }],
      monster: { relX: 0.68, relY: 0.88 }
    },
    // Stage 3: Double Swing with Center Trampoline
    {
      ropes: [
        { anchorRelX: 0.32, anchorRelY: 0.12, candyRelX: 0.5, candyRelY: 0.28 },
        { anchorRelX: 0.68, anchorRelY: 0.12, candyRelX: 0.5, candyRelY: 0.28 }
      ],
      platforms: [
        { relX1: 0.35, relY1: 0.62, relX2: 0.65, relY2: 0.62, bounciness: 0.95 }
      ],
      stars: [{ relX: 0.5, relY: 0.45 }, { relX: 0.38, relY: 0.72 }, { relX: 0.62, relY: 0.72 }],
      monster: { relX: 0.5, relY: 0.88 }
    },
    // Stage 4: High Drop Funnel
    {
      ropes: [{ anchorRelX: 0.5, anchorRelY: 0.1, candyRelX: 0.5, candyRelY: 0.26 }],
      platforms: [
        { relX1: 0.18, relY1: 0.48, relX2: 0.42, relY2: 0.58, bounciness: 0.88 },
        { relX1: 0.58, relY1: 0.58, relX2: 0.82, relY2: 0.48, bounciness: 0.88 }
      ],
      stars: [{ relX: 0.5, relY: 0.38 }, { relX: 0.32, relY: 0.68 }, { relX: 0.68, relY: 0.68 }],
      monster: { relX: 0.5, relY: 0.88 }
    },
    // Stage 5: Triple Pinball Cascading Bouncers
    {
      ropes: [{ anchorRelX: 0.2, anchorRelY: 0.12, candyRelX: 0.25, candyRelY: 0.28 }],
      platforms: [
        { relX1: 0.15, relY1: 0.45, relX2: 0.4, relY2: 0.52, bounciness: 0.92 },
        { relX1: 0.58, relY1: 0.62, relX2: 0.82, relY2: 0.55, bounciness: 0.92 },
        { relX1: 0.28, relY1: 0.75, relX2: 0.52, relY2: 0.82, bounciness: 0.9 }
      ],
      stars: [{ relX: 0.3, relY: 0.4 }, { relX: 0.68, relY: 0.5 }, { relX: 0.75, relY: 0.75 }],
      monster: { relX: 0.76, relY: 0.88 }
    },
    // Stages 6-20: Procedural Calculation presets
    ...Array.from({ length: 15 }, (_, i) => {
      const idx = i + 6;
      const flip = idx % 2 === 0;
      return {
        ropes: [
          { anchorRelX: flip ? 0.3 : 0.7, anchorRelY: 0.12, candyRelX: flip ? 0.35 : 0.65, candyRelY: 0.28 }
        ],
        platforms: [
          { relX1: flip ? 0.2 : 0.55, relY1: 0.5, relX2: flip ? 0.45 : 0.8, relY2: flip ? 0.58 : 0.58, bounciness: 0.9 },
          { relX1: flip ? 0.55 : 0.2, relY1: 0.7, relX2: flip ? 0.8 : 0.45, relY2: flip ? 0.65 : 0.65, bounciness: 0.92 }
        ],
        stars: [
          { relX: flip ? 0.35 : 0.65, relY: 0.42 },
          { relX: 0.5, relY: 0.6 },
          { relX: flip ? 0.75 : 0.25, relY: 0.74 }
        ],
        monster: { relX: flip ? 0.8 : 0.2, relY: 0.88 }
      };
    })
  ];

  let currentLevelIdx = 0;
  let startTime = Date.now();
  let starsCollected = 0;
  let gameWon = false;

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
    radius: 19,
    eaten: false,
    particles: []
  };

  let activeRopes = [];
  let platforms = [];
  let stars = [];
  let monster = { x: 0, y: 0, mouthOpen: 0, chewing: 0, jumpY: 0, eyeAngle: 0 };

  // --- Stage Pre-Verification & Solvability Engine ---
  function simulateTrajectory(def, testCutTiming = 0, width = logicalW, height = logicalH) {
    const ropeDefs = def.ropes.map((r) => ({
      anchorX: r.anchorRelX * width,
      anchorY: r.anchorRelY * height,
      candyX: r.candyRelX * width,
      candyY: r.candyRelY * height,
      length: Math.hypot((r.candyRelX - r.anchorRelX) * width, (r.candyRelY - r.anchorRelY) * height),
      cut: false
    }));
    let cx = ropeDefs[0]?.candyX ?? width * 0.5;
    let cy = ropeDefs[0]?.candyY ?? height * 0.3;
    let cvx = 0;
    let cvy = 0;
    const plats = (def.platforms || []).map((p) => ({
      x1: p.relX1 * width,
      y1: p.relY1 * height,
      x2: p.relX2 * width,
      y2: p.relY2 * height,
      bounciness: p.bounciness || 0.88
    }));
    const mx = def.monster.relX * width;
    const my = def.monster.relY * height;
    const history = [];

    for (let tick = 0; tick < 360; tick++) {
      if (tick >= testCutTiming) {
        ropeDefs.forEach((r) => (r.cut = true));
      }
      cvy += 0.44;
      const uncuts = ropeDefs.filter((r) => !r.cut);
      if (uncuts.length > 0) {
        for (let it = 0; it < 4; it++) {
          uncuts.forEach((r) => {
            const dx = cx - r.anchorX;
            const dy = cy - r.anchorY;
            const dist = Math.hypot(dx, dy);
            if (dist > 0) {
              const diff = (dist - r.length) / dist;
              cx -= dx * diff * 0.95;
              cy -= dy * diff * 0.95;
            }
          });
        }
      }
      cvx *= 0.994;
      cvy *= 0.994;
      cx += cvx;
      cy += cvy;

      // Platform bounces
      plats.forEach((plat) => {
        const dx = plat.x2 - plat.x1;
        const dy = plat.y2 - plat.y1;
        const lenSq = dx * dx + dy * dy;
        if (lenSq === 0) return;
        let t = ((cx - plat.x1) * dx + (cy - plat.y1) * dy) / lenSq;
        t = Math.max(0, Math.min(1, t));
        const px = plat.x1 + t * dx;
        const py = plat.y1 + t * dy;
        const dist = Math.hypot(cx - px, cy - py);
        if (dist < 19 + 4) {
          let nx = -dy, ny = dx;
          const nLen = Math.hypot(nx, ny);
          if (nLen === 0) return;
          nx /= nLen; ny /= nLen;
          if (nx * (cx - px) + ny * (cy - py) < 0) { nx = -nx; ny = -ny; }
          cx = px + nx * 23;
          cy = py + ny * 23;
          const dot = cvx * nx + cvy * ny;
          if (dot < 0) {
            cvx = (cvx - 2 * dot * nx) * plat.bounciness;
            cvy = (cvy - 2 * dot * ny) * plat.bounciness;
          }
        }
      });

      history.push({ x: cx, y: cy });

      if (Math.hypot(cx - mx, cy - my) < 46) {
        return { solved: true, tick, history };
      }
      if (cy > height + 80) break;
    }
    return { solved: false, history };
  }

  function verifyAndEnsureSolvability(def, width, height) {
    // 1. Check if level is naturally solvable across common cut timings
    for (const cutTime of [0, 15, 30]) {
      const res = simulateTrajectory(def, cutTime, width, height);
      if (res.solved) return def;
    }

    // 2. If not reaching monster, align monster and platforms along the bounce landing arc
    const sim = simulateTrajectory(def, 0, width, height);
    if (sim.history && sim.history.length > 0) {
      const targetY = height * 0.86;
      let landingPt = sim.history.find((p) => p.y >= targetY) || sim.history[sim.history.length - 1];
      if (landingPt) {
        const clampedRelX = Math.max(0.15, Math.min(0.85, landingPt.x / width));
        def.monster.relX = clampedRelX;
        def.monster.relY = 0.86;
      }
    }
    return def;
  }

  // Setup Level
  function initLevel(lvlIdx) {
    currentLevelIdx = lvlIdx % TOTAL_STAGES;
    const rawDef = LEVELS[currentLevelIdx];
    const def = verifyAndEnsureSolvability(rawDef, logicalW, logicalH);
    startTime = Date.now();
    starsCollected = 0;
    gameWon = false;

    const lvlEl = document.getElementById('level-num');
    if (lvlEl) lvlEl.textContent = `${currentLevelIdx + 1}/${TOTAL_STAGES}`;

    const starEl = document.getElementById('star-count');
    if (starEl) starEl.textContent = '0/3';

    // Build Ropes
    activeRopes = def.ropes.map((r) => {
      const anchorX = r.anchorRelX * logicalW;
      const anchorY = r.anchorRelY * logicalH;
      const candyX = r.candyRelX * logicalW;
      const candyY = r.candyRelY * logicalH;
      const length = Math.hypot(candyX - anchorX, candyY - anchorY);
      return {
        anchorX,
        anchorY,
        length,
        cut: false
      };
    });

    // Set Candy Position
    if (def.ropes.length > 0) {
      candy.x = def.ropes[0].candyRelX * logicalW;
      candy.y = def.ropes[0].candyRelY * logicalH;
    } else {
      candy.x = logicalW * 0.5;
      candy.y = logicalH * 0.3;
    }
    candy.vx = 0;
    candy.vy = 0;
    candy.eaten = false;
    candy.particles = [];

    // Build Platforms
    platforms = (def.platforms || []).map((p) => ({
      x1: p.relX1 * logicalW,
      y1: p.relY1 * logicalH,
      x2: p.relX2 * logicalW,
      y2: p.relY2 * logicalH,
      bounciness: p.bounciness || 0.88
    }));

    // Build Stars
    stars = def.stars.map((s) => ({
      x: s.relX * logicalW,
      y: s.relY * logicalH,
      collected: false,
      rot: 0
    }));

    // Build Monster
    monster.x = def.monster.relX * logicalW;
    monster.y = def.monster.relY * logicalH;
    monster.mouthOpen = 0;
    monster.chewing = 0;
    monster.jumpY = 0;
    monster.eyeAngle = 0;
  }

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    logicalW = Math.max(320, rect.width);
    logicalH = Math.max(400, rect.height);

    canvas.width = logicalW * dpr;
    canvas.height = logicalH * dpr;
    canvas.style.width = `${logicalW}px`;
    canvas.style.height = `${logicalH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    initLevel(currentLevelIdx);
  }

  window.addEventListener('resize', resizeCanvas);
  const observer = new ResizeObserver(() => resizeCanvas());
  observer.observe(canvas.parentElement);

  function getCoords(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  // Pointer slice handling
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
      activeRopes.forEach((rope) => {
        if (!rope.cut) {
          const ropeStart = { x: rope.anchorX, y: rope.anchorY };
          const ropeEnd = { x: candy.x, y: candy.y };
          if (intersect(lastPointerPos, pt, ropeStart, ropeEnd)) {
            rope.cut = true;
            AudioEngine.playCut();
            createParticles(pt.x, pt.y, '#f59e0b', 8);
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
    if (e.touches.length > 0) onPointerDown(e.touches[0]);
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) onPointerMove(e.touches[0]);
  }, { passive: false });

  window.addEventListener('touchend', onPointerUp);

  function createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      candy.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 3 + Math.random() * 4,
        alpha: 1.0,
        decay: 0.03 + Math.random() * 0.03
      });
    }
  }

  // --- Physics Update with Calculated Platform Collisions ---
  function updatePhysics() {
    if (candy.eaten) {
      monster.chewing += 0.15;
      return;
    }

    const gravity = 0.44;
    candy.vy += gravity;

    // Apply rope constraints
    const connectedRopes = activeRopes.filter((r) => !r.cut);
    if (connectedRopes.length > 0) {
      for (let iter = 0; iter < 4; iter++) {
        connectedRopes.forEach((rope) => {
          const dx = candy.x - rope.anchorX;
          const dy = candy.y - rope.anchorY;
          const dist = Math.hypot(dx, dy);
          if (dist > rope.length) {
            const diff = (dist - rope.length) / dist;
            candy.x -= dx * diff;
            candy.y -= dy * diff;

            const nx = dx / dist;
            const ny = dy / dist;
            const dot = candy.vx * nx + candy.vy * ny;
            if (dot > 0) {
              candy.vx -= dot * nx * 0.88;
              candy.vy -= dot * ny * 0.88;
            }
          }
        });
      }
    }

    // Air friction
    candy.vx *= 0.994;
    candy.vy *= 0.994;

    candy.x += candy.vx;
    candy.y += candy.vy;

    // Boundary bounce
    if (candy.x < candy.radius) {
      candy.x = candy.radius;
      candy.vx = -candy.vx * 0.7;
    } else if (candy.x > logicalW - candy.radius) {
      candy.x = logicalW - candy.radius;
      candy.vx = -candy.vx * 0.7;
    }

    // Calculated Platform Collisions & Ricochets
    platforms.forEach((plat) => {
      const dx = plat.x2 - plat.x1;
      const dy = plat.y2 - plat.y1;
      const lenSq = dx * dx + dy * dy;
      if (lenSq === 0) return;

      let t = ((candy.x - plat.x1) * dx + (candy.y - plat.y1) * dy) / lenSq;
      t = Math.max(0, Math.min(1, t));

      const projX = plat.x1 + t * dx;
      const projY = plat.y1 + t * dy;

      const dist = Math.hypot(candy.x - projX, candy.y - projY);
      if (dist < candy.radius + 4) {
        let nx = -dy;
        let ny = dx;
        const nLen = Math.hypot(nx, ny);
        if (nLen === 0) return;
        nx /= nLen;
        ny /= nLen;

        if (nx * (candy.x - projX) + ny * (candy.y - projY) < 0) {
          nx = -nx;
          ny = -ny;
        }

        candy.x = projX + nx * (candy.radius + 4);
        candy.y = projY + ny * (candy.radius + 4);

        const dot = candy.vx * nx + candy.vy * ny;
        if (dot < 0) {
          const bounce = plat.bounciness;
          candy.vx = (candy.vx - 2 * dot * nx) * bounce;
          candy.vy = (candy.vy - 2 * dot * ny) * bounce;

          AudioEngine.playBounce();
          createParticles(projX, projY, '#38bdf8', 6);
        }
      }
    });

    // Star Collections
    stars.forEach((star) => {
      star.rot += 0.04;
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

    // Monster dynamic animation: eye tracking & eager jump
    const eyeDx = candy.x - monster.x;
    const eyeDy = candy.y - (monster.y - 12);
    monster.eyeAngle = Math.atan2(eyeDy, eyeDx);

    const distToMouth = Math.hypot(candy.x - monster.x, candy.y - (monster.y - 10 + monster.jumpY));

    if (distToMouth < 150) {
      monster.mouthOpen = Math.min(1, monster.mouthOpen + 0.12);
      // Eager jump to catch candy!
      monster.jumpY = -Math.sin(Date.now() * 0.01) * 8;
    } else {
      monster.mouthOpen = Math.max(0, monster.mouthOpen - 0.05);
      monster.jumpY = 0;
    }

    // Eat candy condition
    const canEat = logicalW > 100 && logicalH > 100 && (Date.now() - startTime > 700 || activeRopes.some((r) => r.cut));
    if (canEat && distToMouth < 42 && !candy.eaten) {
      candy.eaten = true;
      AudioEngine.playEat();
      createParticles(candy.x, candy.y, '#ff4757', 24);

      if (!gameWon) {
        gameWon = true;
        const elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
        try {
          if (typeof window.triggerPlatformWin === 'function') {
            window.triggerPlatformWin({ score: starsCollected * 100, level: currentLevelIdx + 1, time: elapsed });
          }
        } catch (_) {}
        window.parent.postMessage({ type: 'win', time: elapsed, level: currentLevelIdx + 1 }, '*');

        setTimeout(() => {
          initLevel((currentLevelIdx + 1) % TOTAL_STAGES);
        }, 1400);
      }
    }

    // Respawn if candy falls off screen
    if (candy.y > logicalH + 100 && !candy.eaten) {
      initLevel(currentLevelIdx);
    }
  }

  // --- Rendering Functions with Pseudo-3D Depth ---
  function draw() {
    ctx.clearRect(0, 0, logicalW, logicalH);

    // 1. Draw Background grid & depth shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, logicalH - 30, logicalW, 30);

    // 2. Draw 3D Platforms
    platforms.forEach((plat) => {
      ctx.save();
      const dx = plat.x2 - plat.x1;
      const dy = plat.y2 - plat.y1;
      const angle = Math.atan2(dy, dx);
      const len = Math.hypot(dx, dy);

      ctx.translate(plat.x1, plat.y1);
      ctx.rotate(angle);

      // Deep contact shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.roundRect(0, 10, len, 8, 4);
      ctx.fill();

      // Platform 3D base wood bevel
      const woodGrad = ctx.createLinearGradient(0, 0, 0, 12);
      woodGrad.addColorStop(0, '#92400e');
      woodGrad.addColorStop(0.5, '#78350f');
      woodGrad.addColorStop(1, '#451a03');
      ctx.fillStyle = woodGrad;
      ctx.beginPath();
      ctx.roundRect(0, 2, len, 12, 5);
      ctx.fill();

      // Neon Trampoline Bouncer Cushion Surface
      const bouncerGrad = ctx.createLinearGradient(0, -2, 0, 4);
      bouncerGrad.addColorStop(0, '#38bdf8');
      bouncerGrad.addColorStop(1, '#0284c7');
      ctx.fillStyle = bouncerGrad;
      ctx.beginPath();
      ctx.roundRect(2, -2, len - 4, 6, 3);
      ctx.fill();

      // Rivets on edges
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.arc(6, 6, 2, 0, Math.PI * 2);
      ctx.arc(len - 6, 6, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    // 3. Draw Ropes
    activeRopes.forEach((rope) => {
      if (!rope.cut) {
        ctx.save();
        // Rope shadow
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(rope.anchorX + 2, rope.anchorY + 3);
        ctx.lineTo(candy.x + 2, candy.y + 3);
        ctx.stroke();

        // Authentic hemp fiber rope
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(rope.anchorX, rope.anchorY);
        ctx.lineTo(candy.x, candy.y);
        ctx.stroke();

        // Inner twist highlight
        ctx.strokeStyle = '#fde68a';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(rope.anchorX, rope.anchorY);
        ctx.lineTo(candy.x, candy.y);
        ctx.stroke();

        // 3D Anchor ring
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(rope.anchorX, rope.anchorY, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fde68a';
        ctx.beginPath();
        ctx.arc(rope.anchorX, rope.anchorY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    });

    // 4. Draw Stars
    stars.forEach((star) => {
      if (!star.collected) {
        ctx.save();
        ctx.translate(star.x, star.y);
        ctx.rotate(star.rot);

        // Glow halo
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 12;

        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * 15, -Math.sin(((18 + i * 72) * Math.PI) / 180) * 15);
          ctx.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * 7, -Math.sin(((54 + i * 72) * Math.PI) / 180) * 7);
        }
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(-2, -3, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    });

    // 5. Draw 3D Om Nom Monster
    ctx.save();
    const my = monster.y + monster.jumpY;
    ctx.translate(monster.x, my);

    // Floor shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 22 - monster.jumpY * 0.5, 34, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body (Green gradient sphere with 3D bevel)
    const bodyGrad = ctx.createRadialGradient(-8, -8, 4, 0, 0, 36);
    bodyGrad.addColorStop(0, '#86efac');
    bodyGrad.addColorStop(0.5, '#22c55e');
    bodyGrad.addColorStop(1, '#15803d');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 36, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cute Antenna on head
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(0, -32, 5, 0, Math.PI * 2);
    ctx.fill();

    // Animated mouth
    const openH = monster.mouthOpen * 22;
    ctx.fillStyle = '#450a0a';
    ctx.beginPath();
    ctx.ellipse(0, 8, 22, 6 + openH, 0, 0, Math.PI);
    ctx.fill();

    if (openH > 4) {
      // Pink tongue
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.ellipse(0, 10 + openH * 0.4, 12, 4 + openH * 0.4, 0, 0, Math.PI);
      ctx.fill();

      // Sharp white teeth
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(-14, 8);
      ctx.lineTo(-10, 14);
      ctx.lineTo(-6, 8);
      ctx.lineTo(-2, 14);
      ctx.lineTo(2, 8);
      ctx.lineTo(6, 14);
      ctx.lineTo(10, 8);
      ctx.lineTo(14, 14);
      ctx.closePath();
      ctx.fill();
    }

    // Big Eyes tracking candy
    const eyeOffset = Math.min(3, 3);
    const pupilX = Math.cos(monster.eyeAngle) * eyeOffset;
    const pupilY = Math.sin(monster.eyeAngle) * eyeOffset;

    [-11, 11].forEach((ex) => {
      // Eye white with 3D drop shadow
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ex, -12, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Dark pupil
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(ex + pupilX, -12 + pupilY, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Glint
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ex + pupilX - 1.5, -12 + pupilY - 1.5, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();

    // 6. Draw 3D Candy (Glass gloss + swirl stripes)
    if (!candy.eaten) {
      ctx.save();
      ctx.translate(candy.x, candy.y);

      // Candy shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(2, 22, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // 3D Red sphere with rich glossy gradient
      const candyGrad = ctx.createRadialGradient(-5, -6, 2, 0, 0, candy.radius);
      candyGrad.addColorStop(0, '#fca5a5');
      candyGrad.addColorStop(0.3, '#ef4444');
      candyGrad.addColorStop(0.8, '#b91c1c');
      candyGrad.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = candyGrad;
      ctx.beginPath();
      ctx.arc(0, 0, candy.radius, 0, Math.PI * 2);
      ctx.fill();

      // White spiral stripe
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, candy.radius * 0.65, 0.3, 2.5);
      ctx.stroke();

      // Specular highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(-6, -7, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 7. Draw Slicing Blade Trail
    if (bladeTrail.length > 1) {
      ctx.save();
      for (let i = 1; i < bladeTrail.length; i++) {
        const p1 = bladeTrail[i - 1];
        const p2 = bladeTrail[i];
        ctx.strokeStyle = `rgba(255, 255, 255, ${p2.age})`;
        ctx.lineWidth = p2.age * 5;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Update blade age
    for (let i = bladeTrail.length - 1; i >= 0; i--) {
      bladeTrail[i].age -= 0.08;
      if (bladeTrail[i].age <= 0) bladeTrail.splice(i, 1);
    }

    // 8. Draw Candy / Bounce Particles
    for (let i = candy.particles.length - 1; i >= 0; i--) {
      const p = candy.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        candy.particles.splice(i, 1);
      } else {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  // --- Main Animation Loop ---
  function loop() {
    updatePhysics();
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    requestAnimationFrame(loop);

    const restartBtn = document.getElementById('btn-restart');
    restartBtn?.addEventListener('click', () => {
      initLevel(currentLevelIdx);
    });

    const soundBtn = document.getElementById('btn-sound');
    soundBtn?.addEventListener('click', () => {
      AudioEngine.muted = !AudioEngine.muted;
      soundBtn.innerHTML = AudioEngine.muted ? '🔇' : '🔊';
    });
  });
})();
