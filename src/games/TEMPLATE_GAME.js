/**
 * MODELO DE JOGO DROP-IN (TEMPLATE)
 * 
 * Estrutura da pasta do jogo:
 * /src/games/meu-jogo/
 *   ├── index.html (ou index.js / game.js)
 *   ├── meta.json  (apenas metadados e SEO - somente leitura)
 *   └── cover.svg  (capa opcional)
 * 
 * 💡 ONDE FICA O CÁLCULO DE RATING E VIEWS?
 * - O motor central (src/utils/gameStats.ts) calcula e persiste tudo automaticamente.
 * - Dentro do seu game.js você pode consultar ou interagir usando a API global window.FunLogic:
 * 
 *   // 1. Obter estatísticas em tempo real (Rating, Reviews, Plays)
 *   const stats = window.FunLogic.getStats('meu-jogo');
 *   console.log(stats.ratingValue, stats.formattedPlaysCount);
 * 
 *   // 2. Registrar uma jogada manualmente (caso necessário)
 *   window.FunLogic.recordPlay('meu-jogo');
 * 
 *   // 3. Registrar avaliação de estrelas (1 a 5)
 *   window.FunLogic.rateGame('meu-jogo', 5);
 * 
 *   // 4. Exibir tela de vitória com modal e avaliação de estrelas
 *   window.FunLogic.showVictory({ title: 'Meu Jogo', timeSeconds: 45, gameId: 'meu-jogo' });
 */

export const title = "My Awesome Puzzle";
export const instructions = "Click the tiles and solve the challenge to win!";

/**
 * Função chamada quando o jogador clica para jogar.
 * @param {HTMLElement} container - O elemento HTML do palco onde o jogo será montado.
 * @param {Function} onWin - Chame onWin(tempoSegundos) quando o jogador vencer!
 * @returns {Function|void} - (Opcional) Função de cleanup/limpeza ao sair da tela.
 */
export function render(container, onWin) {
  let timerSeconds = 0;

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
      <div class="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-black mb-3 shadow-inner">
        🎮
      </div>
      <h2 class="text-2xl font-black text-gray-900 mb-2">${title}</h2>
      <p class="text-xs text-gray-600 font-semibold mb-6">${instructions}</p>

      <div class="p-6 bg-white rounded-3xl border-2 border-emerald-500/20 shadow-md w-full mb-6">
        <p class="text-sm font-bold text-gray-800 mb-4">Clique no botão abaixo para concluir o teste:</p>
        <button id="btn-resolver" class="h-14 px-8 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] active:scale-95 text-white font-black text-base shadow-md transition cursor-pointer border-b-4 border-[#3D8F02]">
          Completar Desafio!
        </button>
      </div>

      <div class="text-xs font-bold text-gray-400">
        Tempo decorrido: <span id="tempo-decorrido" class="text-gray-800">0s</span>
      </div>
    </div>
  `;

  // Cronômetro simples
  const timer = setInterval(() => {
    timerSeconds++;
    const span = container.querySelector('#tempo-decorrido');
    if (span) span.textContent = `${timerSeconds}s`;
  }, 1000);

  // Ação de vitória
  const btn = container.querySelector('#btn-resolver');
  btn?.addEventListener('click', () => {
    clearInterval(timer);
    onWin(timerSeconds); // Dispara modal de vitória, comemoração e salva dados!
  });

  return () => {
    clearInterval(timer);
  };
}
