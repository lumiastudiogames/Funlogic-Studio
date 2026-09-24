import { subscribeToPWAInstall, triggerPWAInstall, isIOS, showIOSGuidedInstall } from '../utils/pwaInstall';

export function renderFooter(container: HTMLElement): void {
  container.innerHTML = `
    <footer class="w-full game-console-footer mt-12 sm:mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <!-- Col 1: Brand Info -->
          <div>
            <div class="flex items-center gap-2.5 mb-3">
              <div class="w-9 h-9 rounded-xl bg-[#58CC02] text-white font-black text-xl flex items-center justify-center border-b-4 border-[#46A302]">
                F
              </div>
              <span class="font-black text-lg tracking-tight text-white">FunLogic.games</span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed max-w-sm mb-3">
              <strong class="text-white">Lumia Studio</strong> — Independent studio making calm brain games. Fast, lightweight, no popups over the board.
            </p>
            <p class="text-[11px] text-slate-400 font-medium">
              International casual logic portal focused on curiosity and cognitive wellbeing for all ages.
            </p>
          </div>

          <!-- Col 2: Explore Navigation -->
          <div>
            <h4 class="text-xs font-black uppercase tracking-widest text-[#58CC02] mb-3">
              Explore Portal
            </h4>
            <ul class="space-y-2 text-xs font-bold text-slate-300">
              <li><a href="#home" class="hover:text-white transition text-decoration-none">Home</a></li>
              <li><a href="#category/brain" class="hover:text-white transition text-decoration-none">Brain & Logic</a></li>
              <li><a href="#category/kids" class="hover:text-white transition text-decoration-none">Kids (3–8)</a></li>
              <li><a href="#category/seniors" class="hover:text-white transition text-decoration-none">Seniors 60+</a></li>
              <li><a href="#daily" class="hover:text-white transition text-decoration-none">Daily Challenge 🔥</a></li>
              <li><a href="#sitemap" class="hover:text-white transition font-black text-[#58CC02] text-decoration-none">HTML Sitemap</a></li>
            </ul>
          </div>

          <!-- Col 3: Legal & Studio -->
          <div>
            <h4 class="text-xs font-black uppercase tracking-widest text-[#1CB0F6] mb-3">
              Legal & Info
            </h4>
            <ul class="space-y-2 text-xs font-bold text-slate-300 mb-5">
              <li><a href="#privacy" class="hover:text-white transition text-decoration-none">Privacy Policy</a></li>
              <li><a href="#terms" class="hover:text-white transition text-decoration-none">Terms of Service</a></li>
              <li><a href="#about" class="hover:text-white transition text-decoration-none">About Lumia Studio</a></li>
              <li><a href="#contact" class="hover:text-white transition text-decoration-none">Contact Us</a></li>
            </ul>
            
            <!-- PWA Installation Button -->
            <div id="pwa-install-container" class="hidden">
              <button 
                id="btn-pwa-install" 
                class="w-full sm:w-auto h-10 px-4 rounded-2xl bg-[#58CC02] hover:bg-[#4EBA02] border-b-4 border-[#46A302] font-black text-xs text-white flex items-center justify-center gap-2 shadow-md cursor-pointer transition active:scale-95"
              >
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/>
                </svg>
                Install App (PWA)
              </button>
            </div>
          </div>

        </div>

        <div class="mt-10 pt-6 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between text-[11px] font-bold text-slate-400 gap-3">
          <div>
            © 2026 FunLogic.games by Lumia Studio. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  `;

  // Dynamic PWA activation inside Footer
  const pwaContainer = container.querySelector('#pwa-install-container') as HTMLElement;
  const pwaButton = container.querySelector('#btn-pwa-install') as HTMLButtonElement;

  if (pwaContainer && pwaButton) {
    const isApple = isIOS();
    
    subscribeToPWAInstall((isInstallable, isInstalled) => {
      if (isInstalled) {
        pwaContainer.classList.add('hidden');
      } else if (isInstallable || isApple) {
        pwaContainer.classList.remove('hidden');
      } else {
        pwaContainer.classList.add('hidden');
      }
    });

    pwaButton.addEventListener('click', () => {
      if (isApple) {
        showIOSGuidedInstall();
      } else {
        triggerPWAInstall();
      }
    });
  }
}

