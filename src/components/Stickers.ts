/**
 * Premium SVG Mini-Sticker System for FunLogic.games
 * Replaces raw OS Unicode emojis with beautiful, custom-designed vector mini-stickers
 * featuring glossy highlights, multi-stop gradients, and crisp die-cut borders.
 */

export const STICKERS: Record<string, string> = {
  // 🧠 Brain & Logic
  brain: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brainGrad" x1="6" y1="8" x2="42" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FF7EB3" />
          <stop offset="50%" stop-color="#FF5398" />
          <stop offset="100%" stop-color="#E02874" />
        </linearGradient>
        <linearGradient id="brainHighlight" x1="12" y1="8" x2="24" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
        </linearGradient>
      </defs>
      <!-- Die-cut white border -->
      <path d="M24 8C19 8 15 10.5 13 14C9.5 15 7 18.5 7 22.5C7 25 8 27.2 9.7 28.8C8 31.2 8.3 34.5 10.5 36.8C12.5 39 15.5 40 18.5 39.5C20 41 21.8 41.8 24 41.8C26.2 41.8 28 41 29.5 39.5C32.5 40 35.5 39 37.5 36.8C39.7 34.5 40 31.2 38.3 28.8C40 27.2 41 25 41 22.5C41 18.5 38.5 15 35 14C33 10.5 29 8 24 8Z" 
        fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round" />
      <!-- Brain base shape -->
      <path d="M24 9C19.5 9 15.8 11.2 13.9 14.5C10.7 15.4 8.5 18.6 8.5 22.2C8.5 24.5 9.4 26.5 10.9 28C9.4 30.2 9.7 33.2 11.7 35.3C13.5 37.3 16.2 38.2 18.9 37.7C20.3 39.1 22 40 24 40C26 40 27.7 39.1 29.1 37.7C31.8 38.2 34.5 37.3 36.3 35.3C38.3 33.2 38.6 30.2 37.1 28C38.6 26.5 39.5 24.5 39.5 22.2C39.5 18.6 37.3 15.4 34.1 14.5C32.2 11.2 28.5 9 24 9Z" 
        fill="url(#brainGrad)" />
      <!-- Brain cerebral folds -->
      <path d="M24 11V38M17 17C14 18 12 21 13 24M31 17C34 18 36 21 35 24M16 26C14 28 15 32 18 33M32 26C34 28 33 32 30 33M19 14C21 16 21 20 18 22M29 14C27 16 27 20 30 22" 
        stroke="#8A0A3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.65" />
      <!-- Glossy top highlight -->
      <path d="M16 13C18 11 21 10.5 24 10.5C27 10.5 30 11 32 13C29 12 26 11.5 24 11.5C21 11.5 18 12 16 13Z" 
        fill="url(#brainHighlight)" />
      <!-- Energy spark dot -->
      <circle cx="24" cy="18" r="1.5" fill="#FFE875" />
      <circle cx="17" cy="22" r="1.2" fill="#FFE875" opacity="0.8" />
      <circle cx="31" cy="22" r="1.2" fill="#FFE875" opacity="0.8" />
    </svg>
  `,

  // 🃏 Solitaire & Cards
  solitaire: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cardGrad1" x1="4" y1="4" x2="34" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="100%" stop-color="#F1F5F9" />
        </linearGradient>
      </defs>
      <!-- Back Card tilted -->
      <g transform="rotate(-10 20 24)">
        <rect x="10" y="6" width="22" height="32" rx="4" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
        <rect x="12" y="8" width="18" height="28" rx="2.5" fill="#EF4444" />
        <path d="M21 17L24 22H18L21 17Z" fill="#FFFFFF" opacity="0.9" />
        <path d="M21 27L18 22H24L21 27Z" fill="#FFFFFF" opacity="0.9" />
      </g>
      <!-- Front Card Ace of Spades -->
      <g transform="rotate(8 26 25)">
        <rect x="16" y="8" width="22" height="32" rx="4.5" fill="url(#cardGrad1)" stroke="#FFFFFF" stroke-width="3" />
        <rect x="16" y="8" width="22" height="32" rx="4" stroke="#CBD5E1" stroke-width="1.5" />
        <text x="19" y="17" font-size="8" font-weight="900" fill="#0F172A" font-family="sans-serif">A</text>
        <!-- Spade suit icon -->
        <path d="M27 18C25.5 20.5 23 23 23 25C23 26.5 24 27.5 25.5 27.5C26.5 27.5 27 27 27 26.5C27 27 27.5 27.5 28.5 27.5C30 27.5 31 26.5 31 25C31 23 28.5 20.5 27 18ZM26 27.5H28V30.5H26V27.5Z" fill="#0F172A" />
      </g>
    </svg>
  `,

  // 🔠 Word Search & Crosswords
  wordsearch: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tileGradA" x1="6" y1="6" x2="26" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FFEED6" />
          <stop offset="100%" stop-color="#FFD188" />
        </linearGradient>
        <linearGradient id="tileGradB" x1="22" y1="20" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#E0E7FF" />
          <stop offset="100%" stop-color="#A5B4FC" />
        </linearGradient>
      </defs>
      <!-- Die-cut shadow contour -->
      <rect x="6" y="6" width="22" height="22" rx="5" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round" />
      <rect x="20" y="18" width="22" height="22" rx="5" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round" />
      <!-- Tile 1 (A) -->
      <rect x="7" y="7" width="20" height="20" rx="4.5" fill="url(#tileGradA)" stroke="#D97706" stroke-width="1.5" />
      <text x="13.5" y="21" font-size="13" font-weight="900" fill="#78350F" font-family="sans-serif">A</text>
      <text x="21" y="24" font-size="6" font-weight="800" fill="#92400E" font-family="sans-serif">1</text>
      <!-- Tile 2 (B) overlapping -->
      <rect x="21" y="19" width="20" height="20" rx="4.5" fill="url(#tileGradB)" stroke="#4F46E5" stroke-width="1.5" />
      <text x="27" y="33.5" font-size="13" font-weight="900" fill="#312E81" font-family="sans-serif">B</text>
      <text x="35" y="36" font-size="6" font-weight="800" fill="#3730A3" font-family="sans-serif">3</text>
      <!-- Sparkle -->
      <path d="M38 10L39 13L42 14L39 15L38 18L37 15L34 14L37 13L38 10Z" fill="#F59E0B" />
    </svg>
  `,

  // ❓ Trivia & Brain Quizzes
  trivia: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="qGrad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FCD34D" />
          <stop offset="50%" stop-color="#F59E0B" />
          <stop offset="100%" stop-color="#D97706" />
        </linearGradient>
      </defs>
      <!-- Sticker background circle -->
      <circle cx="24" cy="24" r="20" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" />
      <circle cx="24" cy="24" r="18" fill="#FFFBEB" stroke="#FDE68A" stroke-width="2" />
      <!-- Golden Question mark 3D -->
      <path d="M19 16C19 13.2 21.2 11 24 11C26.8 11 29 13.2 29 16C29 18.2 27.5 19.8 25.8 21.2C24.2 22.5 23 24 23 26V27H26V26C26 24.5 27 23.5 28.2 22.5C30.2 20.8 32 18.7 32 16C32 11.6 28.4 8 24 8C19.6 8 16 11.6 16 16H19ZM24.5 31C23.1 31 22 32.1 22 33.5C22 34.9 23.1 36 24.5 36C25.9 36 27 34.9 27 33.5C27 32.1 25.9 31 24.5 31Z" 
        fill="url(#qGrad)" stroke="#B45309" stroke-width="1.5" stroke-linejoin="round" />
      <!-- Sparkles -->
      <circle cx="12" cy="14" r="2" fill="#F59E0B" />
      <circle cx="36" cy="32" r="1.5" fill="#F59E0B" />
    </svg>
  `,

  // 🀄 Mahjong Solitaire
  mahjong: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mahjongIvory" x1="12" y1="6" x2="36" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="100%" stop-color="#F8FAFC" />
        </linearGradient>
      </defs>
      <!-- Base 3D bevel / tile bottom back -->
      <rect x="13" y="10" width="22" height="30" rx="4" fill="#047857" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round" />
      <rect x="13" y="8" width="22" height="30" rx="4" fill="url(#mahjongIvory)" stroke="#CBD5E1" stroke-width="1.5" />
      <!-- Red / Green Mahjong Symbol (Red Dragon 中) -->
      <rect x="18" y="16" width="12" height="12" rx="2" fill="#EF4444" />
      <rect x="20" y="18" width="8" height="8" rx="1" fill="#FFFFFF" />
      <path d="M24 13V33M18 23H30" stroke="#EF4444" stroke-width="3" stroke-linecap="round" />
      <circle cx="18" cy="33" r="1.5" fill="#047857" />
      <circle cx="30" cy="33" r="1.5" fill="#047857" />
    </svg>
  `,

  // ✨ Memory Training
  memory: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="starGrad" x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#38BDF8" />
          <stop offset="50%" stop-color="#818CF8" />
          <stop offset="100%" stop-color="#C084FC" />
        </linearGradient>
      </defs>
      <!-- Die-cut white border -->
      <path d="M24 6L28 17L39 17L30 24L33 35L24 29L15 35L18 24L9 17L20 17L24 6Z" 
        fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round" />
      <!-- Main glowing star -->
      <path d="M24 7L27.8 17.5L39 17.5L30 24.2L33.3 35L24 28.5L14.7 35L18 24.2L9 17.5L20.2 17.5L24 7Z" 
        fill="url(#starGrad)" stroke="#6366F1" stroke-width="1.5" stroke-linejoin="round" />
      <!-- Shimmer cross -->
      <path d="M38 8L39 11L42 12L39 13L38 16L37 13L34 12L37 11L38 8Z" fill="#FACC15" />
      <circle cx="10" cy="34" r="2.5" fill="#FACC15" />
      <circle cx="24" cy="21" r="3" fill="#FFFFFF" opacity="0.6" />
    </svg>
  `,

  // 🧪 Water Sort (Test Tube with Liquid Layers)
  waterSort: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tubeGlass" x1="16" y1="8" x2="32" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#E0F2FE" />
          <stop offset="100%" stop-color="#BAE6FD" />
        </linearGradient>
      </defs>
      <!-- White die cut -->
      <path d="M17 7H31V32C31 36 28 39 24 39C20 39 17 36 17 32V7Z" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round" />
      <!-- Tube Lip -->
      <rect x="15" y="6" width="18" height="4" rx="2" fill="#FFFFFF" stroke="#0284C7" stroke-width="1.5" />
      <!-- Liquid Layers -->
      <!-- Bottom Layer (Purple) -->
      <path d="M18 28H30V32C30 35.3 27.3 38 24 38C20.7 38 18 35.3 18 32V28Z" fill="#8B5CF6" />
      <!-- Middle Layer (Yellow) -->
      <rect x="18" y="21" width="12" height="7" fill="#FACC15" />
      <!-- Top Layer (Cyan) -->
      <rect x="18" y="14" width="12" height="7" fill="#06B6D4" />
      <!-- Glass Tube Outline -->
      <path d="M18 8V32C18 35.3 20.7 38 24 38C27.3 38 30 35.3 30 32V8" stroke="#0284C7" stroke-width="2" stroke-linecap="round" />
      <!-- Glass Reflection Highlight -->
      <line x1="20" y1="12" x2="20" y2="34" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.7" />
      <!-- Sparkle Drop -->
      <circle cx="34" cy="12" r="2.5" fill="#38BDF8" />
    </svg>
  `,

  // 📦 Sokoban (Warehouse Wooden Box / Pusher)
  sokoban: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="boxWood" x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#D97706" />
          <stop offset="100%" stop-color="#92400E" />
        </linearGradient>
      </defs>
      <!-- White die cut -->
      <rect x="8" y="8" width="32" height="32" rx="6" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round" />
      <!-- Wooden Crate Body -->
      <rect x="9" y="9" width="30" height="30" rx="5" fill="url(#boxWood)" stroke="#78350F" stroke-width="2" />
      <!-- Crate Slats & Diagonal Cross -->
      <line x1="9" y1="9" x2="39" y2="39" stroke="#78350F" stroke-width="2" />
      <line x1="39" y1="9" x2="9" y2="39" stroke="#78350F" stroke-width="2" />
      <rect x="13" y="13" width="22" height="22" rx="2" fill="none" stroke="#FDE68A" stroke-width="1.5" />
      <!-- Metal Corner Brackets -->
      <circle cx="12" cy="12" r="1.5" fill="#FDE68A" />
      <circle cx="36" cy="12" r="1.5" fill="#FDE68A" />
      <circle cx="12" cy="36" r="1.5" fill="#FDE68A" />
      <circle cx="36" cy="36" r="1.5" fill="#FDE68A" />
      <!-- Pusher Direction Arrow -->
      <polygon points="24,16 30,22 26,22 26,28 22,28 22,22 18,22" fill="#22C55E" stroke="#15803D" stroke-width="1" />
    </svg>
  `,

  // 🔧 Pipe Connect & Flow
  pipe: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pipeMetal" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#38BDF8" />
          <stop offset="100%" stop-color="#0284C7" />
        </linearGradient>
      </defs>
      <!-- White die cut -->
      <path d="M8 20H20V8H28V28H8V20Z" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round" />
      <path d="M28 28H40V36H20V20H28V28Z" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round" />
      <!-- Pipe Corner Elbow -->
      <path d="M10 20H22V8H28V28H10V20Z" fill="url(#pipeMetal)" stroke="#0369A1" stroke-width="2" />
      <path d="M28 28H38V34H20V20H26V28H38" fill="url(#pipeMetal)" stroke="#0369A1" stroke-width="2" />
      <!-- Flanges / Joints -->
      <rect x="7" y="18" width="5" height="12" rx="1.5" fill="#FACC15" stroke="#CA8A04" stroke-width="1" />
      <rect x="20" y="7" width="12" height="5" rx="1.5" fill="#FACC15" stroke="#CA8A04" stroke-width="1" />
      <rect x="36" y="26" width="5" height="10" rx="1.5" fill="#FACC15" stroke="#CA8A04" stroke-width="1" />
      <!-- Flow Water Drop -->
      <circle cx="25" cy="24" r="3" fill="#FFFFFF" />
      <circle cx="32" cy="30" r="2" fill="#FFFFFF" opacity="0.8" />
    </svg>
  `,

  // 🖐️ Drag & Drop
  dragdrop: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="handGrad" x1="12" y1="12" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FED7AA" />
          <stop offset="100%" stop-color="#FB923C" />
        </linearGradient>
      </defs>
      <!-- White die cut -->
      <circle cx="28" cy="14" r="7" fill="#38BDF8" stroke="#FFFFFF" stroke-width="3" />
      <path d="M20 22V14C20 12.3 21.3 11 23 11C24.7 11 26 12.3 26 14V22H28C29.7 22 31 23.3 31 25V30C31 35 27 39 22 39C17 39 13 35 13 30V25C13 23.3 14.3 22 16 22H20Z" 
        fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round" />
      <path d="M20 22V14C20 12.3 21.3 11 23 11C24.7 11 26 12.3 26 14V22H28C29.7 22 31 23.3 31 25V30C31 35 27 39 22 39C17 39 13 35 13 30V25C13 23.3 14.3 22 16 22H20Z" 
        fill="url(#handGrad)" stroke="#EA580C" stroke-width="1.5" stroke-linejoin="round" />
      <!-- Motion arrows -->
      <path d="M36 24L41 24M41 24L38 21M41 24L38 27" stroke="#0284C7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,

  // 🔍 Find Hidden Items
  hiddenitem: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="glassGrad" x1="12" y1="8" x2="30" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#E0F2FE" />
          <stop offset="100%" stop-color="#BAE6FD" />
        </linearGradient>
        <linearGradient id="handleGrad" x1="28" y1="28" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#D97706" />
          <stop offset="100%" stop-color="#92400E" />
        </linearGradient>
      </defs>
      <!-- Die cut -->
      <circle cx="21" cy="20" r="13" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" />
      <line x1="30" y1="29" x2="42" y2="41" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" />
      <!-- Magnifier Glass -->
      <circle cx="21" cy="20" r="12" fill="url(#glassGrad)" stroke="#F59E0B" stroke-width="3" />
      <!-- Hidden Gem inside glass -->
      <path d="M21 15L25 19L21 24L17 19L21 15Z" fill="#EC4899" stroke="#BE185D" stroke-width="1" />
      <circle cx="17" cy="15" r="1.5" fill="#FFFFFF" opacity="0.8" />
      <!-- Sturdy handle -->
      <line x1="30" y1="29" x2="41" y2="40" stroke="url(#handleGrad)" stroke-width="6" stroke-linecap="round" />
      <line x1="30" y1="29" x2="41" y2="40" stroke="#78350F" stroke-width="1" stroke-linecap="round" />
    </svg>
  `,

  // 🎯 Spot 7 Differences
  differences: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- White die cut -->
      <circle cx="24" cy="24" r="19" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" />
      <!-- Outer target ring -->
      <circle cx="24" cy="24" r="17" fill="#EF4444" />
      <circle cx="24" cy="24" r="13" fill="#FFFFFF" />
      <circle cx="24" cy="24" r="9" fill="#EF4444" />
      <circle cx="24" cy="24" r="5" fill="#FACC15" />
      <!-- Green Checkmark on corner -->
      <circle cx="36" cy="14" r="7" fill="#22C55E" stroke="#FFFFFF" stroke-width="2" />
      <path d="M33 14L35.5 16.5L39 12" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,

  // 🔤 Classic Hangman
  hangman: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="32" height="32" rx="6" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" />
      <rect x="8" y="8" width="32" height="32" rx="5" fill="#1E293B" stroke="#0F172A" stroke-width="2" />
      <!-- Chalkboard gallows & letters -->
      <path d="M14 34H26M18 34V14H28V18" stroke="#E2E8F0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="28" cy="21" r="2.5" stroke="#FDE047" stroke-width="1.5" fill="none" />
      <!-- Missing letters tray -->
      <text x="14" y="30" font-size="8" font-weight="900" fill="#38BDF8" font-family="monospace">W_RD</text>
    </svg>
  `,

  // 🌀 Mazes & Labyrinths
  mazes: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mazeGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#10B981" />
          <stop offset="100%" stop-color="#047857" />
        </linearGradient>
      </defs>
      <rect x="7" y="7" width="34" height="34" rx="7" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" />
      <rect x="7" y="7" width="34" height="34" rx="6" fill="url(#mazeGrad)" />
      <!-- Maze paths -->
      <path d="M14 13V35H34V13H14ZM19 18H29V30H19V18Z" fill="#FFFFFF" opacity="0.9" />
      <path d="M19 23H24V26H19" fill="url(#mazeGrad)" />
      <!-- Maze runner golden ball -->
      <circle cx="24" cy="24" r="3" fill="#FACC15" stroke="#B45309" stroke-width="1" />
    </svg>
  `,

  // 💡 Logic Grid
  logicgrid: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bulbGrad" x1="16" y1="8" x2="32" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FEF08A" />
          <stop offset="60%" stop-color="#FACC15" />
          <stop offset="100%" stop-color="#EAB308" />
        </linearGradient>
      </defs>
      <!-- White die-cut outline -->
      <path d="M24 7C17.5 7 12 12.5 12 19C12 23 14 26.5 17 28.5V33C17 34.5 18.5 36 20 36H28C29.5 36 31 34.5 31 33V28.5C34 26.5 36 23 36 19C36 12.5 30.5 7 24 7Z" 
        fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round" />
      <!-- Glowing bulb -->
      <path d="M24 8C18 8 13 13 13 19C13 22.8 15 26 18 28V33C18 34.1 18.9 35 20 35H28C29.1 35 30 34.1 30 33V28C33 26 35 22.8 35 19C35 13 30 8 24 8Z" 
        fill="url(#bulbGrad)" stroke="#CA8A04" stroke-width="1.5" />
      <!-- Filament & screw base -->
      <path d="M21 19L23 15L25 19L27 15" stroke="#854D0E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <rect x="20" y="35" width="8" height="3" rx="1.5" fill="#94A3B8" stroke="#475569" stroke-width="1" />
      <!-- Eureka rays -->
      <line x1="24" y1="3" x2="24" y2="5" stroke="#EAB308" stroke-width="2.5" stroke-linecap="round" />
      <line x1="9" y1="12" x2="11" y2="14" stroke="#EAB308" stroke-width="2.5" stroke-linecap="round" />
      <line x1="39" y1="12" x2="37" y2="14" stroke="#EAB308" stroke-width="2.5" stroke-linecap="round" />
    </svg>
  `,

  // 🧩 Problem Solving
  problemsolving: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="puzzleGrad" x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#38BDF8" />
          <stop offset="100%" stop-color="#0284C7" />
        </linearGradient>
      </defs>
      <!-- Die-cut -->
      <path d="M12 12H20C20 14.5 21.5 16 24 16C26.5 16 28 14.5 28 12H36V20C33.5 20 32 21.5 32 24C32 26.5 33.5 28 36 28V36H28C28 33.5 26.5 32 24 32C21.5 32 20 33.5 20 36H12V28C14.5 28 16 26.5 16 24C16 21.5 14.5 20 12 20V12Z" 
        fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round" />
      <path d="M12 12H20C20 14.5 21.5 16 24 16C26.5 16 28 14.5 28 12H36V20C33.5 20 32 21.5 32 24C32 26.5 33.5 28 36 28V36H28C28 33.5 26.5 32 24 32C21.5 32 20 33.5 20 36H12V28C14.5 28 16 26.5 16 24C16 21.5 14.5 20 12 20V12Z" 
        fill="url(#puzzleGrad)" stroke="#0369A1" stroke-width="1.5" />
      <circle cx="24" cy="24" r="2.5" fill="#FFFFFF" opacity="0.6" />
    </svg>
  `,

  // 💻 Programming & Algorithms
  programming: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="codeGrad" x1="8" y1="8" x2="40" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#0F172A" />
          <stop offset="100%" stop-color="#1E293B" />
        </linearGradient>
      </defs>
      <rect x="7" y="10" width="34" height="28" rx="6" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" />
      <rect x="7" y="10" width="34" height="28" rx="5" fill="url(#codeGrad)" stroke="#334155" stroke-width="1.5" />
      <!-- Window dots -->
      <circle cx="12" cy="15" r="1.5" fill="#EF4444" />
      <circle cx="16" cy="15" r="1.5" fill="#FACC15" />
      <circle cx="20" cy="15" r="1.5" fill="#22C55E" />
      <!-- Code brackets </> -->
      <path d="M17 22L12 26L17 30M31 22L36 26L31 30M26 20L22 32" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,

  // 📐 Tangram
  tangram: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer white die cut -->
      <rect x="8" y="8" width="32" height="32" rx="6" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" />
      <!-- Colorful 7 Pieces of Tangram -->
      <g stroke="#FFFFFF" stroke-width="1.5" stroke-linejoin="round">
        <polygon points="8,8 40,8 24,24" fill="#EC4899" />
        <polygon points="8,8 24,24 8,40" fill="#3B82F6" />
        <polygon points="24,24 40,8 40,24" fill="#F59E0B" />
        <polygon points="24,24 32,32 16,32" fill="#10B981" />
        <polygon points="32,16 40,24 32,32 24,24" fill="#8B5CF6" />
        <polygon points="16,32 32,32 24,40 8,40" fill="#F43F5E" />
        <polygon points="32,32 40,24 40,40 24,40" fill="#06B6D4" />
      </g>
    </svg>
  `,

  // 🧱 Tetris & Blocks
  tetris: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tetrisCyan" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#38BDF8" />
          <stop offset="100%" stop-color="#0284C7" />
        </linearGradient>
      </defs>
      <!-- Die cut -->
      <g stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round" fill="#FFFFFF">
        <rect x="18" y="10" width="12" height="12" rx="3" />
        <rect x="6" y="22" width="12" height="12" rx="3" />
        <rect x="18" y="22" width="12" height="12" rx="3" />
        <rect x="30" y="22" width="12" height="12" rx="3" />
      </g>
      <!-- T-shaped block with glossy bevels -->
      <rect x="18" y="10" width="12" height="12" rx="2.5" fill="#A855F7" stroke="#7E22CE" stroke-width="1.5" />
      <rect x="6" y="22" width="12" height="12" rx="2.5" fill="#A855F7" stroke="#7E22CE" stroke-width="1.5" />
      <rect x="18" y="22" width="12" height="12" rx="2.5" fill="#A855F7" stroke="#7E22CE" stroke-width="1.5" />
      <rect x="30" y="22" width="12" height="12" rx="2.5" fill="#A855F7" stroke="#7E22CE" stroke-width="1.5" />
      <!-- Inner block highlights -->
      <rect x="19" y="11" width="4" height="4" rx="1" fill="#FFFFFF" opacity="0.6" />
      <rect x="7" y="23" width="4" height="4" rx="1" fill="#FFFFFF" opacity="0.6" />
      <rect x="19" y="23" width="4" height="4" rx="1" fill="#FFFFFF" opacity="0.6" />
      <rect x="31" y="23" width="4" height="4" rx="1" fill="#FFFFFF" opacity="0.6" />
    </svg>
  `,

  // 🔢 Numbers & Math
  numbers: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mathGrad" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FCD34D" />
          <stop offset="100%" stop-color="#F59E0B" />
        </linearGradient>
      </defs>
      <rect x="7" y="7" width="34" height="34" rx="8" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" />
      <rect x="7" y="7" width="34" height="34" rx="7" fill="url(#mathGrad)" stroke="#D97706" stroke-width="2" />
      <!-- 1 2 3 matrix -->
      <text x="12" y="21" font-size="12" font-weight="900" fill="#78350F" font-family="sans-serif">1</text>
      <text x="28" y="21" font-size="12" font-weight="900" fill="#78350F" font-family="sans-serif">2</text>
      <text x="12" y="35" font-size="12" font-weight="900" fill="#78350F" font-family="sans-serif">3</text>
      <text x="27" y="35" font-size="13" font-weight="900" fill="#EF4444" font-family="sans-serif">+</text>
    </svg>
  `,

  // ♟️ Board Classics
  board: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="knightGrad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#334155" />
          <stop offset="100%" stop-color="#0F172A" />
        </linearGradient>
      </defs>
      <!-- Die cut -->
      <path d="M14 38H34V34C34 34 32 30 30 26C31 24 33 21 33 17C33 11 28 8 24 8C20 8 18 10 16 13C14 16 13 21 16 25C17 26 15 28 14 34V38Z" 
        fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round" />
      <!-- Chess Knight Silhouette -->
      <path d="M14 38H34V34C34 34 32 30 30 26C31 24 33 21 33 17C33 11 28 8 24 8C20 8 18 10 16 13C14 16 13 21 16 25C17 26 15 28 14 34V38Z" 
        fill="url(#knightGrad)" stroke="#1E293B" stroke-width="1.5" />
      <!-- Knight mane detail & eye -->
      <circle cx="21" cy="14" r="1.5" fill="#FDE047" />
      <path d="M26 11C28 13 29 16 28 19" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  `,

  // 🧸 Kids (Ages 3–8)
  kids: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bearGrad" x1="10" y1="10" x2="38" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FDBA74" />
          <stop offset="100%" stop-color="#C2410C" />
        </linearGradient>
      </defs>
      <!-- Die-cut white border -->
      <g fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round">
        <circle cx="14" cy="14" r="6" />
        <circle cx="34" cy="14" r="6" />
        <circle cx="24" cy="26" r="15" />
      </g>
      <!-- Bear Ears -->
      <circle cx="14" cy="14" r="5.5" fill="#EA580C" />
      <circle cx="14" cy="14" r="3" fill="#FED7AA" />
      <circle cx="34" cy="14" r="5.5" fill="#EA580C" />
      <circle cx="34" cy="14" r="3" fill="#FED7AA" />
      <!-- Bear Head -->
      <circle cx="24" cy="26" r="14" fill="url(#bearGrad)" stroke="#9A3412" stroke-width="1.5" />
      <!-- Snout -->
      <ellipse cx="24" cy="29" rx="6" ry="4.5" fill="#FED7AA" />
      <ellipse cx="24" cy="27.5" rx="2.5" ry="1.8" fill="#431407" />
      <!-- Eyes & Blushing cheeks -->
      <circle cx="18" cy="23" r="1.8" fill="#431407" />
      <circle cx="30" cy="23" r="1.8" fill="#431407" />
      <circle cx="15" cy="28" r="2.5" fill="#F43F5E" opacity="0.6" />
      <circle cx="33" cy="28" r="2.5" fill="#F43F5E" opacity="0.6" />
    </svg>
  `,

  // 👵 Seniors 60+
  seniors: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="seniorSkin" x1="12" y1="12" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FFEDD5" />
          <stop offset="100%" stop-color="#FED7AA" />
        </linearGradient>
      </defs>
      <!-- White die cut -->
      <circle cx="24" cy="24" r="19" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" />
      <!-- Silver hair bun -->
      <circle cx="24" cy="11" r="5" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1" />
      <circle cx="24" cy="22" r="15" fill="#E2E8F0" stroke="#CBD5E1" stroke-width="1.5" />
      <!-- Face -->
      <circle cx="24" cy="25" r="11" fill="url(#seniorSkin)" stroke="#FDBA74" stroke-width="1" />
      <!-- Glasses (Red / Tortoise) -->
      <circle cx="20" cy="24" r="3.5" stroke="#DC2626" stroke-width="1.8" fill="#FFFFFF" fill-opacity="0.4" />
      <circle cx="28" cy="24" r="3.5" stroke="#DC2626" stroke-width="1.8" fill="#FFFFFF" fill-opacity="0.4" />
      <line x1="23.5" y1="24" x2="24.5" y2="24" stroke="#DC2626" stroke-width="1.8" />
      <!-- Eyes behind glasses -->
      <circle cx="20" cy="24" r="1" fill="#1E293B" />
      <circle cx="28" cy="24" r="1" fill="#1E293B" />
      <!-- Warm smile & blush -->
      <path d="M21 30C22 31.5 26 31.5 27 30" stroke="#9A3412" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="16" cy="28" r="1.5" fill="#FB7185" opacity="0.6" />
      <circle cx="32" cy="28" r="1.5" fill="#FB7185" opacity="0.6" />
    </svg>
  `,

  // 🧩 General Puzzle
  puzzle: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="puzGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#F472B6" />
          <stop offset="100%" stop-color="#DB2777" />
        </linearGradient>
      </defs>
      <rect x="7" y="7" width="34" height="34" rx="8" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" />
      <rect x="7" y="7" width="34" height="34" rx="7" fill="url(#puzGrad)" stroke="#BE185D" stroke-width="1.5" />
      <path d="M20 14C20 16 22 17 24 17C26 17 28 16 28 14H34V20C32 20 31 22 31 24C31 26 32 28 34 28V34H28C28 32 26 31 24 31C22 31 20 32 20 34H14V28C16 28 17 26 17 24C17 22 16 20 14 20V14H20Z" 
        fill="#FFFFFF" opacity="0.9" />
    </svg>
  `,

  // 🔤 Words
  words: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="32" height="32" rx="7" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" />
      <rect x="8" y="8" width="32" height="32" rx="6" fill="#F43F5E" stroke="#E11D48" stroke-width="1.5" />
      <text x="13" y="29" font-size="18" font-weight="900" fill="#FFFFFF" font-family="sans-serif">Aa</text>
      <circle cx="33" cy="15" r="2.5" fill="#FFE4E6" />
    </svg>
  `,

  // ➕ Math Plus
  mathPlus: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="19" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" />
      <circle cx="24" cy="24" r="17" fill="#3B82F6" stroke="#1D4ED8" stroke-width="1.5" />
      <path d="M24 14V34M14 24H34" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" />
    </svg>
  `,

  // 🎨 Color Palette
  palette: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 8C14 8 8 15 8 24C8 32 14 38 20 38C22 38 23 37 23 35C23 34 22 33 22 32C22 30 24 28 26 28H29C35 28 40 23 40 17C40 12 33 8 24 8Z" 
        fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round" />
      <path d="M24 8C14 8 8 15 8 24C8 32 14 38 20 38C22 38 23 37 23 35C23 34 22 33 22 32C22 30 24 28 26 28H29C35 28 40 23 40 17C40 12 33 8 24 8Z" 
        fill="#FDE047" stroke="#CA8A04" stroke-width="1.5" />
      <circle cx="16" cy="18" r="3" fill="#EF4444" />
      <circle cx="24" cy="14" r="3" fill="#3B82F6" />
      <circle cx="32" cy="18" r="3" fill="#10B981" />
      <circle cx="34" cy="25" r="3" fill="#EC4899" />
    </svg>
  `,

  // 🔷 Shapes
  shapes: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round">
        <polygon points="24,8 36,28 12,28" />
        <rect x="22" y="22" width="18" height="18" rx="3" />
      </g>
      <polygon points="24,9 35,27 13,27" fill="#3B82F6" stroke="#1D4ED8" stroke-width="1.5" />
      <rect x="23" y="23" width="16" height="16" rx="2.5" fill="#EC4899" stroke="#BE185D" stroke-width="1.5" />
    </svg>
  `,

  // 🦁 Cute Lion Cub
  lion: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Mane -->
      <circle cx="24" cy="25" r="18" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" />
      <circle cx="24" cy="25" r="17" fill="#F97316" stroke="#C2410C" stroke-width="1.5" />
      <!-- Face -->
      <circle cx="24" cy="25" r="11" fill="#FDE047" stroke="#EAB308" stroke-width="1" />
      <!-- Ears -->
      <circle cx="15" cy="15" r="3.5" fill="#EA580C" />
      <circle cx="33" cy="15" r="3.5" fill="#EA580C" />
      <!-- Eyes & nose -->
      <circle cx="20" cy="23" r="1.5" fill="#1E293B" />
      <circle cx="28" cy="23" r="1.5" fill="#1E293B" />
      <polygon points="24,26 22,28 26,28" fill="#7C2D12" />
    </svg>
  `,

  // 🎲 Game Dice
  dice: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="9" width="30" height="30" rx="7" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" />
      <rect x="9" y="9" width="30" height="30" rx="6" fill="#EF4444" stroke="#B91C1C" stroke-width="1.5" />
      <circle cx="17" cy="17" r="2.5" fill="#FFFFFF" />
      <circle cx="31" cy="17" r="2.5" fill="#FFFFFF" />
      <circle cx="24" cy="24" r="2.5" fill="#FFFFFF" />
      <circle cx="17" cy="31" r="2.5" fill="#FFFFFF" />
      <circle cx="31" cy="31" r="2.5" fill="#FFFFFF" />
    </svg>
  `,

  // 🧊 3D Cube
  cube: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round" fill="#FFFFFF">
        <polygon points="24,8 40,16 24,24 8,16" />
        <polygon points="8,16 24,24 24,40 8,32" />
        <polygon points="40,16 24,24 24,40 40,32" />
      </g>
      <polygon points="24,9 39,16.5 24,24 9,16.5" fill="#38BDF8" />
      <polygon points="9,16.5 24,24 24,39 9,31.5" fill="#0284C7" />
      <polygon points="39,16.5 24,24 24,39 39,31.5" fill="#0369A1" />
    </svg>
  `,

  // 🔗 Chain Links
  link: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="24" r="10" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" />
      <circle cx="30" cy="24" r="10" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" />
      <circle cx="18" cy="24" r="9" stroke="#10B981" stroke-width="4" fill="none" />
      <circle cx="30" cy="24" r="9" stroke="#059669" stroke-width="4" fill="none" />
    </svg>
  `,

  // ✏️ Pencil
  pencil: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(45 24 24)">
        <rect x="20" y="8" width="8" height="24" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" />
        <polygon points="20,32 28,32 24,40" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" />
        <rect x="20" y="8" width="8" height="6" fill="#F43F5E" />
        <rect x="20" y="14" width="8" height="18" fill="#FACC15" />
        <polygon points="20,32 28,32 24,40" fill="#FED7AA" />
        <polygon points="22,36 26,36 24,40" fill="#1E293B" />
      </g>
    </svg>
  `,

  // 🔥 Flame / Popular / Daily
  flame: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fireGrad" x1="12" y1="40" x2="36" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#EA580C" />
          <stop offset="50%" stop-color="#F59E0B" />
          <stop offset="100%" stop-color="#FDE047" />
        </linearGradient>
      </defs>
      <path d="M24 6C24 6 29 13 29 18C29 20 28 22 26.5 23C29 23 34 26 34 32C34 37.5 29.5 42 24 42C18.5 42 14 37.5 14 32C14 24 20 17 20 17C20 17 19 22 21 24C21.5 20 24 6 24 6Z" 
        fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round" />
      <path d="M24 6C24 6 29 13 29 18C29 20 28 22 26.5 23C29 23 34 26 34 32C34 37.5 29.5 42 24 42C18.5 42 14 37.5 14 32C14 24 20 17 20 17C20 17 19 22 21 24C21.5 20 24 6 24 6Z" 
        fill="url(#fireGrad)" stroke="#C2410C" stroke-width="1.5" />
      <path d="M24 28C24 28 27 31 27 34C27 36 25.5 37.5 24 37.5C22.5 37.5 21 36 21 34C21 31 24 28 24 28Z" fill="#FFFFFF" opacity="0.9" />
    </svg>
  `,

  // 🏆 Trophy
  trophy: `
    <svg viewBox="0 0 48 48" class="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="trophyGrad" x1="12" y1="8" x2="36" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FDE047" />
          <stop offset="50%" stop-color="#EAB308" />
          <stop offset="100%" stop-color="#CA8A04" />
        </linearGradient>
      </defs>
      <path d="M16 8H32V20C32 25 28 28 24 28C20 28 16 25 16 20V8Z" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round" />
      <rect x="18" y="36" width="12" height="4" rx="2" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="4" />
      <path d="M16 8H32V20C32 25 28 28 24 28C20 28 16 25 16 20V8Z" fill="url(#trophyGrad)" stroke="#A16207" stroke-width="1.5" />
      <path d="M16 11H10C8.5 11 8 13 8 15C8 19 12 21 16 21M32 11H38C39.5 11 40 13 40 15C40 19 36 21 32 21" stroke="#EAB308" stroke-width="2.5" stroke-linecap="round" />
      <path d="M22 28V36H26V28" fill="#EAB308" stroke="#CA8A04" stroke-width="1.5" />
      <rect x="17" y="36" width="14" height="4" rx="2" fill="#713F12" stroke="#A16207" stroke-width="1" />
      <circle cx="24" cy="16" r="3" fill="#FFFFFF" opacity="0.6" />
    </svg>
  `
};

/**
 * Helper to get sticker SVG string.
 * Falls back to default category or brain sticker if not found.
 */
export function getSticker(id: string): string {
  if (STICKERS[id]) {
    return STICKERS[id];
  }
  return STICKERS.brain;
}
