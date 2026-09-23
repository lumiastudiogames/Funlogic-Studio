// Pattern Puzzles and SVG Visual Generators
// 40 Comprehensive Logic Pattern Levels in 100% Vanilla JS

export function renderPatternSvg(item, sizeClass = '') {
  if (!item) return '';

  const {
    type = 'shape',
    shape = 'polygon',
    sides = 3,
    rotation = 0,
    color = '#2563eb',
    fill = true,
    count = 1,
    text = '',
    matrix = [],
    slices = 4,
    filledSlices = [0],
    outerSides = 4,
    innerSides = 3,
    outerColor = '#2563eb',
    innerColor = '#f59e0b',
    hours = 12,
    minutes = 0,
    domino = [1, 1],
    bars = [1, 2, 3],
  } = item;

  switch (type) {
    case 'shape':
    case 'polygon': {
      let pathHtml = '';
      if (shape === 'star') {
        // Star rendering with variable points (sides)
        const pts = sides || 5;
        let pointsStr = '';
        for (let i = 0; i < pts * 2; i++) {
          const r = i % 2 === 0 ? 36 : 18;
          const angle = (i * Math.PI) / pts - Math.PI / 2;
          const x = 50 + r * Math.cos(angle);
          const y = 50 + r * Math.sin(angle);
          pointsStr += `${x.toFixed(1)},${y.toFixed(1)} `;
        }
        pathHtml = `<polygon points="${pointsStr.trim()}" fill="${fill ? color : 'none'}" stroke="${color}" stroke-width="${fill ? '2' : '5'}" stroke-linejoin="round" />`;
      } else if (shape === 'cross') {
        pathHtml = `<path d="M38 18 H62 V38 H82 V62 H62 V82 H38 V62 H18 V38 H38 Z" fill="${fill ? color : 'none'}" stroke="${color}" stroke-width="${fill ? '2' : '5'}" stroke-linejoin="round" />`;
      } else if (shape === 'diamond') {
        pathHtml = `<polygon points="50,14 86,50 50,86 14,50" fill="${fill ? color : 'none'}" stroke="${color}" stroke-width="${fill ? '2' : '5'}" stroke-linejoin="round" />`;
      } else if (shape === 'rings') {
        const ringCount = Math.min(6, count || sides || 3);
        let ringsHtml = '';
        for (let r = 1; r <= ringCount; r++) {
          const radius = 8 + r * (30 / ringCount);
          ringsHtml += `<circle cx="50" cy="50" r="${radius.toFixed(1)}" fill="none" stroke="${color}" stroke-width="3" />`;
        }
        pathHtml = `<circle cx="50" cy="50" r="4" fill="${color}" />` + ringsHtml;
      } else if (sides === 3) {
        // Triangle
        pathHtml = `<polygon points="50,15 88,80 12,80" fill="${fill ? color : 'none'}" stroke="${color}" stroke-width="${fill ? '2' : '6'}" stroke-linejoin="round" />`;
      } else if (sides === 4) {
        // Square
        pathHtml = `<rect x="20" y="20" width="60" height="60" rx="8" fill="${fill ? color : 'none'}" stroke="${color}" stroke-width="${fill ? '2' : '6'}" />`;
      } else if (sides === 5) {
        // Pentagon
        pathHtml = `<polygon points="50,16 86,42 72,82 28,82 14,42" fill="${fill ? color : 'none'}" stroke="${color}" stroke-width="${fill ? '2' : '6'}" stroke-linejoin="round" />`;
      } else if (sides === 6) {
        // Hexagon
        pathHtml = `<polygon points="50,14 84,32 84,68 50,86 16,68 16,32" fill="${fill ? color : 'none'}" stroke="${color}" stroke-width="${fill ? '2' : '6'}" stroke-linejoin="round" />`;
      } else if (sides === 7) {
        // Heptagon
        pathHtml = `<polygon points="50,14 80,28 90,60 68,86 32,86 10,60 20,28" fill="${fill ? color : 'none'}" stroke="${color}" stroke-width="${fill ? '2' : '6'}" stroke-linejoin="round" />`;
      } else if (sides === 8) {
        // Octagon
        pathHtml = `<polygon points="32,14 68,14 86,32 86,68 68,86 32,86 14,68 14,32" fill="${fill ? color : 'none'}" stroke="${color}" stroke-width="${fill ? '2' : '6'}" stroke-linejoin="round" />`;
      } else if (sides === 10) {
        // Decagon
        pathHtml = `<polygon points="50,12 73,19 88,38 88,62 73,81 50,88 27,81 12,62 12,38 27,19" fill="${fill ? color : 'none'}" stroke="${color}" stroke-width="${fill ? '2' : '5'}" stroke-linejoin="round" />`;
      } else {
        // Circle default
        pathHtml = `<circle cx="50" cy="50" r="32" fill="${fill ? color : 'none'}" stroke="${color}" stroke-width="${fill ? '2' : '6'}" />`;
      }

      return `
        <svg viewBox="0 0 100 100" class="w-full h-full max-w-[85px] max-h-[85px] ${sizeClass}" style="transform: rotate(${rotation}deg); transition: transform 0.2s ease;">
          <defs>
            <filter id="glow-${sides}-${rotation}" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="${color}" flood-opacity="0.25" />
            </filter>
          </defs>
          <g filter="url(#glow-${sides}-${rotation})">${pathHtml}</g>
        </svg>
      `;
    }

    case 'nested': {
      // Concentric or nested shapes
      const getShapeSvg = (s, col, isOuter) => {
        const rad = isOuter ? 36 : 18;
        if (s === 3) {
          const yTop = isOuter ? 16 : 33;
          const yBot = isOuter ? 82 : 67;
          const xLeft = isOuter ? 15 : 32;
          const xRight = isOuter ? 85 : 68;
          return `<polygon points="50,${yTop} ${xRight},${yBot} ${xLeft},${yBot}" fill="${isOuter ? 'none' : col}" stroke="${col}" stroke-width="3" stroke-linejoin="round" />`;
        }
        if (s === 4) {
          const pad = isOuter ? 18 : 36;
          const sz = 100 - pad * 2;
          return `<rect x="${pad}" y="${pad}" width="${sz}" height="${sz}" rx="6" fill="${isOuter ? 'none' : col}" stroke="${col}" stroke-width="3" />`;
        }
        if (s === 6) {
          return `<polygon points="50,${isOuter ? 14 : 32} ${isOuter ? 84 : 67},${isOuter ? 32 : 41} ${isOuter ? 84 : 67},${isOuter ? 68 : 59} 50,${isOuter ? 86 : 68} ${isOuter ? 16 : 33},${isOuter ? 68 : 59} ${isOuter ? 16 : 33},${isOuter ? 32 : 41}" fill="${isOuter ? 'none' : col}" stroke="${col}" stroke-width="3" stroke-linejoin="round" />`;
        }
        return `<circle cx="50" cy="50" r="${rad}" fill="${isOuter ? 'none' : col}" stroke="${col}" stroke-width="3" />`;
      };

      return `
        <svg viewBox="0 0 100 100" class="w-full h-full max-w-[85px] max-h-[85px] ${sizeClass}">
          ${getShapeSvg(outerSides, outerColor, true)}
          ${getShapeSvg(innerSides, innerColor, false)}
        </svg>
      `;
    }

    case 'rotation': {
      return `
        <svg viewBox="0 0 100 100" class="w-full h-full max-w-[85px] max-h-[85px] ${sizeClass}" style="transform: rotate(${rotation}deg); transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
          <polygon points="50,14 78,74 50,60 22,74" fill="${color}" stroke="#0f172a" stroke-width="2" stroke-linejoin="round" />
          <circle cx="50" cy="50" r="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.5" />
        </svg>
      `;
    }

    case 'propeller': {
      return `
        <svg viewBox="0 0 100 100" class="w-full h-full max-w-[85px] max-h-[85px] ${sizeClass}" style="transform: rotate(${rotation}deg); transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
          <circle cx="50" cy="50" r="40" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" />
          <path d="M50 50 L50 16 A8 8 0 0 1 58 24 Z" fill="${color}" />
          <path d="M50 50 L79 67 A8 8 0 0 1 73 75 Z" fill="${color}" />
          <path d="M50 50 L21 67 A8 8 0 0 1 27 75 Z" fill="${color}" />
          <circle cx="50" cy="50" r="7" fill="#0f172a" />
        </svg>
      `;
    }

    case 'dots': {
      const positions = {
        1: [{ x: 50, y: 50 }],
        2: [{ x: 30, y: 50 }, { x: 70, y: 50 }],
        3: [{ x: 50, y: 25 }, { x: 30, y: 70 }, { x: 70, y: 70 }],
        4: [{ x: 30, y: 30 }, { x: 70, y: 30 }, { x: 30, y: 70 }, { x: 70, y: 70 }],
        5: [{ x: 30, y: 30 }, { x: 70, y: 30 }, { x: 50, y: 50 }, { x: 30, y: 70 }, { x: 70, y: 70 }],
        6: [{ x: 30, y: 25 }, { x: 70, y: 25 }, { x: 30, y: 50 }, { x: 70, y: 50 }, { x: 30, y: 75 }, { x: 70, y: 75 }],
        7: [{ x: 30, y: 25 }, { x: 70, y: 25 }, { x: 50, y: 37 }, { x: 50, y: 50 }, { x: 50, y: 63 }, { x: 30, y: 75 }, { x: 70, y: 75 }],
        8: [{ x: 25, y: 25 }, { x: 50, y: 25 }, { x: 75, y: 25 }, { x: 25, y: 50 }, { x: 75, y: 50 }, { x: 25, y: 75 }, { x: 50, y: 75 }, { x: 75, y: 75 }],
        9: [{ x: 25, y: 25 }, { x: 50, y: 25 }, { x: 75, y: 25 }, { x: 25, y: 50 }, { x: 50, y: 50 }, { x: 75, y: 50 }, { x: 25, y: 75 }, { x: 50, y: 75 }, { x: 75, y: 75 }],
        10: [
          { x: 50, y: 18 },
          { x: 38, y: 34 }, { x: 62, y: 34 },
          { x: 28, y: 54 }, { x: 50, y: 54 }, { x: 72, y: 54 },
          { x: 20, y: 76 }, { x: 40, y: 76 }, { x: 60, y: 76 }, { x: 80, y: 76 }
        ],
        12: [
          { x: 25, y: 20 }, { x: 50, y: 20 }, { x: 75, y: 20 },
          { x: 25, y: 40 }, { x: 50, y: 40 }, { x: 75, y: 40 },
          { x: 25, y: 60 }, { x: 50, y: 60 }, { x: 75, y: 60 },
          { x: 25, y: 80 }, { x: 50, y: 80 }, { x: 75, y: 80 }
        ],
        15: [
          { x: 50, y: 15 },
          { x: 42, y: 30 }, { x: 58, y: 30 },
          { x: 34, y: 48 }, { x: 50, y: 48 }, { x: 66, y: 48 },
          { x: 26, y: 66 }, { x: 42, y: 66 }, { x: 58, y: 66 }, { x: 74, y: 66 },
          { x: 18, y: 84 }, { x: 34, y: 84 }, { x: 50, y: 84 }, { x: 66, y: 84 }, { x: 82, y: 84 }
        ]
      };

      const dotCoords = positions[count] || [{ x: 50, y: 50 }];
      const dotRadius = count > 9 ? 4.5 : count > 6 ? 6 : 7.5;

      return `
        <svg viewBox="0 0 100 100" class="w-full h-full max-w-[85px] max-h-[85px] ${sizeClass}">
          <rect x="10" y="10" width="80" height="80" rx="14" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
          ${dotCoords.map(d => `<circle cx="${d.x}" cy="${d.y}" r="${dotRadius}" fill="${color}" stroke="#0f172a" stroke-width="1.2" />`).join('')}
        </svg>
      `;
    }

    case 'number': {
      return `
        <div class="w-full h-full flex flex-col items-center justify-center p-1">
          <span class="font-black text-2xl sm:text-3xl text-slate-900 font-heading tracking-tight" style="color: ${color}">
            ${text}
          </span>
        </div>
      `;
    }

    case 'matrix': {
      if (matrix.length === 9) {
        // 3x3 Grid
        let cells = '';
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const idx = r * 3 + c;
            const isLit = matrix[idx];
            const x = 16 + c * 24;
            const y = 16 + r * 24;
            cells += `<rect x="${x}" y="${y}" width="20" height="20" rx="4" fill="${isLit ? color : '#ffffff'}" stroke="${isLit ? '#0f172a' : '#e2e8f0'}" stroke-width="1" />`;
          }
        }
        return `
          <svg viewBox="0 0 100 100" class="w-full h-full max-w-[85px] max-h-[85px] ${sizeClass}">
            <rect x="10" y="10" width="80" height="80" rx="10" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2" />
            ${cells}
          </svg>
        `;
      }

      // 2x2 Grid Default
      const grid = matrix.length === 4 ? matrix : [1, 0, 0, 1];
      return `
        <svg viewBox="0 0 100 100" class="w-full h-full max-w-[85px] max-h-[85px] ${sizeClass}">
          <rect x="12" y="12" width="76" height="76" rx="10" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2" />
          <line x1="50" y1="12" x2="50" y2="88" stroke="#cbd5e1" stroke-width="2" />
          <line x1="12" y1="50" x2="88" y2="50" stroke="#cbd5e1" stroke-width="2" />
          <rect x="18" y="18" width="26" height="26" rx="4" fill="${grid[0] ? color : '#ffffff'}" stroke="${grid[0] ? '#0f172a' : '#e2e8f0'}" stroke-width="1" />
          <rect x="56" y="18" width="26" height="26" rx="4" fill="${grid[1] ? color : '#ffffff'}" stroke="${grid[1] ? '#0f172a' : '#e2e8f0'}" stroke-width="1" />
          <rect x="18" y="56" width="26" height="26" rx="4" fill="${grid[2] ? color : '#ffffff'}" stroke="${grid[2] ? '#0f172a' : '#e2e8f0'}" stroke-width="1" />
          <rect x="56" y="56" width="26" height="26" rx="4" fill="${grid[3] ? color : '#ffffff'}" stroke="${grid[3] ? '#0f172a' : '#e2e8f0'}" stroke-width="1" />
        </svg>
      `;
    }

    case 'pie': {
      const sliceCount = slices || 4;
      const filled = Array.isArray(filledSlices) ? filledSlices : [0];
      let paths = '';
      for (let i = 0; i < sliceCount; i++) {
        const startAngle = (i * 2 * Math.PI) / sliceCount - Math.PI / 2;
        const endAngle = ((i + 1) * 2 * Math.PI) / sliceCount - Math.PI / 2;
        const x1 = 50 + 36 * Math.cos(startAngle);
        const y1 = 50 + 36 * Math.sin(startAngle);
        const x2 = 50 + 36 * Math.cos(endAngle);
        const y2 = 50 + 36 * Math.sin(endAngle);
        const isFilled = filled.includes(i);
        paths += `<path d="M50 50 L${x1.toFixed(1)} ${y1.toFixed(1)} A36 36 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="${isFilled ? color : '#ffffff'}" stroke="#0f172a" stroke-width="1.5" />`;
      }
      return `
        <svg viewBox="0 0 100 100" class="w-full h-full max-w-[85px] max-h-[85px] ${sizeClass}">
          <circle cx="50" cy="50" r="37" fill="#f8fafc" stroke="#94a3b8" stroke-width="2" />
          ${paths}
        </svg>
      `;
    }

    case 'clock': {
      const hrAngle = ((hours % 12) + minutes / 60) * 30 - 90;
      const minAngle = minutes * 6 - 90;
      const hrX = 50 + 20 * Math.cos((hrAngle * Math.PI) / 180);
      const hrY = 50 + 20 * Math.sin((hrAngle * Math.PI) / 180);
      const minX = 50 + 28 * Math.cos((minAngle * Math.PI) / 180);
      const minY = 50 + 28 * Math.sin((minAngle * Math.PI) / 180);

      return `
        <svg viewBox="0 0 100 100" class="w-full h-full max-w-[85px] max-h-[85px] ${sizeClass}">
          <circle cx="50" cy="50" r="38" fill="#ffffff" stroke="#0f172a" stroke-width="3" />
          <circle cx="50" cy="18" r="2" fill="#64748b" />
          <circle cx="82" cy="50" r="2" fill="#64748b" />
          <circle cx="50" cy="82" r="2" fill="#64748b" />
          <circle cx="18" cy="50" r="2" fill="#64748b" />
          <line x1="50" y1="50" x2="${hrX.toFixed(1)}" y2="${hrY.toFixed(1)}" stroke="${color}" stroke-width="4" stroke-linecap="round" />
          <line x1="50" y1="50" x2="${minX.toFixed(1)}" y2="${minY.toFixed(1)}" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" />
          <circle cx="50" cy="50" r="4" fill="${color}" />
        </svg>
      `;
    }

    case 'domino': {
      const topCount = domino[0] || 1;
      const botCount = domino[1] || 1;
      const getPips = (c, offsetY) => {
        const coords = {
          1: [{ x: 50, y: offsetY + 15 }],
          2: [{ x: 36, y: offsetY + 9 }, { x: 64, y: offsetY + 21 }],
          3: [{ x: 36, y: offsetY + 9 }, { x: 50, y: offsetY + 15 }, { x: 64, y: offsetY + 21 }],
          4: [{ x: 36, y: offsetY + 9 }, { x: 64, y: offsetY + 9 }, { x: 36, y: offsetY + 21 }, { x: 64, y: offsetY + 21 }],
          5: [{ x: 36, y: offsetY + 9 }, { x: 64, y: offsetY + 9 }, { x: 50, y: offsetY + 15 }, { x: 36, y: offsetY + 21 }, { x: 64, y: offsetY + 21 }],
          6: [{ x: 36, y: offsetY + 8 }, { x: 64, y: offsetY + 8 }, { x: 36, y: offsetY + 15 }, { x: 64, y: offsetY + 15 }, { x: 36, y: offsetY + 22 }, { x: 64, y: offsetY + 22 }],
        };
        const pList = coords[c] || [{ x: 50, y: offsetY + 15 }];
        return pList.map(p => `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="${color}" />`).join('');
      };

      return `
        <svg viewBox="0 0 100 100" class="w-full h-full max-w-[85px] max-h-[85px] ${sizeClass}">
          <rect x="24" y="12" width="52" height="76" rx="8" fill="#ffffff" stroke="#0f172a" stroke-width="2" />
          <line x1="24" y1="50" x2="76" y2="50" stroke="#cbd5e1" stroke-width="2" />
          ${getPips(topCount, 16)}
          ${getPips(botCount, 48)}
        </svg>
      `;
    }

    case 'bars': {
      const barHeights = bars || [1, 2, 3];
      const countB = barHeights.length;
      const width = Math.max(8, Math.floor(60 / countB - 4));
      let barsHtml = '';
      barHeights.forEach((h, i) => {
        const x = 20 + i * (width + 4);
        const bh = Math.min(60, h * 12);
        const y = 80 - bh;
        barsHtml += `<rect x="${x}" y="${y}" width="${width}" height="${bh}" rx="3" fill="${color}" stroke="#0f172a" stroke-width="1.5" />`;
      });
      return `
        <svg viewBox="0 0 100 100" class="w-full h-full max-w-[85px] max-h-[85px] ${sizeClass}">
          <rect x="10" y="10" width="80" height="80" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" />
          <line x1="16" y1="80" x2="84" y2="80" stroke="#64748b" stroke-width="2" />
          ${barsHtml}
        </svg>
      `;
    }

    default:
      return `<div class="font-bold text-slate-400">?</div>`;
  }
}

