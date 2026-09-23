/**
 * Standalone Museum Art Heist Logic Grid Game (Pure Vanilla JS)
 * Features Dynamic Responsive Flex-Wrap Subgrid Layout
 */

(function () {
  const LEVELS = [
    {
      id: 1,
      title: "Nível 1: O Mistério da Galeria Norte",
      detectives: [
        { id: "sarah", name: "Det. Sarah", icon: "🔍" },
        { id: "charles", name: "Insp. Charles", icon: "🕵️‍♂️" },
        { id: "elena", name: "Agente Elena", icon: "🕶️" }
      ],
      paintings: [
        { id: "starry", name: "Noite Estrelada", icon: "🌌" },
        { id: "mona", name: "Mona Lisa", icon: "🎨" },
        { id: "sunflower", name: "Girassol", icon: "🌻" }
      ],
      clues: [
        { id: "glove", name: "Luva Veludo", icon: "🧤" },
        { id: "footprint", name: "Pegada nº 42", icon: "👞" },
        { id: "card", name: "Cartão Coringa", icon: "🃏" }
      ],
      solution: [
        { detectiveId: "sarah", paintingId: "starry", clueId: "glove" },
        { detectiveId: "charles", paintingId: "sunflower", clueId: "footprint" },
        { detectiveId: "elena", paintingId: "mona", clueId: "card" }
      ],
      cluesText: [
        "1. Sarah Vance NÃO encontrou a Pegada de Lamaçal nem o Cartão do Coringa.",
        "2. O caso da 'Noite Estrelada' foi atribuído diretamente a Sarah Vance.",
        "3. O roubo da 'Mona Lisa' deixou como evidência o Cartão do Coringa.",
        "4. O Inspetor Charles NÃO está com o caso da 'Mona Lisa'."
      ]
    },
    {
      id: 2,
      title: "Nível 2: A Sala das Relíquias Barrocas",
      detectives: [
        { id: "sarah", name: "Det. Sarah", icon: "🔍" },
        { id: "charles", name: "Insp. Charles", icon: "🕵️‍♂️" },
        { id: "elena", name: "Agente Elena", icon: "🕶️" },
        { id: "kenji", name: "Perito Kenji", icon: "🔬" }
      ],
      paintings: [
        { id: "portrait", name: "Retrato Real", icon: "👑" },
        { id: "lady", name: "Dama Arminho", icon: "🦔" },
        { id: "scream", name: "Grito Meia-Noite", icon: "😱" },
        { id: "boat", name: "Barco Luar", icon: "⛵" }
      ],
      clues: [
        { id: "glove", name: "Fibra Luva", icon: "🧤" },
        { id: "laser", name: "Fita Laser", icon: "⚡" },
        { id: "perfume", name: "Perfume Francês", icon: "🧪" },
        { id: "key", name: "Chave Mestra", icon: "🗝️" }
      ],
      solution: [
        { detectiveId: "sarah", paintingId: "lady", clueId: "glove" },
        { detectiveId: "charles", paintingId: "boat", clueId: "perfume" },
        { detectiveId: "elena", paintingId: "portrait", clueId: "laser" },
        { detectiveId: "kenji", paintingId: "scream", clueId: "key" }
      ],
      cluesText: [
        "1. A Agente Elena Vega encontrou no seu caso a Fita Laser Rompida.",
        "2. O caso do quadro 'Grito Meia-Noite' tem como pista a Chave Mestra.",
        "3. Kenji Sato NÃO investiga 'Barco Luar' nem 'Retrato Real', e sua pista foi a Chave Mestra.",
        "4. 'Dama com Arminho' está com Sarah Vance, que não encontrou Laser nem Perfume.",
        "5. O Inspetor Charles localizou o Perfume Francês, mas não investiga o 'Retrato Real'."
      ]
    }
  ];

  let currentLevelIdx = 0;
  let startTime = Date.now();
  let gridState = { AB: [], AC: [], BC: [] };
  let isWon = false;

  function initLevel(lvlIdx) {
    currentLevelIdx = lvlIdx;
    startTime = Date.now();
    isWon = false;
    const lvl = LEVELS[currentLevelIdx];
    const n = lvl.detectives.length;

    const makeMatrix = () => Array.from({ length: n }, () => Array(n).fill(0));
    gridState = {
      AB: makeMatrix(),
      AC: makeMatrix(),
      BC: makeMatrix()
    };

    render();
  }

  function render() {
    const lvl = LEVELS[currentLevelIdx];
    const app = document.getElementById('game-app');
    if (!app) return;

    let html = `
      <div style="padding: 12px; display: flex; flex-direction: column; height: 100%; box-sizing: border-box; overflow-y: auto;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #1e293b; padding-bottom: 8px; flex-shrink: 0;">
          <div>
            <h2 style="margin: 0; font-size: 15px; color: #facc15;">${lvl.title}</h2>
            
          </div>
          <div style="display: flex; gap: 6px; flex-shrink: 0;">
            <button id="btn-reset" class="btn-tactile" style="background: #1e293b; color: #cbd5e1; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: bold;">Limpar</button>
            <button id="btn-next" class="btn-tactile" style="background: #eab308; color: #020617; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold;">${currentLevelIdx < LEVELS.length - 1 ? 'Próxima Fase' : 'Reiniciar'}</button>
          </div>
        </div>

        <!-- Dynamic Subgrids Area (Flex-Wrap for Zero Horizontal Scroll) -->
        <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; align-items: flex-start; margin-bottom: 10px;">
          
          <!-- Subgrid 1: Detectives x Paintings -->
          <div style="flex: 1 1 280px; max-width: 400px; background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 8px;">
            <div style="font-size: 11px; font-weight: bold; color: #38bdf8; margin-bottom: 6px; display: flex; justify-content: space-between;">
              <span>🕵️ Investigadores × 🎨 Obras</span>
              <span style="color: #64748b;">1/3</span>
            </div>
            <div style="display: flex; justify-content: center;">
              <table style="border-collapse: collapse; user-select: none;">
                <thead>
                  <tr>
                    <th style="border: 1px solid transparent;"></th>
                    ${lvl.paintings.map(p => `
                      <th style="background: #1e293b; border: 1px solid #334155; padding: 4px; font-size: 9px; text-align: center; width: 34px;">
                        <div>${p.icon}</div>
                        <div style="font-size: 8px; color: #94a3b8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 34px;">${p.name.split(' ')[0]}</div>
                      </th>
                    `).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${lvl.detectives.map((d, r) => `
                    <tr>
                      <th style="background: #1e293b; border: 1px solid #334155; padding: 4px 6px; text-align: left; font-size: 10px; color: #38bdf8; white-space: nowrap;">
                        ${d.icon} ${d.name}
                      </th>
                      ${lvl.paintings.map((_, c) => renderCell('AB', r, c)).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Subgrid 2: Detectives x Clues -->
          <div style="flex: 1 1 280px; max-width: 400px; background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 8px;">
            <div style="font-size: 11px; font-weight: bold; color: #f43f5e; margin-bottom: 6px; display: flex; justify-content: space-between;">
              <span>🕵️ Investigadores × 🔬 Pistas</span>
              <span style="color: #64748b;">2/3</span>
            </div>
            <div style="display: flex; justify-content: center;">
              <table style="border-collapse: collapse; user-select: none;">
                <thead>
                  <tr>
                    <th style="border: 1px solid transparent;"></th>
                    ${lvl.clues.map(c => `
                      <th style="background: #1e293b; border: 1px solid #334155; padding: 4px; font-size: 9px; text-align: center; width: 34px;">
                        <div>${c.icon}</div>
                        <div style="font-size: 8px; color: #94a3b8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 34px;">${c.name.split(' ')[0]}</div>
                      </th>
                    `).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${lvl.detectives.map((d, r) => `
                    <tr>
                      <th style="background: #1e293b; border: 1px solid #334155; padding: 4px 6px; text-align: left; font-size: 10px; color: #38bdf8; white-space: nowrap;">
                        ${d.icon} ${d.name}
                      </th>
                      ${lvl.clues.map((_, c) => renderCell('AC', r, c)).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Subgrid 3: Paintings x Clues -->
          <div style="flex: 1 1 280px; max-width: 400px; background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 8px;">
            <div style="font-size: 11px; font-weight: bold; color: #facc15; margin-bottom: 6px; display: flex; justify-content: space-between;">
              <span>🎨 Obras × 🔬 Pistas Forenses</span>
              <span style="color: #64748b;">3/3</span>
            </div>
            <div style="display: flex; justify-content: center;">
              <table style="border-collapse: collapse; user-select: none;">
                <thead>
                  <tr>
                    <th style="border: 1px solid transparent;"></th>
                    ${lvl.clues.map(c => `
                      <th style="background: #1e293b; border: 1px solid #334155; padding: 4px; font-size: 9px; text-align: center; width: 34px;">
                        <div>${c.icon}</div>
                        <div style="font-size: 8px; color: #94a3b8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 34px;">${c.name.split(' ')[0]}</div>
                      </th>
                    `).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${lvl.paintings.map((p, r) => `
                    <tr>
                      <th style="background: #1e293b; border: 1px solid #334155; padding: 4px 6px; text-align: left; font-size: 10px; color: #facc15; white-space: nowrap;">
                        ${p.icon} ${p.name}
                      </th>
                      ${lvl.clues.map((_, c) => renderCell('BC', r, c)).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- Clues List -->
        <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 10px; padding: 10px; flex-shrink: 0;">
          <div style="font-size: 11px; font-weight: bold; color: #facc15; margin-bottom: 4px;">📜 Pistas do Caso:</div>
          ${lvl.cluesText.map(t => `<div style="font-size: 11px; color: #cbd5e1; margin-bottom: 3px;">• ${t}</div>`).join('')}
        </div>
      </div>
    `;

    app.innerHTML = html;

    // Listeners
    app.querySelectorAll('.grid-cell').forEach(el => {
      el.addEventListener('click', () => {
        const target = el.dataset.target;
        const r = parseInt(el.dataset.row, 10);
        const c = parseInt(el.dataset.col, 10);
        toggle(target, r, c);
      });
    });

    document.getElementById('btn-reset')?.addEventListener('click', () => {
      initLevel(currentLevelIdx);
    });

    document.getElementById('btn-next')?.addEventListener('click', () => {
      initLevel((currentLevelIdx + 1) % LEVELS.length);
    });
  }

  function renderCell(target, r, c) {
    const val = gridState[target][r][c];
    let char = '';
    let cls = 'grid-cell';
    if (val === 1) {
      char = '✕';
      cls += ' cell-cross';
    } else if (val === 2) {
      char = '✓';
      cls += ' cell-check';
    }
    return `<td class="${cls}" data-target="${target}" data-row="${r}" data-col="${c}">${char}</td>`;
  }

  function toggle(target, r, c) {
    if (isWon) return;
    const current = gridState[target][r][c];
    const next = current === 0 ? 1 : (current === 1 ? 2 : 0);
    gridState[target][r][c] = next;

    const n = LEVELS[currentLevelIdx].detectives.length;
    if (next === 2) {
      for (let i = 0; i < n; i++) {
        if (i !== c && gridState[target][r][i] !== 1) gridState[target][r][i] = 1;
        if (i !== r && gridState[target][i][c] !== 1) gridState[target][i][c] = 1;
      }
    }

    checkWin();
    render();
  }

  function checkWin() {
    const lvl = LEVELS[currentLevelIdx];
    let allGood = true;

    for (const sol of lvl.solution) {
      const dIdx = lvl.detectives.findIndex(d => d.id === sol.detectiveId);
      const pIdx = lvl.paintings.findIndex(p => p.id === sol.paintingId);
      const cIdx = lvl.clues.findIndex(c => c.id === sol.clueId);

      if (gridState.AB[dIdx][pIdx] !== 2 || gridState.AC[dIdx][cIdx] !== 2 || gridState.BC[pIdx][cIdx] !== 2) {
        allGood = false;
        break;
      }
    }

    if (allGood && !isWon) {
      isWon = true;
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      
      // Platform trigger (PostMessage to parent)
      if (typeof window !== 'undefined' && window.parent) {
        window.parent.postMessage({ type: 'win', time: elapsed }, '*');
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initLevel(0);
  });
})();
