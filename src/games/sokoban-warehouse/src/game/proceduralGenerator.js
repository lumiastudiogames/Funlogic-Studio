const DIRS = [
  { dir: 'up', dx: 0, dy: -1, opp: 'down' },
  { dir: 'down', dx: 0, dy: 1, opp: 'up' },
  { dir: 'left', dx: -1, dy: 0, opp: 'right' },
  { dir: 'right', dx: 1, dy: 0, opp: 'left' },
];

function coordKey(c) {
  return `${c.x},${c.y}`;
}

function stateKey(playerComp, crates) {
  const cKeys = crates.map(coordKey).join(';');
  return `${playerComp.x},${playerComp.y}|${cKeys}`;
}

function sortCoords(coords) {
  return [...coords].sort((a, b) => (a.y !== b.y ? a.y - b.y : a.x - b.x));
}

function getReachableFloor(start, isWall, cratesSet) {
  const reachable = new Set();
  const queue = [start];
  const startKey = coordKey(start);
  reachable.add(startKey);

  let canonical = start;

  while (queue.length > 0) {
    const cur = queue.shift();
    if (cur.y < canonical.y || (cur.y === canonical.y && cur.x < canonical.x)) {
      canonical = cur;
    }

    for (const d of DIRS) {
      const nx = cur.x + d.dx;
      const ny = cur.y + d.dy;
      const key = `${nx},${ny}`;
      if (!isWall(nx, ny) && !cratesSet.has(key) && !reachable.has(key)) {
        reachable.add(key);
        queue.push({ x: nx, y: ny });
      }
    }
  }

  return { reachable, canonical };
}

function findPath(from, to, isWall, cratesSet) {
  if (from.x === to.x && from.y === to.y) return [];
  const queue = [{ pos: from, path: [] }];
  const visited = new Set([coordKey(from)]);

  while (queue.length > 0) {
    const { pos, path } = queue.shift();
    if (pos.x === to.x && pos.y === to.y) return path;

    for (const d of DIRS) {
      const nx = pos.x + d.dx;
      const ny = pos.y + d.dy;
      const key = `${nx},${ny}`;
      if (!isWall(nx, ny) && !cratesSet.has(key) && !visited.has(key)) {
        visited.add(key);
        queue.push({ pos: { x: nx, y: ny }, path: [...path, d.dir] });
      }
    }
  }
  return null;
}

