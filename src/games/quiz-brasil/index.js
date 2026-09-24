export const title = "Quiz Brasil: Capitais & Desafios";
export const instructions = "Teste seus conhecimentos rápidos respondendo às perguntas antes do tempo acabar!";
export const playsCount = "3.4k";
export const isTrending = true;

export function render(container, onWin) {
  let score = 0;
  let currentQuestion = 0;
  let timerSeconds = 0;

  const questions = [
    {
      q: "Qual é a capital do Brasil?",
      options: ["Rio de Janeiro", "Brasília", "São Paulo", "Salvador"],
      correct: 1
    },
    {
      q: "Qual destes animais é típico do pantanal e cerrado brasileiro?",
      options: ["Lobo-Guará", "Canguru", "Pinguim", "Urso Polar"],
      correct: 0
    },
    {
      q: "Quantos estados compõem a República Federativa do Brasil (além do DF)?",
      options: ["24", "25", "26", "27"],
      correct: 2
    }
  ];

  function renderQuestion() {
    if (currentQuestion >= questions.length) {
      // Venceu!
      clearInterval(timer);
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
          <div class="text-6xl mb-4 animate-bounce">🏆</div>
          <h2 class="text-2xl font-black text-gray-900 mb-2">Parabéns!</h2>
          <p class="text-sm font-semibold text-gray-600 mb-6">Você acertou todas as perguntas com louvor!</p>
          <button id="btn-finish" class="px-8 py-3 bg-[#58CC02] text-white font-black rounded-2xl shadow-md active:scale-95 cursor-pointer">
            Coletar Troféu
          </button>
        </div>
      `;
      container.querySelector('#btn-finish')?.addEventListener('click', () => {
        onWin(timerSeconds, 3);
      });
      return;
    }

    const q = questions[currentQuestion];

    container.innerHTML = `
      <div class="flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div class="flex items-center justify-between w-full mb-4 px-2">
          <span class="text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Questão ${currentQuestion + 1} de ${questions.length}
          </span>
          <span class="text-xs font-bold text-gray-400">
            ⏱️ <span id="quiz-timer">${timerSeconds}s</span>
          </span>
        </div>

        <div class="w-full bg-white rounded-3xl p-6 border-2 border-emerald-500/20 shadow-md mb-6">
          <h3 class="text-lg font-bold text-gray-900 mb-6">${q.q}</h3>
          
          <div class="flex flex-col gap-3">
            ${q.options.map((opt, idx) => `
              <button data-idx="${idx}" class="btn-opt w-full py-3.5 px-4 text-left font-bold text-sm text-gray-700 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border-2 border-gray-200 rounded-2xl transition cursor-pointer active:scale-98">
                ${String.fromCharCode(65 + idx)}) ${opt}
              </button>
            `).join('')}
          </div>
        </div>

        <div id="quiz-feedback" class="h-6 text-xs font-black"></div>
      </div>
    `;

    const buttons = container.querySelectorAll('.btn-opt');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = parseInt(btn.getAttribute('data-idx') || '0', 10);
        const feedback = container.querySelector('#quiz-feedback');
        if (selected === q.correct) {
          btn.classList.remove('bg-gray-50', 'border-gray-200');
          btn.classList.add('bg-emerald-500', 'text-white', 'border-emerald-600');
          if (feedback) {
            feedback.textContent = '🎉 Resposta Correta!';
            feedback.className = 'h-6 text-xs font-black text-emerald-600';
          }
          score++;
          setTimeout(() => {
            currentQuestion++;
            renderQuestion();
          }, 600);
        } else {
          btn.classList.remove('bg-gray-50', 'border-gray-200');
          btn.classList.add('bg-red-500', 'text-white', 'border-red-600');
          if (feedback) {
            feedback.textContent = '❌ Tente novamente!';
            feedback.className = 'h-6 text-xs font-black text-red-500';
          }
        }
      });
    });
  }

  const timer = setInterval(() => {
    timerSeconds++;
    const span = container.querySelector('#quiz-timer');
    if (span) span.textContent = `${timerSeconds}s`;
  }, 1000);

  renderQuestion();

  return () => {
    clearInterval(timer);
  };
}
