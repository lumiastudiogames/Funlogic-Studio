// City Parking Jam - Standalone Vanilla JS Engine
(function() {
  const LEVELS = [
    { num: 1, w: 5, h: 5, par: 3, cars: [
      { id: 'c1', t: 'sedan', x: 2, y: 0, d: 'UP', c: '#ef4444' },
      { id: 'c2', t: 'sedan', x: 0, y: 2, d: 'LEFT', c: '#3b82f6' },
      { id: 'c3', t: 'sedan', x: 2, y: 3, d: 'DOWN', c: '#10b981' }
    ]},
    { num: 2, w: 5, h: 5, par: 4, cars: [
      { id: 'c1', t: 'sedan', x: 1, y: 0, d: 'UP', c: '#f59e0b' },
      { id: 'c2', t: 'sedan', x: 3, y: 1, d: 'RIGHT', c: '#8b5cf6' },
      { id: 'c3', t: 'sedan', x: 0, y: 3, d: 'LEFT', c: '#ec4899' },
      { id: 'c4', t: 'sedan', x: 2, y: 3, d: 'DOWN', c: '#06b6d4' }
    ]},
    { num: 3, w: 5, h: 5, par: 4, cars: [
      { id: 'c1', t: 'suv', x: 1, y: 1, d: 'DOWN', c: '#3b82f6' },
      { id: 'c2', t: 'sedan', x: 3, y: 0, d: 'UP', c: '#ef4444' },
      { id: 'c3', t: 'sedan', x: 0, y: 4, d: 'LEFT', c: '#10b981' },
      { id: 'c4', t: 'suv', x: 3, y: 3, d: 'RIGHT', c: '#f97316' }
    ]},
    { num: 4, w: 5, h: 5, par: 4, obs: [{ x: 2, y: 2, t: 'cone' }], cars: [
      { id: 'c1', t: 'sedan', x: 0, y: 1, d: 'UP', c: '#8b5cf6' },
      { id: 'c2', t: 'suv', x: 3, y: 1, d: 'DOWN', c: '#ef4444' },
      { id: 'c3', t: 'sedan', x: 1, y: 3, d: 'LEFT', c: '#06b6d4' },
      { id: 'c4', t: 'sedan', x: 3, y: 3, d: 'RIGHT', c: '#10b981' }
    ]},
    { num: 5, w: 5, h: 5, par: 4, cars: [
      { id: 'v1', t: 'van', x: 0, y: 1, d: 'UP', c: '#6366f1' },
      { id: 'c2', t: 'sedan', x: 2, y: 0, d: 'RIGHT', c: '#f59e0b' },
      { id: 'c3', t: 'suv', x: 2, y: 2, d: 'RIGHT', c: '#10b981' },
      { id: 'c4', t: 'sedan', x: 1, y: 4, d: 'DOWN', c: '#ef4444' }
    ]}
  ];

  // Fill up to 30 procedural levels
  for (let i = 6; i <= 30; i++) {
    const size = i <= 10 ? 6 : i <= 20 ? 7 : 8;
    const carsCount = Math.min(14, 4 + Math.floor(i / 2));
    const cars = [];
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
    for (let c = 0; c < carsCount; c++) {
      const isVan = c % 4 === 0 && i >= 5;
      const dir = ['UP', 'DOWN', 'LEFT', 'RIGHT'][c % 4];
      const gx = (c * 2) % (size - (isVan ? 2 : 1));
      const gy = Math.floor((c * 2) / size) % (size - (isVan ? 2 : 1));
      cars.push({
        id: 'c' + c,
        t: isVan ? 'van' : (c % 2 === 0 ? 'sedan' : 'suv'),
        x: gx,
        y: gy,
        d: dir,
        c: colors[c % colors.length]
      });
    }
    LEVELS.push({ num: i, w: size, h: size, par: carsCount + 2, cars: cars });
  }

  let currentLevelIdx = 0;
  let unlockedLevel = 1;
  let moves = 0;
  let startTime = Date.now();
  let cars = [];
  let isWon = false;
  let particles = [];

  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  let dpr = 1;
  let cssW = 0;
  let cssH = 0;

  function resize() {
    const parent = canvas.parentElement.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cssW = Math.floor(parent.width);
    cssH = Math.floor(parent.height);
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize);
  setTimeout(resize, 50);

  function loadLevel(idx) {
    currentLevelIdx = Math.max(0, Math.min(LEVELS.length - 1, idx));
    const lvl = LEVELS[currentLevelIdx];
    moves = 0;
    isWon = false;
    startTime = Date.now();
    particles = [];
    document.getElementById('level-badge').innerText = 'LVL ' + lvl.num;
    document.getElementById('moves-counter').innerText = '0';

    cars = lvl.cars.map(c => ({
      id: c.id,
      type: c.t,
      length: c.t === 'van' ? 3 : 2,
      x: c.x,
      y: c.y,
      d: c.d,
      color: c.c,
      state: 'parked',
      vx: c.x,
      vy: c.y,
      bump: 0
    }));
  }

  function tryMoveCar(car) {
    if (car.state !== 'parked' || isWon) return;
    const lvl = LEVELS[currentLevelIdx];
    let blocked = false;

    for (const other of cars) {
      if (other.id === car.id || other.state === 'exited') continue;
      // Simple collision along line of sight
      if (car.d === 'UP' && other.x === car.x && other.y < car.y) blocked = true;
      if (car.d === 'DOWN' && other.x === car.x && other.y > car.y) blocked = true;
      if (car.d === 'LEFT' && other.y === car.y && other.x < car.x) blocked = true;
      if (car.d === 'RIGHT' && other.y === car.y && other.x > car.x) blocked = true;
    }

    if (blocked) {
      car.state = 'bumping';
      car.bump = 0;
    } else {
      car.state = 'moving';
      moves++;
      document.getElementById('moves-counter').innerText = moves;
    }
  }

  function update(dt) {
    for (const car of cars) {
      if (car.state === 'bumping') {
        car.bump += dt * 8;
        if (car.bump >= 1) {
          car.bump = 0;
          car.state = 'parked';
        }
      } else if (car.state === 'moving') {
        const spd = (car.type === 'sedan' ? 5 : car.type === 'suv' ? 4 : 3) * dt;
        if (car.d === 'UP') car.vy -= spd;
        if (car.d === 'DOWN') car.vy += spd;
        if (car.d === 'LEFT') car.vx -= spd;
        if (car.d === 'RIGHT') car.vx += spd;

        if (car.vx < -4 || car.vx > 12 || car.vy < -4 || car.vy > 12) {
          car.state = 'exited';
          checkWin();
        }
      }
    }
  }

  function checkWin() {
    if (isWon) return;
    if (cars.every(c => c.state === 'exited')) {
      isWon = true;
      const duration = Math.floor((Date.now() - startTime) / 1000);
      unlockedLevel = Math.max(unlockedLevel, currentLevelIdx + 2);
      
      // Post Message to parent platform
      try {
        window.parent.postMessage({ type: 'win', time: duration }, '*');
      } catch (e) {}

      setTimeout(() => {
        if (currentLevelIdx < LEVELS.length - 1) {
          loadLevel(currentLevelIdx + 1);
        } else {
          alert('Congratulations! All 30 levels completed!');
        }
      }, 500);
    }
  }

  function render() {
    if (cssW === 0 || cssH === 0) {
      requestAnimationFrame(render);
      return;
    }

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, cssW, cssH);

    const lvl = LEVELS[currentLevelIdx];
    const cs = Math.min(50, Math.floor((Math.min(cssW, cssH) - 40) / lvl.w));
    const ox = (cssW - lvl.w * cs) / 2;
    const oy = (cssH - lvl.h * cs) / 2;

    // Grid base
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(ox, oy, lvl.w * cs, lvl.h * cs);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(ox, oy, lvl.w * cs, lvl.h * cs);

    // Cars
    for (const car of cars) {
      if (car.state === 'exited') continue;
      const isH = car.d === 'LEFT' || car.d === 'RIGHT';
      const w = (isH ? car.length : 1) * cs;
      const h = (isH ? 1 : car.length) * cs;
      const px = ox + car.vx * cs;
      const py = oy + car.vy * cs;

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(px + 2, py + 4, w - 4, h - 4);

      // Body
      ctx.fillStyle = car.color;
      ctx.beginPath();
      ctx.roundRect(px + 2, py + 2, w - 4, h - 4, 6);
      ctx.fill();

      // Headlights & Forward Light Beams (Farol Ligado)
      ctx.fillStyle = '#fef08a';
      if (car.d === 'RIGHT') {
        // Headlights on right edge
        ctx.fillRect(px + w - 4, py + 4, 3, 4);
        ctx.fillRect(px + w - 4, py + h - 8, 3, 4);
        // Beams
        ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
        ctx.fillRect(px + w, py + 2, cs * 0.7, h - 4);
      } else if (car.d === 'LEFT') {
        // Headlights on left edge
        ctx.fillRect(px + 1, py + 4, 3, 4);
        ctx.fillRect(px + 1, py + h - 8, 3, 4);
        // Beams
        ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
        ctx.fillRect(px - cs * 0.7, py + 2, cs * 0.7, h - 4);
      } else if (car.d === 'DOWN') {
        // Headlights on bottom edge
        ctx.fillRect(px + 4, py + h - 4, 4, 3);
        ctx.fillRect(px + w - 8, py + h - 4, 4, 3);
        // Beams
        ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
        ctx.fillRect(px + 2, py + h, w - 4, cs * 0.7);
      } else if (car.d === 'UP') {
        // Headlights on top edge
        ctx.fillRect(px + 4, py + 1, 4, 3);
        ctx.fillRect(px + w - 8, py + 1, 4, 3);
        // Beams
        ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
        ctx.fillRect(px + 2, py - cs * 0.7, w - 4, cs * 0.7);
      }

      // Glass / Windshield
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px + w * 0.25, py + h * 0.25, w * 0.5, h * 0.5);
    }

    update(0.016);
    requestAnimationFrame(render);
  }

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const lvl = LEVELS[currentLevelIdx];
    const cs = Math.min(50, Math.floor((Math.min(cssW, cssH) - 40) / lvl.w));
    const ox = (cssW - lvl.w * cs) / 2;
    const oy = (cssH - lvl.h * cs) / 2;

    for (const car of cars) {
      if (car.state !== 'parked') continue;
      const isH = car.d === 'LEFT' || car.d === 'RIGHT';
      const w = (isH ? car.length : 1) * cs;
      const h = (isH ? 1 : car.length) * cs;
      const px = ox + car.vx * cs;
      const py = oy + car.vy * cs;

      if (mx >= px && mx <= px + w && my >= py && my <= py + h) {
        tryMoveCar(car);
        break;
      }
    }
  });

  document.getElementById('btn-play').onclick = () => {
    document.getElementById('screen-main-menu').classList.add('hidden');
    loadLevel(unlockedLevel - 1);
  };
  document.getElementById('btn-menu').onclick = () => {
    document.getElementById('screen-main-menu').classList.remove('hidden');
  };
  document.getElementById('btn-restart').onclick = () => {
    loadLevel(currentLevelIdx);
  };

  loadLevel(0);
  requestAnimationFrame(render);
})();