export function solveSokobanLevel(level, maxIterations = 8000) {
  const lines = level.grid;
  const rows = lines.length;
  const cols = Math.max(...lines.map((l) => l.length));

  let player = { x: 0, y: 0 };
  const crates = [];
  const targets = [];
  const walls = new Set();

  for (let y = 0; y < rows; y++) {
    const line = lines[y] || '';
    for (let x = 0; x < cols; x++) {
      const c = line[x] || ' ';
      if (c === '#') {
        walls.add(`${x},${y}`);
      } else if (c === '.') {
        targets.push({ x, y });
      } else if (c === '$') {
        crates.push({ x, y });
      } else if (c === '*') {
        targets.push({ x, y });
        crates.push({ x, y });
      } else if (c === '@') {
        player = { x, y };
      } else if (c === '+') {
        targets.push({ x, y });
        player = { x, y };
      }
    }
  }

  const isWall = (x, y) => walls.has(`${x},${y}`);
  const targetKeys = new Set(targets.map(coordKey));

  const isSolved = (cratesList) =>
    cratesList.every((c) => targetKeys.has(coordKey(c)));

  const initialCrates = sortCoords(crates);
  if (isSolved(initialCrates)) {
    return { solvable: true, moves: [], pushes: 0, parMoves: 0, steps: [] };
  }

  const initialCratesSet = new Set(initialCrates.map(coordKey));
  const initComp = getReachableFloor(player, isWall, initialCratesSet);

  const startNode = {
    player,
    crates: initialCrates,
    parent: null,
    moveDir: 'down',
    isPush: false,
  };

  const queue = [startNode];
  const visited = new Set();
  visited.add(stateKey(initComp.canonical, initialCrates));

  let goalNode = null;
  let iterations = 0;

  while (queue.length > 0 && iterations < maxIterations) {
    iterations++;
    const current = queue.shift();

    if (isSolved(current.crates)) {
      goalNode = current;
      break;
    }

    const currentCratesSet = new Set(current.crates.map(coordKey));
    const comp = getReachableFloor(current.player, isWall, currentCratesSet);

    for (let i = 0; i < current.crates.length; i++) {
      const crate = current.crates[i];
      for (const d of DIRS) {
        const playerPushPos = { x: crate.x - d.dx, y: crate.y - d.dy };
        const crateNextPos = { x: crate.x + d.dx, y: crate.y + d.dy };

        if (comp.reachable.has(coordKey(playerPushPos))) {
          const nextKey = coordKey(crateNextPos);
          if (!isWall(crateNextPos.x, crateNextPos.y) && !currentCratesSet.has(nextKey)) {
            const nextCrates = current.crates.map((c, idx) => (idx === i ? crateNextPos : c));
            const sortedNextCrates = sortCoords(nextCrates);
            const nextCratesSet = new Set(sortedNextCrates.map(coordKey));

            const newPlayer = { x: crate.x, y: crate.y };
            const nextComp = getReachableFloor(newPlayer, isWall, nextCratesSet);
            const key = stateKey(nextComp.canonical, sortedNextCrates);

            if (!visited.has(key)) {
              visited.add(key);
              queue.push({
                player: newPlayer,
                crates: sortedNextCrates,
                parent: current,
                moveDir: d.dir,
                isPush: true,
                crateFrom: { x: crate.x, y: crate.y },
                crateTo: crateNextPos,
              });
            }
          }
        }
      }
    }
  }

  if (!goalNode) {
    return { solvable: false, moves: [], pushes: 0, parMoves: 0, steps: [] };
  }

  const pushSequence = [];
  let curr = goalNode;
  while (curr && curr.parent) {
    pushSequence.unshift(curr);
    curr = curr.parent;
  }

  const fullMoves = [];
  const fullSteps = [];
  let simulatedPlayer = player;
  let simulatedCrates = [...initialCrates];

  for (const pNode of pushSequence) {
    const simulatedCratesSet = new Set(simulatedCrates.map(coordKey));
    const dObj = DIRS.find((d) => d.dir === pNode.moveDir);
    const pushFrom = {
      x: pNode.crateFrom.x - dObj.dx,
      y: pNode.crateFrom.y - dObj.dy,
    };

    const walk = findPath(simulatedPlayer, pushFrom, isWall, simulatedCratesSet);
    if (walk) {
      for (const wDir of walk) {
        const wObj = DIRS.find((d) => d.dir === wDir);
        const nextP = { x: simulatedPlayer.x + wObj.dx, y: simulatedPlayer.y + wObj.dy };
        fullSteps.push({
          playerFrom: simulatedPlayer,
          playerTo: nextP,
          direction: wDir,
          isPush: false,
        });
        simulatedPlayer = nextP;
        fullMoves.push(wDir);
      }
    }

    const nextPlayer = { x: pNode.crateFrom.x, y: pNode.crateFrom.y };
    fullSteps.push({
      playerFrom: simulatedPlayer,
      playerTo: nextPlayer,
      direction: pNode.moveDir,
      isPush: true,
      crateFrom: pNode.crateFrom,
      crateTo: pNode.crateTo,
    });
    fullMoves.push(pNode.moveDir);
    simulatedPlayer = nextPlayer;

    simulatedCrates = simulatedCrates.map((c) =>
      c.x === pNode.crateFrom.x && c.y === pNode.crateFrom.y ? pNode.crateTo : c
    );
  }

  return {
    solvable: true,
    moves: fullMoves,
    pushes: pushSequence.length,
    parMoves: fullMoves.length,
    steps: fullSteps,
  };
}

let proceduralCounter = 1;

