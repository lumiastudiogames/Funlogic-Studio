(function () {
  'use strict';

  const SVG_ICONS = {
    microscope: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-indigo-500"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg>`,
    flask: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-amber-500"><path d="M10 2v7.31L4.14 19.3A2 2 0 0 0 5.86 22h12.28a2 2 0 0 0 1.72-2.7L14 9.31V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>`,
    rocket: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-indigo-400"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
    map: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-sky-400"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>`,
    book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-emerald-400"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>`,
    timer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-slate-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    lightbulb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-amber-500"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
    clipboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-indigo-600"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-indigo-600"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-indigo-600"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-emerald-600"><polyline points="20 6 9 17 4 12"/></svg>`,
    cross: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-rose-500"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    trophy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-amber-400"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" class="w-full h-full text-amber-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-slate-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    arrowLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
    question: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-slate-400"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    sparkle: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-amber-300"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/></svg>`,

    avatar_boy_1: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#E0E7FF" stroke="#6366F1" stroke-width="2"/>
      <path d="M10 14C10 9 14 6 18 6C22 6 26 9 26 14C26 15.5 25.5 17 24.5 18C23.5 19 22 20 18 20C14 20 12.5 19 11.5 18C10.5 17 10 15.5 10 14Z" fill="#818CF8"/>
      <circle cx="18" cy="16" r="6" fill="#FDE68A"/>
      <path d="M14 12C14 9 16 8 18 8C20 8 22 9 22 12" stroke="#4338CA" stroke-width="2" stroke-linecap="round"/>
      <circle cx="16" cy="15" r="1" fill="#1E1B4B"/>
      <circle cx="20" cy="15" r="1" fill="#1E1B4B"/>
      <path d="M16 18C17 19 19 19 20 18" stroke="#D97706" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M11 31C11 25 14 23 18 23C22 23 25 25 25 31" fill="#4F46E5"/>
      <rect x="13" y="13" width="10" height="4" rx="2" stroke="#4338CA" stroke-width="1.2" fill="none"/>
    </svg>`,

    avatar_girl_1: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#FCE7F3" stroke="#EC4899" stroke-width="2"/>
      <circle cx="9" cy="16" r="3.5" fill="#DB2777"/>
      <circle cx="27" cy="16" r="3.5" fill="#DB2777"/>
      <path d="M11 15C11 9 14 7 18 7C22 7 25 9 25 15C25 20 22 21 18 21C14 21 11 20 11 15Z" fill="#BE185D"/>
      <circle cx="18" cy="16" r="6" fill="#FDE68A"/>
      <path d="M12 13C14 9 22 9 24 13" fill="#9D174D"/>
      <circle cx="16" cy="15" r="1" fill="#1E1B4B"/>
      <circle cx="20" cy="15" r="1" fill="#1E1B4B"/>
      <path d="M16 18C17 19 19 19 20 18" stroke="#DB2777" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M11 31C11 25 14 23 18 23C22 23 25 25 25 31" fill="#EC4899"/>
    </svg>`,

    avatar_girl_2: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2"/>
      <path d="M10 17C10 9 14 6 18 6C22 6 26 9 26 17C26 23 22 24 18 24C14 24 10 23 10 17Z" fill="#B45309"/>
      <circle cx="18" cy="16" r="6" fill="#FDE68A"/>
      <path d="M12 12C15 8 21 8 24 12" fill="#78350F"/>
      <circle cx="16" cy="15" r="1" fill="#1E1B4B"/>
      <circle cx="20" cy="15" r="1" fill="#1E1B4B"/>
      <path d="M16 18C17 19.5 19 19.5 20 18" stroke="#B45309" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M11 31C11 25 14 23 18 23C22 23 25 25 25 31" fill="#F59E0B"/>
    </svg>`,

    avatar_boy_2: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#CCFBF1" stroke="#14B8A6" stroke-width="2"/>
      <path d="M12 13C12 9 14 6 18 6C22 6 24 9 24 13" stroke="#0F766E" stroke-width="3" stroke-linecap="round"/>
      <circle cx="18" cy="16" r="6" fill="#FDE68A"/>
      <circle cx="16" cy="15" r="1" fill="#1E1B4B"/>
      <circle cx="20" cy="15" r="1" fill="#1E1B4B"/>
      <path d="M16 18C17 19 19 19 20 18" stroke="#0F766E" stroke-width="1.2" stroke-linecap="round"/>
      <path d="M11 31C11 25 14 23 18 23C22 23 25 25 25 31" fill="#0D9488"/>
      <path d="M15 24L18 29L21 24" stroke="#CCFBF1" stroke-width="1.5"/>
    </svg>`,

    project_volcano: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#FFEDD5" stroke="#F97316" stroke-width="2"/>
      <path d="M6 30L14 14H22L30 30H6Z" fill="#78350F"/>
      <path d="M14 14L10 30H26L22 14H14Z" fill="#9A3412"/>
      <ellipse cx="18" cy="14" rx="4" ry="1.5" fill="#EF4444"/>
      <path d="M17 14L15 22L16 26" stroke="#F97316" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M19 14L21 20L20 25" stroke="#FBBF24" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="16" cy="9" r="1.5" fill="#EF4444"/>
      <circle cx="20" cy="8" r="1.2" fill="#F97316"/>
      <circle cx="18" cy="6" r="1.8" fill="#F59E0B"/>
    </svg>`,

    project_robot: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#E0F2FE" stroke="#0284C7" stroke-width="2"/>
      <line x1="18" y1="6" x2="18" y2="10" stroke="#0369A1" stroke-width="2"/>
      <circle cx="18" cy="5" r="2" fill="#EF4444"/>
      <rect x="10" y="10" width="16" height="12" rx="3" fill="#0284C7"/>
      <rect x="13" y="13" width="10" height="4" rx="1.5" fill="#38BDF8"/>
      <rect x="11" y="24" width="14" height="7" rx="2" fill="#0369A1"/>
      <circle cx="15" cy="27.5" r="1.5" fill="#BAE6FD"/>
      <circle cx="21" cy="27.5" r="1.5" fill="#BAE6FD"/>
      <rect x="8" y="13" width="2" height="6" rx="1" fill="#0369A1"/>
      <rect x="26" y="13" width="2" height="6" rx="1" fill="#0369A1"/>
    </svg>`,

    project_solar: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2"/>
      <circle cx="27" cy="9" r="4" fill="#F59E0B"/>
      <line x1="27" y1="2" x2="27" y2="3.5" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="33" y1="5" x2="32" y2="6.5" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="34" y1="9" x2="32.5" y2="9" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round"/>
      <rect x="16.5" y="24" width="3" height="7" fill="#64748B"/>
      <path d="M12 31H24" stroke="#475569" stroke-width="2" stroke-linecap="round"/>
      <g transform="rotate(-12 16 18)">
        <rect x="8" y="10" width="17" height="13" rx="1.5" fill="#1D4ED8" stroke="#60A5FA" stroke-width="1.5"/>
        <line x1="13.5" y1="10" x2="13.5" y2="23" stroke="#93C5FD" stroke-width="0.8"/>
        <line x1="19.5" y1="10" x2="19.5" y2="23" stroke="#93C5FD" stroke-width="0.8"/>
        <line x1="8" y1="16.5" x2="25" y2="16.5" stroke="#93C5FD" stroke-width="0.8"/>
      </g>
    </svg>`,

    project_tesla: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#F3E8FF" stroke="#A855F7" stroke-width="2"/>
      <ellipse cx="18" cy="9" rx="8" ry="3.5" fill="#C084FC" stroke="#7E22CE" stroke-width="1.5"/>
      <rect x="15" y="12" width="6" height="14" fill="#9333EA"/>
      <line x1="15" y1="14" x2="21" y2="15" stroke="#E9D5FF" stroke-width="1"/>
      <line x1="15" y1="17" x2="21" y2="18" stroke="#E9D5FF" stroke-width="1"/>
      <line x1="15" y1="20" x2="21" y2="21" stroke="#E9D5FF" stroke-width="1"/>
      <line x1="15" y1="23" x2="21" y2="24" stroke="#E9D5FF" stroke-width="1"/>
      <rect x="12" y="26" width="12" height="4" rx="1" fill="#581C87"/>
      <path d="M10 8L6 5L8 11L4 12" stroke="#FACC15" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M26 8L30 5L28 11L32 12" stroke="#38BDF8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    project_rocket: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#E0E7FF" stroke="#6366F1" stroke-width="2"/>
      <path d="M18 6C14 11 13 17 13 24H23C23 17 22 11 18 6Z" fill="#E11D48"/>
      <circle cx="18" cy="15" r="2.5" fill="#38BDF8" stroke="#FFFFFF" stroke-width="1"/>
      <path d="M13 20L8 25V27L13 25V20Z" fill="#BE123C"/>
      <path d="M23 20L28 25V27L23 25V20Z" fill="#BE123C"/>
      <path d="M15 24L18 30L21 24Z" fill="#F59E0B"/>
      <path d="M16.5 24L18 28L19.5 24Z" fill="#FEF08A"/>
    </svg>`,

    project_microscope: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#F1F5F9" stroke="#64748B" stroke-width="2"/>
      <path d="M9 30H27" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M21 29C21 22 18 19 14 18" stroke="#475569" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="10" y="21" width="10" height="2" fill="#0EA5E9"/>
      <g transform="rotate(22 17 13)">
        <rect x="14" y="8" width="6" height="12" rx="1.5" fill="#0284C7"/>
        <rect x="15" y="5" width="4" height="3" fill="#38BDF8"/>
        <rect x="15.5" y="20" width="3" height="3" fill="#0369A1"/>
      </g>
    </svg>`,

    project_biogen: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#DCFCE7" stroke="#10B981" stroke-width="2"/>
      <path d="M15 8V14L9 26C8 28 9.5 30 12 30H24C26.5 30 28 28 27 26L21 14V8H15Z" fill="#34D399" stroke="#059669" stroke-width="1.5"/>
      <path d="M11 25L14 18H22L25 25C24 28 22 29 18 29C14 29 12 28 11 25Z" fill="#059669"/>
      <path d="M18 20C15 20 15 26 18 27C21 26 21 20 18 20Z" fill="#A7F3D0"/>
      <line x1="18" y1="21" x2="18" y2="26" stroke="#047857" stroke-width="1"/>
      <circle cx="16" cy="16" r="1" fill="#FFFFFF"/>
      <circle cx="19" cy="13" r="1.5" fill="#FFFFFF"/>
    </svg>`,

    project_rover: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#E0F2FE" stroke="#0284C7" stroke-width="2"/>
      <rect x="10" y="16" width="16" height="8" rx="2" fill="#E2E8F0" stroke="#475569" stroke-width="1.5"/>
      <rect x="13" y="13" width="6" height="3" fill="#38BDF8"/>
      <circle cx="11" cy="27" r="3" fill="#1E293B"/>
      <circle cx="18" cy="27" r="3" fill="#1E293B"/>
      <circle cx="25" cy="27" r="3" fill="#1E293B"/>
      <line x1="22" y1="16" x2="22" y2="10" stroke="#64748B" stroke-width="1.5"/>
      <circle cx="22" cy="9" r="2" fill="#EF4444"/>
      <path d="M12 11C12 8 16 8 16 11" stroke="#3B82F6" stroke-width="1.5"/>
    </svg>`,

    project_wind: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#ECFEFF" stroke="#06B6D4" stroke-width="2"/>
      <polygon points="17,16 19,16 20,30 16,30" fill="#64748B"/>
      <circle cx="18" cy="15" r="2.5" fill="#0891B2"/>
      <path d="M18 15L18 4C19 4 20 8 18 15Z" fill="#22D3EE"/>
      <path d="M18 15L8 22C9 23 12 21 18 15Z" fill="#22D3EE"/>
      <path d="M18 15L28 22C27 23 24 21 18 15Z" fill="#22D3EE"/>
    </svg>`,

    project_filter: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#E0F2FE" stroke="#38BDF8" stroke-width="2"/>
      <rect x="13" y="8" width="10" height="18" rx="2" fill="#F8FAFC" stroke="#0284C7" stroke-width="1.5"/>
      <rect x="14" y="10" width="8" height="4" fill="#334155"/>
      <rect x="14" y="15" width="8" height="4" fill="#D97706"/>
      <rect x="14" y="20" width="8" height="5" fill="#38BDF8"/>
      <path d="M18 27C16 27 15 28.5 15 30C15 31.5 16.3 32.5 18 32.5C19.7 32.5 21 31.5 21 30C21 28.5 20 27 18 27Z" fill="#0284C7"/>
    </svg>`,

    project_greenhouse: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#F0FDF4" stroke="#22C55E" stroke-width="2"/>
      <path d="M8 28C8 16 13 10 18 10C23 10 28 16 28 28H8Z" fill="#DCFCE7" stroke="#15803D" stroke-width="1.5"/>
      <line x1="18" y1="10" x2="18" y2="28" stroke="#16A34A" stroke-width="1"/>
      <line x1="8" y1="20" x2="28" y2="20" stroke="#16A34A" stroke-width="1"/>
      <path d="M18 28V21" stroke="#15803D" stroke-width="2"/>
      <path d="M18 22C15 20 15 17 18 17C18 20 17 21 18 22Z" fill="#22C55E"/>
      <path d="M18 24C21 22 21 19 18 19C18 22 19 23 18 24Z" fill="#22C55E"/>
    </svg>`,

    project_accelerator: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#FAF5FF" stroke="#A855F7" stroke-width="2"/>
      <ellipse cx="18" cy="18" rx="12" ry="6" fill="none" stroke="#7E22CE" stroke-width="2"/>
      <ellipse cx="18" cy="18" rx="6" ry="12" fill="none" stroke="#9333EA" stroke-width="2"/>
      <circle cx="18" cy="18" r="3" fill="#FACC15"/>
      <circle cx="28" cy="18" r="1.5" fill="#38BDF8"/>
      <circle cx="18" cy="6" r="1.5" fill="#EC4899"/>
    </svg>`,

    project_bionic: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#F8FAFC" stroke="#64748B" stroke-width="2"/>
      <rect x="8" y="22" width="10" height="6" rx="2" fill="#334155"/>
      <circle cx="18" cy="20" r="3.5" fill="#0284C7" stroke="#0369A1" stroke-width="1"/>
      <path d="M18 20L25 12" stroke="#64748B" stroke-width="3" stroke-linecap="round"/>
      <circle cx="25" cy="12" r="2" fill="#F59E0B"/>
      <path d="M25 12L28 8" stroke="#334155" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M25 12L30 11" stroke="#334155" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M25 12L29 14" stroke="#334155" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,

    project_cubesat: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
      <rect x="4" y="15" width="8" height="6" fill="#1D4ED8" stroke="#60A5FA" stroke-width="1"/>
      <rect x="24" y="15" width="8" height="6" fill="#1D4ED8" stroke="#60A5FA" stroke-width="1"/>
      <rect x="13" y="13" width="10" height="10" rx="1.5" fill="#E2E8F0" stroke="#475569" stroke-width="1.5"/>
      <circle cx="18" cy="18" r="2.5" fill="#0284C7"/>
      <line x1="18" y1="13" x2="18" y2="8" stroke="#F59E0B" stroke-width="1.5"/>
      <circle cx="18" cy="7" r="1" fill="#EF4444"/>
    </svg>`,

    project_drone: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#FEFCE8" stroke="#EAB308" stroke-width="2"/>
      <line x1="8" y1="10" x2="28" y2="26" stroke="#475569" stroke-width="2"/>
      <line x1="8" y1="26" x2="28" y2="10" stroke="#475569" stroke-width="2"/>
      <ellipse cx="8" cy="10" rx="4" ry="1.5" fill="#38BDF8"/>
      <ellipse cx="28" cy="10" rx="4" ry="1.5" fill="#38BDF8"/>
      <ellipse cx="8" cy="26" rx="4" ry="1.5" fill="#38BDF8"/>
      <ellipse cx="28" cy="26" rx="4" ry="1.5" fill="#38BDF8"/>
      <circle cx="18" cy="18" r="4.5" fill="#CA8A04" stroke="#713F12" stroke-width="1"/>
      <circle cx="18" cy="18" r="1.8" fill="#FEF08A"/>
    </svg>`,

    award_gold: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2"/>
      <path d="M13 6L10 16L15 15L18 20L21 15L26 16L23 6H13Z" fill="#DC2626"/>
      <circle cx="18" cy="21" r="8" fill="#F59E0B" stroke="#B45309" stroke-width="1.5"/>
      <circle cx="18" cy="21" r="6" fill="#FBBF24"/>
      <text x="18" y="24" font-size="7" font-weight="900" fill="#78350F" text-anchor="middle" font-family="sans-serif">1</text>
    </svg>`,

    award_silver: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#F1F5F9" stroke="#94A3B8" stroke-width="2"/>
      <path d="M13 6L10 16L15 15L18 20L21 15L26 16L23 6H13Z" fill="#2563EB"/>
      <circle cx="18" cy="21" r="8" fill="#94A3B8" stroke="#475569" stroke-width="1.5"/>
      <circle cx="18" cy="21" r="6" fill="#CBD5E1"/>
      <text x="18" y="24" font-size="7" font-weight="900" fill="#1E293B" text-anchor="middle" font-family="sans-serif">2</text>
    </svg>`,

    award_bronze: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#FFEDD5" stroke="#D97706" stroke-width="2"/>
      <path d="M13 6L10 16L15 15L18 20L21 15L26 16L23 6H13Z" fill="#16A34A"/>
      <circle cx="18" cy="21" r="8" fill="#B45309" stroke="#78350F" stroke-width="1.5"/>
      <circle cx="18" cy="21" r="6" fill="#D97706"/>
      <text x="18" y="24" font-size="7" font-weight="900" fill="#FEF3C7" text-anchor="middle" font-family="sans-serif">3</text>
    </svg>`,

    award_diamond: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#E0F2FE" stroke="#0284C7" stroke-width="2"/>
      <path d="M18 8L27 15L18 28L9 15L18 8Z" fill="#38BDF8" stroke="#0284C7" stroke-width="1.5"/>
      <path d="M18 8L14 15H22L18 8Z" fill="#BAE6FD"/>
      <path d="M9 15L14 15L18 28L9 15Z" fill="#0284C7"/>
      <path d="M27 15L22 15L18 28L27 15Z" fill="#0369A1"/>
      <circle cx="25" cy="10" r="1.5" fill="#FFFFFF"/>
    </svg>`,

    award_honor: `<svg viewBox="0 0 36 36" fill="none" class="w-full h-full">
      <circle cx="18" cy="18" r="17" fill="#F5F3FF" stroke="#8B5CF6" stroke-width="2"/>
      <path d="M18 9L25 12V19C25 24 21 27 18 28C15 27 11 24 11 19V12L18 9Z" fill="#8B5CF6" stroke="#6D28D9" stroke-width="1.5"/>
      <path d="M18 12L22 14V19C22 22 20 24 18 25C16 24 14 22 14 19V14L18 12Z" fill="#DDD6FE"/>
      <polygon points="18 14 19 17 21.5 17 19.5 18.5 20 21 18 19.5 16 21 16.5 18.5 14.5 17 17 17" fill="#F59E0B"/>
    </svg>`
  };

  window.GameAssets = {
    get(name, extraClass = '') {
      const raw = SVG_ICONS[name] || SVG_ICONS['question'];
      if (extraClass) {
        return `<span class="inline-flex items-center justify-center shrink-0 ${extraClass}">${raw}</span>`;
      }
      return raw;
    },

    getIcon(name) {
      return SVG_ICONS[name] || SVG_ICONS['question'];
    }
  };
})();
