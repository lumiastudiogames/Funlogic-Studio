
function triggerPlatformWin(timeInSeconds) {
    const elapsed = Math.round(timeInSeconds || 45);
    try {
        if (typeof window.onWin === 'function') {
            window.onWin(elapsed);
        }
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'win', time: elapsed }, '*');
        }
    } catch(e) { console.error('Platform win notify error:', e); }
}
(() => {
  // unblock-red-key/src/levels.ts
  var LEVELS = [
    // --- LEVELS 1 TO 5: EASY (INTRO & CONCEPTS) ---
    {
      id: 1,
      name: "First Steps",
      difficulty: "Easy",
      cols: 6,
      rows: 6,
      exitRow: 2,
      exitCol: 5,
      exitSide: "right",
      targetMoves: 4,
      blocks: [
        { id: "key", x: 1, y: 2, width: 2, height: 1, isKey: true },
        { id: "b1", x: 3, y: 1, width: 1, height: 2 },
        { id: "b2", x: 0, y: 0, width: 2, height: 1 },
        { id: "b3", x: 4, y: 2, width: 1, height: 3 },
        { id: "b4", x: 1, y: 4, width: 3, height: 1 }
      ]
    },
    {
      id: 2,
      name: "Clear Path",
      difficulty: "Easy",
      cols: 6,
      rows: 6,
      exitRow: 2,
      exitCol: 5,
      exitSide: "right",
      targetMoves: 6,
      blocks: [
        { id: "key", x: 0, y: 2, width: 2, height: 1, isKey: true },
        { id: "b1", x: 2, y: 1, width: 1, height: 2 },
        { id: "b2", x: 2, y: 3, width: 1, height: 2 },
        { id: "b3", x: 3, y: 1, width: 2, height: 1 },
        { id: "b4", x: 4, y: 2, width: 1, height: 2 },
        { id: "b5", x: 0, y: 4, width: 2, height: 1 }
      ]
    },
    {
      id: 3,
      name: "Double Opening",
      difficulty: "Easy",
      cols: 6,
      rows: 6,
      exitRow: 2,
      exitCol: 5,
      exitSide: "right",
      targetMoves: 8,
      blocks: [
        { id: "key", x: 1, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 0, y: 1, width: 1, height: 3 },
        { id: "v2", x: 3, y: 0, width: 1, height: 3 },
        { id: "v3", x: 4, y: 2, width: 1, height: 3 },
        { id: "h1", x: 0, y: 0, width: 3, height: 1 },
        { id: "h2", x: 1, y: 4, width: 2, height: 1 },
        { id: "h3", x: 2, y: 5, width: 3, height: 1 }
      ]
    },
    {
      id: 4,
      name: "Wooden Guardian",
      difficulty: "Easy",
      cols: 6,
      rows: 6,
      exitRow: 2,
      exitCol: 5,
      exitSide: "right",
      targetMoves: 9,
      blocks: [
        { id: "key", x: 0, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 2, y: 0, width: 1, height: 3 },
        { id: "v2", x: 3, y: 1, width: 1, height: 3 },
        { id: "v3", x: 5, y: 0, width: 1, height: 3 },
        { id: "h1", x: 3, y: 0, width: 2, height: 1 },
        { id: "h2", x: 0, y: 3, width: 2, height: 1 },
        { id: "h3", x: 0, y: 4, width: 3, height: 1 },
        { id: "h4", x: 3, y: 4, width: 3, height: 1 }
      ]
    },
    {
      id: 5,
      name: "Smooth Slide",
      difficulty: "Easy",
      cols: 6,
      rows: 6,
      exitRow: 2,
      exitCol: 5,
      exitSide: "right",
      targetMoves: 10,
      blocks: [
        { id: "key", x: 1, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 0, y: 0, width: 1, height: 2 },
        { id: "v2", x: 3, y: 1, width: 1, height: 3 },
        { id: "v3", x: 4, y: 2, width: 1, height: 2 },
        { id: "v4", x: 5, y: 1, width: 1, height: 3 },
        { id: "h1", x: 1, y: 0, width: 3, height: 1 },
        { id: "h2", x: 0, y: 4, width: 2, height: 1 },
        { id: "h3", x: 2, y: 5, width: 3, height: 1 }
      ]
    },
    // --- LEVELS 6 TO 12: MEDIUM (STRATEGY & EXPANDED BOARDS) ---
    {
      id: 6,
      name: "Narrow Crossing",
      difficulty: "Medium",
      cols: 6,
      rows: 6,
      exitRow: 2,
      exitCol: 5,
      exitSide: "right",
      targetMoves: 12,
      blocks: [
        { id: "key", x: 0, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 2, y: 1, width: 1, height: 2 },
        { id: "v2", x: 3, y: 2, width: 1, height: 2 },
        { id: "v3", x: 4, y: 0, width: 1, height: 3 },
        { id: "v4", x: 5, y: 2, width: 1, height: 3 },
        { id: "h1", x: 0, y: 0, width: 2, height: 1 },
        { id: "h2", x: 1, y: 4, width: 2, height: 1 },
        { id: "h3", x: 0, y: 5, width: 3, height: 1 },
        { id: "h4", x: 3, y: 5, width: 2, height: 1 }
      ]
    },
    {
      id: 7,
      name: "Oak Gears",
      difficulty: "Medium",
      cols: 6,
      rows: 6,
      exitRow: 2,
      exitCol: 5,
      exitSide: "right",
      targetMoves: 14,
      blocks: [
        { id: "key", x: 1, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 0, y: 0, width: 1, height: 3 },
        { id: "v2", x: 3, y: 0, width: 1, height: 3 },
        { id: "v3", x: 4, y: 1, width: 1, height: 3 },
        { id: "v4", x: 5, y: 2, width: 1, height: 2 },
        { id: "h1", x: 1, y: 0, width: 2, height: 1 },
        { id: "h2", x: 1, y: 3, width: 2, height: 1 },
        { id: "h3", x: 0, y: 4, width: 2, height: 1 },
        { id: "h4", x: 2, y: 5, width: 3, height: 1 }
      ]
    },
    {
      id: 8,
      name: "Golden Key",
      difficulty: "Medium",
      cols: 8,
      rows: 6,
      exitRow: 2,
      exitCol: 7,
      exitSide: "right",
      targetMoves: 13,
      blocks: [
        { id: "key", x: 2, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 1, y: 1, width: 1, height: 3 },
        { id: "v2", x: 4, y: 0, width: 1, height: 3 },
        { id: "v3", x: 5, y: 2, width: 1, height: 3 },
        { id: "v4", x: 6, y: 1, width: 1, height: 3 },
        { id: "h1", x: 1, y: 0, width: 3, height: 1 },
        { id: "h2", x: 2, y: 3, width: 2, height: 1 },
        { id: "h3", x: 0, y: 4, width: 3, height: 1 },
        { id: "h4", x: 3, y: 5, width: 4, height: 1 }
      ]
    },
    {
      id: 9,
      name: "Imperial Maze",
      difficulty: "Medium",
      cols: 10,
      rows: 6,
      exitRow: 2,
      exitCol: 9,
      exitSide: "right",
      targetMoves: 15,
      blocks: [
        { id: "key", x: 4, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 1, y: 0, width: 1, height: 2 },
        { id: "v2", x: 1, y: 3, width: 1, height: 2 },
        { id: "v3", x: 2, y: 2, width: 1, height: 2 },
        { id: "h1", x: 3, y: 0, width: 3, height: 1 },
        { id: "b_sq", x: 5, y: 1, width: 1, height: 1 },
        { id: "h2", x: 4, y: 3, width: 3, height: 1 },
        { id: "h3", x: 3, y: 4, width: 3, height: 1 },
        { id: "v4", x: 7, y: 1, width: 1, height: 2 },
        { id: "v5", x: 7, y: 3, width: 1, height: 2 }
      ]
    },
    {
      id: 10,
      name: "Mahogany Wall",
      difficulty: "Medium",
      cols: 6,
      rows: 6,
      exitRow: 2,
      exitCol: 5,
      exitSide: "right",
      targetMoves: 16,
      blocks: [
        { id: "key", x: 0, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 2, y: 0, width: 1, height: 3 },
        { id: "v2", x: 3, y: 1, width: 1, height: 3 },
        { id: "v3", x: 4, y: 2, width: 1, height: 3 },
        { id: "v4", x: 5, y: 0, width: 1, height: 2 },
        { id: "h1", x: 0, y: 0, width: 2, height: 1 },
        { id: "h2", x: 0, y: 3, width: 2, height: 1 },
        { id: "h3", x: 0, y: 5, width: 3, height: 1 },
        { id: "h4", x: 3, y: 4, width: 2, height: 1 }
      ]
    },
    {
      id: 11,
      name: "Hidden Corridor",
      difficulty: "Medium",
      cols: 8,
      rows: 6,
      exitRow: 2,
      exitCol: 7,
      exitSide: "right",
      targetMoves: 17,
      blocks: [
        { id: "key", x: 1, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 0, y: 1, width: 1, height: 3 },
        { id: "v2", x: 3, y: 0, width: 1, height: 3 },
        { id: "v3", x: 4, y: 1, width: 1, height: 3 },
        { id: "v4", x: 5, y: 2, width: 1, height: 3 },
        { id: "v5", x: 6, y: 0, width: 1, height: 2 },
        { id: "h1", x: 0, y: 0, width: 3, height: 1 },
        { id: "h2", x: 1, y: 4, width: 3, height: 1 },
        { id: "h3", x: 4, y: 4, width: 3, height: 1 },
        { id: "h4", x: 2, y: 5, width: 4, height: 1 }
      ]
    },
    {
      id: 12,
      name: "Drawbridge",
      difficulty: "Medium",
      cols: 6,
      rows: 6,
      exitRow: 2,
      exitCol: 5,
      exitSide: "right",
      targetMoves: 18,
      blocks: [
        { id: "key", x: 1, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 0, y: 0, width: 1, height: 3 },
        { id: "v2", x: 3, y: 0, width: 1, height: 3 },
        { id: "v3", x: 4, y: 1, width: 1, height: 3 },
        { id: "v4", x: 5, y: 1, width: 1, height: 3 },
        { id: "h1", x: 1, y: 0, width: 2, height: 1 },
        { id: "h2", x: 0, y: 3, width: 3, height: 1 },
        { id: "h3", x: 0, y: 4, width: 2, height: 1 },
        { id: "h4", x: 2, y: 5, width: 3, height: 1 }
      ]
    },
    // --- LEVELS 13 TO 18: HARD (INTRICATE & DEEP) ---
    {
      id: 13,
      name: "The Royal Vault",
      difficulty: "Hard",
      cols: 6,
      rows: 6,
      exitRow: 2,
      exitCol: 5,
      exitSide: "right",
      targetMoves: 21,
      blocks: [
        { id: "key", x: 1, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 0, y: 1, width: 1, height: 3 },
        { id: "v2", x: 3, y: 1, width: 1, height: 2 },
        { id: "v3", x: 4, y: 0, width: 1, height: 3 },
        { id: "v4", x: 5, y: 2, width: 1, height: 3 },
        { id: "h1", x: 0, y: 0, width: 3, height: 1 },
        { id: "h2", x: 1, y: 3, width: 2, height: 1 },
        { id: "h3", x: 1, y: 4, width: 3, height: 1 },
        { id: "h4", x: 0, y: 5, width: 3, height: 1 },
        { id: "h5", x: 3, y: 5, width: 2, height: 1 }
      ]
    },
    {
      id: 14,
      name: "Ebony Cylinders",
      difficulty: "Hard",
      cols: 6,
      rows: 6,
      exitRow: 2,
      exitCol: 5,
      exitSide: "right",
      targetMoves: 23,
      blocks: [
        { id: "key", x: 0, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 2, y: 1, width: 1, height: 3 },
        { id: "v2", x: 3, y: 0, width: 1, height: 3 },
        { id: "v3", x: 4, y: 2, width: 1, height: 3 },
        { id: "v4", x: 5, y: 1, width: 1, height: 3 },
        { id: "h1", x: 0, y: 0, width: 3, height: 1 },
        { id: "h2", x: 0, y: 1, width: 2, height: 1 },
        { id: "h3", x: 0, y: 4, width: 2, height: 1 },
        { id: "h4", x: 0, y: 5, width: 3, height: 1 },
        { id: "h5", x: 3, y: 5, width: 3, height: 1 }
      ]
    },
    {
      id: 15,
      name: "Grand Chamber",
      difficulty: "Hard",
      cols: 10,
      rows: 6,
      exitRow: 2,
      exitCol: 9,
      exitSide: "right",
      targetMoves: 24,
      blocks: [
        { id: "key", x: 3, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 1, y: 0, width: 1, height: 3 },
        { id: "v2", x: 2, y: 2, width: 1, height: 3 },
        { id: "v3", x: 5, y: 1, width: 1, height: 3 },
        { id: "v4", x: 6, y: 0, width: 1, height: 3 },
        { id: "v5", x: 7, y: 2, width: 1, height: 3 },
        { id: "v6", x: 8, y: 1, width: 1, height: 3 },
        { id: "h1", x: 2, y: 0, width: 3, height: 1 },
        { id: "h2", x: 3, y: 4, width: 3, height: 1 },
        { id: "h3", x: 6, y: 5, width: 3, height: 1 },
        { id: "h4", x: 0, y: 5, width: 3, height: 1 }
      ]
    },
    {
      id: 16,
      name: "Secret Passage",
      difficulty: "Hard",
      cols: 6,
      rows: 6,
      exitRow: 2,
      exitCol: 5,
      exitSide: "right",
      targetMoves: 25,
      blocks: [
        { id: "key", x: 1, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 0, y: 0, width: 1, height: 3 },
        { id: "v2", x: 3, y: 0, width: 1, height: 3 },
        { id: "v3", x: 4, y: 1, width: 1, height: 3 },
        { id: "v4", x: 5, y: 0, width: 1, height: 2 },
        { id: "h1", x: 1, y: 0, width: 2, height: 1 },
        { id: "h2", x: 1, y: 1, width: 2, height: 1 },
        { id: "h3", x: 0, y: 3, width: 2, height: 1 },
        { id: "h4", x: 0, y: 4, width: 3, height: 1 },
        { id: "h5", x: 2, y: 5, width: 3, height: 1 }
      ]
    },
    {
      id: 17,
      name: "Cedar Prison",
      difficulty: "Hard",
      cols: 6,
      rows: 6,
      exitRow: 2,
      exitCol: 5,
      exitSide: "right",
      targetMoves: 27,
      blocks: [
        { id: "key", x: 0, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 2, y: 0, width: 1, height: 3 },
        { id: "v2", x: 3, y: 1, width: 1, height: 3 },
        { id: "v3", x: 4, y: 0, width: 1, height: 2 },
        { id: "v4", x: 4, y: 3, width: 1, height: 3 },
        { id: "v5", x: 5, y: 1, width: 1, height: 3 },
        { id: "h1", x: 0, y: 0, width: 2, height: 1 },
        { id: "h2", x: 0, y: 1, width: 2, height: 1 },
        { id: "h3", x: 0, y: 4, width: 2, height: 1 },
        { id: "h4", x: 1, y: 5, width: 3, height: 1 }
      ]
    },
    {
      id: 18,
      name: "The Gordian Knot",
      difficulty: "Hard",
      cols: 6,
      rows: 6,
      exitRow: 2,
      exitCol: 5,
      exitSide: "right",
      targetMoves: 28,
      blocks: [
        { id: "key", x: 1, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 0, y: 1, width: 1, height: 3 },
        { id: "v2", x: 3, y: 0, width: 1, height: 3 },
        { id: "v3", x: 4, y: 2, width: 1, height: 3 },
        { id: "v4", x: 5, y: 1, width: 1, height: 3 },
        { id: "h1", x: 0, y: 0, width: 3, height: 1 },
        { id: "h2", x: 1, y: 3, width: 2, height: 1 },
        { id: "h3", x: 0, y: 4, width: 2, height: 1 },
        { id: "h4", x: 2, y: 4, width: 2, height: 1 },
        { id: "h5", x: 1, y: 5, width: 3, height: 1 }
      ]
    },
    // --- LEVELS 19 TO 25: MASTER (ADVANCED PUZZLES) ---
    {
      id: 19,
      name: "Forbidden Sanctuary",
      difficulty: "Master",
      cols: 6,
      rows: 6,
      exitRow: 2,
      exitCol: 5,
      exitSide: "right",
      targetMoves: 31,
      blocks: [
        { id: "key", x: 0, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 2, y: 1, width: 1, height: 3 },
        { id: "v2", x: 3, y: 0, width: 1, height: 3 },
        { id: "v3", x: 4, y: 1, width: 1, height: 3 },
        { id: "v4", x: 5, y: 0, width: 1, height: 3 },
        { id: "h1", x: 0, y: 0, width: 2, height: 1 },
        { id: "h2", x: 0, y: 1, width: 2, height: 1 },
        { id: "h3", x: 0, y: 4, width: 2, height: 1 },
        { id: "h4", x: 2, y: 4, width: 2, height: 1 },
        { id: "h5", x: 1, y: 5, width: 3, height: 1 },
        { id: "h6", x: 4, y: 5, width: 2, height: 1 }
      ]
    },
    {
      id: 20,
      name: "Archivist's Enigma",
      difficulty: "Master",
      cols: 8,
      rows: 6,
      exitRow: 2,
      exitCol: 7,
      exitSide: "right",
      targetMoves: 33,
      blocks: [
        { id: "key", x: 1, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 0, y: 0, width: 1, height: 3 },
        { id: "v2", x: 3, y: 1, width: 1, height: 3 },
        { id: "v3", x: 4, y: 0, width: 1, height: 3 },
        { id: "v4", x: 5, y: 2, width: 1, height: 3 },
        { id: "v5", x: 6, y: 1, width: 1, height: 3 },
        { id: "v6", x: 7, y: 0, width: 1, height: 2 },
        { id: "h1", x: 1, y: 0, width: 3, height: 1 },
        { id: "h2", x: 0, y: 3, width: 3, height: 1 },
        { id: "h3", x: 1, y: 4, width: 3, height: 1 },
        { id: "h4", x: 4, y: 5, width: 3, height: 1 }
      ]
    },
    {
      id: 21,
      name: "Primordial Mechanism",
      difficulty: "Master",
      cols: 6,
      rows: 6,
      exitRow: 2,
      exitCol: 5,
      exitSide: "right",
      targetMoves: 36,
      blocks: [
        { id: "key", x: 0, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 2, y: 0, width: 1, height: 3 },
        { id: "v2", x: 3, y: 1, width: 1, height: 3 },
        { id: "v3", x: 4, y: 2, width: 1, height: 3 },
        { id: "v4", x: 5, y: 0, width: 1, height: 3 },
        { id: "h1", x: 0, y: 0, width: 2, height: 1 },
        { id: "h2", x: 0, y: 1, width: 2, height: 1 },
        { id: "h3", x: 0, y: 3, width: 2, height: 1 },
        { id: "h4", x: 0, y: 4, width: 3, height: 1 },
        { id: "h5", x: 2, y: 5, width: 3, height: 1 }
      ]
    },
    {
      id: 22,
      name: "The Great Lockup",
      difficulty: "Master",
      cols: 6,
      rows: 6,
      exitRow: 2,
      exitCol: 5,
      exitSide: "right",
      targetMoves: 38,
      blocks: [
        { id: "key", x: 1, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 0, y: 1, width: 1, height: 3 },
        { id: "v2", x: 3, y: 0, width: 1, height: 3 },
        { id: "v3", x: 4, y: 1, width: 1, height: 3 },
        { id: "v4", x: 5, y: 1, width: 1, height: 3 },
        { id: "h1", x: 0, y: 0, width: 3, height: 1 },
        { id: "h2", x: 1, y: 1, width: 2, height: 1 },
        { id: "h3", x: 1, y: 3, width: 2, height: 1 },
        { id: "h4", x: 0, y: 4, width: 3, height: 1 },
        { id: "h5", x: 1, y: 5, width: 3, height: 1 }
      ]
    },
    {
      id: 23,
      name: "Key of Kings",
      difficulty: "Master",
      cols: 10,
      rows: 6,
      exitRow: 2,
      exitCol: 9,
      exitSide: "right",
      targetMoves: 40,
      blocks: [
        { id: "key", x: 2, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 0, y: 0, width: 1, height: 3 },
        { id: "v2", x: 1, y: 2, width: 1, height: 3 },
        { id: "v3", x: 4, y: 0, width: 1, height: 3 },
        { id: "v4", x: 5, y: 2, width: 1, height: 3 },
        { id: "v5", x: 6, y: 1, width: 1, height: 3 },
        { id: "v6", x: 7, y: 2, width: 1, height: 3 },
        { id: "v7", x: 8, y: 0, width: 1, height: 3 },
        { id: "h1", x: 1, y: 0, width: 3, height: 1 },
        { id: "h2", x: 2, y: 4, width: 3, height: 1 },
        { id: "h3", x: 5, y: 5, width: 3, height: 1 },
        { id: "h4", x: 0, y: 5, width: 2, height: 1 }
      ]
    },
    {
      id: 24,
      name: "Endless Labyrinth",
      difficulty: "Master",
      cols: 8,
      rows: 6,
      exitRow: 2,
      exitCol: 7,
      exitSide: "right",
      targetMoves: 42,
      blocks: [
        { id: "key", x: 1, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 0, y: 1, width: 1, height: 3 },
        { id: "v2", x: 3, y: 0, width: 1, height: 3 },
        { id: "v3", x: 4, y: 1, width: 1, height: 3 },
        { id: "v4", x: 5, y: 2, width: 1, height: 3 },
        { id: "v5", x: 6, y: 0, width: 1, height: 3 },
        { id: "h1", x: 0, y: 0, width: 3, height: 1 },
        { id: "h2", x: 1, y: 3, width: 2, height: 1 },
        { id: "h3", x: 1, y: 4, width: 3, height: 1 },
        { id: "h4", x: 4, y: 4, width: 2, height: 1 },
        { id: "h5", x: 2, y: 5, width: 4, height: 1 }
      ]
    },
    {
      id: 25,
      name: "Block Master",
      difficulty: "Master",
      cols: 6,
      rows: 6,
      exitRow: 2,
      exitCol: 5,
      exitSide: "right",
      targetMoves: 45,
      blocks: [
        { id: "key", x: 0, y: 2, width: 2, height: 1, isKey: true },
        { id: "v1", x: 2, y: 1, width: 1, height: 3 },
        { id: "v2", x: 3, y: 0, width: 1, height: 3 },
        { id: "v3", x: 4, y: 2, width: 1, height: 3 },
        { id: "v4", x: 5, y: 0, width: 1, height: 3 },
        { id: "h1", x: 0, y: 0, width: 2, height: 1 },
        { id: "h2", x: 0, y: 1, width: 2, height: 1 },
        { id: "h3", x: 0, y: 3, width: 2, height: 1 },
        { id: "h4", x: 0, y: 4, width: 2, height: 1 },
        { id: "h5", x: 2, y: 4, width: 2, height: 1 },
        { id: "h6", x: 1, y: 5, width: 3, height: 1 },
        { id: "h7", x: 4, y: 5, width: 2, height: 1 }
      ]
    }
  ];

  // unblock-red-key/src/solver.ts
  function stateToKey(blocks) {
    const sorted = [...blocks].sort((a, b) => a.id.localeCompare(b.id));
    return sorted.map((b) => `${b.id}:${b.x},${b.y}`).join("|");
  }
  function isOccupied(grid, x, y, w, h, excludeId, cols, rows) {
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        const curX = x + c;
        const curY = y + r;
        if (curX < 0 || curX >= cols || curY < 0 || curY >= rows) {
          return true;
        }
        const occ = grid[curY][curX];
        if (occ !== null && occ !== excludeId) {
          return true;
        }
      }
    }
    return false;
  }
  function solveLevel(level, initialBlocks) {
    const cols = level.cols;
    const rows = level.rows;
    const exitRow = level.exitRow;
    const startBlocks = initialBlocks.map((b) => ({
      id: b.id,
      x: b.x,
      y: b.y,
      w: b.width,
      h: b.height,
      isKey: !!b.isKey
    }));
    const keyBlock = startBlocks.find((b) => b.isKey);
    if (!keyBlock) return null;
    if (keyBlock.y === exitRow && keyBlock.x + keyBlock.w >= cols) {
      return [];
    }
    const visited = /* @__PURE__ */ new Set();
    const queue = [
      {
        blocks: startBlocks,
        parent: null,
        move: null,
        depth: 0
      }
    ];
    visited.add(stateToKey(startBlocks));
    let maxIterations = 25e3;
    while (queue.length > 0 && maxIterations-- > 0) {
      const current = queue.shift();
      const currentKeyBlock = current.blocks.find((b) => b.isKey);
      if (currentKeyBlock.y === exitRow && currentKeyBlock.x + currentKeyBlock.w >= cols) {
        const moves = [];
        let trace = current;
        while (trace && trace.move) {
          moves.unshift(trace.move);
          trace = trace.parent;
        }
        return moves;
      }
      const grid = Array.from(
        { length: rows },
        () => Array.from({ length: cols }, () => null)
      );
      for (const b of current.blocks) {
        for (let r = 0; r < b.h; r++) {
          for (let c = 0; c < b.w; c++) {
            if (b.y + r < rows && b.x + c < cols) {
              grid[b.y + r][b.x + c] = b.id;
            }
          }
        }
      }
      for (let i = 0; i < current.blocks.length; i++) {
        const b = current.blocks[i];
        const isHorizontal = b.w > b.h;
        const isVertical = b.h > b.w;
        const isSingle = b.w === 1 && b.h === 1;
        if (isHorizontal || isSingle) {
          for (let dx = -1; ; dx--) {
            const newX = b.x + dx;
            if (newX < 0 || isOccupied(grid, newX, b.y, b.w, b.h, b.id, cols, rows)) {
              break;
            }
            const nextBlocks = current.blocks.map(
              (item, idx) => idx === i ? { ...item, x: newX } : item
            );
            const key = stateToKey(nextBlocks);
            if (!visited.has(key)) {
              visited.add(key);
              queue.push({
                blocks: nextBlocks,
                parent: current,
                move: {
                  blockId: b.id,
                  dx,
                  dy: 0,
                  targetX: newX,
                  targetY: b.y,
                  description: `Move block to the left`
                },
                depth: current.depth + 1
              });
            }
          }
          for (let dx = 1; ; dx++) {
            const newX = b.x + dx;
            if (newX + b.w > cols || isOccupied(grid, newX, b.y, b.w, b.h, b.id, cols, rows)) {
              break;
            }
            const nextBlocks = current.blocks.map(
              (item, idx) => idx === i ? { ...item, x: newX } : item
            );
            const key = stateToKey(nextBlocks);
            if (!visited.has(key)) {
              visited.add(key);
              queue.push({
                blocks: nextBlocks,
                parent: current,
                move: {
                  blockId: b.id,
                  dx,
                  dy: 0,
                  targetX: newX,
                  targetY: b.y,
                  description: `Move block to the right`
                },
                depth: current.depth + 1
              });
            }
          }
        }
        if (isVertical || isSingle) {
          for (let dy = -1; ; dy--) {
            const newY = b.y + dy;
            if (newY < 0 || isOccupied(grid, b.x, newY, b.w, b.h, b.id, cols, rows)) {
              break;
            }
            const nextBlocks = current.blocks.map(
              (item, idx) => idx === i ? { ...item, y: newY } : item
            );
            const key = stateToKey(nextBlocks);
            if (!visited.has(key)) {
              visited.add(key);
              queue.push({
                blocks: nextBlocks,
                parent: current,
                move: {
                  blockId: b.id,
                  dx: 0,
                  dy,
                  targetX: b.x,
                  targetY: newY,
                  description: `Move block up`
                },
                depth: current.depth + 1
              });
            }
          }
          for (let dy = 1; ; dy++) {
            const newY = b.y + dy;
            if (newY + b.h > rows || isOccupied(grid, b.x, newY, b.w, b.h, b.id, cols, rows)) {
              break;
            }
            const nextBlocks = current.blocks.map(
              (item, idx) => idx === i ? { ...item, y: newY } : item
            );
            const key = stateToKey(nextBlocks);
            if (!visited.has(key)) {
              visited.add(key);
              queue.push({
                blocks: nextBlocks,
                parent: current,
                move: {
                  blockId: b.id,
                  dx: 0,
                  dy,
                  targetX: b.x,
                  targetY: newY,
                  description: `Move block down`
                },
                depth: current.depth + 1
              });
            }
          }
        }
      }
    }
    return null;
  }

  // unblock-red-key/src/audio.ts
  var SoundManager = class {
    constructor() {
      this.ctx = null;
      this.soundEnabled = true;
      this.slideOsc = null;
      this.slideGain = null;
      const saved = localStorage.getItem("unblock_sound_enabled");
      this.soundEnabled = saved !== null ? JSON.parse(saved) : true;
    }
    initCtx() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {
        });
      }
    }
    isEnabled() {
      return this.soundEnabled;
    }
    toggleSound() {
      this.soundEnabled = !this.soundEnabled;
      localStorage.setItem("unblock_sound_enabled", JSON.stringify(this.soundEnabled));
      if (this.soundEnabled) {
        this.playClick();
      }
      return this.soundEnabled;
    }
    setSound(enabled) {
      this.soundEnabled = enabled;
      localStorage.setItem("unblock_sound_enabled", JSON.stringify(this.soundEnabled));
    }
    // Crisp wooden click for UI buttons
    playClick() {
      if (!this.soundEnabled) return;
      this.initCtx();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.04);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } catch {
      }
    }
    // Tactile wood slide sound
    playWoodSlide() {
      if (!this.soundEnabled) return;
      this.initCtx();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(320, now);
        filter.Q.setValueAtTime(3, now);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(90 + Math.random() * 20, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.06);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(5e-3, now + 0.07);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } catch {
      }
    }
    // Tactile wood block snap into grid place
    playWoodSnap() {
      if (!this.soundEnabled) return;
      this.initCtx();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.06);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      } catch {
      }
    }
    // Wood bump against obstacle or wall
    playBump() {
      if (!this.soundEnabled) return;
      this.initCtx();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.05);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      } catch {
      }
    }
    // Star collection sound
    playStar(starIndex = 0) {
      if (!this.soundEnabled) return;
      this.initCtx();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99];
        const freq = freqs[starIndex % freqs.length] || 523.25;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
      } catch {
      }
    }
    // Hint activation chime
    playHint() {
      if (!this.soundEnabled) return;
      this.initCtx();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const notes = [659.25, 880, 1174.66];
        notes.forEach((f, i) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, now + i * 0.06);
          gain.gain.setValueAtTime(0.15, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(1e-3, now + i * 0.06 + 0.2);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.22);
        });
      } catch {
      }
    }
    // Level completion victory fanfare
    playVictory() {
      if (!this.soundEnabled) return;
      this.initCtx();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const melody = [
          { f: 523.25, t: 0, d: 0.12 },
          // C5
          { f: 659.25, t: 0.12, d: 0.12 },
          // E5
          { f: 783.99, t: 0.24, d: 0.12 },
          // G5
          { f: 1046.5, t: 0.38, d: 0.4 }
          // C6
        ];
        melody.forEach(({ f, t, d }) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(f, now + t);
          gain.gain.setValueAtTime(0.22, now + t);
          gain.gain.exponentialRampToValueAtTime(1e-3, now + t + d);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + t);
          osc.stop(now + t + d + 0.05);
        });
      } catch {
      }
    }
    // Rewarded Ad claim chime
    playReward() {
      if (!this.soundEnabled) return;
      this.initCtx();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((f, i) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, now + i * 0.08);
          gain.gain.setValueAtTime(0.2, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(1e-3, now + i * 0.08 + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.28);
        });
      } catch {
      }
    }
  };
  var soundManager = new SoundManager();

  // unblock-red-key/src/display.ts
  var DisplayManager = class {
    constructor(canvas, onResize) {
      this.dpr = 1;
      this.cssWidth = 600;
      this.cssHeight = 400;
      this.observer = null;
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.onResizeCallback = onResize;
      if (this.canvas.parentElement) {
        this.observer = new ResizeObserver(() => this.resize());
        this.observer.observe(this.canvas.parentElement);
      }
      setTimeout(() => this.resize(), 10);
    }
    resize() {
      if (!this.canvas || !this.canvas.parentElement) return;
      const parentRect = this.canvas.parentElement.getBoundingClientRect();
      if (parentRect.width <= 0 || parentRect.height <= 0) return;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.cssWidth = parentRect.width;
      this.cssHeight = parentRect.height;
      this.canvas.width = Math.floor(this.cssWidth * this.dpr);
      this.canvas.height = Math.floor(this.cssHeight * this.dpr);
      this.canvas.style.width = `${this.cssWidth}px`;
      this.canvas.style.height = `${this.cssHeight}px`;
      this.ctx.resetTransform?.();
      this.ctx.scale(this.dpr, this.dpr);
      if (this.onResizeCallback) {
        this.onResizeCallback(this.cssWidth, this.cssHeight);
      }
    }
    getGameCoordinates(clientX, clientY) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }
    getDimensions() {
      return {
        width: this.cssWidth,
        height: this.cssHeight,
        dpr: this.dpr
      };
    }
    destroy() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    }
  };

  // unblock-red-key/src/renderer.ts
  var GameRenderer = class {
    constructor(ctx) {
      this.particles = [];
      this.animTime = 0;
      this.ctx = ctx;
    }
    setContext(ctx) {
      this.ctx = ctx;
    }
    // Calculate proportional board placement inside available CSS area
    computeBoardLayout(width, height, level) {
      const cols = level.cols;
      const rows = level.rows;
      const paddingX = Math.max(16, width * 0.04);
      const paddingY = Math.max(16, height * 0.04);
      const exitExtraWidth = 32;
      const availW = width - paddingX * 2 - exitExtraWidth;
      const availH = height - paddingY * 2;
      const maxCellByW = availW / cols;
      const maxCellByH = availH / rows;
      const cellSize = Math.floor(Math.min(maxCellByW, maxCellByH, 72));
      const boardWidth = cellSize * cols;
      const boardHeight = cellSize * rows;
      const boardX = Math.floor((width - boardWidth - exitExtraWidth) / 2) + Math.floor(exitExtraWidth / 4);
      const boardY = Math.floor((height - boardHeight) / 2);
      return {
        boardX,
        boardY,
        boardWidth,
        boardHeight,
        cellSize,
        cols,
        rows,
        exitRow: level.exitRow,
        exitCol: level.exitCol
      };
    }
    // Main render loop
    render(width, height, level, blocks, activeDrag, activeHint, isWon, exitProgress) {
      this.animTime += 0.02;
      const ctx = this.ctx;
      ctx.clearRect(0, 0, width, height);
      const layout = this.computeBoardLayout(width, height, level);
      this.drawBackground(width, height);
      this.drawBoardTray(layout, level);
      this.drawExitGate(layout, level, isWon, exitProgress);
      const draggedId = activeDrag?.blockId;
      for (const b of blocks) {
        if (b.id !== draggedId) {
          let posX = b.x;
          let posY = b.y;
          if (b.isKey && isWon && exitProgress > 0) {
            posX = b.x + exitProgress * (layout.cols - b.x + 1.2);
          }
          this.drawBlock(layout, b, posX, posY, false, b.id === activeHint?.blockId);
        }
      }
      if (activeDrag) {
        const b = blocks.find((item) => item.id === activeDrag.blockId);
        if (b) {
          this.drawBlock(
            layout,
            b,
            activeDrag.currentX,
            activeDrag.currentY,
            true,
            b.id === activeHint?.blockId
          );
        }
      }
      if (activeHint && !isWon) {
        this.drawHintArrow(layout, activeHint, blocks);
      }
      this.renderParticles(ctx);
    }
    drawBackground(width, height) {
      const ctx = this.ctx;
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        30,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      bgGrad.addColorStop(0, "#f0f7fc");
      bgGrad.addColorStop(0.5, "#e4eff7");
      bgGrad.addColorStop(1, "#d0e2ee");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.25);
      ctx.lineTo(width * 0.4, 0);
      ctx.moveTo(width * 0.6, 0);
      ctx.lineTo(width, height * 0.4);
      ctx.moveTo(0, height * 0.75);
      ctx.lineTo(width * 0.35, height);
      ctx.moveTo(width * 0.7, height);
      ctx.lineTo(width, height * 0.7);
      ctx.stroke();
      ctx.restore();
    }
    // Draw 2.5D Wooden Frame, Tray and Grid Mat
    drawBoardTray(layout, level) {
      const ctx = this.ctx;
      const { boardX, boardY, boardWidth, boardHeight, cellSize, cols, rows } = layout;
      const rim = Math.max(14, Math.floor(cellSize * 0.28));
      const outerX = boardX - rim;
      const outerY = boardY - rim;
      const outerW = boardWidth + rim * 2;
      const outerH = boardHeight + rim * 2;
      const outerRadius = 22;
      ctx.save();
      ctx.shadowColor = "rgba(28, 16, 7, 0.24)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 10;
      this.roundRect(ctx, outerX, outerY, outerW, outerH, outerRadius);
      ctx.fillStyle = "#6d4224";
      ctx.fill();
      ctx.restore();
      ctx.save();
      const woodRimGrad = ctx.createLinearGradient(outerX, outerY, outerX + outerW, outerY + outerH);
      woodRimGrad.addColorStop(0, "#be8251");
      woodRimGrad.addColorStop(0.3, "#9c633a");
      woodRimGrad.addColorStop(0.7, "#7a4624");
      woodRimGrad.addColorStop(1, "#532d15");
      this.roundRect(ctx, outerX, outerY, outerW, outerH, outerRadius);
      ctx.fillStyle = woodRimGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 235, 205, 0.45)";
      ctx.lineWidth = 2.5;
      this.roundRect(ctx, outerX + 1.5, outerY + 1.5, outerW - 3, outerH - 3, outerRadius - 1);
      ctx.stroke();
      ctx.strokeStyle = "#381c0c";
      ctx.lineWidth = 2;
      this.roundRect(ctx, boardX - 2, boardY - 2, boardWidth + 4, boardHeight + 4, 8);
      ctx.stroke();
      ctx.restore();
      const exitCellY = boardY + level.exitRow * cellSize;
      const exitOpeningH = cellSize * 0.94;
      const exitOpeningY = exitCellY + (cellSize - exitOpeningH) / 2;
      ctx.save();
      ctx.fillStyle = "#edd8be";
      ctx.fillRect(boardX + boardWidth - 2, exitOpeningY, rim + 4, exitOpeningH);
      ctx.strokeStyle = "#baa185";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(boardX + boardWidth, exitOpeningY);
      ctx.lineTo(boardX + boardWidth + rim, exitOpeningY);
      ctx.moveTo(boardX + boardWidth, exitOpeningY + exitOpeningH);
      ctx.lineTo(boardX + boardWidth + rim, exitOpeningY + exitOpeningH);
      ctx.stroke();
      ctx.restore();
      ctx.save();
      this.roundRect(ctx, boardX, boardY, boardWidth, boardHeight, 6);
      ctx.clip();
      const matGrad = ctx.createLinearGradient(boardX, boardY, boardX, boardY + boardHeight);
      matGrad.addColorStop(0, "#f9f5ed");
      matGrad.addColorStop(1, "#eee4d4");
      ctx.fillStyle = matGrad;
      ctx.fillRect(boardX, boardY, boardWidth, boardHeight);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = boardX + c * cellSize;
          const cy = boardY + r * cellSize;
          if ((r + c) % 2 === 1) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.025)";
            ctx.fillRect(cx, cy, cellSize, cellSize);
          }
          ctx.strokeStyle = "rgba(175, 150, 125, 0.28)";
          ctx.lineWidth = 1;
          ctx.strokeRect(cx + 0.5, cy + 0.5, cellSize - 1, cellSize - 1);
        }
      }
      const aoGradTop = ctx.createLinearGradient(boardX, boardY, boardX, boardY + 12);
      aoGradTop.addColorStop(0, "rgba(40, 20, 10, 0.22)");
      aoGradTop.addColorStop(1, "rgba(40, 20, 10, 0)");
      ctx.fillStyle = aoGradTop;
      ctx.fillRect(boardX, boardY, boardWidth, 12);
      const aoGradLeft = ctx.createLinearGradient(boardX, boardY, boardX + 12, boardY);
      aoGradLeft.addColorStop(0, "rgba(40, 20, 10, 0.22)");
      aoGradLeft.addColorStop(1, "rgba(40, 20, 10, 0)");
      ctx.fillStyle = aoGradLeft;
      ctx.fillRect(boardX, boardY, 12, boardHeight);
      ctx.restore();
    }
    // Draw 2.5D Exit Gate & Horseshoe Arrow
    drawExitGate(layout, level, isWon, exitProgress) {
      const ctx = this.ctx;
      const { boardX, boardY, boardWidth, cellSize } = layout;
      const exitX = boardX + boardWidth + 8;
      const exitY = boardY + level.exitRow * cellSize + cellSize / 2;
      ctx.save();
      const pulse = Math.sin(this.animTime * 4) * 0.25 + 0.75;
      const archSize = cellSize * 0.42;
      ctx.save();
      ctx.translate(exitX + 10, exitY);
      if (isWon) {
        ctx.shadowColor = "rgba(255, 215, 0, 0.8)";
        ctx.shadowBlur = 15;
      }
      ctx.lineWidth = 8;
      ctx.strokeStyle = "rgba(100, 60, 20, 0.35)";
      ctx.beginPath();
      ctx.arc(0, 3, archSize, Math.PI * 0.8, Math.PI * 2.2);
      ctx.stroke();
      const goldGrad = ctx.createLinearGradient(-archSize, -archSize, archSize, archSize);
      goldGrad.addColorStop(0, "#fff4b8");
      goldGrad.addColorStop(0.4, "#f59e0b");
      goldGrad.addColorStop(0.8, "#d97706");
      goldGrad.addColorStop(1, "#92400e");
      ctx.strokeStyle = goldGrad;
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(0, 0, archSize, Math.PI * 0.8, Math.PI * 2.2);
      ctx.stroke();
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.moveTo(archSize + 4, 0);
      ctx.lineTo(archSize - 4, -7);
      ctx.lineTo(archSize - 4, 7);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.font = `800 ${Math.max(10, Math.floor(cellSize * 0.2))}px Outfit, sans-serif`;
      ctx.fillStyle = isWon ? "#d97706" : "#926a45";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText("EXIT", exitX + 10, exitY + archSize + 6);
      ctx.restore();
    }
    // Draw 2.5D Realistic Wooden Block (or Red Key Block)
    drawBlock(layout, block, gridX, gridY, isElevated, isHinted) {
      const ctx = this.ctx;
      const { boardX, boardY, cellSize } = layout;
      const gap = Math.max(3, Math.floor(cellSize * 0.06));
      const radius = Math.max(5, Math.floor(cellSize * 0.12));
      const px = boardX + gridX * cellSize + gap;
      const py = boardY + gridY * cellSize + gap;
      const pw = block.width * cellSize - gap * 2;
      const ph = block.height * cellSize - gap * 2;
      const isKey = !!block.isKey;
      const depth3D = Math.max(4, Math.floor(cellSize * 0.09));
      ctx.save();
      const shadowOffset = isElevated ? depth3D + 5 : depth3D;
      const shadowBlur = isElevated ? 14 : 6;
      const shadowAlpha = isElevated ? 0.35 : 0.22;
      ctx.fillStyle = `rgba(30, 15, 5, ${shadowAlpha})`;
      this.roundRect(ctx, px, py + shadowOffset, pw, ph, radius);
      ctx.filter = `blur(${shadowBlur}px)`;
      ctx.fill();
      ctx.filter = "none";
      const baseColorDark = isKey ? "#690a0a" : "#4a2610";
      ctx.fillStyle = baseColorDark;
      this.roundRect(ctx, px, py + depth3D, pw, ph, radius);
      ctx.fill();
      ctx.save();
      this.roundRect(ctx, px, py, pw, ph, radius);
      ctx.clip();
      if (isKey) {
        const redGrad = ctx.createLinearGradient(px, py, px + pw, py + ph);
        redGrad.addColorStop(0, "#f84343");
        redGrad.addColorStop(0.35, "#e02424");
        redGrad.addColorStop(0.8, "#b91c1c");
        redGrad.addColorStop(1, "#8b0e0e");
        ctx.fillStyle = redGrad;
        ctx.fillRect(px, py, pw, ph);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(px + 4, py + ph * 0.3);
        ctx.lineTo(px + pw - 4, py + ph * 0.3);
        ctx.moveTo(px + 10, py + ph * 0.7);
        ctx.lineTo(px + pw - 10, py + ph * 0.7);
        ctx.stroke();
        this.drawGoldenKeyEmboss(px, py, pw, ph);
      } else {
        const isHorizontal = block.width > block.height;
        const woodGrad = isHorizontal ? ctx.createLinearGradient(px, py, px, py + ph) : ctx.createLinearGradient(px, py, px + pw, py);
        woodGrad.addColorStop(0, "#be8353");
        woodGrad.addColorStop(0.3, "#9d633b");
        woodGrad.addColorStop(0.85, "#7b4623");
        woodGrad.addColorStop(1, "#5e3215");
        ctx.fillStyle = woodGrad;
        ctx.fillRect(px, py, pw, ph);
        ctx.strokeStyle = "rgba(60, 25, 5, 0.18)";
        ctx.lineWidth = 1;
        const lines = isHorizontal ? Math.floor(ph / 7) : Math.floor(pw / 7);
        for (let i = 1; i < lines; i++) {
          const offset = isHorizontal ? py + i * 7 : px + i * 7;
          ctx.beginPath();
          if (isHorizontal) {
            ctx.moveTo(px + 6, offset);
            ctx.bezierCurveTo(px + pw * 0.3, offset - 2, px + pw * 0.7, offset + 2, px + pw - 6, offset);
          } else {
            ctx.moveTo(offset, py + 6);
            ctx.bezierCurveTo(offset - 2, py + ph * 0.3, offset + 2, py + ph * 0.7, offset, py + ph - 6);
          }
          ctx.stroke();
        }
        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = 1;
        ctx.strokeRect(px + 3, py + 3, pw - 6, ph - 6);
      }
      ctx.restore();
      ctx.strokeStyle = isKey ? "rgba(255, 200, 200, 0.5)" : "rgba(255, 235, 205, 0.4)";
      ctx.lineWidth = 1.5;
      this.roundRect(ctx, px + 0.75, py + 0.75, pw - 1.5, ph - 1.5, radius);
      ctx.stroke();
      if (isHinted) {
        const hintPulse = Math.sin(this.animTime * 6) * 0.3 + 0.7;
        ctx.strokeStyle = `rgba(250, 204, 21, ${hintPulse})`;
        ctx.lineWidth = 3.5;
        ctx.shadowColor = "#facc15";
        ctx.shadowBlur = 10;
        this.roundRect(ctx, px - 2, py - 2, pw + 4, ph + 4, radius + 2);
        ctx.stroke();
      }
      ctx.restore();
    }
    // Draw 2.5D Golden Embossed Key Glyph on the Red Block
    drawGoldenKeyEmboss(px, py, pw, ph) {
      const ctx = this.ctx;
      const cx = px + pw * 0.46;
      const cy = py + ph * 0.5;
      const scale = Math.min(pw * 0.75, ph * 1.5) / 60;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = 3;
      ctx.shadowOffsetY = 2;
      const goldGrad = ctx.createLinearGradient(-24, -10, 24, 10);
      goldGrad.addColorStop(0, "#fffbe6");
      goldGrad.addColorStop(0.3, "#fcd34d");
      goldGrad.addColorStop(0.7, "#f59e0b");
      goldGrad.addColorStop(1, "#b45309");
      ctx.fillStyle = goldGrad;
      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(-16, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#a81c1c";
      ctx.beginPath();
      ctx.arc(-16, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = goldGrad;
      ctx.fillRect(-8, -2.8, 28, 5.6);
      ctx.strokeRect(-8, -2.8, 28, 5.6);
      ctx.fillRect(8, 2.8, 4.2, 5.8);
      ctx.strokeRect(8, 2.8, 4.2, 5.8);
      ctx.fillRect(15, 2.8, 3.8, 7.5);
      ctx.strokeRect(15, 2.8, 3.8, 7.5);
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.beginPath();
      ctx.arc(-18, -4, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // Draw animated hint arrow showing destination
    drawHintArrow(layout, hint, blocks) {
      const ctx = this.ctx;
      const { boardX, boardY, cellSize } = layout;
      const block = blocks.find((b) => b.id === hint.blockId);
      if (!block) return;
      const startX = boardX + (block.x + block.width / 2) * cellSize;
      const startY = boardY + (block.y + block.height / 2) * cellSize;
      const targetX = boardX + (hint.targetX + block.width / 2) * cellSize;
      const targetY = boardY + (hint.targetY + block.height / 2) * cellSize;
      const bounce = Math.sin(this.animTime * 8) * 6;
      const angle = Math.atan2(targetY - startY, targetX - startX);
      ctx.save();
      ctx.strokeStyle = "#f59e0b";
      ctx.fillStyle = "#f59e0b";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.shadowColor = "rgba(245, 158, 11, 0.8)";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(targetX + Math.cos(angle) * bounce, targetY + Math.sin(angle) * bounce);
      ctx.stroke();
      const headLen = 14;
      const tipX = targetX + Math.cos(angle) * (bounce + 4);
      const tipY = targetY + Math.sin(angle) * (bounce + 4);
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(
        tipX - headLen * Math.cos(angle - Math.PI / 6),
        tipY - headLen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        tipX - headLen * Math.cos(angle + Math.PI / 6),
        tipY - headLen * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    // Confetti and Sparkle Particle System
    spawnVictoryParticles(width, height) {
      const colors = ["#f59e0b", "#ef4444", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#fbbf24"];
      for (let i = 0; i < 70; i++) {
        const angle = Math.PI * 2 * i / 70 + (Math.random() - 0.5) * 0.5;
        const speed = 4 + Math.random() * 8;
        this.particles.push({
          x: width * 0.65,
          y: height * 0.45,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          size: 5 + Math.random() * 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.012 + Math.random() * 0.015,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.2,
          shape: Math.random() > 0.4 ? "square" : "sparkle"
        });
      }
    }
    renderParticles(ctx) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18;
        p.vx *= 0.98;
        p.rotation += p.vRot;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        if (p.shape === "square") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        } else {
          ctx.beginPath();
          for (let s = 0; s < 4; s++) {
            ctx.rotate(Math.PI / 2);
            ctx.lineTo(0, -p.size * 1.2);
            ctx.lineTo(p.size * 0.3, 0);
          }
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
    }
    // Rounded rectangle utility
    roundRect(ctx, x, y, w, h, r) {
      const radius = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
    }
  };

  // unblock-red-key/src/icons.ts
  var icons = {
    play: (cls = "w-5 h-5") => `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
    grid: (cls = "w-5 h-5") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    helpCircle: (cls = "w-5 h-5") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    volume2: (cls = "w-5 h-5") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
    volumeX: (cls = "w-5 h-5") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`,
    key: (cls = "w-5 h-5") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-1.5 1.5l-3 3M12 9l-2 2-1-1 1-1m2-2l1 1-2 2m-5 3a5 5 0 1 0 7.07 7.07 5 5 0 0 0-7.07-7.07z"/></svg>`,
    star: (cls = "w-5 h-5", fill = false) => `<svg class="${cls} ${fill ? "fill-amber-400 text-amber-400" : "text-slate-600 fill-slate-800"}" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    trophy: (cls = "w-5 h-5") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>`,
    sparkles: (cls = "w-5 h-5") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
    rotateCcw: (cls = "w-5 h-5") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
    undo: (cls = "w-5 h-5") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>`,
    lightbulb: (cls = "w-5 h-5") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
    x: (cls = "w-5 h-5") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    lock: (cls = "w-5 h-5") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    arrowRight: (cls = "w-5 h-5") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    arrowLeft: (cls = "w-5 h-5") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
    settings: (cls = "w-5 h-5") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    playCircle: (cls = "w-5 h-5") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`,
    alertTriangle: (cls = "w-5 h-5") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
  };

  // unblock-red-key/src/main.ts
  var STORAGE_KEY = "unblock_red_key_progress_v1";
  var GameApp = class {
    constructor(container) {
      this.currentScreen = "MENU";
      this.currentLevelIndex = 0;
      // Active Gameplay State
      this.blocks = [];
      this.moves = 0;
      this.history = [];
      this.activeHint = null;
      this.isWon = false;
      // Canvas & Render Engine
      this.canvasElement = null;
      this.displayManager = null;
      this.renderer = null;
      this.dragState = null;
      this.animFrameId = null;
      this.exitProgress = 0;
      this.hasTriggeredWin = false;
      // Modal active states
      this.activeModal = null;
      this.levelSelectFilter = "All";
      this.victoryStarsAnimated = 0;
      this.rewardedCountdown = 5;
      this.rewardedTimerId = null;
      this.settingsConfirmReset = false;
      this.handlePointerDown = (e) => {
        if (this.isWon || !this.displayManager || !this.renderer || !this.canvasElement) return;
        this.canvasElement.setPointerCapture(e.pointerId);
        const { x, y } = this.displayManager.getGameCoordinates(e.clientX, e.clientY);
        const { width, height } = this.displayManager.getDimensions();
        const layout = this.renderer.computeBoardLayout(width, height, this.getCurrentLevel());
        for (const b of this.blocks) {
          const bx = layout.boardX + b.x * layout.cellSize;
          const by = layout.boardY + b.y * layout.cellSize;
          const bw = b.width * layout.cellSize;
          const bh = b.height * layout.cellSize;
          if (x >= bx && x <= bx + bw && y >= by && y <= by + bh) {
            const bounds = this.computeSlidingBounds(b, this.blocks, this.getCurrentLevel());
            this.dragState = {
              blockId: b.id,
              startPointerX: x,
              startPointerY: y,
              originalBlockX: b.x,
              originalBlockY: b.y,
              currentX: b.x,
              currentY: b.y,
              minX: bounds.minX,
              maxX: bounds.maxX,
              minY: bounds.minY,
              maxY: bounds.maxY,
              isHorizontal: bounds.isHorizontal,
              isVertical: bounds.isVertical
            };
            soundManager.playWoodSlide();
            break;
          }
        }
      };
      this.handlePointerMove = (e) => {
        if (!this.dragState || !this.displayManager || !this.renderer) return;
        const { x, y } = this.displayManager.getGameCoordinates(e.clientX, e.clientY);
        const { width, height } = this.displayManager.getDimensions();
        const layout = this.renderer.computeBoardLayout(width, height, this.getCurrentLevel());
        const deltaX = (x - this.dragState.startPointerX) / layout.cellSize;
        const deltaY = (y - this.dragState.startPointerY) / layout.cellSize;
        if (this.dragState.isHorizontal) {
          let targetX = this.dragState.originalBlockX + deltaX;
          targetX = Math.max(this.dragState.minX, Math.min(this.dragState.maxX, targetX));
          this.dragState.currentX = targetX;
        }
        if (this.dragState.isVertical) {
          let targetY = this.dragState.originalBlockY + deltaY;
          targetY = Math.max(this.dragState.minY, Math.min(this.dragState.maxY, targetY));
          this.dragState.currentY = targetY;
        }
      };
      this.handlePointerUp = (e) => {
        if (this.canvasElement && this.canvasElement.hasPointerCapture(e.pointerId)) {
          this.canvasElement.releasePointerCapture(e.pointerId);
        }
        if (!this.dragState) return;
        const finalX = Math.round(this.dragState.currentX);
        const finalY = Math.round(this.dragState.currentY);
        const changed = finalX !== this.dragState.originalBlockX || finalY !== this.dragState.originalBlockY;
        if (changed) {
          this.history.push(this.blocks.map((b) => ({ ...b })));
          this.blocks = this.blocks.map(
            (b) => b.id === this.dragState?.blockId ? { ...b, x: finalX, y: finalY } : b
          );
          this.moves++;
          this.activeHint = null;
          soundManager.playWoodSnap();
          const movesElem = this.container.querySelector("#hud-moves-val");
          if (movesElem) movesElem.textContent = String(this.moves);
          const btnUndo = this.container.querySelector("#btn-undo");
          if (btnUndo) btnUndo.disabled = this.history.length === 0;
          const level = this.getCurrentLevel();
          const keyBlock = this.blocks.find((b) => b.isKey);
          if (keyBlock && keyBlock.y === level.exitRow && keyBlock.x + keyBlock.width >= level.cols) {
            if (!this.hasTriggeredWin) {
              this.hasTriggeredWin = true;
              soundManager.playVictory();
              if (this.displayManager && this.renderer) {
                const { width, height } = this.displayManager.getDimensions();
                this.renderer.spawnVictoryParticles(width, height);
              }
              this.triggerWin();
            }
          }
        }
        this.dragState = null;
      };
      this.container = container;
      this.progress = this.loadProgress();
      this.init();
    }
    loadProgress() {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          return {
            unlockedLevel: Math.max(1, parsed.unlockedLevel || 1),
            scores: parsed.scores || {},
            hintsRemaining: parsed.hintsRemaining !== void 0 ? parsed.hintsRemaining : 3,
            soundEnabled: parsed.soundEnabled !== void 0 ? parsed.soundEnabled : true,
            hapticsEnabled: true
          };
        }
      } catch {
      }
      return {
        unlockedLevel: 1,
        scores: {},
        hintsRemaining: 3,
        soundEnabled: true,
        hapticsEnabled: true
      };
    }
    saveProgress() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
      } catch {
      }
    }
    getCurrentLevel() {
      return LEVELS[this.currentLevelIndex] || LEVELS[0];
    }
    getTotalStars() {
      let total = 0;
      Object.values(this.progress.scores).forEach((s) => {
        total += s.stars;
      });
      return total;
    }
    getCompletedCount() {
      let count = 0;
      Object.values(this.progress.scores).forEach((s) => {
        if (s.stars > 0) count++;
      });
      return count;
    }
    init() {
      this.renderMain();
    }
    // Root UI Renderer
    renderMain() {
      this.cleanCanvasLoop();
      const stageHTML = `
      <div id="game-stage" class="w-full max-w-5xl h-[100dvh] sm:h-[92vh] sm:max-h-[880px] mx-auto flex flex-col relative overflow-hidden bg-slate-900 sm:rounded-3xl shadow-2xl border border-slate-700/30">
        ${this.currentScreen === "MENU" ? this.renderMenuHTML() : this.renderGameHTML()}
        <div id="modal-container">
          ${this.renderModalHTML()}
        </div>
      </div>
    `;
      this.container.innerHTML = stageHTML;
      this.bindEvents();
      if (this.currentScreen === "PLAYING") {
        this.initCanvasEngine();
      }
    }
    // --- HTML GENERATORS ---
    renderMenuHTML() {
      const completedCount = this.getCompletedCount();
      const totalStars = this.getTotalStars();
      const nextLevel = Math.min(this.progress.unlockedLevel, LEVELS.length);
      return `
      <div class="w-full h-full flex flex-col items-center justify-between p-4 sm:p-8 bg-gradient-to-b from-slate-900 via-slate-800 to-amber-950 text-white select-none overflow-y-auto scrollbar-none">
        <!-- Top Header Bar -->
        <div class="w-full flex items-center justify-between max-w-md shrink-0">
          <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
            ${icons.trophy("w-4 h-4 text-amber-400")}
            <span class="text-xs font-bold text-amber-300">${completedCount} / ${LEVELS.length} Levels</span>
          </div>

          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-amber-400 font-black text-xs">
              ${icons.star("w-4 h-4", true)}
              <span>${totalStars}</span>
            </div>

            <button
              id="btn-toggle-sound"
              class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-slate-200 transition-colors"
              title="Toggle Sound"
            >
              ${this.progress.soundEnabled ? icons.volume2("w-4 h-4 text-amber-400") : icons.volumeX("w-4 h-4 text-slate-400")}
            </button>
          </div>
        </div>

        <!-- Hero Visual Mascot & Title -->
        <div class="flex flex-col items-center text-center my-auto py-4">
          <div id="btn-hero-key" class="relative mb-4 group cursor-pointer">
            <div class="absolute -inset-4 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-500 animate-pulse"></div>
            <div class="relative w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-red-500 via-red-600 to-amber-900 rounded-3xl p-1 shadow-2xl border-2 border-amber-300/40 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
              <div class="w-full h-full bg-gradient-to-br from-red-600 to-red-900 rounded-[22px] flex items-center justify-center relative overflow-hidden shadow-inner">
                <div class="absolute top-0 left-0 w-full h-1/2 bg-white/15 rounded-t-[22px]"></div>
                ${icons.key("w-16 h-16 sm:w-20 sm:h-20 text-amber-300 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transform -rotate-12")}
                <div class="absolute top-3 right-3 animate-spin" style="animation-duration: 6s;">
                  ${icons.sparkles("w-6 h-6 text-yellow-200")}
                </div>
              </div>
            </div>
          </div>

          <h1 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300 filter drop-shadow-md">
            UNBLOCK RED KEY
          </h1>
          <p class="text-xs sm:text-sm text-amber-100/75 mt-1 font-medium max-w-xs sm:max-w-sm">
            Slide the wooden blocks and set the golden key free!
          </p>
        </div>

        <!-- Action Buttons Menu -->
        <div class="w-full max-w-xs flex flex-col gap-3 shrink-0 pb-2">
          <button
            id="btn-play-now"
            class="btn-tactile w-full py-3.5 px-6 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 border border-amber-300/80 shadow-xl active:scale-95 transition-all"
          >
            ${icons.play("w-5 h-5 fill-amber-950 shrink-0")}
            <span>${completedCount > 0 ? `CONTINUE (LEVEL ${nextLevel})` : "PLAY NOW"}</span>
          </button>

          <button
            id="btn-open-level-select"
            class="btn-tactile w-full py-3 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 bg-white/15 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md active:scale-95 transition-all"
          >
            ${icons.grid("w-5 h-5 text-amber-400 shrink-0")}
            <span>SELECT LEVEL</span>
          </button>

          <button
            id="btn-open-how-to-play"
            class="btn-tactile w-full py-2.5 px-6 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10 backdrop-blur-md active:scale-95 transition-all"
          >
            ${icons.helpCircle("w-4 h-4 text-slate-300 shrink-0")}
            <span>HOW TO PLAY</span>
          </button>
        </div>
      </div>
    `;
    }
    renderGameHTML() {
      const level = this.getCurrentLevel();
      const bestScore = this.progress.scores[level.id]?.bestMoves ?? null;
      return `
      <div class="w-full h-full flex flex-col justify-between overflow-hidden relative select-none">
        
        <div class="w-full px-4 py-3 bg-gradient-to-b from-slate-900 to-slate-900/95 border-b border-white/10 text-white flex items-center justify-between shrink-0 shadow-lg backdrop-blur-md z-10">
          <div class="flex items-center gap-2">
            <button
              id="btn-hud-back"
              class="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-slate-200 transition-all active:scale-95"
              title="Back to Menu"
            >
              ${icons.arrowLeft("w-5 h-5")}
            </button>

            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-black tracking-wider text-amber-400 uppercase">LEVEL ${level.id}</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ${level.difficulty}
                </span>
              </div>
              <div class="text-[11px] text-slate-300 font-medium mt-0.5">
                Target: <span class="font-bold text-white">${level.targetMoves} moves</span>
              </div>
            </div>
          </div>

          <!-- Central Score Badge -->
          <div class="flex items-center gap-3 bg-white/10 px-3.5 py-1.5 rounded-2xl border border-white/15">
            <div class="text-center">
              <span class="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">MOVES</span>
              <span id="hud-moves-val" class="text-base font-black text-amber-300 leading-tight">${this.moves}</span>
            </div>
            <div class="w-px h-6 bg-white/15"></div>
            <div class="text-center">
              <span class="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">BEST</span>
              <span class="text-base font-black text-emerald-400 leading-tight">${bestScore !== null ? bestScore : "-"}</span>
            </div>
          </div>

          <!-- Right Action Tools -->
          <div class="flex items-center gap-1.5">
            <button
              id="btn-hud-sound"
              class="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-slate-200 transition-colors"
              title="Sound"
            >
              ${this.progress.soundEnabled ? icons.volume2("w-4 h-4 text-amber-400") : icons.volumeX("w-4 h-4 text-slate-400")}
            </button>

            <button
              id="btn-hud-settings"
              class="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-slate-200 transition-colors"
              title="Settings"
            >
              ${icons.settings("w-4 h-4 text-slate-200")}
            </button>
          </div>
        </div>

        <!-- Central 2.5D Canvas Board -->
        <div id="canvas-container" class="flex-1 w-full h-full min-h-0 relative flex items-center justify-center overflow-hidden touch-none">
          <canvas id="game-canvas" class="w-full h-full block cursor-grab active:cursor-grabbing select-none"></canvas>
        </div>

        <!-- Bottom Controls -->
        <div class="w-full px-4 py-3 bg-gradient-to-t from-slate-950 via-slate-900 to-transparent flex items-center justify-center gap-3 shrink-0 z-10">
          <button
            id="btn-control-undo"
            ${this.history.length === 0 || this.isWon ? "disabled" : ""}
            class="btn-tactile flex-1 max-w-[130px] py-2.5 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${this.history.length > 0 && !this.isWon ? "bg-white/15 hover:bg-white/20 text-white border border-white/20 active:scale-95 cursor-pointer shadow-md" : "bg-white/5 border border-white/5 text-slate-600 cursor-not-allowed opacity-50"}"
          >
            ${icons.undo("w-4 h-4 shrink-0")}
            <span>UNDO (${this.history.length})</span>
          </button>

          <button
            id="btn-control-hint"
            ${this.isWon ? "disabled" : ""}
            class="btn-tactile flex-1 max-w-[140px] py-2.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 border border-amber-300/80 shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            ${icons.lightbulb("w-4 h-4 fill-amber-950 shrink-0")}
            <span>HINT (${this.progress.hintsRemaining})</span>
          </button>

          <button
            id="btn-control-reset"
            ${this.isWon ? "disabled" : ""}
            class="btn-tactile flex-1 max-w-[130px] py-2.5 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${!this.isWon ? "bg-white/15 hover:bg-white/20 text-white border border-white/20 active:scale-95 cursor-pointer shadow-md" : "bg-white/5 border border-white/5 text-slate-600 cursor-not-allowed opacity-50"}"
          >
            ${icons.rotateCcw("w-4 h-4 shrink-0")}
            <span>RESET</span>
          </button>
        </div>
      </div>
    `;
    }
    // Modals Generator
    renderModalHTML() {
      if (!this.activeModal) return "";
      if (this.activeModal === "LEVEL_SELECT") {
        const difficulties = ["All", "Easy", "Medium", "Hard", "Master"];
        const filteredLevels = this.levelSelectFilter === "All" ? LEVELS : LEVELS.filter((l) => l.difficulty === this.levelSelectFilter);
        return `
        <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn select-none">
          <div class="w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-900/40 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-white">
            <div class="px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/5">
              <div class="flex items-center gap-2">
                ${icons.trophy("w-5 h-5 text-amber-400")}
                <h2 class="text-lg sm:text-xl font-black text-amber-200">LEVEL SELECT</h2>
              </div>
              <button
                id="btn-close-modal"
                class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                ${icons.x("w-5 h-5")}
              </button>
            </div>

            <div class="px-4 py-2.5 bg-black/20 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              ${difficulties.map(
          (diff) => `
                <button
                  data-filter="${diff}"
                  class="btn-filter-tab px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${this.levelSelectFilter === diff ? "bg-amber-400 text-amber-950 shadow-md" : "bg-white/10 text-slate-300 hover:bg-white/15"}"
                >
                  ${diff}
                </button>
              `
        ).join("")}
            </div>

            <div class="p-4 sm:p-6 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 scrollbar-none">
              ${filteredLevels.map((lvl) => {
          const isUnlocked = lvl.id <= this.progress.unlockedLevel;
          const scoreData = this.progress.scores[lvl.id];
          const stars = scoreData?.stars || 0;
          const bestMoves = scoreData?.bestMoves;
          return `
                    <button
                      data-level-id="${lvl.id}"
                      ${!isUnlocked ? "disabled" : ""}
                      class="btn-level-card btn-tactile relative flex flex-col items-center justify-between p-3 rounded-2xl border transition-all ${isUnlocked ? "bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 border-amber-500/30 text-white cursor-pointer active:scale-95 shadow-md" : "bg-slate-900/60 border-white/5 text-slate-500 cursor-not-allowed opacity-60"}"
                    >
                      <div class="text-base sm:text-lg font-black tracking-tight">${lvl.id}</div>
                      <div class="my-1.5 flex items-center justify-center">
                        ${!isUnlocked ? icons.lock("w-5 h-5 text-slate-600") : `
                          <div class="flex items-center gap-0.5 text-amber-400">
                            ${icons.star("w-3 h-3", stars >= 1)}
                            ${icons.star("w-3 h-3", stars >= 2)}
                            ${icons.star("w-3 h-3", stars >= 3)}
                          </div>
                        `}
                      </div>
                      <div class="text-[10px] font-bold text-slate-400">
                        ${isUnlocked && bestMoves ? `${bestMoves} moves` : lvl.difficulty}
                      </div>
                    </button>
                  `;
        }).join("")}
            </div>
          </div>
        </div>
      `;
      }
      if (this.activeModal === "VICTORY") {
        const level = this.getCurrentLevel();
        const bestMoves = this.progress.scores[level.id]?.bestMoves ?? this.moves;
        let starsEarned = 3;
        if (this.moves > level.targetMoves + 4) {
          starsEarned = 1;
        } else if (this.moves > level.targetMoves) {
          starsEarned = 2;
        }
        const ratingTitles = {
          3: "PERFECT!",
          2: "EXCELLENT!",
          1: "GREAT JOB!"
        };
        const hasNextLevel = this.currentLevelIndex < LEVELS.length - 1;
        return `
        <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
          <div class="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950 border-2 border-amber-400/40 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center relative overflow-hidden text-white">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-amber-950 shadow-lg mb-3 border border-amber-300">
              ${icons.trophy("w-9 h-9")}
            </div>

            <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300">
              LEVEL COMPLETED!
            </h2>
            <p class="text-xs text-amber-300/80 font-bold uppercase tracking-wider mt-0.5">
              ${ratingTitles[starsEarned] || "GREAT JOB!"}
            </p>

            <div class="flex items-center justify-center gap-2 my-4">
              ${[1, 2, 3].map((index) => {
          const isFilled = this.victoryStarsAnimated >= index;
          return `
                  <div class="transform transition-all duration-300 ${isFilled ? "scale-110" : "scale-90 opacity-40"}">
                    ${icons.star("w-10 h-10 sm:w-12 sm:h-12", isFilled)}
                  </div>
                `;
        }).join("")}
            </div>

            <div class="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/15 my-2 flex items-center justify-around">
              <div class="text-center">
                <span class="block text-[10px] text-slate-400 font-bold uppercase">MOVES</span>
                <span class="text-lg font-black text-amber-300">${this.moves}</span>
              </div>
              <div class="w-px h-8 bg-white/15"></div>
              <div class="text-center">
                <span class="block text-[10px] text-slate-400 font-bold uppercase">TARGET (3\u2B50)</span>
                <span class="text-lg font-black text-slate-200">\u2264${level.targetMoves}</span>
              </div>
              <div class="w-px h-8 bg-white/15"></div>
              <div class="text-center">
                <span class="block text-[10px] text-slate-400 font-bold uppercase">BEST</span>
                <span class="text-lg font-black text-emerald-400">${bestMoves}</span>
              </div>
            </div>

            <div class="w-full flex flex-col gap-2.5 mt-4">
              ${hasNextLevel ? `
                <button
                  id="btn-victory-next"
                  class="btn-tactile w-full py-3.5 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 border border-amber-300/80 shadow-lg active:scale-95 transition-all"
                >
                  <span>NEXT LEVEL</span>
                  ${icons.arrowRight("w-5 h-5 shrink-0")}
                </button>
              ` : `
                <button
                  id="btn-victory-select"
                  class="btn-tactile w-full py-3.5 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 border border-amber-300/80 shadow-lg active:scale-95 transition-all"
                >
                  <span>ALL LEVELS CLEARED! \u{1F389}</span>
                </button>
              `}

              <div class="flex gap-2">
                <button
                  id="btn-victory-replay"
                  class="btn-tactile flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-white/15 hover:bg-white/20 text-white border border-white/20 active:scale-95 transition-all"
                >
                  ${icons.rotateCcw("w-4 h-4 shrink-0")}
                  <span>REPLAY</span>
                </button>

                <button
                  id="btn-victory-levels"
                  class="btn-tactile flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-white/15 hover:bg-white/20 text-white border border-white/20 active:scale-95 transition-all"
                >
                  ${icons.grid("w-4 h-4 shrink-0")}
                  <span>LEVELS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      }
      if (this.activeModal === "REWARDED_AD") {
        const isCompleted = this.rewardedCountdown <= 0;
        const progressPercent = (5 - this.rewardedCountdown) / 5 * 100;
        return `
        <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
          <div class="w-full max-w-sm bg-gradient-to-b from-slate-900 to-amber-950 border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center relative overflow-hidden text-white">
            <button
              id="btn-close-modal"
              class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
              title="Close"
            >
              ${icons.x("w-4 h-4")}
            </button>

            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-3">
              ${icons.playCircle("w-3.5 h-3.5")}
              <span>HINT REWARD</span>
            </div>

            <h3 class="text-xl font-black text-amber-200">
              ${isCompleted ? "Hint Unlocked!" : "Watching Sponsor..."}
            </h3>
            <p class="text-xs text-slate-300 mt-1 max-w-xs">
              ${isCompleted ? "Click below to claim +3 free Hints for your game!" : `Wait ${this.rewardedCountdown}s to unlock +3 free Hints.`}
            </p>

            <div class="w-full h-32 my-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden shadow-inner p-4">
              <div class="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-2">
                <div class="animate-pulse">${icons.lightbulb("w-7 h-7")}</div>
              </div>
              <span class="text-xs font-bold text-amber-100">
                Puzzle Master
              </span>
              <span class="text-[10px] text-slate-400">Game Sponsor</span>

              <div class="absolute bottom-0 left-0 w-full h-1.5 bg-black/40">
                <div
                  class="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-1000 ease-linear"
                  style="width: ${progressPercent}%; height: 100%; background: linear-gradient(to right, #facc15, #f59e0b);"
                ></div>
              </div>
            </div>

            <button
              id="btn-claim-reward"
              ${!isCompleted ? "disabled" : ""}
              class="btn-tactile w-full py-3.5 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all ${isCompleted ? "bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 border border-amber-300/80 shadow-lg active:scale-95 cursor-pointer animate-bounce" : "bg-slate-800 border border-white/10 text-slate-500 cursor-not-allowed opacity-60"}"
            >
              ${isCompleted ? `
                ${icons.sparkles("w-5 h-5 fill-amber-950")}
                <span>CLAIM +3 HINTS! \u{1F4A1}</span>
              ` : `
                <span>WAIT (${this.rewardedCountdown}s)...</span>
              `}
            </button>

            <button
              id="btn-skip-reward"
              class="mt-3 text-xs text-slate-400 hover:text-slate-200 underline font-medium"
            >
              Skip and keep playing
            </button>
          </div>
        </div>
      `;
      }
      if (this.activeModal === "HOW_TO_PLAY") {
        return `
        <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
          <div class="w-full max-w-lg bg-gradient-to-b from-slate-900 to-amber-950 border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl text-white flex flex-col max-h-[90vh] overflow-y-auto scrollbar-none">
            <div class="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
              <div class="flex items-center gap-2">
                <span class="text-2xl">\u{1F4D6}</span>
                <h2 class="text-lg sm:text-xl font-black text-amber-200">HOW TO PLAY</h2>
              </div>
              <button
                id="btn-close-modal"
                class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                ${icons.x("w-5 h-5")}
              </button>
            </div>

            <div class="flex flex-col gap-3.5 my-5">
              <div class="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/10 border border-white/10">
                <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 font-black text-base">
                  1
                </div>
                <div>
                  <h4 class="font-extrabold text-sm text-amber-200">Touch and Slide</h4>
                  <p class="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Touch wooden blocks and drag with your finger or mouse. Horizontal blocks only slide left and right; vertical blocks only slide up and down.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/10 border border-white/10">
                <div class="w-10 h-10 rounded-xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-300 shrink-0 font-black text-base">
                  2
                </div>
                <div>
                  <h4 class="font-extrabold text-sm text-red-200">Clear the Way</h4>
                  <p class="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Move surrounding wooden blocks out of the way to create an open horizontal exit path for the <strong>Red Key</strong> towards the <strong>Golden Gate</strong> on the right.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/10 border border-white/10">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0 font-black text-base">
                  3
                </div>
                <div>
                  <h4 class="font-extrabold text-sm text-emerald-200">Earn 3 Stars</h4>
                  <p class="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Slide the red key out through the gate. The fewer moves you use compared to the target, the higher your star score (up to 3 stars \u2B50\u2B50\u2B50)!
                  </p>
                </div>
              </div>
            </div>

            <button
              id="btn-close-modal"
              class="btn-tactile w-full py-3.5 rounded-2xl font-black text-base bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 border border-amber-300/80 shadow-lg active:scale-95 transition-all"
            >
              GOT IT, LET'S PLAY! \u{1F680}
            </button>
          </div>
        </div>
      `;
      }
      if (this.activeModal === "SETTINGS") {
        return `
        <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
          <div class="w-full max-w-sm bg-gradient-to-b from-slate-900 to-amber-950 border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-white flex flex-col relative overflow-hidden">
            <div class="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
              <h3 class="text-lg font-black text-amber-200">SETTINGS</h3>
              <button
                id="btn-close-modal"
                class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
              >
                ${icons.x("w-5 h-5")}
              </button>
            </div>

            <div class="flex flex-col gap-4 my-5">
              <div class="flex items-center justify-between p-3.5 rounded-2xl bg-white/10 border border-white/10">
                <div class="flex items-center gap-3">
                  ${this.progress.soundEnabled ? icons.volume2("w-5 h-5 text-amber-400") : icons.volumeX("w-5 h-5 text-slate-400")}
                  <div>
                    <div class="font-bold text-sm">Sound Effects</div>
                    <div class="text-[11px] text-slate-300">${this.progress.soundEnabled ? "Enabled" : "Disabled"}</div>
                  </div>
                </div>

                <button
                  id="btn-toggle-sound-settings"
                  class="w-12 h-7 rounded-full transition-colors relative p-1 ${this.progress.soundEnabled ? "bg-amber-400" : "bg-slate-700"}"
                >
                  <div
                    class="w-5 h-5 rounded-full bg-white transition-transform ${this.progress.soundEnabled ? "translate-x-5" : "translate-x-0"}"
                  ></div>
                </button>
              </div>

              <div class="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex flex-col gap-2">
                ${!this.settingsConfirmReset ? `
                  <button
                    id="btn-show-reset-confirm"
                    class="btn-tactile w-full py-2.5 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    ${icons.rotateCcw("w-4 h-4")}
                    <span>Reset All Progress</span>
                  </button>
                ` : `
                  <div class="flex flex-col gap-2 text-center p-1">
                    <div class="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-bold">
                      ${icons.alertTriangle("w-4 h-4 text-amber-400")}
                      <span>Are you sure? All levels and stars will be reset!</span>
                    </div>
                    <div class="flex gap-2 mt-1">
                      <button
                        id="btn-confirm-reset"
                        class="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs"
                      >
                        Yes, Reset
                      </button>
                      <button
                        id="btn-cancel-reset"
                        class="flex-1 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                `}
              </div>
            </div>

            <button
              id="btn-close-modal"
              class="btn-tactile w-full py-3 rounded-xl font-black text-sm bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 border border-amber-300/80 shadow-md active:scale-95"
            >
              DONE
            </button>
          </div>
        </div>
      `;
      }
      return "";
    }
    // --- EVENT BINDING ---
    bindEvents() {
      const btnToggleSound = this.container.querySelector("#btn-toggle-sound");
      if (btnToggleSound) {
        btnToggleSound.addEventListener("click", () => this.toggleSound());
      }
      const btnPlayNow = this.container.querySelector("#btn-play-now");
      const btnHeroKey = this.container.querySelector("#btn-hero-key");
      const startPlay = () => {
        soundManager.playClick();
        const targetIdx = Math.min(this.progress.unlockedLevel - 1, LEVELS.length - 1);
        this.loadLevel(targetIdx);
        this.currentScreen = "PLAYING";
        this.renderMain();
      };
      if (btnPlayNow) btnPlayNow.addEventListener("click", startPlay);
      if (btnHeroKey) btnHeroKey.addEventListener("click", startPlay);
      const btnOpenLevelSelect = this.container.querySelector("#btn-open-level-select");
      if (btnOpenLevelSelect) {
        btnOpenLevelSelect.addEventListener("click", () => {
          soundManager.playClick();
          this.activeModal = "LEVEL_SELECT";
          this.renderMain();
        });
      }
      const btnOpenHowToPlay = this.container.querySelector("#btn-open-how-to-play");
      if (btnOpenHowToPlay) {
        btnOpenHowToPlay.addEventListener("click", () => {
          soundManager.playClick();
          this.activeModal = "HOW_TO_PLAY";
          this.renderMain();
        });
      }
      const btnHudBack = this.container.querySelector("#btn-hud-back");
      if (btnHudBack) {
        btnHudBack.addEventListener("click", () => {
          soundManager.playClick();
          this.currentScreen = "MENU";
          this.renderMain();
        });
      }
      const btnHudSound = this.container.querySelector("#btn-hud-sound");
      if (btnHudSound) {
        btnHudSound.addEventListener("click", () => this.toggleSound());
      }
      const btnHudSettings = this.container.querySelector("#btn-hud-settings");
      if (btnHudSettings) {
        btnHudSettings.addEventListener("click", () => {
          soundManager.playClick();
          this.settingsConfirmReset = false;
          this.activeModal = "SETTINGS";
          this.renderMain();
        });
      }
      const btnControlUndo = this.container.querySelector("#btn-control-undo");
      if (btnControlUndo) {
        btnControlUndo.addEventListener("click", () => this.handleUndo());
      }
      const btnControlHint = this.container.querySelector("#btn-control-hint");
      if (btnControlHint) {
        btnControlHint.addEventListener("click", () => this.handleHint());
      }
      const btnControlReset = this.container.querySelector("#btn-control-reset");
      if (btnControlReset) {
        btnControlReset.addEventListener("click", () => this.handleReset());
      }
      const btnCloseModals = this.container.querySelectorAll("#btn-close-modal");
      btnCloseModals.forEach((b) => {
        b.addEventListener("click", () => {
          soundManager.playClick();
          this.closeModal();
        });
      });
      const filterTabs = this.container.querySelectorAll(".btn-filter-tab");
      filterTabs.forEach((tab) => {
        tab.addEventListener("click", (e) => {
          soundManager.playClick();
          const diff = e.currentTarget.getAttribute("data-filter");
          if (diff) {
            this.levelSelectFilter = diff;
            this.renderMain();
          }
        });
      });
      const levelCards = this.container.querySelectorAll(".btn-level-card");
      levelCards.forEach((card) => {
        card.addEventListener("click", (e) => {
          soundManager.playClick();
          const levelId = Number(e.currentTarget.getAttribute("data-level-id"));
          if (levelId) {
            const idx = LEVELS.findIndex((l) => l.id === levelId);
            if (idx !== -1) {
              this.loadLevel(idx);
              this.activeModal = null;
              this.currentScreen = "PLAYING";
              this.renderMain();
            }
          }
        });
      });
      const btnVictoryNext = this.container.querySelector("#btn-victory-next");
      if (btnVictoryNext) {
        btnVictoryNext.addEventListener("click", () => {
          soundManager.playClick();
          this.activeModal = null;
          if (this.currentLevelIndex < LEVELS.length - 1) {
            this.loadLevel(this.currentLevelIndex + 1);
            this.renderMain();
          } else {
            this.activeModal = "LEVEL_SELECT";
            this.renderMain();
          }
        });
      }
      const btnVictorySelect = this.container.querySelector("#btn-victory-select");
      if (btnVictorySelect) {
        btnVictorySelect.addEventListener("click", () => {
          soundManager.playClick();
          this.activeModal = "LEVEL_SELECT";
          this.renderMain();
        });
      }
      const btnVictoryReplay = this.container.querySelector("#btn-victory-replay");
      if (btnVictoryReplay) {
        btnVictoryReplay.addEventListener("click", () => {
          soundManager.playClick();
          this.activeModal = null;
          this.loadLevel(this.currentLevelIndex);
          this.renderMain();
        });
      }
      const btnVictoryLevels = this.container.querySelector("#btn-victory-levels");
      if (btnVictoryLevels) {
        btnVictoryLevels.addEventListener("click", () => {
          soundManager.playClick();
          this.activeModal = "LEVEL_SELECT";
          this.renderMain();
        });
      }
      const btnClaimReward = this.container.querySelector("#btn-claim-reward");
      if (btnClaimReward) {
        btnClaimReward.addEventListener("click", () => {
          if (this.rewardedCountdown <= 0) {
            soundManager.playReward();
            this.progress.hintsRemaining += 3;
            this.saveProgress();
            this.closeModal();
            setTimeout(() => {
              const solution = solveLevel(this.getCurrentLevel(), this.blocks);
              if (solution && solution.length > 0) {
                this.activeHint = solution[0];
                soundManager.playHint();
              }
              this.renderMain();
            }, 200);
          }
        });
      }
      const btnSkipReward = this.container.querySelector("#btn-skip-reward");
      if (btnSkipReward) {
        btnSkipReward.addEventListener("click", () => {
          soundManager.playClick();
          this.closeModal();
        });
      }
      const btnToggleSoundSettings = this.container.querySelector("#btn-toggle-sound-settings");
      if (btnToggleSoundSettings) {
        btnToggleSoundSettings.addEventListener("click", () => this.toggleSound());
      }
      const btnShowResetConfirm = this.container.querySelector("#btn-show-reset-confirm");
      if (btnShowResetConfirm) {
        btnShowResetConfirm.addEventListener("click", () => {
          soundManager.playClick();
          this.settingsConfirmReset = true;
          this.renderMain();
        });
      }
      const btnConfirmReset = this.container.querySelector("#btn-confirm-reset");
      if (btnConfirmReset) {
        btnConfirmReset.addEventListener("click", () => {
          soundManager.playClick();
          this.progress = {
            unlockedLevel: 1,
            scores: {},
            hintsRemaining: 3,
            soundEnabled: this.progress.soundEnabled,
            hapticsEnabled: true
          };
          localStorage.removeItem(STORAGE_KEY);
          this.loadLevel(0);
          this.closeModal();
          this.currentScreen = "MENU";
          this.renderMain();
        });
      }
      const btnCancelReset = this.container.querySelector("#btn-cancel-reset");
      if (btnCancelReset) {
        btnCancelReset.addEventListener("click", () => {
          soundManager.playClick();
          this.settingsConfirmReset = false;
          this.renderMain();
        });
      }
    }
    closeModal() {
      if (this.rewardedTimerId) {
        clearInterval(this.rewardedTimerId);
        this.rewardedTimerId = null;
      }
      this.activeModal = null;
      this.renderMain();
    }
    toggleSound() {
      const enabled = soundManager.toggleSound();
      this.progress.soundEnabled = enabled;
      this.saveProgress();
      this.renderMain();
    }
    // --- GAME LOGIC & CANVAS ENGINE ---
    loadLevel(levelIndex) {
      const safeIndex = Math.max(0, Math.min(LEVELS.length - 1, levelIndex));
      this.currentLevelIndex = safeIndex;
      const targetLvl = LEVELS[safeIndex];
      this.blocks = targetLvl.blocks.map((b) => ({ ...b }));
      this.moves = 0;
      this.history = [];
      this.activeHint = null;
      this.isWon = false;
      this.exitProgress = 0;
      this.hasTriggeredWin = false;
    }
    handleUndo() {
      if (this.history.length === 0 || this.isWon) return;
      const lastState = this.history[this.history.length - 1];
      this.blocks = lastState;
      this.history = this.history.slice(0, -1);
      this.moves = Math.max(0, this.moves - 1);
      this.activeHint = null;
      soundManager.playWoodSnap();
      const movesElem = this.container.querySelector("#hud-moves-val");
      if (movesElem) movesElem.textContent = String(this.moves);
      const btnUndo = this.container.querySelector("#btn-undo");
      if (btnUndo) btnUndo.disabled = this.history.length === 0;
    }
    handleReset() {
      if (this.isWon) return;
      soundManager.playClick();
      this.loadLevel(this.currentLevelIndex);
      this.renderMain();
    }
    handleHint() {
      if (this.isWon) return;
      if (this.progress.hintsRemaining <= 0) {
        soundManager.playClick();
        this.startRewardedAdFlow();
        return;
      }
      const solution = solveLevel(this.getCurrentLevel(), this.blocks);
      if (solution && solution.length > 0) {
        this.activeHint = solution[0];
        soundManager.playHint();
        this.progress.hintsRemaining = Math.max(0, this.progress.hintsRemaining - 1);
        this.saveProgress();
        this.renderMain();
      } else {
        soundManager.playClick();
      }
    }
    startRewardedAdFlow() {
      this.rewardedCountdown = 5;
      this.activeModal = "REWARDED_AD";
      this.renderMain();
      if (this.rewardedTimerId) clearInterval(this.rewardedTimerId);
      this.rewardedTimerId = setInterval(() => {
        this.rewardedCountdown--;
        if (this.rewardedCountdown <= 0) {
          if (this.rewardedTimerId) clearInterval(this.rewardedTimerId);
          this.rewardedTimerId = null;
          soundManager.playReward();
        }
        this.renderMain();
      }, 1e3);
    }
    triggerWin() {
      this.isWon = true;
      const level = this.getCurrentLevel();
      let starsEarned = 3;
      if (this.moves > level.targetMoves + 4) {
        starsEarned = 1;
      } else if (this.moves > level.targetMoves) {
        starsEarned = 2;
      }
      const currentBest = this.progress.scores[level.id]?.bestMoves;
      const currentStars = this.progress.scores[level.id]?.stars || 0;
      const newBestMoves = currentBest ? Math.min(currentBest, this.moves) : this.moves;
      const newStars = Math.max(currentStars, starsEarned);
      const nextUnlocked = Math.max(this.progress.unlockedLevel, level.id + 1);
      this.progress.unlockedLevel = nextUnlocked;
      this.progress.scores[level.id] = {
        bestMoves: newBestMoves,
        stars: newStars
      };
      this.saveProgress();
      this.victoryStarsAnimated = 0;
      for (let i = 1; i <= starsEarned; i++) {
        setTimeout(() => {
          this.victoryStarsAnimated = i;
          soundManager.playStar(i - 1);
          if (this.activeModal === "VICTORY") {
            this.renderMain();
          }
        }, i * 280);
      }
      setTimeout(() => {
        this.activeModal = "VICTORY";
        this.renderMain();
      }, 600);
    }
    // Canvas engine initialization and loop
    initCanvasEngine() {
      this.canvasElement = this.container.querySelector("#game-canvas");
      if (!this.canvasElement) return;
      const ctx = this.canvasElement.getContext("2d");
      if (!ctx) return;
      this.renderer = new GameRenderer(ctx);
      this.displayManager = new DisplayManager(this.canvasElement);
      this.canvasElement.addEventListener("pointerdown", this.handlePointerDown);
      this.canvasElement.addEventListener("pointermove", this.handlePointerMove);
      this.canvasElement.addEventListener("pointerup", this.handlePointerUp);
      this.canvasElement.addEventListener("pointercancel", this.handlePointerUp);
      this.startCanvasLoop();
    }
    cleanCanvasLoop() {
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      if (this.canvasElement) {
        this.canvasElement.removeEventListener("pointerdown", this.handlePointerDown);
        this.canvasElement.removeEventListener("pointermove", this.handlePointerMove);
        this.canvasElement.removeEventListener("pointerup", this.handlePointerUp);
        this.canvasElement.removeEventListener("pointercancel", this.handlePointerUp);
        this.canvasElement = null;
      }
      if (this.displayManager) {
        this.displayManager.destroy();
        this.displayManager = null;
      }
    }
    startCanvasLoop() {
      const loop = () => {
        if (this.currentScreen !== "PLAYING" || !this.displayManager || !this.renderer) return;
        const { width, height } = this.displayManager.getDimensions();
        const level = this.getCurrentLevel();
        if (this.isWon) {
          if (this.exitProgress < 1) {
            this.exitProgress = Math.min(1, this.exitProgress + 0.025);
          }
        } else {
          this.exitProgress = 0;
        }
        this.renderer.render(
          width,
          height,
          level,
          this.blocks,
          this.dragState ? {
            blockId: this.dragState.blockId,
            currentX: this.dragState.currentX,
            currentY: this.dragState.currentY
          } : null,
          this.activeHint,
          this.isWon,
          this.exitProgress
        );
        this.animFrameId = requestAnimationFrame(loop);
      };
      loop();
    }
    // --- CANVAS DRAG BOUNDS & POINTER HANDLERS ---
    computeSlidingBounds(block, currentBlocks, level) {
      const isHorizontal = block.width > block.height;
      const isVertical = block.height > block.width;
      const isSingle = block.width === 1 && block.height === 1;
      const cols = level.cols;
      const rows = level.rows;
      const grid = Array.from(
        { length: rows },
        () => Array.from({ length: cols }, () => null)
      );
      for (const b of currentBlocks) {
        if (b.id !== block.id) {
          for (let r = 0; r < b.height; r++) {
            for (let c = 0; c < b.width; c++) {
              if (b.y + r < rows && b.x + c < cols) {
                grid[b.y + r][b.x + c] = b.id;
              }
            }
          }
        }
      }
      let minX = block.x;
      let maxX = block.x;
      let minY = block.y;
      let maxY = block.y;
      if (isHorizontal || isSingle) {
        while (minX > 0) {
          let canMove = true;
          for (let r = 0; r < block.height; r++) {
            if (grid[block.y + r][minX - 1] !== null) {
              canMove = false;
              break;
            }
          }
          if (canMove) minX--;
          else break;
        }
        while (maxX + block.width < cols) {
          let canMove = true;
          for (let r = 0; r < block.height; r++) {
            if (grid[block.y + r][maxX + block.width] !== null) {
              canMove = false;
              break;
            }
          }
          if (canMove) maxX++;
          else break;
        }
      }
      if (isVertical || isSingle) {
        while (minY > 0) {
          let canMove = true;
          for (let c = 0; c < block.width; c++) {
            if (grid[minY - 1][block.x + c] !== null) {
              canMove = false;
              break;
            }
          }
          if (canMove) minY--;
          else break;
        }
        while (maxY + block.height < rows) {
          let canMove = true;
          for (let c = 0; c < block.width; c++) {
            if (grid[maxY + block.height][block.x + c] !== null) {
              canMove = false;
              break;
            }
          }
          if (canMove) maxY++;
          else break;
        }
      }
      return {
        minX,
        maxX,
        minY,
        maxY,
        isHorizontal: isHorizontal || isSingle,
        isVertical: isVertical || isSingle
      };
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("app");
    if (root) {
      new GameApp(root);
    }
  });
})();
