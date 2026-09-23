interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const installChangeCallbacks: Set<(isInstallable: boolean, isInstalled: boolean) => void> = new Set();

export function isAppInstalled(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

export function isIOS(): boolean {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

export function isPWAInstallable(): boolean {
  return !!deferredPrompt && !isAppInstalled();
}

function notifyCallbacks() {
  const installable = isPWAInstallable();
  const installed = isAppInstalled();
  for (const cb of installChangeCallbacks) {
    cb(installable, installed);
  }
}

export function registerPWAInstallListener() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    notifyCallbacks();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notifyCallbacks();
  });
}

export function subscribeToPWAInstall(callback: (isInstallable: boolean, isInstalled: boolean) => void) {
  installChangeCallbacks.add(callback);
  callback(isPWAInstallable(), isAppInstalled());
  return () => {
    installChangeCallbacks.delete(callback);
  };
}

export async function triggerPWAInstall(): Promise<boolean> {
  if (!deferredPrompt) return false;
  try {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      deferredPrompt = null;
      notifyCallbacks();
      return true;
    }
  } catch (error) {
    console.error('PWA installation prompt failed:', error);
  }
  return false;
}

export function showIOSGuidedInstall() {
  const modalId = 'pwa-ios-guided-modal';
  if (document.getElementById(modalId)) return;

  const modal = document.createElement('div');
  modal.id = modalId;
  modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs transition-opacity duration-300 animate-fade-in';
  modal.innerHTML = `
    <div class="w-full max-w-sm bg-[#1E293B] border-2 border-slate-700 rounded-3xl p-6 shadow-2xl relative text-white border-b-6 border-b-slate-800">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 rounded-2xl bg-[#58CC02] flex items-center justify-center font-black text-2xl shadow-md text-white border-b-4 border-[#46A302]">
          F
        </div>
        <div>
          <h3 class="text-base font-black text-white leading-tight">Install FunLogic</h3>
          <p class="text-xs text-slate-400 font-bold">Add to your Home Screen</p>
        </div>
      </div>
      
      <div class="space-y-4 text-xs sm:text-sm font-semibold text-slate-300">
        <div class="flex gap-3 items-start">
          <span class="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-black text-white shrink-0">1</span>
          <p>Tap the <span class="bg-slate-800 px-2 py-0.5 rounded text-white font-black">Share 📤</span> button in Safari's bottom toolbar.</p>
        </div>
        <div class="flex gap-3 items-start">
          <span class="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-black text-white shrink-0">2</span>
          <p>Scroll down and select <span class="bg-slate-800 px-2 py-0.5 rounded text-white font-black">Add to Home Screen ➕</span>.</p>
        </div>
        <div class="flex gap-3 items-start">
          <span class="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-black text-white shrink-0">3</span>
          <p>Confirm by tapping <span class="text-[#58CC02] font-black">Add</span> in the top right.</p>
        </div>
      </div>

      <button id="pwa-ios-modal-close" class="mt-6 w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-98 transition text-xs font-black text-white cursor-pointer border-2 border-slate-700 border-b-4 border-b-slate-900">
        Got it!
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('#pwa-ios-modal-close');
  closeBtn?.addEventListener('click', () => {
    modal.classList.add('opacity-0');
    setTimeout(() => modal.remove(), 300);
  });
}