// 40 FULLY CRAFTED LOGIC PATTERN PUZZLE LEVELS
export const PUZZLES = [
  // SECTION 1: GEOMETRIC POLYGONS & TOPOLOGY (Levels 1 - 6)
  {
    id: 1,
    seriesName: 'Polygon Sides Series',
    category: 'geometric',
    difficulty: 'easy',
    prompt: 'Count the number of vertices and sides in the sequence.',
    clue: 'Each shape adds exactly one new edge (3 sides → 4 sides → 5 sides → 6 sides).',
    ruleDescription: 'The series progresses by adding 1 side per step: Triangle (3), Square (4), Pentagon (5), Hexagon (6) → Heptagon (7 sides).',
    sequence: [
      { type: 'polygon', sides: 3, color: '#2563eb', fill: true },
      { type: 'polygon', sides: 4, color: '#2563eb', fill: true },
      { type: 'polygon', sides: 5, color: '#2563eb', fill: true },
      { type: 'polygon', sides: 6, color: '#2563eb', fill: true },
    ],
    correctOptionId: 'B',
    options: [
      { id: 'A', label: 'Octagon (8 Sides)', explanation: 'Skips the 7-sided step in the linear series.', item: { type: 'polygon', sides: 8, color: '#2563eb', fill: true } },
      { id: 'B', label: 'Heptagon (7 Sides)', explanation: 'Follows the +1 edge linear progression directly.', item: { type: 'polygon', sides: 7, color: '#2563eb', fill: true } },
      { id: 'C', label: 'Circle', explanation: 'Does not follow the polygon edge count sequence.', item: { type: 'shape', sides: 0, color: '#2563eb', fill: true } },
      { id: 'D', label: 'Pentagon (5 Sides)', explanation: 'Step 3 repetition rather than sequence continuation.', item: { type: 'polygon', sides: 5, color: '#2563eb', fill: true } },
    ],
  },
  {
    id: 2,
    seriesName: 'Star Vertices Progression',
    category: 'geometric',
    difficulty: 'easy',
    prompt: 'Count the number of points on each celestial star.',
    clue: 'Notice the points: 3-point → 4-point → 5-point → 6-point...',
    ruleDescription: 'The star vertices increase by +1 at every step: 3, 4, 5, 6 → 7-point star.',
    sequence: [
      { type: 'shape', shape: 'star', sides: 3, color: '#f59e0b', fill: true },
      { type: 'shape', shape: 'star', sides: 4, color: '#f59e0b', fill: true },
      { type: 'shape', shape: 'star', sides: 5, color: '#f59e0b', fill: true },
      { type: 'shape', shape: 'star', sides: 6, color: '#f59e0b', fill: true },
    ],
    correctOptionId: 'A',
    options: [
      { id: 'A', label: '7-Point Star', explanation: 'Adds 1 point to the 6-point star (6 + 1 = 7).', item: { type: 'shape', shape: 'star', sides: 7, color: '#f59e0b', fill: true } },
      { id: 'B', label: '8-Point Star', explanation: 'Skips the 7-point step.', item: { type: 'shape', shape: 'star', sides: 8, color: '#f59e0b', fill: true } },
      { id: 'C', label: '5-Point Star', explanation: 'Previous step repeated.', item: { type: 'shape', shape: 'star', sides: 5, color: '#f59e0b', fill: true } },
      { id: 'D', label: 'Square Star', explanation: '4-point star from earlier in sequence.', item: { type: 'shape', shape: 'star', sides: 4, color: '#f59e0b', fill: true } },
    ],
  },
  {
    id: 3,
    seriesName: 'Concentric Ring Expansion',
    category: 'geometric',
    difficulty: 'easy',
    prompt: 'Observe the number of concentric rings expanding outward.',
    clue: '1 ring → 2 rings → 3 rings → 4 rings...',
    ruleDescription: 'Concentric circles increase by 1 ripple per step: 1, 2, 3, 4 → 5 rings.',
    sequence: [
      { type: 'shape', shape: 'rings', count: 1, color: '#06b6d4' },
      { type: 'shape', shape: 'rings', count: 2, color: '#06b6d4' },
      { type: 'shape', shape: 'rings', count: 3, color: '#06b6d4' },
      { type: 'shape', shape: 'rings', count: 4, color: '#06b6d4' },
    ],
    correctOptionId: 'C',
    options: [
      { id: 'A', label: '3 Rings', explanation: 'Decreases rather than expands.', item: { type: 'shape', shape: 'rings', count: 3, color: '#06b6d4' } },
      { id: 'B', label: '6 Rings', explanation: 'Skips the 5-ring step.', item: { type: 'shape', shape: 'rings', count: 6, color: '#06b6d4' } },
      { id: 'C', label: '5 Rings', explanation: 'Next linear increment in the ring series (4 + 1 = 5).', item: { type: 'shape', shape: 'rings', count: 5, color: '#06b6d4' } },
      { id: 'D', label: 'Solid Circle', explanation: 'Breaks the concentric rings format.', item: { type: 'shape', sides: 0, color: '#06b6d4', fill: true } },
    ],
  },
  {
    id: 4,
    seriesName: 'Hollow to Solid Phase Oscillation',
    category: 'geometric',
    difficulty: 'easy',
    prompt: 'Track the alternating fill pattern and shape evolution.',
    clue: 'Outlined Triangle → Solid Square → Outlined Pentagon → Solid Hexagon...',
    ruleDescription: 'Two combined rules: 1) Sides increase by +1 (3, 4, 5, 6 → 7), and 2) Fill alternates (Hollow, Solid, Hollow, Solid → Hollow).',
    sequence: [
      { type: 'polygon', sides: 3, fill: false, color: '#8b5cf6' },
      { type: 'polygon', sides: 4, fill: true, color: '#8b5cf6' },
      { type: 'polygon', sides: 5, fill: false, color: '#8b5cf6' },
      { type: 'polygon', sides: 6, fill: true, color: '#8b5cf6' },
    ],
    correctOptionId: 'D',
    options: [
      { id: 'A', label: 'Solid Heptagon (7 Sides)', explanation: 'Wrong fill state; solid was step 4.', item: { type: 'polygon', sides: 7, fill: true, color: '#8b5cf6' } },
      { id: 'B', label: 'Hollow Hexagon (6 Sides)', explanation: 'Repeats 6 sides instead of advancing to 7.', item: { type: 'polygon', sides: 6, fill: false, color: '#8b5cf6' } },
      { id: 'C', label: 'Solid Octagon (8 Sides)', explanation: 'Skips 7 sides and has incorrect solid fill.', item: { type: 'polygon', sides: 8, fill: true, color: '#8b5cf6' } },
      { id: 'D', label: 'Hollow Heptagon (7 Sides)', explanation: 'Correctly increments to 7 sides and switches to hollow outline.', item: { type: 'polygon', sides: 7, fill: false, color: '#8b5cf6' } },
    ],
  },
  {
    id: 5,
    seriesName: 'Nested Shape Hierarchy',
    category: 'geometric',
    difficulty: 'medium',
    prompt: 'Track the relationship between the outer boundary and inner shape.',
    clue: 'Outer: 3 sides, Inner: 4 sides → Outer: 4, Inner: 5 → Outer: 5, Inner: 6...',
    ruleDescription: 'Inner shape has exactly 1 more edge than the outer shape. Progression: (3 outer / 4 inner), (4/5), (5/6), (6/7) → (7 outer / 8 inner).',
    sequence: [
      { type: 'nested', outerSides: 3, innerSides: 4, outerColor: '#2563eb', innerColor: '#ef4444' },
      { type: 'nested', outerSides: 4, innerSides: 5, outerColor: '#2563eb', innerColor: '#ef4444' },
      { type: 'nested', outerSides: 5, innerSides: 6, outerColor: '#2563eb', innerColor: '#ef4444' },
      { type: 'nested', outerSides: 6, innerSides: 4, outerColor: '#2563eb', innerColor: '#ef4444' },
    ],
    correctOptionId: 'B',
    options: [
      { id: 'A', label: 'Square inside Triangle', explanation: 'Reverses the outer sequence.', item: { type: 'nested', outerSides: 3, innerSides: 4, outerColor: '#2563eb', innerColor: '#ef4444' } },
      { id: 'B', label: 'Circle inside Hexagon', explanation: 'Consistent continuation of layered geometry.', item: { type: 'nested', outerSides: 6, innerSides: 0, outerColor: '#2563eb', innerColor: '#ef4444' } },
      { id: 'C', label: 'Triangle inside Square', explanation: 'Step 1 arrangement inverted.', item: { type: 'nested', outerSides: 4, innerSides: 3, outerColor: '#2563eb', innerColor: '#ef4444' } },
      { id: 'D', label: 'Double Circle', explanation: 'Lacks polygon boundary structure.', item: { type: 'nested', outerSides: 0, innerSides: 0, outerColor: '#2563eb', innerColor: '#ef4444' } },
    ],
  },
  {
    id: 6,
    seriesName: 'Geometric Cross & Diamond Swap',
    category: 'geometric',
    difficulty: 'easy',
    prompt: 'Identify the alternating shape pattern.',
    clue: 'Cross ✚ → Diamond ◆ → Cross ✚ → Diamond ◆...',
    ruleDescription: 'Strict alternating parity: Cross, Diamond, Cross, Diamond → Cross ✚.',
    sequence: [
      { type: 'shape', shape: 'cross', color: '#10b981', fill: true },
      { type: 'shape', shape: 'diamond', color: '#10b981', fill: true },
      { type: 'shape', shape: 'cross', color: '#10b981', fill: true },
      { type: 'shape', shape: 'diamond', color: '#10b981', fill: true },
    ],
    correctOptionId: 'A',
    options: [
      { id: 'A', label: 'Green Cross', explanation: 'Continues the alternating shape sequence correctly.', item: { type: 'shape', shape: 'cross', color: '#10b981', fill: true } },
      { id: 'B', label: 'Green Diamond', explanation: 'Consecutive duplicate of step 4.', item: { type: 'shape', shape: 'diamond', color: '#10b981', fill: true } },
      { id: 'C', label: 'Green Square', explanation: 'Introduces an unrequested new polygon.', item: { type: 'polygon', sides: 4, color: '#10b981', fill: true } },
      { id: 'D', label: 'Green Circle', explanation: 'Breaks the cross-diamond cycle.', item: { type: 'shape', sides: 0, color: '#10b981', fill: true } },
    ],
  },

  // SECTION 2: ROTATIONAL & SPATIAL ANGULAR PHYSICS (Levels 7 - 12)
  {
    id: 7,
    seriesName: 'Arrow 90° Clockwise Rotation',
    category: 'rotational',
    difficulty: 'easy',
    prompt: 'Observe the angular progression of the pointer.',
    clue: 'The arrow rotates clockwise by 90° at each stage: Up → Right → Down → Left...',
    ruleDescription: 'Clockwise rotation: 0° (Up) → 90° (Right) → 180° (Down) → 270° (Left) → 360° / 0° (Up).',
    sequence: [
      { type: 'rotation', rotation: 0, color: '#6366f1' },
      { type: 'rotation', rotation: 90, color: '#6366f1' },
      { type: 'rotation', rotation: 180, color: '#6366f1' },
      { type: 'rotation', rotation: 270, color: '#6366f1' },
    ],
    correctOptionId: 'A',
    options: [
      { id: 'A', label: 'Arrow Facing Up (0°)', explanation: 'Completes the full 360-degree rotational cycle.', item: { type: 'rotation', rotation: 0, color: '#6366f1' } },
      { id: 'B', label: 'Arrow Facing Down (180°)', explanation: 'Opposite of the expected 90° clockwise increment.', item: { type: 'rotation', rotation: 180, color: '#6366f1' } },
      { id: 'C', label: 'Arrow Facing Right (90°)', explanation: 'Step 2 repetition.', item: { type: 'rotation', rotation: 90, color: '#6366f1' } },
      { id: 'D', label: 'Arrow Facing Diagonal (45°)', explanation: 'Does not match the 90° cardinal step angle.', item: { type: 'rotation', rotation: 45, color: '#6366f1' } },
    ],
  },
  {
    id: 8,
    seriesName: 'Compass 45° Octant Progression',
    category: 'rotational',
    difficulty: 'medium',
    prompt: 'Track the fine 45-degree angle increments.',
    clue: '0° (North) → 45° (North-East) → 90° (East) → 135° (South-East)...',
    ruleDescription: 'Each step adds 45° clockwise: 0° → 45° → 90° → 135° → 180° (South / Down).',
    sequence: [
      { type: 'rotation', rotation: 0, color: '#0284c7' },
      { type: 'rotation', rotation: 45, color: '#0284c7' },
      { type: 'rotation', rotation: 90, color: '#0284c7' },
      { type: 'rotation', rotation: 135, color: '#0284c7' },
    ],
    correctOptionId: 'C',
    options: [
      { id: 'A', label: '225° (South-West)', explanation: 'Skips the 180° South step.', item: { type: 'rotation', rotation: 225, color: '#0284c7' } },
      { id: 'B', label: '0° (North)', explanation: 'Resets prematurely.', item: { type: 'rotation', rotation: 0, color: '#0284c7' } },
      { id: 'C', label: '180° (South / Down)', explanation: 'Next 45° addition: 135° + 45° = 180°.', item: { type: 'rotation', rotation: 180, color: '#0284c7' } },
      { id: 'D', label: '90° (East)', explanation: 'Repeats step 3.', item: { type: 'rotation', rotation: 90, color: '#0284c7' } },
    ],
  },
  {
    id: 9,
    seriesName: 'Counter-Clockwise 90° Turn',
    category: 'rotational',
    difficulty: 'medium',
    prompt: 'Determine the direction and speed of rotation.',
    clue: 'Up (0°) → Left (270°) → Down (180°) → Right (90°)...',
    ruleDescription: 'The pointer turns counter-clockwise by 90° (-90°) each step: 0° → 270° → 180° → 90° → 0° (Up).',
    sequence: [
      { type: 'rotation', rotation: 0, color: '#ec4899' },
      { type: 'rotation', rotation: 270, color: '#ec4899' },
      { type: 'rotation', rotation: 180, color: '#ec4899' },
      { type: 'rotation', rotation: 90, color: '#ec4899' },
    ],
    correctOptionId: 'B',
    options: [
      { id: 'A', label: 'Facing Down (180°)', explanation: 'Step 3 position.', item: { type: 'rotation', rotation: 180, color: '#ec4899' } },
      { id: 'B', label: 'Facing Up (0° / 360°)', explanation: 'Completes the counter-clockwise rotation loop back to Up.', item: { type: 'rotation', rotation: 0, color: '#ec4899' } },
      { id: 'C', label: 'Facing Left (270°)', explanation: 'Skips one turn forward.', item: { type: 'rotation', rotation: 270, color: '#ec4899' } },
      { id: 'D', label: 'Diagonal 45°', explanation: 'Wrong rotational resolution.', item: { type: 'rotation', rotation: 45, color: '#ec4899' } },
    ],
  },
  {
    id: 10,
    seriesName: 'Propeller 60° Tri-Blade Spin',
    category: 'rotational',
    difficulty: 'hard',
    prompt: 'Track the 3-blade propeller as it spins on its axis.',
    clue: 'Rotation increments by 60°: 0° → 60° → 120° → 180°...',
    ruleDescription: '60° angular increment: 0° → 60° → 120° → 180° → 240°.',
    sequence: [
      { type: 'propeller', rotation: 0, color: '#3b82f6' },
      { type: 'propeller', rotation: 60, color: '#3b82f6' },
      { type: 'propeller', rotation: 120, color: '#3b82f6' },
      { type: 'propeller', rotation: 180, color: '#3b82f6' },
    ],
    correctOptionId: 'D',
    options: [
      { id: 'A', label: '0° Propeller', explanation: 'Only reached after 360°.', item: { type: 'propeller', rotation: 0, color: '#3b82f6' } },
      { id: 'B', label: '300° Propeller', explanation: 'Skips the 240° step.', item: { type: 'propeller', rotation: 300, color: '#3b82f6' } },
      { id: 'C', label: '90° Propeller', explanation: 'Does not fit the 60° step series.', item: { type: 'propeller', rotation: 90, color: '#3b82f6' } },
      { id: 'D', label: '240° Propeller', explanation: '180° + 60° = 240°. Exact angular match.', item: { type: 'propeller', rotation: 240, color: '#3b82f6' } },
    ],
  },
  {
    id: 11,
    seriesName: 'Pendulum Harmonic Swing',
    category: 'rotational',
    difficulty: 'medium',
    prompt: 'Identify the oscillation pattern of the swinging arm.',
    clue: 'Left (-45°) → Center (0°) → Right (45°) → Center (0°)...',
    ruleDescription: 'Harmonic pendulum motion oscillates back and forth: -45° → 0° → +45° → 0° → -45° (Left).',
    sequence: [
      { type: 'rotation', rotation: 315, color: '#8b5cf6' }, // -45deg
      { type: 'rotation', rotation: 0, color: '#8b5cf6' },
      { type: 'rotation', rotation: 45, color: '#8b5cf6' },
      { type: 'rotation', rotation: 0, color: '#8b5cf6' },
    ],
    correctOptionId: 'A',
    options: [
      { id: 'A', label: 'Swinging Left (-45° / 315°)', explanation: 'Swings back to the left side after passing center.', item: { type: 'rotation', rotation: 315, color: '#8b5cf6' } },
      { id: 'B', label: 'Swinging Right (+45°)', explanation: 'Would repeat rightward swing without completing left cycle.', item: { type: 'rotation', rotation: 45, color: '#8b5cf6' } },
      { id: 'C', label: 'Pointing Down (180°)', explanation: 'Breaks the pendulum arc.', item: { type: 'rotation', rotation: 180, color: '#8b5cf6' } },
      { id: 'D', label: 'Still at Center (0°)', explanation: 'Repeats center position twice in a row.', item: { type: 'rotation', rotation: 0, color: '#8b5cf6' } },
    ],
  },
  {
    id: 12,
    seriesName: 'Dual Accelerating Rotation',
    category: 'rotational',
    difficulty: 'hard',
    prompt: 'Examine the increasing rotational acceleration.',
    clue: 'Delta angles: +30° → +60° → +90° → +120°...',
    ruleDescription: 'Angles increase with an accelerating step: 0° (+30°) → 30° (+60°) → 90° (+90°) → 180° (+120°) → 300°.',
    sequence: [
      { type: 'rotation', rotation: 0, color: '#d97706' },
      { type: 'rotation', rotation: 30, color: '#d97706' },
      { type: 'rotation', rotation: 90, color: '#d97706' },
      { type: 'rotation', rotation: 180, color: '#d97706' },
    ],
    correctOptionId: 'C',
    options: [
      { id: 'A', label: '270° Pointer', explanation: 'Linear +90° assumption instead of +120° acceleration.', item: { type: 'rotation', rotation: 270, color: '#d97706' } },
      { id: 'B', label: '240° Pointer', explanation: 'Only +60° addition.', item: { type: 'rotation', rotation: 240, color: '#d97706' } },
      { id: 'C', label: '300° Pointer', explanation: '180° + 120° = 300°. Follows triangular angle acceleration.', item: { type: 'rotation', rotation: 300, color: '#d97706' } },
      { id: 'D', label: '360° / 0° Pointer', explanation: 'Too large an angle jump.', item: { type: 'rotation', rotation: 0, color: '#d97706' } },
    ],
  },

  // SECTION 3: NUMERIC SEQUENCES & ARITHMETIC LOGIC (Levels 13 - 18)
  {
    id: 13,
    seriesName: 'Prime Number Sequence',
    category: 'numeric',
    difficulty: 'medium',
    prompt: 'Identify the mathematical sequence of non-composite numbers.',
    clue: 'Prime numbers divisible only by 1 and themselves: 2, 3, 5, 7...',
    ruleDescription: 'Consecutive prime numbers: 2, 3, 5, 7 → 11 (next prime after 7).',
    sequence: [
      { type: 'number', text: '2', color: '#059669' },
      { type: 'number', text: '3', color: '#059669' },
      { type: 'number', text: '5', color: '#059669' },
      { type: 'number', text: '7', color: '#059669' },
    ],
    correctOptionId: 'B',
    options: [
      { id: 'A', label: '9', explanation: 'Composite number (3 x 3 = 9), not prime.', item: { type: 'number', text: '9', color: '#059669' } },
      { id: 'B', label: '11', explanation: 'The 5th prime number following 2, 3, 5, 7.', item: { type: 'number', text: '11', color: '#059669' } },
      { id: 'C', label: '8', explanation: 'Even number (divisible by 2 and 4).', item: { type: 'number', text: '8', color: '#059669' } },
      { id: 'D', label: '10', explanation: 'Composite number (2 x 5 = 10).', item: { type: 'number', text: '10', color: '#059669' } },
    ],
  },
  {
    id: 14,
    seriesName: 'Quadratic Power Series (n²)',
    category: 'numeric',
    difficulty: 'medium',
    prompt: 'Discover the underlying square mathematical function.',
    clue: 'Square values: 1² = 1, 2² = 4, 3² = 9, 4² = 16...',
    ruleDescription: 'Formula n² for n = 1, 2, 3, 4, 5. Sequence: 1, 4, 9, 16 → 25.',
    sequence: [
      { type: 'number', text: '1', color: '#d97706' },
      { type: 'number', text: '4', color: '#d97706' },
      { type: 'number', text: '9', color: '#d97706' },
      { type: 'number', text: '16', color: '#d97706' },
    ],
    correctOptionId: 'D',
    options: [
      { id: 'A', label: '20', explanation: 'Arithmetic +4 addition rather than 5².', item: { type: 'number', text: '20', color: '#d97706' } },
      { id: 'B', label: '24', explanation: 'Off by 1 from square.', item: { type: 'number', text: '24', color: '#d97706' } },
      { id: 'C', label: '32', explanation: 'Doubling pattern rather than squares.', item: { type: 'number', text: '32', color: '#d97706' } },
      { id: 'D', label: '25', explanation: '5² = 25. Exactly continues the n² sequence.', item: { type: 'number', text: '25', color: '#d97706' } },
    ],
  },
  {
    id: 15,
    seriesName: 'Fibonacci Recurrence Sums',
    category: 'numeric',
    difficulty: 'medium',
    prompt: 'Sum the two preceding numbers to find the next value.',
    clue: '1+1=2, 1+2=3, 2+3=5, 3+5=8...',
    ruleDescription: 'Fibonacci recurrence: F(n) = F(n-1) + F(n-2). Sequence: 1, 2, 3, 5, 8 → 13 (5 + 8 = 13).',
    sequence: [
      { type: 'number', text: '2', color: '#8b5cf6' },
      { type: 'number', text: '3', color: '#8b5cf6' },
      { type: 'number', text: '5', color: '#8b5cf6' },
      { type: 'number', text: '8', color: '#8b5cf6' },
    ],
    correctOptionId: 'A',
    options: [
      { id: 'A', label: '13 (5 + 8)', explanation: 'Sum of previous two numbers: 5 + 8 = 13.', item: { type: 'number', text: '13', color: '#8b5cf6' } },
      { id: 'B', label: '11', explanation: 'Prime sequence confusion.', item: { type: 'number', text: '11', color: '#8b5cf6' } },
      { id: 'C', label: '16', explanation: 'Doubling 8 instead of Fibonacci sum.', item: { type: 'number', text: '16', color: '#8b5cf6' } },
      { id: 'D', label: '12', explanation: 'Arithmetic +4 addition.', item: { type: 'number', text: '12', color: '#8b5cf6' } },
    ],
  },
  {
    id: 16,
    seriesName: 'Binary Power Doubling (2ⁿ)',
    category: 'numeric',
    difficulty: 'easy',
    prompt: 'Determine the exponential binary multiplication.',
    clue: 'Multiply by 2 at each step: 2 → 4 → 8 → 16...',
    ruleDescription: 'Exponential doubling 2ⁿ: 2, 4, 8, 16 → 32 (16 x 2 = 32).',
    sequence: [
      { type: 'number', text: '2', color: '#ef4444' },
      { type: 'number', text: '4', color: '#ef4444' },
      { type: 'number', text: '8', color: '#ef4444' },
      { type: 'number', text: '16', color: '#ef4444' },
    ],
    correctOptionId: 'B',
    options: [
      { id: 'A', label: '24', explanation: 'Addition of 8 instead of multiplication by 2.', item: { type: 'number', text: '24', color: '#ef4444' } },
      { id: 'B', label: '32', explanation: '16 x 2 = 32. Direct binary exponential doubling.', item: { type: 'number', text: '32', color: '#ef4444' } },
      { id: 'C', label: '64', explanation: 'Skips one power of 2.', item: { type: 'number', text: '64', color: '#ef4444' } },
      { id: 'D', label: '20', explanation: 'Addition of 4.', item: { type: 'number', text: '20', color: '#ef4444' } },
    ],
  },
  {
    id: 17,
    seriesName: 'Triangular Numbers Accumulation',
    category: 'numeric',
    difficulty: 'hard',
    prompt: 'Analyze the step-wise increasing additions.',
    clue: '+2, +3, +4, +5... (1 + 2 = 3, 3 + 3 = 6, 6 + 4 = 10...)',
    ruleDescription: 'Triangular numbers T(n) = n(n+1)/2: 1 (+2) → 3 (+3) → 6 (+4) → 10 (+5) → 15.',
    sequence: [
      { type: 'number', text: '1', color: '#0284c7' },
      { type: 'number', text: '3', color: '#0284c7' },
      { type: 'number', text: '6', color: '#0284c7' },
      { type: 'number', text: '10', color: '#0284c7' },
    ],
    correctOptionId: 'C',
    options: [
      { id: 'A', label: '14', explanation: 'Only adds 4.', item: { type: 'number', text: '14', color: '#0284c7' } },
      { id: 'B', label: '20', explanation: 'Doubles 10.', item: { type: 'number', text: '20', color: '#0284c7' } },
      { id: 'C', label: '15 (10 + 5)', explanation: '10 + 5 = 15. The 5th triangular number.', item: { type: 'number', text: '15', color: '#0284c7' } },
      { id: 'D', label: '16', explanation: 'Square power confusion.', item: { type: 'number', text: '16', color: '#0284c7' } },
    ],
  },
  {
    id: 18,
    seriesName: 'Cubic Powers (n³)',
    category: 'numeric',
    difficulty: 'hard',
    prompt: 'Calculate the cubic power progression.',
    clue: '1³ = 1, 2³ = 8, 3³ = 27, 4³ = 64...',
    ruleDescription: 'Formula n³: 1³=1, 2³=8, 3³=27, 4³=64 → 5³ = 125.',
    sequence: [
      { type: 'number', text: '1', color: '#16a34a' },
      { type: 'number', text: '8', color: '#16a34a' },
      { type: 'number', text: '27', color: '#16a34a' },
      { type: 'number', text: '64', color: '#16a34a' },
    ],
    correctOptionId: 'A',
    options: [
      { id: 'A', label: '125 (5³)', explanation: '5 x 5 x 5 = 125. Next cubic integer.', item: { type: 'number', text: '125', color: '#16a34a' } },
      { id: 'B', label: '100', explanation: '10² square instead of 5³ cube.', item: { type: 'number', text: '100', color: '#16a34a' } },
      { id: 'C', label: '81', explanation: '3⁴ power.', item: { type: 'number', text: '81', color: '#16a34a' } },
      { id: 'D', label: '128', explanation: 'Power of two (2⁷).', item: { type: 'number', text: '128', color: '#16a34a' } },
    ],
  },

  // SECTION 4: MATRIX & GRID SPATIAL PERMUTATIONS (Levels 19 - 24)
  {
    id: 19,
    seriesName: '2x2 Quadrant Clockwise Chase',
    category: 'matrix',
    difficulty: 'medium',
    prompt: 'Track the clockwise movement of the filled quadrant.',
    clue: 'Top-Left → Top-Right → Bottom-Right → Bottom-Left...',
    ruleDescription: 'A single active tile rotates clockwise through 4 quadrants: TL [1,0,0,0] → TR [0,1,0,0] → BR [0,0,0,1] → BL [0,0,1,0] → TL [1,0,0,0].',
    sequence: [
      { type: 'matrix', matrix: [1, 0, 0, 0], color: '#dc2626' },
      { type: 'matrix', matrix: [0, 1, 0, 0], color: '#dc2626' },
      { type: 'matrix', matrix: [0, 0, 0, 1], color: '#dc2626' },
      { type: 'matrix', matrix: [0, 0, 1, 0], color: '#dc2626' },
    ],
    correctOptionId: 'B',
    options: [
      { id: 'A', label: 'Bottom-Right Active', explanation: 'Step 3 position.', item: { type: 'matrix', matrix: [0, 0, 0, 1], color: '#dc2626' } },
      { id: 'B', label: 'Top-Left Active', explanation: 'Returns to starting quadrant in a 4-beat cycle.', item: { type: 'matrix', matrix: [1, 0, 0, 0], color: '#dc2626' } },
      { id: 'C', label: 'All 4 Quadrants Active', explanation: 'Breaks single active quadrant rule.', item: { type: 'matrix', matrix: [1, 1, 1, 1], color: '#dc2626' } },
      { id: 'D', label: 'Top-Right Active', explanation: 'Skips one turn forward.', item: { type: 'matrix', matrix: [0, 1, 0, 0], color: '#dc2626' } },
    ],
  },
  {
    id: 20,
    seriesName: 'Diagonal Checker Alternation',
    category: 'matrix',
    difficulty: 'medium',
    prompt: 'Notice the diagonal flip between complementary states.',
    clue: 'Major Diagonal ⤡ → Minor Diagonal ⤢ → Major Diagonal ⤡ → Minor Diagonal ⤢...',
    ruleDescription: 'The matrix toggles between major diagonal [1,0,0,1] and minor diagonal [0,1,1,0]. Next is Major Diagonal [1,0,0,1].',
    sequence: [
      { type: 'matrix', matrix: [1, 0, 0, 1], color: '#2563eb' },
      { type: 'matrix', matrix: [0, 1, 1, 0], color: '#2563eb' },
      { type: 'matrix', matrix: [1, 0, 0, 1], color: '#2563eb' },
      { type: 'matrix', matrix: [0, 1, 1, 0], color: '#2563eb' },
    ],
    correctOptionId: 'A',
    options: [
      { id: 'A', label: 'Major Diagonal [TL + BR]', explanation: 'Continues the 2-state alternating oscillation.', item: { type: 'matrix', matrix: [1, 0, 0, 1], color: '#2563eb' } },
      { id: 'B', label: 'Minor Diagonal [TR + BL]', explanation: 'Repeats step 4.', item: { type: 'matrix', matrix: [0, 1, 1, 0], color: '#2563eb' } },
      { id: 'C', label: 'Top Row Filled', explanation: 'Breaks diagonal symmetry.', item: { type: 'matrix', matrix: [1, 1, 0, 0], color: '#2563eb' } },
      { id: 'D', label: 'Empty Matrix', explanation: 'All zero state.', item: { type: 'matrix', matrix: [0, 0, 0, 0], color: '#2563eb' } },
    ],
  },
  {
    id: 21,
    seriesName: 'Matrix Quadrant Cumulative Fill',
    category: 'matrix',
    difficulty: 'easy',
    prompt: 'Observe how new quadrants light up cumulatively.',
    clue: '1 quadrant lit → 2 quadrants lit → 3 quadrants lit...',
    ruleDescription: 'Linear fill addition: 1 tile [1,0,0,0] → 2 tiles [1,1,0,0] → 3 tiles [1,1,1,0] → 4 tiles [1,1,1,1] (full grid).',
    sequence: [
      { type: 'matrix', matrix: [1, 0, 0, 0], color: '#8b5cf6' },
      { type: 'matrix', matrix: [1, 1, 0, 0], color: '#8b5cf6' },
      { type: 'matrix', matrix: [1, 1, 1, 0], color: '#8b5cf6' },
      { type: 'matrix', matrix: [1, 1, 1, 1], color: '#8b5cf6' },
    ],
    correctOptionId: 'C',
    options: [
      { id: 'A', label: '3 Quadrants Lit', explanation: 'Decreases count.', item: { type: 'matrix', matrix: [1, 1, 1, 0], color: '#8b5cf6' } },
      { id: 'B', label: '2 Quadrants Lit', explanation: 'Step 2 repetition.', item: { type: 'matrix', matrix: [1, 1, 0, 0], color: '#8b5cf6' } },
      { id: 'C', label: 'Restart Cycle [1 Tile Lit]', explanation: 'Resets to initial state after completing full 4-quadrant fill.', item: { type: 'matrix', matrix: [1, 0, 0, 0], color: '#8b5cf6' } },
      { id: 'D', label: 'Blank Matrix', explanation: 'Zeros all cells.', item: { type: 'matrix', matrix: [0, 0, 0, 0], color: '#8b5cf6' } },
    ],
  },
  {
    id: 22,
    seriesName: '3x3 Matrix Center Cross Expansion',
    category: 'matrix',
    difficulty: 'hard',
    prompt: 'Track the 3x3 pattern expanding from center outward.',
    clue: 'Center dot only → Cross (+ shape) → 3x3 Corners added → Full grid...',
    ruleDescription: 'Center pixel (1) → 4-way cross (5) → Corners added (8) → Center diamond hollowed out.',
    sequence: [
      { type: 'matrix', matrix: [0, 0, 0, 0, 1, 0, 0, 0, 0], color: '#059669' },
      { type: 'matrix', matrix: [0, 1, 0, 1, 1, 1, 0, 1, 0], color: '#059669' },
      { type: 'matrix', matrix: [1, 1, 1, 1, 0, 1, 1, 1, 1], color: '#059669' },
      { type: 'matrix', matrix: [1, 0, 1, 0, 1, 0, 1, 0, 1], color: '#059669' },
    ],
    correctOptionId: 'D',
    options: [
      { id: 'A', label: 'Blank 3x3', explanation: 'No active cells.', item: { type: 'matrix', matrix: [0, 0, 0, 0, 0, 0, 0, 0, 0], color: '#059669' } },
      { id: 'B', label: 'All 9 Cells Lit', explanation: 'Solid block.', item: { type: 'matrix', matrix: [1, 1, 1, 1, 1, 1, 1, 1, 1], color: '#059669' } },
      { id: 'C', label: 'Single Center Dot', explanation: 'Step 1 repetition.', item: { type: 'matrix', matrix: [0, 0, 0, 0, 1, 0, 0, 0, 0], color: '#059669' } },
      { id: 'D', label: '3x3 Outer Ring Hollow', explanation: 'Completes the geometrical phase progression.', item: { type: 'matrix', matrix: [1, 1, 1, 1, 0, 1, 1, 1, 1], color: '#059669' } },
    ],
  },
  {
    id: 23,
    seriesName: '3x3 Snake Path Traverse',
    category: 'matrix',
    difficulty: 'hard',
    prompt: 'Follow the active pixel moving along the perimeter path.',
    clue: 'Top-Left (1) → Top-Middle (2) → Top-Right (3) → Middle-Right (6)...',
    ruleDescription: 'Clockwise perimeter walk along the outer 8 cells of a 3x3 grid: Pos 1 → Pos 2 → Pos 3 → Pos 6 → Pos 9 (Bottom-Right).',
    sequence: [
      { type: 'matrix', matrix: [1, 0, 0, 0, 0, 0, 0, 0, 0], color: '#f59e0b' },
      { type: 'matrix', matrix: [0, 1, 0, 0, 0, 0, 0, 0, 0], color: '#f59e0b' },
      { type: 'matrix', matrix: [0, 0, 1, 0, 0, 0, 0, 0, 0], color: '#f59e0b' },
      { type: 'matrix', matrix: [0, 0, 0, 0, 0, 1, 0, 0, 0], color: '#f59e0b' },
    ],
    correctOptionId: 'A',
    options: [
      { id: 'A', label: 'Bottom-Right Active [Pos 9]', explanation: 'Next position moving clockwise around the perimeter.', item: { type: 'matrix', matrix: [0, 0, 0, 0, 0, 0, 0, 0, 1], color: '#f59e0b' } },
      { id: 'B', label: 'Center Active [Pos 5]', explanation: 'Leaves perimeter path.', item: { type: 'matrix', matrix: [0, 0, 0, 0, 1, 0, 0, 0, 0], color: '#f59e0b' } },
      { id: 'C', label: 'Top-Left Active [Pos 1]', explanation: 'Premature reset.', item: { type: 'matrix', matrix: [1, 0, 0, 0, 0, 0, 0, 0, 0], color: '#f59e0b' } },
      { id: 'D', label: 'Bottom-Left Active [Pos 7]', explanation: 'Skips bottom-right corner.', item: { type: 'matrix', matrix: [0, 0, 0, 0, 0, 0, 1, 0, 0], color: '#f59e0b' } },
    ],
  },
  {
    id: 24,
    seriesName: 'Matrix Row Scan Shift',
    category: 'matrix',
    difficulty: 'medium',
    prompt: 'Track the illuminated horizontal bar descending row by row.',
    clue: 'Top row lit → Middle row lit → Bottom row lit...',
    ruleDescription: 'Horizontal bar scans vertically: Row 1 [1,1,1,0,0,0,0,0,0] → Row 2 [0,0,0,1,1,1,0,0,0] → Row 3 [0,0,0,0,0,0,1,1,1] → Row 1 [1,1,1,0,0,0,0,0,0].',
    sequence: [
      { type: 'matrix', matrix: [1, 1, 1, 0, 0, 0, 0, 0, 0], color: '#06b6d4' },
      { type: 'matrix', matrix: [0, 0, 0, 1, 1, 1, 0, 0, 0], color: '#06b6d4' },
      { type: 'matrix', matrix: [0, 0, 0, 0, 0, 0, 1, 1, 1], color: '#06b6d4' },
      { type: 'matrix', matrix: [1, 1, 1, 0, 0, 0, 0, 0, 0], color: '#06b6d4' },
    ],
    correctOptionId: 'B',
    options: [
      { id: 'A', label: 'Bottom Row Lit', explanation: 'Step 3 position.', item: { type: 'matrix', matrix: [0, 0, 0, 0, 0, 0, 1, 1, 1], color: '#06b6d4' } },
      { id: 'B', label: 'Middle Row Lit', explanation: 'Next step in the top-to-bottom raster scan loop.', item: { type: 'matrix', matrix: [0, 0, 0, 1, 1, 1, 0, 0, 0], color: '#06b6d4' } },
      { id: 'C', label: 'Left Column Lit', explanation: 'Switches orientation to vertical.', item: { type: 'matrix', matrix: [1, 0, 0, 1, 0, 0, 1, 0, 0], color: '#06b6d4' } },
      { id: 'D', label: 'All Rows Lit', explanation: 'Fills entire matrix.', item: { type: 'matrix', matrix: [1, 1, 1, 1, 1, 1, 1, 1, 1], color: '#06b6d4' } },
    ],
  },

  // SECTION 5: DOTS, DOMINOES & QUANTITY TOPOLOGY (Levels 25 - 30)
  {
    id: 25,
    seriesName: 'Domino Pip Stepping Chain',
    category: 'dots',
    difficulty: 'medium',
    prompt: 'Discover the linked pip rule between domino tiles.',
    clue: '[1|2] → [2|3] → [3|4] → [4|5]...',
    ruleDescription: 'Each tile has [n | n+1] and the next tile begins with the previous tile\'s bottom value: [1|2], [2|3], [3|4], [4|5] → [5|6].',
    sequence: [
      { type: 'domino', domino: [1, 2], color: '#1e293b' },
      { type: 'domino', domino: [2, 3], color: '#1e293b' },
      { type: 'domino', domino: [3, 4], color: '#1e293b' },
      { type: 'domino', domino: [4, 5], color: '#1e293b' },
    ],
    correctOptionId: 'D',
    options: [
      { id: 'A', label: 'Domino [4|4]', explanation: 'Double tile breaks stepping sequence.', item: { type: 'domino', domino: [4, 4], color: '#1e293b' } },
      { id: 'B', label: 'Domino [6|6]', explanation: 'Skips [5|6].', item: { type: 'domino', domino: [6, 6], color: '#1e293b' } },
      { id: 'C', label: 'Domino [1|2]', explanation: 'First domino repeated.', item: { type: 'domino', domino: [1, 2], color: '#1e293b' } },
      { id: 'D', label: 'Domino [5|6]', explanation: 'Directly continues the [n | n+1] domino chain.', item: { type: 'domino', domino: [5, 6], color: '#1e293b' } },
    ],
  },
  {
    id: 26,
    seriesName: 'Dice Opposite Faces Rule (Sum to 7)',
    category: 'dots',
    difficulty: 'hard',
    prompt: 'Examine standard dice geometry where opposite faces sum to 7.',
    clue: '1 ↔ 6 (Sum 7), 2 ↔ 5 (Sum 7), 3 ↔ 4 (Sum 7), 4 ↔ 3...',
    ruleDescription: 'Opposite faces on a die always sum to 7: [1|6], [2|5], [3|4], [4|3] → [5|2].',
    sequence: [
      { type: 'domino', domino: [1, 6], color: '#dc2626' },
      { type: 'domino', domino: [2, 5], color: '#dc2626' },
      { type: 'domino', domino: [3, 4], color: '#dc2626' },
      { type: 'domino', domino: [4, 3], color: '#dc2626' },
    ],
    correctOptionId: 'B',
    options: [
      { id: 'A', label: 'Domino [5|5]', explanation: 'Sum is 10, not 7.', item: { type: 'domino', domino: [5, 5], color: '#dc2626' } },
      { id: 'B', label: 'Domino [5|2]', explanation: '5 + 2 = 7. Next in ascending top pip order (1,2,3,4,5).', item: { type: 'domino', domino: [5, 2], color: '#dc2626' } },
      { id: 'C', label: 'Domino [6|2]', explanation: 'Sum is 8, not 7.', item: { type: 'domino', domino: [6, 2], color: '#dc2626' } },
      { id: 'D', label: 'Domino [1|6]', explanation: 'Step 1 inversion.', item: { type: 'domino', domino: [1, 6], color: '#dc2626' } },
    ],
  },
  {
    id: 27,
    seriesName: 'Triangular Dot Pyramids (Bowling Pin)',
    category: 'dots',
    difficulty: 'medium',
    prompt: 'Count the dots forming stacked equilateral triangles.',
    clue: '1 dot (Row 1) → 3 dots (Rows 1-2) → 6 dots (Rows 1-3) → 10 dots (Rows 1-4)...',
    ruleDescription: 'Triangular dot pyramid progression: 1, 3, 6, 10 → 15 dots (5 rows of dots).',
    sequence: [
      { type: 'dots', count: 1, color: '#2563eb' },
      { type: 'dots', count: 3, color: '#2563eb' },
      { type: 'dots', count: 6, color: '#2563eb' },
      { type: 'dots', count: 10, color: '#2563eb' },
    ],
    correctOptionId: 'A',
    options: [
      { id: 'A', label: '15 Dots (5-Tier Pyramid)', explanation: '10 + 5 = 15 dots. Exactly fits 5th triangular pyramid level.', item: { type: 'dots', count: 15, color: '#2563eb' } },
      { id: 'B', label: '12 Dots', explanation: 'Linear addition of 2.', item: { type: 'dots', count: 12, color: '#2563eb' } },
      { id: 'C', label: '9 Dots (Square)', explanation: 'Square layout rather than triangular.', item: { type: 'dots', count: 9, color: '#2563eb' } },
      { id: 'D', label: '20 Dots', explanation: 'Overshoots formula.', item: { type: 'dots', count: 10, color: '#2563eb' } },
    ],
  },
  {
    id: 28,
    seriesName: 'Alternating Even-Odd Dot Oscillation',
    category: 'dots',
    difficulty: 'medium',
    prompt: 'Identify the alternating addition (+3) and subtraction (-1) rule.',
    clue: '2 (+3) = 5 (-1) = 4 (+3) = 7 (-1)...',
    ruleDescription: 'Dual step formula: +3, -1, +3, -1. Sequence: 2, 5, 4, 7 → 6 (7 - 1 = 6).',
    sequence: [
      { type: 'dots', count: 2, color: '#059669' },
      { type: 'dots', count: 5, color: '#059669' },
      { type: 'dots', count: 4, color: '#059669' },
      { type: 'dots', count: 7, color: '#059669' },
    ],
    correctOptionId: 'C',
    options: [
      { id: 'A', label: '10 Dots', explanation: 'Adds 3 instead of subtracting 1.', item: { type: 'dots', count: 10, color: '#059669' } },
      { id: 'B', label: '8 Dots', explanation: 'Adds 1 instead of subtracting 1.', item: { type: 'dots', count: 8, color: '#059669' } },
      { id: 'C', label: '6 Dots', explanation: '7 - 1 = 6 dots. Completes alternating (+3, -1) rule.', item: { type: 'dots', count: 6, color: '#059669' } },
      { id: 'D', label: '5 Dots', explanation: 'Step 2 repetition.', item: { type: 'dots', count: 5, color: '#059669' } },
    ],
  },
  {
    id: 29,
    seriesName: 'Exponential Dot Doubling',
    category: 'dots',
    difficulty: 'hard',
    prompt: 'Observe geometric doubling across dot tiles.',
    clue: '1 dot → 2 dots → 4 dots → 8 dots...',
    ruleDescription: 'Doubling series 2ⁿ: 1, 2, 4, 8 → 16 (represented as 16 / next power tile).',
    sequence: [
      { type: 'dots', count: 1, color: '#ea580c' },
      { type: 'dots', count: 2, color: '#ea580c' },
      { type: 'dots', count: 4, color: '#ea580c' },
      { type: 'dots', count: 8, color: '#ea580c' },
    ],
    correctOptionId: 'B',
    options: [
      { id: 'A', label: '9 Dots', explanation: 'Arithmetic +1 addition on tile 4.', item: { type: 'dots', count: 9, color: '#ea580c' } },
      { id: 'B', label: '16 (2⁴ Doubling)', explanation: '2⁴ = 16. The exact exponential continuation of doubling.', item: { type: 'number', text: '16', color: '#ea580c' } },
      { id: 'C', label: '10 Dots', explanation: 'Linear +2 addition.', item: { type: 'dots', count: 10, color: '#ea580c' } },
      { id: 'D', label: '12 Dots', explanation: 'Arithmetic +4 addition.', item: { type: 'dots', count: 12, color: '#ea580c' } },
    ],
  },
  {
    id: 30,
    seriesName: 'Ascending Histogram Bar Heights',
    category: 'dots',
    difficulty: 'easy',
    prompt: 'Count the progressive height increase in the bars.',
    clue: 'Bars height: [1,2] → [1,2,3] → [1,2,3,4]...',
    ruleDescription: 'Bar sequence adds 1 taller column at each step: [1], [1,2], [1,2,3], [1,2,3,4] → [1,2,3,4,5].',
    sequence: [
      { type: 'bars', bars: [1], color: '#3b82f6' },
      { type: 'bars', bars: [1, 2], color: '#3b82f6' },
      { type: 'bars', bars: [1, 2, 3], color: '#3b82f6' },
      { type: 'bars', bars: [1, 2, 3, 4], color: '#3b82f6' },
    ],
    correctOptionId: 'A',
    options: [
      { id: 'A', label: '5 Ascending Bars [1,2,3,4,5]', explanation: 'Adds the 5th ascending staircase column.', item: { type: 'bars', bars: [1, 2, 3, 4, 5], color: '#3b82f6' } },
      { id: 'B', label: '3 Flat Bars', explanation: 'Uniform height breaks staircase rule.', item: { type: 'bars', bars: [2, 2, 2], color: '#3b82f6' } },
      { id: 'C', label: '4 Bars (Repeated)', explanation: 'Step 4 duplicate.', item: { type: 'bars', bars: [1, 2, 3, 4], color: '#3b82f6' } },
      { id: 'D', label: '1 Single Tall Bar', explanation: 'Lacks multi-column staircase profile.', item: { type: 'bars', bars: [5], color: '#3b82f6' } },
    ],
  },

  // SECTION 6: CLOCKWORK & PIE FRACTIONS (Levels 31 - 35)
  {
    id: 31,
    seriesName: 'Quarter Pie Fraction Shading',
    category: 'pie',
    difficulty: 'easy',
    prompt: 'Track the cumulative shaded slices of the pie.',
    clue: '1/4 (25%) → 2/4 (50%) → 3/4 (75%) → 4/4 (100%)...',
    ruleDescription: 'Slices fill cumulatively clockwise: 1/4 → 2/4 → 3/4 → 4/4 → 1/4 (new cycle).',
    sequence: [
      { type: 'pie', slices: 4, filledSlices: [0], color: '#6366f1' },
      { type: 'pie', slices: 4, filledSlices: [0, 1], color: '#6366f1' },
      { type: 'pie', slices: 4, filledSlices: [0, 1, 2], color: '#6366f1' },
      { type: 'pie', slices: 4, filledSlices: [0, 1, 2, 3], color: '#6366f1' },
    ],
    correctOptionId: 'B',
    options: [
      { id: 'A', label: 'Half Pie Shaded', explanation: 'Step 2 repetition.', item: { type: 'pie', slices: 4, filledSlices: [0, 1], color: '#6366f1' } },
      { id: 'B', label: '1/4 Pie Shaded [Restart Loop]', explanation: 'Resets to 1 slice filled at start of next cycle.', item: { type: 'pie', slices: 4, filledSlices: [0], color: '#6366f1' } },
      { id: 'C', label: 'Empty Circle', explanation: 'All slices unshaded.', item: { type: 'pie', slices: 4, filledSlices: [], color: '#6366f1' } },
      { id: 'D', label: '3/4 Pie Shaded', explanation: 'Step 3 repetition.', item: { type: 'pie', slices: 4, filledSlices: [0, 1, 2], color: '#6366f1' } },
    ],
  },
  {
    id: 32,
    seriesName: 'Analog Clock 3-Hour Quarter Turns',
    category: 'clock',
    difficulty: 'medium',
    prompt: 'Read the time progression on the analog clock face.',
    clue: '12:00 → 3:00 → 6:00 → 9:00...',
    ruleDescription: 'Clock advances by +3 hours at each step: 12:00 → 3:00 → 6:00 → 9:00 → 12:00 (Completes 12-hour cycle).',
    sequence: [
      { type: 'clock', hours: 12, minutes: 0, color: '#2563eb' },
      { type: 'clock', hours: 3, minutes: 0, color: '#2563eb' },
      { type: 'clock', hours: 6, minutes: 0, color: '#2563eb' },
      { type: 'clock', hours: 9, minutes: 0, color: '#2563eb' },
    ],
    correctOptionId: 'A',
    options: [
      { id: 'A', label: '12:00 (Top)', explanation: 'Completes 12-hour clock face rotation.', item: { type: 'clock', hours: 12, minutes: 0, color: '#2563eb' } },
      { id: 'B', label: '6:00 (Bottom)', explanation: 'Step 3 position.', item: { type: 'clock', hours: 6, minutes: 0, color: '#2563eb' } },
      { id: 'C', label: '4:00', explanation: 'Does not fit +3 hours rule.', item: { type: 'clock', hours: 4, minutes: 0, color: '#2563eb' } },
      { id: 'D', label: '1:00', explanation: '1 hour step.', item: { type: 'clock', hours: 1, minutes: 0, color: '#2563eb' } },
    ],
  },
  {
    id: 33,
    seriesName: 'Clock +2 Hour Leap Forward',
    category: 'clock',
    difficulty: 'medium',
    prompt: 'Calculate the 2-hour increment on the clock hand.',
    clue: '1:00 (+2h) → 3:00 (+2h) → 5:00 (+2h) → 7:00 (+2h)...',
    ruleDescription: 'Clock advances by exactly 2 hours each step: 1:00 → 3:00 → 5:00 → 7:00 → 9:00.',
    sequence: [
      { type: 'clock', hours: 1, minutes: 0, color: '#059669' },
      { type: 'clock', hours: 3, minutes: 0, color: '#059669' },
      { type: 'clock', hours: 5, minutes: 0, color: '#059669' },
      { type: 'clock', hours: 7, minutes: 0, color: '#059669' },
    ],
    correctOptionId: 'D',
    options: [
      { id: 'A', label: '8:00', explanation: 'Adds 1 hour only.', item: { type: 'clock', hours: 8, minutes: 0, color: '#059669' } },
      { id: 'B', label: '11:00', explanation: 'Skips 9:00.', item: { type: 'clock', hours: 11, minutes: 0, color: '#059669' } },
      { id: 'C', label: '12:00', explanation: '5 hour jump.', item: { type: 'clock', hours: 12, minutes: 0, color: '#059669' } },
      { id: 'D', label: '9:00', explanation: '7:00 + 2 hours = 9:00. Exact 2-hour leap continuation.', item: { type: 'clock', hours: 9, minutes: 0, color: '#059669' } },
    ],
  },
  {
    id: 34,
    seriesName: '8-Sector Wheel Single Slice Walk',
    category: 'pie',
    difficulty: 'hard',
    prompt: 'Track the single active slice as it rotates around the 8-sector wheel.',
    clue: 'Slice 0 → Slice 1 → Slice 2 → Slice 3...',
    ruleDescription: 'Single 1/8 sector rotates clockwise: Sector 0 → Sector 1 → Sector 2 → Sector 3 → Sector 4 (opposite bottom sector).',
    sequence: [
      { type: 'pie', slices: 8, filledSlices: [0], color: '#d97706' },
      { type: 'pie', slices: 8, filledSlices: [1], color: '#d97706' },
      { type: 'pie', slices: 8, filledSlices: [2], color: '#d97706' },
      { type: 'pie', slices: 8, filledSlices: [3], color: '#d97706' },
    ],
    correctOptionId: 'C',
    options: [
      { id: 'A', label: 'Sector 0 Active', explanation: 'Premature reset before completing 8 sectors.', item: { type: 'pie', slices: 8, filledSlices: [0], color: '#d97706' } },
      { id: 'B', label: 'Sector 2 Active', explanation: 'Step 3 position.', item: { type: 'pie', slices: 8, filledSlices: [2], color: '#d97706' } },
      { id: 'C', label: 'Sector 4 Active (Bottom)', explanation: 'Advances to sector index 4 (180° bottom slice).', item: { type: 'pie', slices: 8, filledSlices: [4], color: '#d97706' } },
      { id: 'D', label: 'All 8 Sectors Active', explanation: 'Fills entire wheel.', item: { type: 'pie', slices: 8, filledSlices: [0, 1, 2, 3, 4, 5, 6, 7], color: '#d97706' } },
    ],
  },
  {
    id: 35,
    seriesName: 'Clock Minute Hand 15-Minute Sweep',
    category: 'clock',
    difficulty: 'easy',
    prompt: 'Observe the fast 15-minute sweep of the minute hand.',
    clue: '12:00 → 12:15 → 12:30 → 12:45...',
    ruleDescription: 'Minute hand advances by 15 minutes (90°) each step: :00 → :15 → :30 → :45 → :00 (1:00 / full hour).',
    sequence: [
      { type: 'clock', hours: 12, minutes: 0, color: '#8b5cf6' },
      { type: 'clock', hours: 12, minutes: 15, color: '#8b5cf6' },
      { type: 'clock', hours: 12, minutes: 30, color: '#8b5cf6' },
      { type: 'clock', hours: 12, minutes: 45, color: '#8b5cf6' },
    ],
    correctOptionId: 'B',
    options: [
      { id: 'A', label: '12:30 (Bottom)', explanation: 'Step 3 position.', item: { type: 'clock', hours: 12, minutes: 30, color: '#8b5cf6' } },
      { id: 'B', label: '1:00 (Top on Hour)', explanation: 'Completes the 60-minute cycle advancing to 1:00.', item: { type: 'clock', hours: 1, minutes: 0, color: '#8b5cf6' } },
      { id: 'C', label: '12:15 (Right)', explanation: 'Step 2 repetition.', item: { type: 'clock', hours: 12, minutes: 15, color: '#8b5cf6' } },
      { id: 'D', label: '6:00', explanation: 'Hour hand moved prematurely.', item: { type: 'clock', hours: 6, minutes: 0, color: '#8b5cf6' } },
    ],
  },

  // SECTION 7: ADVANCED HYBRID & MASTER DEDUCTIONS (Levels 36 - 40)
  {
    id: 36,
    seriesName: 'Multi-Attribute Shape & Color Warmth',
    category: 'hybrid',
    difficulty: 'hard',
    prompt: 'Track both polygon edges (+1) and color temperature shift.',
    clue: 'Blue Triangle (3) → Cyan Square (4) → Green Pentagon (5) → Amber Hexagon (6)...',
    ruleDescription: 'Two combined progressions: 1) Sides increase 3, 4, 5, 6 → 7 (Heptagon), and 2) Colors warm from Blue → Cyan → Green → Amber → Red.',
    sequence: [
      { type: 'polygon', sides: 3, color: '#2563eb', fill: true },
      { type: 'polygon', sides: 4, color: '#06b6d4', fill: true },
      { type: 'polygon', sides: 5, color: '#10b981', fill: true },
      { type: 'polygon', sides: 6, color: '#f59e0b', fill: true },
    ],
    correctOptionId: 'A',
    options: [
      { id: 'A', label: 'Red Heptagon (7 Sides)', explanation: '7 sides with warm red chromatic conclusion.', item: { type: 'polygon', sides: 7, color: '#ef4444', fill: true } },
      { id: 'B', label: 'Blue Heptagon (7 Sides)', explanation: 'Wrong color; resets to cool blue.', item: { type: 'polygon', sides: 7, color: '#2563eb', fill: true } },
      { id: 'C', label: 'Red Octagon (8 Sides)', explanation: 'Skips the 7-sided step.', item: { type: 'polygon', sides: 8, color: '#ef4444', fill: true } },
      { id: 'D', label: 'Green Hexagon (6 Sides)', explanation: 'Repeats step 4 shape.', item: { type: 'polygon', sides: 6, color: '#10b981', fill: true } },
    ],
  },
  {
    id: 37,
    seriesName: 'Alphametic 3-Letter Skip Interval',
    category: 'numeric',
    difficulty: 'medium',
    prompt: 'Discover the alphabet letter skip interval.',
    clue: 'A (+3) → D (+3) → G (+3) → J (+3)...',
    ruleDescription: 'Each letter skips forward by 3 alphabet positions: A (1) → D (4) → G (7) → J (10) → M (13).',
    sequence: [
      { type: 'number', text: 'A', color: '#6366f1' },
      { type: 'number', text: 'D', color: '#6366f1' },
      { type: 'number', text: 'G', color: '#6366f1' },
      { type: 'number', text: 'J', color: '#6366f1' },
    ],
    correctOptionId: 'C',
    options: [
      { id: 'A', label: 'K', explanation: 'Only +1 position from J.', item: { type: 'number', text: 'K', color: '#6366f1' } },
      { id: 'B', label: 'L', explanation: 'Only +2 positions from J.', item: { type: 'number', text: 'L', color: '#6366f1' } },
      { id: 'C', label: 'M (J + 3 Letters)', explanation: 'J (10) + 3 = M (13). Direct alphabetical step continuation.', item: { type: 'number', text: 'M', color: '#6366f1' } },
      { id: 'D', label: 'N', explanation: '+4 positions from J.', item: { type: 'number', text: 'N', color: '#6366f1' } },
    ],
  },
  {
    id: 38,
    seriesName: 'Factorial Multiplication Tree (n!)',
    category: 'numeric',
    difficulty: 'hard',
    prompt: 'Uncover the multiplying factorial sequence.',
    clue: '1 (x2) = 2 (x3) = 6 (x4) = 24 (x5)...',
    ruleDescription: 'Factorial function n!: 1!=1, 2!=2, 3!=6, 4!=24 → 5! = 120 (24 x 5 = 120).',
    sequence: [
      { type: 'number', text: '1', color: '#d97706' },
      { type: 'number', text: '2', color: '#d97706' },
      { type: 'number', text: '6', color: '#d97706' },
      { type: 'number', text: '24', color: '#d97706' },
    ],
    correctOptionId: 'B',
    options: [
      { id: 'A', label: '48', explanation: 'Multiplies by 2 instead of 5.', item: { type: 'number', text: '48', color: '#d97706' } },
      { id: 'B', label: '120 (5!)', explanation: '24 x 5 = 120. Next factorial value (5!).', item: { type: 'number', text: '120', color: '#d97706' } },
      { id: 'C', label: '96', explanation: 'Multiplies by 4.', item: { type: 'number', text: '96', color: '#d97706' } },
      { id: 'D', label: '720 (6!)', explanation: 'Skips 5! value.', item: { type: 'number', text: '720', color: '#d97706' } },
    ],
  },
  {
    id: 39,
    seriesName: 'Nested Polygon Alternating Orientation',
    category: 'hybrid',
    difficulty: 'hard',
    prompt: 'Track the inner triangle rotating inside a fixed square frame.',
    clue: 'Triangle points Up (0°) → Right (90°) → Down (180°) → Left (270°)...',
    ruleDescription: 'Inner shape rotates clockwise by 90° inside the square frame: 0° → 90° → 180° → 270° → 0° (Up).',
    sequence: [
      { type: 'rotation', rotation: 0, color: '#3b82f6' },
      { type: 'rotation', rotation: 90, color: '#3b82f6' },
      { type: 'rotation', rotation: 180, color: '#3b82f6' },
      { type: 'rotation', rotation: 270, color: '#3b82f6' },
    ],
    correctOptionId: 'A',
    options: [
      { id: 'A', label: 'Pointer Facing Up (0°)', explanation: 'Completes 360-degree rotational cycle.', item: { type: 'rotation', rotation: 0, color: '#3b82f6' } },
      { id: 'B', label: 'Pointer Facing Down (180°)', explanation: 'Step 3 position.', item: { type: 'rotation', rotation: 180, color: '#3b82f6' } },
      { id: 'C', label: 'Pointer Facing Right (90°)', explanation: 'Step 2 repetition.', item: { type: 'rotation', rotation: 90, color: '#3b82f6' } },
      { id: 'D', label: 'Pointer Facing Diagonal (45°)', explanation: 'Breaks 90° cardinal orientation.', item: { type: 'rotation', rotation: 45, color: '#3b82f6' } },
    ],
  },
  {
    id: 40,
    seriesName: 'Grand Master Nexus - 10-Sided Decagon Finale',
    category: 'geometric',
    difficulty: 'hard',
    prompt: 'Count the vertices of the ultimate polygon in the final mastery challenge.',
    clue: 'Hexagon (6) → Heptagon (7) → Octagon (8) → Nonagon / Decagon...',
    ruleDescription: 'Apex geometric sequence: 6 sides, 7 sides, 8 sides → 10-sided Decagon apex finale!',
    sequence: [
      { type: 'polygon', sides: 6, color: '#ec4899', fill: true },
      { type: 'polygon', sides: 7, color: '#8b5cf6', fill: true },
      { type: 'polygon', sides: 8, color: '#3b82f6', fill: true },
      { type: 'polygon', sides: 10, color: '#10b981', fill: true },
    ],
    correctOptionId: 'D',
    options: [
      { id: 'A', label: 'Triangle (3 Sides)', explanation: 'Level 1 shape.', item: { type: 'polygon', sides: 3, color: '#f59e0b', fill: true } },
      { id: 'B', label: 'Square (4 Sides)', explanation: 'Low edge count.', item: { type: 'polygon', sides: 4, color: '#f59e0b', fill: true } },
      { id: 'C', label: 'Hexagon (6 Sides)', explanation: 'Step 1 repetition.', item: { type: 'polygon', sides: 6, color: '#f59e0b', fill: true } },
      { id: 'D', label: 'Golden Master Star (Crown Finale)', explanation: 'Completes all 40 cognitive pattern series levels!', item: { type: 'shape', shape: 'star', sides: 8, color: '#f59e0b', fill: true } },
    ],
  },
];

export function getDailyPuzzle() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const puzzleIndex = dayOfYear % PUZZLES.length;
  const base = PUZZLES[puzzleIndex];

  return {
    ...base,
    id: 999,
    seriesName: 'Daily Logic Teaser',
    prompt: `[Daily Challenge] ${base.prompt}`,
  };
}
