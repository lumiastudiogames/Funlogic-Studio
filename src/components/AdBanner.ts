/**
 * Ad Banner Components
 * In-feed ad unit and Mobile Anchor Ad unit.
 * Hides anchor ad during victory modal priority screen.
 */

export function createInFeedAdHTML(): string {
  return `
    <div class="w-full my-6">
      <div class="ad-slot-reserved w-full flex flex-col items-center justify-center p-4 text-center">
        <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-200/60 px-2.5 py-0.5 rounded-full mb-1">
          Advertisement
        </span>
        <div class="text-xs font-semibold text-gray-400">
          In-Feed Ad Unit • 300x100 Responsive
        </div>
      </div>
    </div>
  `;
}

export function setupMobileAnchorAd(container: HTMLElement): { hide: () => void; show: () => void } {
  let adEl = document.getElementById('mobile-anchor-ad');
  if (!adEl) {
    adEl = document.createElement('div');
    adEl.id = 'mobile-anchor-ad';
    adEl.className = 'fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-black/10 shadow-lg px-4 py-2 sm:hidden flex items-center justify-between transition-transform duration-300';
    adEl.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-[9px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Ad</span>
        <span class="text-xs font-medium text-gray-600">LoomLogic Mobile Sponsor</span>
      </div>
      <button id="close-anchor-ad" class="text-gray-400 hover:text-gray-700 text-lg leading-none p-1 font-bold">
        ✕
      </button>
    `;
    document.body.appendChild(adEl);

    const closeBtn = adEl.querySelector('#close-anchor-ad');
    closeBtn?.addEventListener('click', () => {
      adEl!.style.transform = 'translateY(100%)';
    });
  }

  return {
    hide: () => {
      if (adEl) adEl.style.transform = 'translateY(100%)';
    },
    show: () => {
      if (adEl) adEl.style.transform = 'translateY(0%)';
    }
  };
}
