import './index.css';

import { CategoryId } from './types';
import { getStoredFontScale } from './utils/storage';
import { renderHeader } from './components/Header';
import { renderFooter } from './components/Footer';
import { setupMobileAnchorAd } from './components/AdBanner';
import { registerPWAInstallListener } from './utils/pwaInstall';

import { renderHomeView } from './views/HomeView';
import { renderCategoryView } from './views/CategoryView';
import { renderGameView } from './views/GameView';
import { renderGameDetailView } from './views/GameDetailView';
import { renderSitemapView } from './views/SitemapView';
import { getGameLiveStats, recordGamePlay, recordGameRating } from './utils/gameStats';
import { showVictoryModal } from './components/VictoryModal';
import { GAMES } from './data/games';

// Global helper functions
(window as any).playGame = (gameId: string) => {
  recordGamePlay(gameId);
  window.location.hash = `#play/${gameId}`;
};

(window as any).rateGame = (gameId: string, stars: number) => {
  recordGameRating(gameId, stars);
};

// Global Game SDK for game.js and index.html
(window as any).FunLogic = {
  getStats: (gameId: string) => {
    const game = GAMES.find(g => g.id === gameId) || { id: gameId };
    return getGameLiveStats(game as any);
  },
  recordPlay: (gameId: string) => {
    recordGamePlay(gameId);
  },
  rateGame: (gameId: string, stars: number) => {
    recordGameRating(gameId, stars);
  },
  playGame: (gameId: string) => {
    (window as any).playGame(gameId);
  },
  showVictory: (options: { title: string; timeSeconds: number; streak?: number; gameId: string; onClose?: () => void }) => {
    showVictoryModal({
      title: options.title,
      timeSeconds: options.timeSeconds,
      streak: options.streak,
      gameId: options.gameId,
      onClose: options.onClose || (() => {})
    });
  }
};

function initApp(): void {
  // Register PWA install capturing
  registerPWAInstallListener();

  const app = document.getElementById('app');
  if (!app) return;

  // Initialize stored global font scaling (A- / A+)
  const fontScale = getStoredFontScale();
  document.documentElement.style.setProperty('--font-scale', fontScale.toString());

  app.innerHTML = `
    <div id="app-layout" class="min-h-screen bg-[#0F172A] flex flex-col justify-between selection:bg-[#58CC02] selection:text-white">
      <div id="header-root" class="sticky top-0 z-50 w-full"></div>
      <div id="main-wrapper" class="flex-1 w-full max-w-7xl mx-auto px-0 sm:px-4">
        <!-- Game Screen Recessed Viewport Frame connecting Header & Footer -->
        <div id="viewport-frame" class="game-screen-viewport min-h-[calc(100vh-220px)]">
          <main id="main-content"></main>
        </div>
      </div>
      <div id="footer-root"></div>
    </div>
  `;

  const headerRoot = document.getElementById('header-root')!;
  const mainContent = document.getElementById('main-content')!;
  const footerRoot = document.getElementById('footer-root')!;
  const mainWrapper = document.getElementById('main-wrapper')!;
  const viewportFrame = document.getElementById('viewport-frame')!;

  // Render static Header & Footer
  renderHeader(headerRoot, handleNavigation);
  renderFooter(footerRoot);

  // Initialize Mobile Anchor Ad
  setupMobileAnchorAd(document.body);

  // Router handler
  function handleNavigation(): void {
    // Cleanup previous view if needed
    if ((mainContent as any)._cleanup) {
      (mainContent as any)._cleanup();
      (mainContent as any)._cleanup = null;
    }

    const hash = window.location.hash.replace(/^#/, '').trim();
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Fullscreen game player mode applies to #play/* and #daily
    const isGamePlayer = hash.startsWith('play/') || hash === 'daily';
    const mobileAnchor = document.querySelector('.mobile-anchor-ad') as HTMLElement;

    if (isGamePlayer) {
      headerRoot.style.display = 'none';
      footerRoot.style.display = 'none';
      if (mobileAnchor) mobileAnchor.style.display = 'none';
      mainWrapper.className = 'w-full h-screen p-0 m-0 max-w-none flex flex-col overflow-hidden';
      viewportFrame.className = 'w-full h-full p-0 m-0 border-0 rounded-none bg-black flex-1 flex flex-col overflow-hidden shadow-none';
      mainContent.className = 'w-full h-full flex-1 flex flex-col overflow-hidden';
    } else {
      headerRoot.style.display = '';
      footerRoot.style.display = '';
      if (mobileAnchor) mobileAnchor.style.display = '';
      mainWrapper.className = 'flex-1 w-full max-w-7xl mx-auto px-0 sm:px-4';
      viewportFrame.className = 'game-screen-viewport min-h-[calc(100vh-220px)]';
      mainContent.className = '';
    }

    if (!hash || hash === 'home') {
      document.title = 'FunLogic.games — Casual Logic & Reasoning Games';
      renderHomeView(mainContent);
    } else if (hash === 'daily') {
      document.title = 'Daily Brain Puzzle — FunLogic.games Challenge';
      renderGameView(mainContent, 'daily-brain-challenge');
    } else if (hash === 'sitemap') {
      document.title = 'Human Sitemap — FunLogic.games';
      renderSitemapView(mainContent);
    } else if (hash.startsWith('category/')) {
      const parts = hash.split('/');
      const catId = (parts[1] || 'water-sort') as CategoryId;
      const pageNum = parts[3] ? parseInt(parts[3], 10) : 1;
      document.title = `${catId.toUpperCase()} Logic Games — FunLogic.games`;
      renderCategoryView(mainContent, catId, pageNum);
    } else if (hash.startsWith('play/')) {
      // Direct Instant 1-Click Game Engine Mode
      const parts = hash.split('/');
      const gameId = parts[1] || 'water-sort-lab';
      renderGameView(mainContent, gameId);
    } else if (hash.startsWith('game/')) {
      // Dedicated Individual Game Info & Landing Page
      const parts = hash.split('/');
      const gameId = parts[1] || 'water-sort-lab';
      renderGameDetailView(mainContent, gameId);
    } else {
      document.title = 'FunLogic.games — Casual Logic & Reasoning Games';
      renderHomeView(mainContent);
    }
  }

  // Listen for hash changes
  window.addEventListener('hashchange', handleNavigation);
  handleNavigation();
}

// Boot application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
