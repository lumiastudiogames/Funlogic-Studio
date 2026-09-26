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
import { renderLegalView } from './views/LegalView';
import { getGameLiveStats, recordGamePlay, recordGameRating } from './utils/gameStats';
import { showVictoryModal } from './components/VictoryModal';
import { GAMES } from './data/games';

// Global helper functions
(window as any).navigateTo = (path: string) => {
  const clean = path.replace(/^#/, '');
  const url = clean.startsWith('/') ? clean : '/' + clean;
  window.history.pushState(null, '', url);
  window.dispatchEvent(new Event('popstate'));
};

(window as any).playGame = (gameId: string) => {
  recordGamePlay(gameId);
  (window as any).navigateTo(`/play/${gameId}`);
};

(window as any).rateGame = (gameId: string, stars: number) => {
  recordGameRating(gameId, stars);
};

// Global Game SDK for game.js and index.html
const gameSdk = {
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
(window as any).PlayFunLogic = gameSdk;
(window as any).FunLogic = gameSdk;

function initApp(): void {

  // Register PWA install capturing
  registerPWAInstallListener();

  const app = document.getElementById('app');
  if (!app) return;

  // Initialize stored global font scaling (A- / A+)
  const fontScale = getStoredFontScale();
  document.documentElement.style.setProperty('--font-scale', fontScale.toString());

  app.innerHTML = `
    <div id="app-layout" class="min-h-screen bg-[#0F172A] flex flex-col justify-between selection:bg-[#58CC02] selection:text-white overflow-x-hidden">
      <div id="header-root" class="sticky top-0 z-50 w-full"></div>
      <div id="main-wrapper" class="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
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

  // Router handler (Supports both clean HTML5 paths and hash fallback)
  function handleNavigation(): void {
    // Cleanup previous view if needed
    if ((mainContent as any)._cleanup) {
      (mainContent as any)._cleanup();
      (mainContent as any)._cleanup = null;
    }

    // 1. Extract route from clean pathname first
    let route = window.location.pathname
      .replace(/^\/(funlogic\.games|playfunlogic\.com)\//, '/')
      .replace(/^\//, '')
      .replace(/\/$/, '')
      .trim();

    if (route === 'index.html') {
      route = '';
    }

    // 2. If there's an incoming hash URL, normalize to clean URL (removes '#' for user)
    const hashRoute = window.location.hash.replace(/^#/, '').trim();
    if (hashRoute) {
      route = hashRoute;
      try {
        const cleanPath = '/' + (route === 'home' ? '' : route);
        window.history.replaceState(null, '', cleanPath);
      } catch (e) {}
    }

    // Fullscreen game player mode applies to play/* and daily
    const isGamePlayer = route.startsWith('play/') || route === 'daily';
    const mobileAnchor = document.querySelector('.mobile-anchor-ad') as HTMLElement;

    if (isGamePlayer) {
      headerRoot.style.display = 'none';
      footerRoot.style.display = 'none';
      if (mobileAnchor) mobileAnchor.style.display = 'none';
      mainWrapper.className = 'w-full h-[100dvh] p-0 m-0 max-w-none flex flex-col overflow-hidden';
      viewportFrame.className = 'w-full h-full p-0 m-0 border-0 rounded-none bg-black flex-1 flex flex-col overflow-hidden shadow-none';
      mainContent.className = 'w-full h-full flex-1 flex flex-col overflow-hidden';
    } else {
      headerRoot.style.display = '';
      footerRoot.style.display = '';
      if (mobileAnchor) mobileAnchor.style.display = '';
      mainWrapper.className = 'flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6';
      viewportFrame.className = 'game-screen-viewport min-h-[calc(100vh-220px)]';
      mainContent.className = '';
    }

    // Scroll back to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' as any });

    if (!route || route === 'home') {
      document.title = 'Casual Logic & Reasoning Games — PlayFunLogic.com';
      renderHomeView(mainContent);
    } else if (route === 'daily') {
      document.title = 'Daily Brain Puzzle — PlayFunLogic.com Challenge';
      renderGameView(mainContent, 'daily-brain-challenge');
    } else if (route === 'sitemap') {
      document.title = 'Human Sitemap — PlayFunLogic.com';
      renderSitemapView(mainContent);
    } else if (route === 'privacy') {
      renderLegalView(mainContent, 'privacy');
    } else if (route === 'terms') {
      renderLegalView(mainContent, 'terms');
    } else if (route === 'about') {
      renderLegalView(mainContent, 'about');
    } else if (route === 'contact') {
      renderLegalView(mainContent, 'contact');
    } else if (route.startsWith('category/')) {
      const parts = route.split('/');
      const catId = (parts[1] || 'water-sort') as CategoryId;
      const pageNum = parts[3] ? parseInt(parts[3], 10) : 1;
      document.title = `${catId.toUpperCase()} Logic Games — PlayFunLogic.com`;
      renderCategoryView(mainContent, catId, pageNum);
    } else if (route.startsWith('play/')) {
      // Direct Instant 1-Click Game Engine Mode
      const parts = route.split('/');
      const gameId = parts[1] || 'water-sort-lab';
      renderGameView(mainContent, gameId);
    } else if (route.startsWith('game/')) {
      // Dedicated Individual Game Info & Landing Page
      const parts = route.split('/');
      const gameId = parts[1] || 'water-sort-lab';
      renderGameDetailView(mainContent, gameId);
    } else {
      document.title = 'Casual Logic & Reasoning Games — PlayFunLogic.com';
      renderHomeView(mainContent);
    }
  }

  // Global click interceptor for clean internal navigation (No full-page reload & No # hash)
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('a');
    if (!target) return;
    const href = target.getAttribute('href');
    if (!href) return;

    // Ignore links with target="_blank", downloads, or external protocols
    if (target.hasAttribute('target') || target.hasAttribute('download') || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
      return;
    }

    // Intercept internal hash navigation and convert to clean URL
    if (href.startsWith('#')) {
      e.preventDefault();
      const rawRoute = href.replace(/^#/, '').trim();
      const cleanPath = '/' + (rawRoute === 'home' ? '' : rawRoute);
      window.history.pushState(null, '', cleanPath);
      handleNavigation();
      return;
    }

    // Intercept clean internal path navigation
    if (href.startsWith('/') && !href.startsWith('/games/') && !href.startsWith('/assets/')) {
      e.preventDefault();
      window.history.pushState(null, '', href);
      handleNavigation();
    }
  });

  // Listen for hash and history popstate changes
  window.addEventListener('hashchange', handleNavigation);
  window.addEventListener('popstate', handleNavigation);
  handleNavigation();
}

// Boot application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
