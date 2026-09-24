// Clock Gears Ratio & Speed Challenge — HTML5 Puzzle Game
(function() {
  const canvas = document.getElementById('gears-canvas');
  const ctx = canvas.getContext('2d');

  let currentLevel = 1;
  let score = 0;
  let selectedGear = null;
  let isTesting = false;
  let rotationAngle = 0;
  let animationId = null;

  const levels = [
    { targetSpeed: 2, driverTeeth: 40, drivenTeeth: 20, options: [10, 20, 30] },
    { targetSpeed: 0.5, driverTeeth: 20, drivenTeeth: 40, options: [30, 40, 50] },
    { targetSpeed: 3, driverTeeth: 60, drivenTeeth: 20, options: [15, 20, 35] },
    { targetSpeed: 1.5, driverTeeth: 45, drivenTeeth: 30, options: [25, 30, 45] },
    { targetSpeed: 4, driverTeeth: 80, drivenTeeth: 20, options: [10, 20, 40] }
  ];

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    drawScene();
  }

  function drawGear(x, y, radius, teeth, angle, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.fillStyle = color;
    ctx.beginPath();
    const toothDepth = radius * 0.18;
    const baseRadius = radius - toothDepth;

    for (let i = 0; i < teeth; i++) {
      const a1 = (i / teeth) * Math.PI * 2;
      const a2 = ((i + 0.5) / teeth) * Math.PI * 2;
      const a3 = ((i + 1) / teeth) * Math.PI * 2;

      ctx.lineTo(Math.cos(a1) * baseRadius, Math.sin(a1) * baseRadius);
      ctx.lineTo(Math.cos(a1) * radius, Math.sin(a1) * radius);
      ctx.lineTo(Math.cos(a2) * radius, Math.sin(a2) * radius);
      ctx.lineTo(Math.cos(a3) * baseRadius, Math.sin(a3) * baseRadius);
    }
    ctx.closePath();
    ctx.fill();

    // Inner circle
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${teeth}T`, 0, 0);

    ctx.restore();
  }

  function drawScene() {
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    ctx.clearRect(0, 0, w, h);

    const level = levels[(currentLevel - 1) % levels.length];

    // Driver Gear (Left)
    const driverX = w * 0.25;
    const driverY = h * 0.5;
    drawGear(driverX, driverY, 55, level.driverTeeth, rotationAngle, '#38bdf8');

    // Driven Gear (Right)
    const drivenX = w * 0.75;
    const drivenY = h * 0.5;
    const gearChoice = selectedGear || level.options[0];
    const gearRatio = level.driverTeeth / gearChoice;
    const drivenAngle = -rotationAngle * gearRatio;
    drawGear(drivenX, drivenY, 55, gearChoice, drivenAngle, '#58cc02');

    // Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Driver (Motor)', driverX, driverY + 75);
    ctx.fillText('Driven (Clock)', drivenX, drivenY + 75);

    // Current Speed Display
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`Current Speed: ${gearRatio.toFixed(2)}x`, w * 0.5, h * 0.15);
  }

  function updateSelector() {
    const level = levels[(currentLevel - 1) % levels.length];
    const selector = document.getElementById('gears-selector');
    selector.innerHTML = '';

    level.options.forEach(teeth => {
      const btn = document.createElement('button');
      btn.className = `gear-choice-btn ${selectedGear === teeth ? 'selected' : ''}`;
      btn.textContent = `${teeth} Teeth`;
      btn.onclick = () => {
        if (isTesting) return;
        selectedGear = teeth;
        updateSelector();
        drawScene();
      };
      selector.appendChild(btn);
    });

    document.getElementById('current-level').textContent = currentLevel;
    document.getElementById('target-speed').textContent = `${level.targetSpeed}x`;
    document.getElementById('score-val').textContent = score;
  }

  function animate() {
    if (isTesting) {
      rotationAngle += 0.05;
      drawScene();
      animationId = requestAnimationFrame(animate);
    }
  }

  document.getElementById('btn-test').addEventListener('click', () => {
    if (isTesting) return;
    const level = levels[(currentLevel - 1) % levels.length];
    if (!selectedGear) selectedGear = level.options[0];

    isTesting = true;
    animate();

    const gearRatio = level.driverTeeth / selectedGear;
    const isCorrect = Math.abs(gearRatio - level.targetSpeed) < 0.05;

    setTimeout(() => {
      isTesting = false;
      cancelAnimationFrame(animationId);

      if (isCorrect) {
        score += 100;
        document.getElementById('instruction-text').textContent = '🎉 Perfect Ratio! Level Complete!';
        setTimeout(() => {
          currentLevel++;
          if (currentLevel > 10) {
            window.parent?.postMessage({ type: 'win', score: score }, '*');
            currentLevel = 1;
          }
          selectedGear = null;
          updateSelector();
          drawScene();
          document.getElementById('instruction-text').textContent = 'Select the gear to connect the driver to the clock hand!';
        }, 1200);
      } else {
        document.getElementById('instruction-text').textContent = '❌ Speed mismatch! Check ratio and try again.';
      }
    }, 1500);
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    isTesting = false;
    cancelAnimationFrame(animationId);
    rotationAngle = 0;
    selectedGear = null;
    updateSelector();
    drawScene();
  });

  window.addEventListener('resize', resizeCanvas);
  selectedGear = levels[0].options[0];
  updateSelector();
  resizeCanvas();
})();