export function generateProceduralLevel(options = {}) {
  const numCrates = options.numCrates || (options.difficulty === 'hard' ? 3 : 2);

  const templates = [
    [
      '#######',
      '#     #',
      '#     #',
      '#     #',
      '#     #',
      '#######',
    ],
    [
      '########',
      '#      #',
      '#  #   #',
      '#      #',
      '#      #',
      '########',
    ],
    [
      '########',
      '#      #',
      '#   #  #',
      '#   #  #',
      '#      #',
      '########',
    ],
    [
      '#######',
      '#     #',
      '#  #  #',
      '#     #',
      '#     #',
      '#######',
    ],
  ];

  for (let attempt = 0; attempt < 25; attempt++) {
    const rawTemplate =
      options.baseLayout || templates[attempt % templates.length];
    const rows = rawTemplate.length;
    const cols = Math.max(...rawTemplate.map((r) => r.length));

    const floorCells = [];
    for (let y = 1; y < rows - 1; y++) {
      for (let x = 1; x < cols - 1; x++) {
        if (rawTemplate[y]?.[x] !== '#') {
          floorCells.push({ x, y });
        }
      }
    }

    if (floorCells.length < numCrates + 2) continue;

    const shuffled = [...floorCells].sort(() => Math.random() - 0.5);

    const nonCornerFloors = shuffled.filter((c) => {
      const upWall = rawTemplate[c.y - 1]?.[c.x] === '#';
      const downWall = rawTemplate[c.y + 1]?.[c.x] === '#';
      const leftWall = rawTemplate[c.y]?.[c.x - 1] === '#';
      const rightWall = rawTemplate[c.y]?.[c.x + 1] === '#';
      return !(
        (upWall && leftWall) ||
        (upWall && rightWall) ||
        (downWall && leftWall) ||
        (downWall && rightWall)
      );
    });

    const candidateTargets = nonCornerFloors.length >= numCrates ? nonCornerFloors : shuffled;
    const chosenTargets = candidateTargets.slice(0, numCrates);
    const targetSet = new Set(chosenTargets.map(coordKey));

    let curCrates = chosenTargets.map((c) => ({ x: c.x, y: c.y }));
    const remainingFloors = shuffled.filter((c) => !targetSet.has(coordKey(c)));
    let curPlayer = remainingFloors[0] || { x: 1, y: 1 };

    const reversePulls = 24 + Math.floor(Math.random() * 20);
    const isWallCell = (x, y) =>
      x <= 0 || y <= 0 || x >= cols - 1 || y >= rows - 1 || rawTemplate[y]?.[x] === '#';

    for (let step = 0; step < reversePulls; step++) {
      const cratesSet = new Set(curCrates.map(coordKey));
      const comp = getReachableFloor(curPlayer, isWallCell, cratesSet);

      const validPulls = [];

      for (let ci = 0; ci < curCrates.length; ci++) {
        const crate = curCrates[ci];
        for (const d of DIRS) {
          const workerPos = { x: crate.x + d.dx, y: crate.y + d.dy };
          if (comp.reachable.has(coordKey(workerPos))) {
            const workerPullTarget = { x: workerPos.x + d.dx, y: workerPos.y + d.dy };
            const nKey = coordKey(workerPullTarget);
            if (!isWallCell(workerPullTarget.x, workerPullTarget.y) && !cratesSet.has(nKey)) {
              const upW = isWallCell(workerPos.x, workerPos.y - 1);
              const downW = isWallCell(workerPos.x, workerPos.y + 1);
              const leftW = isWallCell(workerPos.x - 1, workerPos.y);
              const rightW = isWallCell(workerPos.x + 1, workerPos.y);
              const isCorner =
                (upW && leftW) || (upW && rightW) || (downW && leftW) || (downW && rightW);
              if (!isCorner || targetSet.has(coordKey(workerPos))) {
                validPulls.push({
                  crateIdx: ci,
                  workerNew: workerPullTarget,
                  crateNew: workerPos,
                });
              }
            }
          }
        }
      }

      if (validPulls.length === 0) break;
      const chosen = validPulls[Math.floor(Math.random() * validPulls.length)];
      curCrates[chosen.crateIdx] = chosen.crateNew;
      curPlayer = chosen.workerNew;
    }

    const onTargetCount = curCrates.filter((c) => targetSet.has(coordKey(c))).length;
    if (onTargetCount === curCrates.length) {
      continue;
    }

    const gridRows = [];
    const finalCratesSet = new Set(curCrates.map(coordKey));

    for (let y = 0; y < rows; y++) {
      let rowStr = '';
      for (let x = 0; x < cols; x++) {
        if (rawTemplate[y]?.[x] === '#') {
          rowStr += '#';
        } else {
          const isP = curPlayer.x === x && curPlayer.y === y;
          const isC = finalCratesSet.has(`${x},${y}`);
          const isT = targetSet.has(`${x},${y}`);

          if (isC && isT) rowStr += '*';
          else if (isC) rowStr += '$';
          else if (isP && isT) rowStr += '+';
          else if (isP) rowStr += '@';
          else if (isT) rowStr += '.';
          else rowStr += ' ';
        }
      }
      gridRows.push(rowStr);
    }

    const levelId = 100 + proceduralCounter;
    const testLevel = {
      id: levelId,
      name: `Procedural Bay #${proceduralCounter}`,
      grid: gridRows,
      parMoves: 25,
      decorations: [
        { type: 'barrel', x: 1, y: rows - 2 },
        { type: 'pallet', x: cols - 2, y: 1 },
      ],
    };

    const solution = solveSokobanLevel(testLevel);
    if (solution.solvable && solution.moves.length >= 6) {
      proceduralCounter++;
      testLevel.parMoves = Math.max(solution.moves.length, 12);
      return {
        level: testLevel,
        solution,
      };
    }
  }

  const fallbackLevel = {
    id: 100 + proceduralCounter++,
    name: `Procedural Bay #${proceduralCounter}`,
    grid: [
      '########',
      '#  .   #',
      '#  $   #',
      '# @$ . #',
      '#  $   #',
      '#   .  #',
      '########',
    ],
    parMoves: 38,
    decorations: [
      { type: 'barrel', x: 1, y: 5 },
      { type: 'pallet', x: 6, y: 1 },
    ],
  };
  const fallbackSolution = solveSokobanLevel(fallbackLevel);

  return {
    level: fallbackLevel,
    solution: fallbackSolution,
  };
}
