import { updateHeadSeo } from '../utils/seo';

export type LegalTab = 'privacy' | 'terms' | 'about' | 'contact';

export function renderLegalView(container: HTMLElement, activeTab: LegalTab = 'privacy'): void {
  // Update SEO Head
  const tabTitles: Record<LegalTab, string> = {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    about: 'About Lumia Studio',
    contact: 'Contact Us'
  };

  const tabDescriptions: Record<LegalTab, string> = {
    privacy: 'Privacy Policy and Cookie Disclosure for FunLogic.games by Lumia Studio. Learn how your data is protected and our compliance with Google AdSense, GDPR, and LGPD.',
    terms: 'Terms of Service and End-User Usage Agreement for FunLogic.games casual logic and puzzle web games.',
    about: 'About FunLogic.games and Lumia Studio: independent creator of accessible, fast, and cognitive-friendly web puzzles for all generations.',
    contact: 'Contact Lumia Studio and the FunLogic.games team for support, game suggestions, developer partnerships, and bug reports.'
  };

  updateHeadSeo({
    title: tabTitles[activeTab],
    description: tabDescriptions[activeTab],
    canonicalUrl: `https://funlogic.games/${activeTab}/`,
    type: 'website'
  });

  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      
      <!-- Top Navigation Tabs -->
      <div class="flex items-center justify-between flex-wrap gap-4 border-b border-slate-700/60 pb-4">
        <div>
          <a href="#home" class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 shadow-2xs transition group text-decoration-none">
            <span class="text-[#58CC02] font-extrabold group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>Back to Games</span>
          </a>
        </div>

        <nav class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <a href="#privacy" class="px-3.5 py-1.5 rounded-xl text-xs font-black transition no-underline ${activeTab === 'privacy' ? 'bg-[#58CC02] text-white shadow-sm' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'}">
            Privacy Policy
          </a>
          <a href="#terms" class="px-3.5 py-1.5 rounded-xl text-xs font-black transition no-underline ${activeTab === 'terms' ? 'bg-[#58CC02] text-white shadow-sm' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'}">
            Terms of Service
          </a>
          <a href="#about" class="px-3.5 py-1.5 rounded-xl text-xs font-black transition no-underline ${activeTab === 'about' ? 'bg-[#58CC02] text-white shadow-sm' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'}">
            About Us
          </a>
          <a href="#contact" class="px-3.5 py-1.5 rounded-xl text-xs font-black transition no-underline ${activeTab === 'contact' ? 'bg-[#58CC02] text-white shadow-sm' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'}">
            Contact
          </a>
        </nav>
      </div>

      <!-- Legal Content Container -->
      <article class="bg-slate-900/90 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl text-slate-200 leading-relaxed space-y-6 text-sm">
        ${getTabContent(activeTab)}
      </article>

    </div>
  `;
}

function getTabContent(tab: LegalTab): string {
  switch (tab) {
    case 'privacy':
      return `
        <div class="space-y-6">
          <header class="border-b border-slate-800 pb-4">
            <span class="text-xs font-black uppercase tracking-wider text-[#58CC02] bg-[#58CC02]/10 border border-[#58CC02]/20 px-3 py-1 rounded-full inline-block mb-2">Legal Compliance</span>
            <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">Privacy Policy</h1>
            <p class="text-xs text-slate-400 mt-1">Last Updated: September 23, 2026 • FunLogic.games by Lumia Studio</p>
          </header>

          <section class="space-y-3">
            <h2 class="text-base font-black text-white">1. Introduction & Overview</h2>
            <p>Welcome to <strong>FunLogic.games</strong>, an online browser puzzle portal operated by <strong>Lumia Studio</strong> ("we", "us", or "our"). We respect your privacy and are committed to protecting any data collected during your gameplay sessions. This policy explains what information we gather, how we use it, and your rights under global privacy regulations including GDPR (EU), LGPD (Brazil), and CCPA (California).</p>
          </section>

          <section class="space-y-3">
            <h2 class="text-base font-black text-white">2. Information We Collect</h2>
            <p>FunLogic.games is designed to be fully playable without user registration or mandatory personal logins. We collect:</p>
            <ul class="list-disc pl-5 space-y-1.5 text-slate-300">
              <li><strong>Gameplay Progress & High Scores:</strong> Stored locally on your personal device using HTML5 LocalStorage (e.g., solved levels, daily streak, sound volume preferences). This data never leaves your device.</li>
              <li><strong>Log Data:</strong> Standard internet log data collected by hosting servers, including your browser type, operating system, language preference, referring URL, and general geographic location (country level).</li>
            </ul>
          </section>

          <section class="space-y-3">
            <h2 class="text-base font-black text-white">3. Third-Party Advertising & Google AdSense</h2>
            <p>We use third-party advertising companies, including <strong>Google AdSense</strong>, to serve advertisements when you visit our website. These companies may use cookies, web beacons, and device identifiers to serve ads based on your prior visits to this website or other websites on the internet.</p>
            <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
              <h3 class="text-xs font-black uppercase text-[#58CC02] tracking-wider">Google Advertising & DART Cookies</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Google's use of advertising cookies enables it and its partners to serve personalized or non-personalized ads to users based on their visits to FunLogic.games and other sites. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" class="text-[#1CB0F6] underline">Google Ads Settings</a> or <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" class="text-[#1CB0F6] underline">aboutads.info</a>.
              </p>
            </div>
          </section>

          <section class="space-y-3">
            <h2 class="text-base font-black text-white">4. Children's Privacy (COPPA Compliance)</h2>
            <p>We take children's online safety seriously. Our "Kids Puzzles" section features gentle, ad-light or ad-free educational puzzles suitable for young children. We do not knowingly solicit, collect, or store any personally identifiable information from children under the age of 13. If you believe a child has provided us with personal information, please contact us immediately for deletion.</p>
          </section>

          <section class="space-y-3">
            <h2 class="text-base font-black text-white">5. Your Data Rights (GDPR / LGPD)</h2>
            <p>You have the right to request access, correction, or erasure of any data associated with your interaction, or to withdraw consent for third-party cookie tracking at any time through your browser settings.</p>
          </section>

          <section class="space-y-3">
            <h2 class="text-base font-black text-white">6. Contact Information</h2>
            <p>If you have any questions or privacy concerns regarding this policy, contact Lumia Studio directly at: <a href="mailto:contact@funlogic.games" class="text-[#58CC02] font-bold underline">contact@funlogic.games</a>.</p>
          </section>
        </div>
      `;

    case 'terms':
      return `
        <div class="space-y-6">
          <header class="border-b border-slate-800 pb-4">
            <span class="text-xs font-black uppercase tracking-wider text-[#1CB0F6] bg-[#1CB0F6]/10 border border-[#1CB0F6]/20 px-3 py-1 rounded-full inline-block mb-2">Terms & Conditions</span>
            <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">Terms of Service</h1>
            <p class="text-xs text-slate-400 mt-1">Effective Date: September 23, 2026 • FunLogic.games</p>
          </header>

          <section class="space-y-3">
            <h2 class="text-base font-black text-white">1. Acceptance of Terms</h2>
            <p>By accessing and playing games on <strong>FunLogic.games</strong>, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you should discontinue use of the website.</p>
          </section>

          <section class="space-y-3">
            <h2 class="text-base font-black text-white">2. License to Play</h2>
            <p>Lumia Studio grants you a personal, non-exclusive, non-transferable, revocable license to access, view, and play games on FunLogic.games solely for personal, non-commercial entertainment purposes directly inside your web browser.</p>
          </section>

          <section class="space-y-3">
            <h2 class="text-base font-black text-white">3. Intellectual Property</h2>
            <p>All game graphics, code, sound effects, brand logos, titles, and layouts are the intellectual property of Lumia Studio and its licensors. You may not scrape, decompile, redistribute, mirror, or repackage any game without express written consent from Lumia Studio.</p>
          </section>

          <section class="space-y-3">
            <h2 class="text-base font-black text-white">4. Disclaimer of Warranties</h2>
            <p>FunLogic.games is provided on an "AS IS" and "AS AVAILABLE" basis. While we strive for 100% uptime and zero glitches, Lumia Studio makes no warranties that the service will be uninterrupted, error-free, or compatible with every hardware device.</p>
          </section>

          <section class="space-y-3">
            <h2 class="text-base font-black text-white">5. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws applicable to digital interactive entertainment portals, without regard to conflict of law principles.</p>
          </section>
        </div>
      `;

    case 'about':
      return `
        <div class="space-y-6">
          <header class="border-b border-slate-800 pb-4">
            <span class="text-xs font-black uppercase tracking-wider text-[#FF9600] bg-[#FF9600]/10 border border-[#FF9600]/20 px-3 py-1 rounded-full inline-block mb-2">Our Mission</span>
            <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">About Lumia Studio & FunLogic.games</h1>
            <p class="text-xs text-slate-400 mt-1">Crafting accessible cognitive gaming experiences for all ages.</p>
          </header>

          <section class="space-y-3">
            <h2 class="text-base font-black text-white">Who We Are</h2>
            <p><strong>FunLogic.games</strong> is an independent digital portal created by <strong>Lumia Studio</strong>. We design lightweight, fast-loading, and thoughtful puzzle games that challenge reasoning, deduction, spatial visualization, and memory.</p>
          </section>

          <section class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1">
              <div class="text-2xl">🧠</div>
              <h3 class="text-xs font-black text-white uppercase tracking-wider">Brain Health</h3>
              <p class="text-xs text-slate-300">Stimulating cognitive reasoning, short-term working memory, and deductive logic.</p>
            </div>
            <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1">
              <div class="text-2xl">⚡</div>
              <h3 class="text-xs font-black text-white uppercase tracking-wider">Zero Download</h3>
              <p class="text-xs text-slate-300">Play instantly on phone, tablet, or PC without installing any heavy apps or plugins.</p>
            </div>
            <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1">
              <div class="text-2xl">👵🧸</div>
              <h3 class="text-xs font-black text-white uppercase tracking-wider">All Generations</h3>
              <p class="text-xs text-slate-300">Dedicated accessible collections tailored for kids (3-8) and seniors (60+).</p>
            </div>
          </section>

          <section class="space-y-3 pt-2">
            <h2 class="text-base font-black text-white">Accessibility & Clean Design</h2>
            <p>Unlike ad-saturated gaming sites with disruptive overlays, FunLogic.games prioritizes calm play. We provide unlimited undos, untimed options, high color contrasts, and full Progressive Web App (PWA) offline installation.</p>
          </section>
        </div>
      `;

    case 'contact':
      return `
        <div class="space-y-6">
          <header class="border-b border-slate-800 pb-4">
            <span class="text-xs font-black uppercase tracking-wider text-[#58CC02] bg-[#58CC02]/10 border border-[#58CC02]/20 px-3 py-1 rounded-full inline-block mb-2">Get in Touch</span>
            <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">Contact Lumia Studio</h1>
            <p class="text-xs text-slate-400 mt-1">Have a game idea, bug report, or business inquiry? We'd love to hear from you.</p>
          </header>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
              <div class="text-xs font-black uppercase text-[#58CC02] tracking-wider">Direct Email</div>
              <p class="text-xs text-slate-300">For general support, feedback, and questions:</p>
              <a href="mailto:contact@funlogic.games" class="text-sm font-black text-white hover:text-[#58CC02] transition block">contact@funlogic.games</a>
            </div>

            <div class="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
              <div class="text-xs font-black uppercase text-[#1CB0F6] tracking-wider">Partnerships & Developers</div>
              <p class="text-xs text-slate-300">HTML5 game submissions and publishing inquiries:</p>
              <a href="mailto:partners@funlogic.games" class="text-sm font-black text-white hover:text-[#1CB0F6] transition block">partners@funlogic.games</a>
            </div>
          </div>

          <section class="p-5 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-2">
            <h3 class="text-xs font-black text-slate-300 uppercase tracking-wider">Response Time</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              Our small indie team typically responds to user inquiries within 24 to 48 business hours. If you are reporting a game bug, please include your browser name and device type to help us reproduce and fix it quickly.
            </p>
          </section>
        </div>
      `;
  }
}
