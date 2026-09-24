import { setupMobileAnchorAd } from './AdBanner';
import { STICKERS } from './Stickers';
import { recordGameRating, getGameLiveStats } from '../utils/gameStats';

export function showVictoryModal(options: {
  title: string;
  timeSeconds: number;
  streak?: number;
  gameId: string;
  onRestart?: () => void;
  onClose: () => void;
}): void {
  // Hide mobile anchor ad to give maximum visual priority to victory screen
  const anchorAd = setupMobileAnchorAd(document.body);
  anchorAd.hide();

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'victory-modal';
  modalOverlay.className = 'fixed inset-0 z-[100] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in modal-overlay';

  const m = Math.floor(options.timeSeconds / 60);
  const s = options.timeSeconds % 60;
  const timeFormatted = m > 0 ? `${m}m ${s}s` : `${s}s`;

  modalOverlay.innerHTML = `
    <div id="victory-modal-card" class="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-black/5 relative transform transition-all scale-100 modal-card" onclick="event.stopPropagation()">
      
      <!-- Trophy Mini-Sticker -->
      <div class="w-20 h-20 p-2 mx-auto mb-3 filter drop-shadow-md animate-bounce">
        ${STICKERS.trophy}
      </div>

      <h2 class="font-black text-2xl text-gray-900 mb-1">
        Victory! Level Complete!
      </h2>
      <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-4">
        ${options.title}
      </p>

      <!-- Stats Pill -->
      <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-4 grid grid-cols-${options.streak ? '2' : '1'} gap-3">
        <div>
          <div class="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest">Total Time</div>
          <div class="text-xl font-black text-emerald-950">${timeFormatted}</div>
        </div>
        ${options.streak ? `
          <div>
            <div class="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest">Daily Streak</div>
            <div class="text-xl font-black text-amber-950 flex items-center justify-center gap-1">${options.streak} Days <span class="w-4 h-4 inline-block">${STICKERS.flame}</span></div>
          </div>
        ` : ''}
      </div>

      <!-- Quick Real Rating -->
      <div id="rating-box" class="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-4">
        <div class="text-[11px] font-bold text-gray-600 mb-1.5">Rate this puzzle:</div>
        <div class="flex items-center justify-center gap-2" id="star-rating-buttons">
          <button data-star="1" class="text-2xl hover:scale-125 transition text-amber-400 cursor-pointer">★</button>
          <button data-star="2" class="text-2xl hover:scale-125 transition text-amber-400 cursor-pointer">★</button>
          <button data-star="3" class="text-2xl hover:scale-125 transition text-amber-400 cursor-pointer">★</button>
          <button data-star="4" class="text-2xl hover:scale-125 transition text-amber-400 cursor-pointer">★</button>
          <button data-star="5" class="text-2xl hover:scale-125 transition text-amber-400 cursor-pointer">★</button>
        </div>
        <div id="rating-feedback" class="text-[10px] text-emerald-700 font-bold mt-1 hidden">Thank you for rating! ⭐</div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col gap-2.5">
        <button id="btn-restart-victory" class="w-full h-12 bg-[#58CC02] hover:bg-[#4EBA02] active:scale-95 text-white font-black text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer border-0">
          <span class="text-lg">🔄</span>
          <span>Play Again</span>
        </button>

        <button id="btn-share" class="w-full h-11 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold text-xs rounded-2xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer border-0">
          <span>Share Result</span>
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
        </button>

        <a href="#home" id="btn-home-victory" class="w-full h-11 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-800 font-bold text-xs rounded-2xl transition flex items-center justify-center text-decoration-none">
          Back to Home
        </a>
      </div>

      <!-- Close Button -->
      <button id="btn-close-victory" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold p-2 leading-none cursor-pointer" title="Close">
        ✕
      </button>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  // Setup rating button click handlers
  const starButtons = modalOverlay.querySelectorAll('#star-rating-buttons button');
  const ratingFeedback = modalOverlay.querySelector('#rating-feedback');
  starButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const star = parseInt((e.currentTarget as HTMLElement).dataset.star || '5', 10);
      recordGameRating(options.gameId, star);
      if (ratingFeedback) ratingFeedback.classList.remove('hidden');
    });
  });

  const shareText = `Resolvi ${options.title} em ${timeFormatted}! ${options.streak ? `🔥 ${options.streak} dias seguidos!` : ''} Jogue grátis em FunLogic: ${window.location.origin}`;

  const shareBtn = modalOverlay.querySelector('#btn-share');
  shareBtn?.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FunLogic Vitória',
          text: shareText,
          url: window.location.href
        });
      } catch {
        await navigator.clipboard.writeText(shareText);
        alert('Resultado copiado para a área de transferência!');
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Resultado copiado para a área de transferência!');
    }
  });

  const closeModal = (e?: Event) => {
    if (e) e.stopPropagation();
    modalOverlay.remove();
    anchorAd.show();
    options.onClose();
  };

  const restartAndClose = (e?: Event) => {
    if (e) e.stopPropagation();
    modalOverlay.remove();
    anchorAd.show();
    if (options.onRestart) {
      options.onRestart();
    } else {
      options.onClose();
    }
  };

  modalOverlay.querySelector('#btn-restart-victory')?.addEventListener('click', restartAndClose);
  modalOverlay.querySelector('#btn-close-victory')?.addEventListener('click', closeModal);
  modalOverlay.querySelector('#btn-home-victory')?.addEventListener('click', closeModal);

  // Click outside to close (only on the backdrop itself)
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal(e);
    }
  });
}
