// Save the Dog - Draw to Save Engine (Vanilla JS)
(function () {
  'use strict';

  // --- Audio Synthesis Engine ---
  const AudioEngine = {
    ctx: null,
    muted: false,
    buzzGain: null,
    buzzOsc: null,
    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },
    startBuzz() {
      if (this.muted) return;
      this.init();
      if (this.buzzOsc) return;
      this.buzzOsc = this.ctx.createOscillator();
      this.buzzGain = this.ctx.createGain();
      this.buzzOsc.type = 'sawtooth';
      this.buzzOsc.frequency.setValueAtTime(140, this.ctx.currentTime);
      this.buzzGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      this.buzzOsc.connect(this.buzzGain);
      this.buzzGain.connect(this.ctx.destination);
      this.buzzOsc.start();
    },
    stopBuzz() {
      if (this.buzzOsc) {
        try {
          this.buzzOsc.stop();
          this.buzzOsc.disconnect();
        } catch (e) {}
        this.buzzOsc = null;
      }
    },
    playBark() {
      if (this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      [360, 420].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.12);
        osc.frequency.linearRampToValueAtTime(f * 0.7, now + i * 0.12 + 0.1);
        gain.gain.setValueAtTime(0.25, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.1);
      });
    },
    playSting() {
      if (this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  };

  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const inkFill = document.getElementById('ink-fill');
  const timerBox = document.getElementById('timer-box');
  const levelBadge = document.getElementById('level-badge');
  const toast = document.getElementById('instruction-toast');

  let dpr = 1;
  let logicalW = 800;
  let logicalH = 600;
  let currentLevel = 1;
  let startTime = Date.now();

  const MAX_INK = 1200;
  let remainingInk = MAX_INK;
  let drawing = false;
  let gameState = 'DRAWING'; // 'DRAWING', 'DEFENDING', 'WON', 'LOST'

  let currentLine = []; // array of {x, y}
  let lineRigidBody = null; // { points, vy, vx, yOffset }
  let platforms = [];
  let dog = { x: 0, y: 0, radius: 24, vy: 0, hurt: false };
  let hive = { x: 0, y: 0 };
  let bees = [];
  let countdown = 5.0;

  // Geometry helper
  function distToSegment(p, v, w) {
    const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
  }

  function initLevel(lvl) {
    currentLevel = lvl;
    levelBadge.textContent = `FASE ${currentLevel}`;
    startTime = Date.now();
    gameState = 'DRAWING';
    remainingInk = MAX_INK;
    inkFill.style.width = '100%';
    timerBox.classList.remove('active');
    timerBox.textContent = '5.0s';
    toast.style.display = 'flex';
    toast.textContent = '✏️ Desenhe uma barreira para proteger o cãozinho!';
    AudioEngine.stopBuzz();

    currentLine = [];
    lineRigidBody = null;
    bees = [];
    countdown = 5.0;

    // Procedural layout based on level
    if (currentLevel % 3 === 1) {
      platforms = [
        { x: logicalW * 0.35, y: logicalH * 0.65, w: logicalW * 0.3, h: 40 },
        { x: 0, y: logicalH * 0.9, w: logicalW, h: logicalH * 0.1 }
      ];
      dog.x = logicalW * 0.5;
      dog.y = logicalH * 0.65 - 24;
      hive.x = logicalW * 0.2;
      hive.y = logicalH * 0.25;
    } else if (currentLevel % 3 === 2) {
      platforms = [
        { x: logicalW * 0.42, y: logicalH * 0.62, w: logicalW * 0.16, h: 120 },
        { x: logicalW * 0.05, y: logicalH * 0.75, w: logicalW * 0.25, h: 30 },
        { x: logicalW * 0.7, y: logicalH * 0.75, w: logicalW * 0.25, h: 30 }
      ];
      dog.x = logicalW * 0.5;
      dog.y = logicalH * 0.62 - 24;
      hive.x = logicalW * 0.8;
      hive.y = logicalH * 0.22;
    } else {
      platforms = [
        { x: logicalW * 0.2, y: logicalH * 0.68, w: logicalW * 0.25, h: 35 },
        { x: logicalW * 0.55, y: logicalH * 0.68, w: logicalW * 0.25, h: 35 }
      ];
      dog.x = logicalW * 0.32;
      dog.y = logicalH * 0.68 - 24;
      hive.x = logicalW * 0.67;
      hive.y = logicalH * 0.25;
    }
    dog.hurt = false;
    dog.vy = 0;
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    logicalW = rect.width;
    logicalH = rect.height;

    canvas.width = Math.floor(logicalW * dpr);
    canvas.height = Math.floor(logicalH * dpr);
    canvas.style.width = `${logicalW}px`;
    canvas.style.height = `${logicalH}px`;
    ctx.scale(dpr, dpr);

    initLevel(currentLevel);
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

  // Pointer drawing events
  function onPointerDown(e) {
    if (gameState !== 'DRAWING') return;
    AudioEngine.init();
    drawing = true;
    currentLine = [];
    remainingInk = MAX_INK;
    const pt = getCoords(e.clientX, e.clientY);
    currentLine.push(pt);
  }

  function onPointerMove(e) {
    if (!drawing || gameState !== 'DRAWING') return;
    const pt = getCoords(e.clientX, e.clientY);
    const last = currentLine[currentLine.length - 1];
    const dist = Math.hypot(pt.x - last.x, pt.y - last.y);
    if (dist > 5) {
      if (remainingInk >= dist) {
        remainingInk -= dist;
        currentLine.push(pt);
        inkFill.style.width = `${(remainingInk / MAX_INK) * 100}%`;
      } else {
        onPointerUp();
      }
    }
  }

  function onPointerUp() {
    if (!drawing || gameState !== 'DRAWING') return;
    drawing = false;
    if (currentLine.length < 3) {
      currentLine = [];
      return;
    }

    // Start DEFENDING phase
    gameState = 'DEFENDING';
    toast.style.display = 'none';
    timerBox.classList.add('active');
    lineRigidBody = {
      points: currentLine.map((p) => ({ ...p })),
      vy: 0,
      vx: 0,
      yOffset: 0
    };

    // Spawn 16 Bees
    bees = [];
    const count = 14 + currentLevel * 2;
    for (let i = 0; i < count; i++) {
      bees.push({
        x: hive.x + (Math.random() - 0.5) * 20,
        y: hive.y + 20 + Math.random() * 10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3,
        radius: 6,
        speed: 3.2 + Math.random() * 1.5,
        wiggle: Math.random() * Math.PI * 2
      });
    }
    AudioEngine.startBuzz();
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

  // Physics and Logic Loop
  let lastTime = performance.now();

  function update(deltaSec) {
    if (gameState === 'DEFENDING') {
      countdown -= deltaSec;
      timerBox.textContent = `${Math.max(0, countdown).toFixed(1)}s`;

      // Update line rigid body (gravity and platform collision)
      if (lineRigidBody) {
        lineRigidBody.vy += 0.35; // Gravity
        lineRigidBody.yOffset += lineRigidBody.vy;

        // Check if any point hits platform
        let restingOnSolid = false;
        lineRigidBody.points.forEach((p) => {
          const actualY = p.y + lineRigidBody.yOffset;
          platforms.forEach((plat) => {
            if (p.x >= plat.x && p.x <= plat.x + plat.w && actualY >= plat.y && actualY <= plat.y + 15) {
              restingOnSolid = true;
            }
          });
        });

        if (restingOnSolid) {
          lineRigidBody.vy = 0;
        }
      }

      // Update Bees
      bees.forEach((b) => {
        b.wiggle += 0.2;
        // Direction towards dog
        const dx = dog.x - b.x;
        const dy = dog.y - b.y;
        const dist = Math.hypot(dx, dy);

        let targetVx = (dx / dist) * b.speed + Math.sin(b.wiggle) * 1.5;
        let targetVy = (dy / dist) * b.speed + Math.cos(b.wiggle) * 1.5;

        b.vx += (targetVx - b.vx) * 0.08;
        b.vy += (targetVy - b.vy) * 0.08;

        const nextX = b.x + b.vx;
        const nextY = b.y + b.vy;

        // Collision with drawn line
        if (lineRigidBody) {
          const pts = lineRigidBody.points;
          for (let i = 0; i < pts.length - 1; i++) {
            const p1 = { x: pts[i].x, y: pts[i].y + lineRigidBody.yOffset };
            const p2 = { x: pts[i + 1].x, y: pts[i + 1].y + lineRigidBody.yOffset };
            const d = distToSegment({ x: nextX, y: nextY }, p1, p2);
            if (d < b.radius + 6) {
              // Bounce off line
              b.vx = -b.vx * 1.2 + (Math.random() - 0.5) * 3;
              b.vy = -b.vy * 1.2 + (Math.random() - 0.5) * 3;
              break;
            }
          }
        }

        b.x += b.vx;
        b.y += b.vy;

        // Test stung dog
        if (Math.hypot(b.x - dog.x, b.y - dog.y) < dog.radius + b.radius - 2) {
          dog.hurt = true;
          gameState = 'LOST';
          AudioEngine.stopBuzz();
          AudioEngine.playSting();
          toast.style.display = 'flex';
          toast.textContent = '😢 O cãozinho foi picado! Tente novamente!';
          setTimeout(() => initLevel(currentLevel), 1500);
        }
      });

      // Victory check
      if (countdown <= 0 && gameState === 'DEFENDING') {
        gameState = 'WON';
        AudioEngine.stopBuzz();
        AudioEngine.playBark();
        const TIME = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
        // Golden platform win notification
        window.parent.postMessage({ type: 'win', time: TIME }, '*');

        toast.style.display = 'flex';
        toast.textContent = '🎉 Cãozinho a salvo! Parabéns!';
        setTimeout(() => initLevel(currentLevel + 1), 1600);
      }
    }
  }

  function render() {
    const now = performance.now();
    const deltaSec = Math.min(0.1, (now - lastTime) / 1000);
    lastTime = now;

    update(deltaSec);

    ctx.clearRect(0, 0, logicalW, logicalH);

    // Decorative clouds
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.ellipse(logicalW * 0.2, 80, 50, 20, 0, 0, Math.PI * 2);
    ctx.ellipse(logicalW * 0.24, 75, 40, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(logicalW * 0.75, 110, 60, 22, 0, 0, Math.PI * 2);
    ctx.ellipse(logicalW * 0.78, 105, 45, 26, 0, 0, Math.PI * 2);
    ctx.fill();

    // Platforms
    platforms.forEach((plat) => {
      // Grass top
      ctx.fillStyle = '#65a30d';
      ctx.fillRect(plat.x, plat.y, plat.w, 10);
      // Dirt body
      ctx.fillStyle = '#78350f';
      ctx.fillRect(plat.x, plat.y + 10, plat.w, plat.h - 10);
    });

    // Hive
    ctx.save();
    ctx.translate(hive.x, hive.y);
    ctx.fillStyle = '#543310';
    ctx.fillRect(-25, -6, 50, 6);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(0, 15, 18, 12, 0, 0, Math.PI * 2);
    ctx.ellipse(0, 25, 24, 14, 0, 0, Math.PI * 2);
    ctx.ellipse(0, 36, 18, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(0, 26, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Dog
    drawDog(dog.x, dog.y, dog.radius, dog.hurt);

    // Drawn Line / Rigid Shield
    const lineToDraw = lineRigidBody ? lineRigidBody.points : currentLine;
    const yOff = lineRigidBody ? lineRigidBody.yOffset : 0;

    if (lineToDraw.length > 1) {
      ctx.save();
      // Outer border
      ctx.beginPath();
      ctx.moveTo(lineToDraw[0].x, lineToDraw[0].y + yOff);
      for (let i = 1; i < lineToDraw.length; i++) {
        ctx.lineTo(lineToDraw[i].x, lineToDraw[i].y + yOff);
      }
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Inner color
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.restore();
    }

    // Bees
    bees.forEach((b) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      // Wings
      ctx.fillStyle = 'rgba(224, 242, 254, 0.8)';
      ctx.beginPath();
      ctx.ellipse(-2, -7, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // Bee body
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(0, 0, b.radius, b.radius * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();
      // Stripes
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-2, -b.radius * 0.7, 2, b.radius * 1.4);
      ctx.fillRect(2, -b.radius * 0.7, 2, b.radius * 1.4);
      ctx.restore();
    });

    requestAnimationFrame(render);
  }

  function drawDog(x, y, radius, hurt) {
    ctx.save();
    ctx.translate(x, y);

    // Body
    ctx.fillStyle = hurt ? '#fca5a5' : '#e59844';
    ctx.beginPath();
    ctx.ellipse(0, 0, radius, radius * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#c27829';
    ctx.beginPath();
    ctx.moveTo(-radius * 0.8, -radius * 0.4);
    ctx.lineTo(-radius * 1.2, -radius * 1.1);
    ctx.lineTo(-radius * 0.3, -radius * 0.8);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(radius * 0.8, -radius * 0.4);
    ctx.lineTo(radius * 1.2, -radius * 1.1);
    ctx.lineTo(radius * 0.3, -radius * 0.8);
    ctx.fill();

    // Snout
    ctx.fillStyle = '#fff7ed';
    ctx.beginPath();
    ctx.ellipse(0, 4, radius * 0.5, radius * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.ellipse(0, 1, 4, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    if (hurt) {
      // Stung X eyes
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      [-7, 7].forEach((ex) => {
        ctx.beginPath();
        ctx.moveTo(ex - 3, -7);
        ctx.lineTo(ex + 3, -1);
        ctx.moveTo(ex + 3, -7);
        ctx.lineTo(ex - 3, -1);
        ctx.stroke();
      });
    } else {
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.arc(-8, -4, 3, 0, Math.PI * 2);
      ctx.arc(8, -4, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  document.getElementById('btn-restart').addEventListener('click', () => {
    initLevel(currentLevel);
  });

  document.getElementById('btn-sound').addEventListener('click', function () {
    AudioEngine.muted = !AudioEngine.muted;
    this.innerHTML = AudioEngine.muted ? '🔇' : '🔊';
    if (AudioEngine.muted) AudioEngine.stopBuzz();
  });

  requestAnimationFrame(render);
})();
