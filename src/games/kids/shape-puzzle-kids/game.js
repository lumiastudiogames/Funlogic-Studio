// Shape Puzzle Kids - 20 Cute Animal Tangrams for Children (Detailed Drawings, Pseudo-3D & Drag & Drop)
(function() {
  'use strict';

  let audioCtx = null;
  let soundEnabled = true;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playSound(type) {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'select') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'snap') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.12);
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'win') {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.2, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.35);
      });
    }
  }

  // 20 Cute Animal Tangram Definitions with Rich Detail Layers
  const ANIMALS = [
    {
      id: 1, name: 'Kitten', emoji: '🐱',
      shapes: [
        { id: 's1', name: 'Cat Ears', color: '#f43f5e', border: '#be123c', type: 'polygon', points: '120,20 70,70 170,70' },
        { id: 's2', name: 'Cute Face', color: '#06b6d4', border: '#0e7490', type: 'polygon', points: '120,70 170,120 120,170 70,120' },
        { id: 's3', name: 'Cozy Body', color: '#f59e0b', border: '#b45309', type: 'polygon', points: '120,170 60,230 180,230' }
      ],
      details: `
        <circle cx="102" cy="115" r="7" fill="#0f172a"/>
        <circle cx="104" cy="113" r="2.5" fill="#ffffff"/>
        <circle cx="138" cy="115" r="7" fill="#0f172a"/>
        <circle cx="140" cy="113" r="2.5" fill="#ffffff"/>
        <polygon points="120,126 116,132 124,132" fill="#fda4af"/>
        <path d="M115,136 Q120,140 125,136" stroke="#0f172a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <line x1="88" y1="126" x2="65" y2="122" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="88" y1="133" x2="65" y2="135" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="152" y1="126" x2="175" y2="122" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="152" y1="133" x2="175" y2="135" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="90" cy="128" r="5" fill="#fda4af" opacity="0.6"/>
        <circle cx="150" cy="128" r="5" fill="#fda4af" opacity="0.6"/>
      `
    },
    {
      id: 2, name: 'Puppy', emoji: '🐶',
      shapes: [
        { id: 's1', name: 'Floppy Ears', color: '#854d0e', border: '#713f12', type: 'polygon', points: '60,40 180,40 160,90 80,90' },
        { id: 's2', name: 'Puppy Face', color: '#fcd34d', border: '#d97706', type: 'circle', cx: '120', cy: '115', r: '45' },
        { id: 's3', name: 'Puppy Body', color: '#fb923c', border: '#c2410c', type: 'polygon', points: '80,160 160,160 170,225 70,225' }
      ],
      details: `
        <circle cx="105" cy="105" r="6" fill="#1e293b"/>
        <circle cx="107" cy="103" r="2" fill="#ffffff"/>
        <circle cx="135" cy="105" r="6" fill="#1e293b"/>
        <circle cx="137" cy="103" r="2" fill="#ffffff"/>
        <ellipse cx="120" cy="120" rx="9" ry="6" fill="#1e293b"/>
        <path d="M120,126 Q115,134 110,130" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M120,126 Q125,134 130,130" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <ellipse cx="120" cy="136" rx="4" ry="7" fill="#f43f5e"/>
        <circle cx="94" cy="118" r="6" fill="#fb7185" opacity="0.5"/>
        <circle cx="146" cy="118" r="6" fill="#fb7185" opacity="0.5"/>
      `
    },
    {
      id: 3, name: 'Bunny', emoji: '🐰',
      shapes: [
        { id: 's1', name: 'Long Ears', color: '#f472b6', border: '#db2777', type: 'polygon', points: '90,15 110,75 130,75 150,15' },
        { id: 's2', name: 'Head', color: '#ffffff', border: '#cbd5e1', type: 'circle', cx: '120', cy: '115', r: '42' },
        { id: 's3', name: 'Fluffy Body', color: '#e2e8f0', border: '#94a3b8', type: 'circle', cx: '120', cy: '185', r: '40' }
      ],
      details: `
        <circle cx="106" cy="108" r="6" fill="#0f172a"/>
        <circle cx="108" cy="106" r="2" fill="#ffffff"/>
        <circle cx="134" cy="108" r="6" fill="#0f172a"/>
        <circle cx="136" cy="106" r="2" fill="#ffffff"/>
        <ellipse cx="120" cy="118" rx="5" ry="4" fill="#fb7185"/>
        <path d="M116,122 Q120,126 124,122" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round"/>
        <circle cx="96" cy="118" r="5" fill="#fda4af" opacity="0.6"/>
        <circle cx="144" cy="118" r="5" fill="#fda4af" opacity="0.6"/>
      `
    },
    {
      id: 4, name: 'Duckling', emoji: '🦆',
      shapes: [
        { id: 's1', name: 'Duck Head', color: '#facc15', border: '#ca8a04', type: 'circle', cx: '100', cy: '65', r: '36' },
        { id: 's2', name: 'Orange Beak', color: '#f97316', border: '#c2410c', type: 'polygon', points: '135,60 175,68 135,76' },
        { id: 's3', name: 'Pond Body', color: '#fbbf24', border: '#d97706', type: 'polygon', points: '60,110 180,110 160,180 70,170' }
      ],
      details: `
        <circle cx="110" cy="58" r="6" fill="#0f172a"/>
        <circle cx="112" cy="56" r="2" fill="#ffffff"/>
        <circle cx="94" cy="72" r="5" fill="#f97316" opacity="0.6"/>
        <path d="M90,135 Q120,150 150,135" stroke="#ca8a04" stroke-width="3" fill="none" stroke-linecap="round"/>
      `
    },
    {
      id: 5, name: 'Teddy Bear', emoji: '🐻',
      shapes: [
        { id: 's1', name: 'Bear Ears', color: '#78350f', border: '#451a03', type: 'polygon', points: '70,40 100,50 140,50 170,40 160,75 80,75' },
        { id: 's2', name: 'Bear Face', color: '#b45309', border: '#78350f', type: 'circle', cx: '120', cy: '105', r: '45' },
        { id: 's3', name: 'Bear Tummy', color: '#92400e', border: '#713f12', type: 'circle', cx: '120', cy: '180', r: '46' }
      ],
      details: `
        <circle cx="104" cy="95" r="5" fill="#0f172a"/>
        <circle cx="106" cy="93" r="1.8" fill="#ffffff"/>
        <circle cx="136" cy="95" r="5" fill="#0f172a"/>
        <circle cx="138" cy="93" r="1.8" fill="#ffffff"/>
        <ellipse cx="120" cy="115" rx="14" ry="10" fill="#fde68a"/>
        <ellipse cx="120" cy="112" rx="6" ry="4" fill="#1e293b"/>
        <path d="M120,116 L120,122" stroke="#1e293b" stroke-width="2"/>
        <path d="M116,122 Q120,125 124,122" stroke="#1e293b" stroke-width="2" fill="none"/>
        <ellipse cx="120" cy="180" rx="22" ry="24" fill="#b45309" opacity="0.6"/>
      `
    },
    {
      id: 6, name: 'Fox', emoji: '🦊',
      shapes: [
        { id: 's1', name: 'Alert Ears', color: '#ea580c', border: '#9a3412', type: 'polygon', points: '70,25 100,75 140,75 170,25' },
        { id: 's2', name: 'Fox Face', color: '#f97316', border: '#c2410c', type: 'polygon', points: '80,75 160,75 120,140' },
        { id: 's3', name: 'Bushy Tail', color: '#fb923c', border: '#ea580c', type: 'polygon', points: '120,140 185,150 200,215 130,200' }
      ],
      details: `
        <circle cx="105" cy="88" r="5" fill="#0f172a"/>
        <circle cx="107" cy="86" r="1.8" fill="#ffffff"/>
        <circle cx="135" cy="88" r="5" fill="#0f172a"/>
        <circle cx="137" cy="86" r="1.8" fill="#ffffff"/>
        <circle cx="120" cy="136" r="5" fill="#0f172a"/>
        <polygon points="120,140 100,105 140,105" fill="#ffffff" opacity="0.3"/>
      `
    },
    {
      id: 7, name: 'Frog', emoji: '🐸',
      shapes: [
        { id: 's1', name: 'Froggy Eyes', color: '#4ade80', border: '#16a34a', type: 'polygon', points: '80,45 100,75 140,75 160,45' },
        { id: 's2', name: 'Wide Head', color: '#22c55e', border: '#15803d', type: 'circle', cx: '120', cy: '105', r: '48' },
        { id: 's3', name: 'Springy Legs', color: '#16a34a', border: '#166534', type: 'polygon', points: '60,165 180,165 160,220 80,220' }
      ],
      details: `
        <circle cx="95" cy="55" r="7" fill="#0f172a"/>
        <circle cx="97" cy="53" r="2.5" fill="#ffffff"/>
        <circle cx="145" cy="55" r="7" fill="#0f172a"/>
        <circle cx="147" cy="53" r="2.5" fill="#ffffff"/>
        <path d="M100,115 Q120,135 140,115" stroke="#064e3b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <circle cx="92" cy="115" r="6" fill="#f472b6" opacity="0.6"/>
        <circle cx="148" cy="115" r="6" fill="#f472b6" opacity="0.6"/>
      `
    },
    {
      id: 8, name: 'Tropical Fish', emoji: '🐠',
      shapes: [
        { id: 's1', name: 'Fish Face', color: '#38bdf8', border: '#0284c7', type: 'polygon', points: '70,120 120,70 120,170' },
        { id: 's2', name: 'Fish Body', color: '#0ea5e9', border: '#0369a1', type: 'polygon', points: '120,70 175,90 175,150 120,170' },
        { id: 's3', name: 'Tail Fin', color: '#f43f5e', border: '#be123c', type: 'polygon', points: '175,120 220,75 220,165' }
      ],
      details: `
        <circle cx="95" cy="110" r="7" fill="#0f172a"/>
        <circle cx="97" cy="108" r="2.5" fill="#ffffff"/>
        <circle cx="82" cy="126" r="4" fill="#fda4af" opacity="0.6"/>
        <path d="M135,95 Q145,120 135,145" stroke="#ffffff" stroke-width="3" fill="none" stroke-linecap="round"/>
      `
    },
    {
      id: 9, name: 'Songbird', emoji: '🐦',
      shapes: [
        { id: 's1', name: 'Crest Head', color: '#3b82f6', border: '#1d4ed8', type: 'circle', cx: '95', cy: '75', r: '32' },
        { id: 's2', name: 'Feather Wing', color: '#6366f1', border: '#4338ca', type: 'polygon', points: '110,80 180,45 155,120' },
        { id: 's3', name: 'Round Body', color: '#2563eb', border: '#1e40af', type: 'polygon', points: '80,105 140,115 130,175 70,150' }
      ],
      details: `
        <circle cx="88" cy="70" r="5" fill="#0f172a"/>
        <circle cx="90" cy="68" r="1.8" fill="#ffffff"/>
        <polygon points="63,75 50,79 63,83" fill="#f59e0b"/>
      `
    },
    {
      id: 10, name: 'Piglet', emoji: '🐷',
      shapes: [
        { id: 's1', name: 'Pink Ears', color: '#f472b6', border: '#db2777', type: 'polygon', points: '75,45 105,75 135,75 165,45' },
        { id: 's2', name: 'Pig Head', color: '#fbcfe8', border: '#f472b6', type: 'circle', cx: '120', cy: '110', r: '46' },
        { id: 's3', name: 'Cute Snout', color: '#ec4899', border: '#be185d', type: 'circle', cx: '120', cy: '120', r: '20' }
      ],
      details: `
        <circle cx="102" cy="100" r="5" fill="#0f172a"/>
        <circle cx="104" cy="98" r="1.8" fill="#ffffff"/>
        <circle cx="138" cy="100" r="5" fill="#0f172a"/>
        <circle cx="136" cy="98" r="1.8" fill="#ffffff"/>
        <ellipse cx="114" cy="120" rx="3" ry="5" fill="#831843"/>
        <ellipse cx="126" cy="120" rx="3" ry="5" fill="#831843"/>
        <circle cx="88" cy="115" r="5" fill="#fb7185" opacity="0.6"/>
        <circle cx="152" cy="115" r="5" fill="#fb7185" opacity="0.6"/>
      `
    },
    {
      id: 11, name: 'Elephant', emoji: '🐘',
      shapes: [
        { id: 's1', name: 'Big Ear', color: '#94a3b8', border: '#64748b', type: 'polygon', points: '50,60 110,50 100,140 40,120' },
        { id: 's2', name: 'Head', color: '#cbd5e1', border: '#94a3b8', type: 'circle', cx: '135', cy: '95', r: '42' },
        { id: 's3', name: 'Long Trunk', color: '#64748b', border: '#475569', type: 'polygon', points: '160,110 195,120 185,185 160,165' }
      ],
      details: `
        <circle cx="140" cy="85" r="5" fill="#0f172a"/>
        <circle cx="142" cy="83" r="1.8" fill="#ffffff"/>
        <path d="M150,118 Q165,120 160,135" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>
      `
    },
    {
      id: 12, name: 'Lion Cub', emoji: '🦁',
      shapes: [
        { id: 's1', name: 'Brave Mane', color: '#ea580c', border: '#9a3412', type: 'circle', cx: '120', cy: '100', r: '56' },
        { id: 's2', name: 'Lion Face', color: '#fde047', border: '#ca8a04', type: 'circle', cx: '120', cy: '100', r: '36' },
        { id: 's3', name: 'Lion Body', color: '#f59e0b', border: '#b45309', type: 'polygon', points: '80,155 160,155 170,225 70,225' }
      ],
      details: `
        <circle cx="108" cy="92" r="5" fill="#0f172a"/>
        <circle cx="110" cy="90" r="1.8" fill="#ffffff"/>
        <circle cx="132" cy="92" r="5" fill="#0f172a"/>
        <circle cx="134" cy="90" r="1.8" fill="#ffffff"/>
        <polygon points="120,102 116,108 124,108" fill="#b45309"/>
        <path d="M116,112 Q120,116 124,112" stroke="#0f172a" stroke-width="2" fill="none"/>
      `
    },
    {
      id: 13, name: 'Monkey', emoji: '🐵',
      shapes: [
        { id: 's1', name: 'Round Ears', color: '#b45309', border: '#78350f', type: 'polygon', points: '55,90 90,70 150,70 185,90 170,125 70,125' },
        { id: 's2', name: 'Monkey Face', color: '#fcd34d', border: '#d97706', type: 'circle', cx: '120', cy: '105', r: '40' },
        { id: 's3', name: 'Jumping Body', color: '#78350f', border: '#451a03', type: 'polygon', points: '90,145 150,145 160,215 80,215' }
      ],
      details: `
        <circle cx="108" cy="98" r="5" fill="#0f172a"/>
        <circle cx="110" cy="96" r="1.8" fill="#ffffff"/>
        <circle cx="132" cy="98" r="5" fill="#0f172a"/>
        <circle cx="134" cy="96" r="1.8" fill="#ffffff"/>
        <ellipse cx="120" cy="116" rx="14" ry="9" fill="#fde68a"/>
        <circle cx="116" cy="114" r="1.5" fill="#0f172a"/>
        <circle cx="124" cy="114" r="1.5" fill="#0f172a"/>
        <path d="M114,120 Q120,124 126,120" stroke="#0f172a" stroke-width="2" fill="none"/>
      `
    },
    {
      id: 14, name: 'Giraffe', emoji: '🦒',
      shapes: [
        { id: 's1', name: 'Horns & Head', color: '#f59e0b', border: '#b45309', type: 'polygon', points: '105,25 135,25 145,70 95,70' },
        { id: 's2', name: 'Long Neck', color: '#fbbf24', border: '#d97706', type: 'polygon', points: '105,70 135,70 140,160 100,160' },
        { id: 's3', name: 'Spotted Body', color: '#f59e0b', border: '#b45309', type: 'polygon', points: '70,160 170,160 155,225 85,225' }
      ],
      details: `
        <circle cx="112" cy="45" r="4" fill="#0f172a"/>
        <circle cx="128" cy="45" r="4" fill="#0f172a"/>
        <circle cx="115" cy="100" r="6" fill="#b45309" opacity="0.6"/>
        <circle cx="125" cy="130" r="7" fill="#b45309" opacity="0.6"/>
      `
    },
    {
      id: 15, name: 'Ladybug', emoji: '🐞',
      shapes: [
        { id: 's1', name: 'Round Head', color: '#0f172a', border: '#020617', type: 'circle', cx: '120', cy: '55', r: '28' },
        { id: 's2', name: 'Left Wing', color: '#ef4444', border: '#b91c1c', type: 'polygon', points: '115,85 50,110 70,195 115,190' },
        { id: 's3', name: 'Right Wing', color: '#dc2626', border: '#991b1b', type: 'polygon', points: '125,85 190,110 170,195 125,190' }
      ],
      details: `
        <circle cx="110" cy="50" r="4" fill="#ffffff"/>
        <circle cx="130" cy="50" r="4" fill="#ffffff"/>
        <circle cx="85" cy="135" r="8" fill="#0f172a"/>
        <circle cx="95" cy="170" r="7" fill="#0f172a"/>
        <circle cx="155" cy="135" r="8" fill="#0f172a"/>
        <circle cx="145" cy="170" r="7" fill="#0f172a"/>
      `
    },
    {
      id: 16, name: 'Turtle', emoji: '🐢',
      shapes: [
        { id: 's1', name: 'Green Head', color: '#22c55e', border: '#15803d', type: 'circle', cx: '70', cy: '120', r: '26' },
        { id: 's2', name: 'Round Shell', color: '#15803d', border: '#14532d', type: 'circle', cx: '135', cy: '120', r: '50' },
        { id: 's3', name: 'Flippers', color: '#4ade80', border: '#16a34a', type: 'polygon', points: '95,165 175,165 160,200 110,200' }
      ],
      details: `
        <circle cx="65" cy="115" r="4" fill="#0f172a"/>
        <circle cx="67" cy="113" r="1.5" fill="#ffffff"/>
        <path d="M110,120 L160,120 M135,95 L135,145" stroke="#14532d" stroke-width="4" stroke-linecap="round"/>
      `
    },
    {
      id: 17, name: 'Butterfly', emoji: '🦋',
      shapes: [
        { id: 's1', name: 'Top Wings', color: '#c084fc', border: '#7e22ce', type: 'polygon', points: '120,80 40,30 65,115 120,110 175,115 200,30' },
        { id: 's2', name: 'Center Body', color: '#475569', border: '#1e293b', type: 'polygon', points: '115,60 125,60 125,185 115,185' },
        { id: 's3', name: 'Lower Wings', color: '#f472b6', border: '#be185d', type: 'polygon', points: '120,115 55,140 85,195 120,165 155,195 185,140' }
      ],
      details: `
        <circle cx="100" cy="65" r="9" fill="#fde047"/>
        <circle cx="140" cy="65" r="9" fill="#fde047"/>
        <circle cx="100" cy="155" r="7" fill="#67e8f9"/>
        <circle cx="140" cy="155" r="7" fill="#67e8f9"/>
      `
    },
    {
      id: 18, name: 'Penguin', emoji: '🐧',
      shapes: [
        { id: 's1', name: 'Penguin Head', color: '#0f172a', border: '#020617', type: 'circle', cx: '120', cy: '65', r: '36' },
        { id: 's2', name: 'White Tummy', color: '#ffffff', border: '#cbd5e1', type: 'circle', cx: '120', cy: '135', r: '40' },
        { id: 's3', name: 'Flippers', color: '#1e293b', border: '#0f172a', type: 'polygon', points: '70,95 170,95 180,180 60,180' }
      ],
      details: `
        <circle cx="108" cy="60" r="5" fill="#ffffff"/>
        <circle cx="110" cy="60" r="2.5" fill="#0f172a"/>
        <circle cx="132" cy="60" r="5" fill="#ffffff"/>
        <circle cx="130" cy="60" r="2.5" fill="#0f172a"/>
        <polygon points="120,68 114,75 126,75" fill="#f97316"/>
        <circle cx="98" cy="68" r="4" fill="#fbbf24" opacity="0.6"/>
        <circle cx="142" cy="68" r="4" fill="#fbbf24" opacity="0.6"/>
      `
    },
    {
      id: 19, name: 'Octopus', emoji: '🐙',
      shapes: [
        { id: 's1', name: 'Octopus Head', color: '#ec4899', border: '#be185d', type: 'circle', cx: '120', cy: '85', r: '50' },
        { id: 's2', name: 'Center Tentacles', color: '#f43f5e', border: '#e11d48', type: 'polygon', points: '95,130 145,130 140,215 100,215' },
        { id: 's3', name: 'Side Tentacles', color: '#fb7185', border: '#f43f5e', type: 'polygon', points: '70,125 170,125 190,195 50,195' }
      ],
      details: `
        <circle cx="105" cy="80" r="7" fill="#ffffff"/>
        <circle cx="107" cy="80" r="3.5" fill="#0f172a"/>
        <circle cx="135" cy="80" r="7" fill="#ffffff"/>
        <circle cx="133" cy="80" r="3.5" fill="#0f172a"/>
        <ellipse cx="120" cy="98" rx="5" ry="3" fill="#831843"/>
        <circle cx="92" cy="92" r="5" fill="#fbcfe8" opacity="0.6"/>
        <circle cx="148" cy="92" r="5" fill="#fbcfe8" opacity="0.6"/>
      `
    },
    {
      id: 20, name: 'Dino', emoji: '🦖',
      shapes: [
        { id: 's1', name: 'T-Rex Head', color: '#10b981', border: '#047857', type: 'polygon', points: '80,45 155,45 165,100 80,95' },
        { id: 's2', name: 'Dino Body', color: '#059669', border: '#065f46', type: 'polygon', points: '80,95 145,100 135,190 70,175' },
        { id: 's3', name: 'Tail & Legs', color: '#047857', border: '#064e3b', type: 'polygon', points: '135,160 200,165 175,225 65,225' }
      ],
      details: `
        <circle cx="105" cy="65" r="6" fill="#0f172a"/>
        <circle cx="107" cy="63" r="2" fill="#ffffff"/>
        <polygon points="140,98 145,90 150,98 155,90 160,98" fill="#ffffff"/>
        <polygon points="70,55 60,65 70,75" fill="#047857"/>
        <polygon points="65,105 55,115 65,125" fill="#047857"/>
      `
    }
  ];

  let currentIdx = 0;
  let selectedShapeId = null;
  let placedShapes = new Set();
  let startTime = Date.now();
  let isWon = false;

  const svgStage = document.getElementById('animal-svg');
  const trayContainer = document.getElementById('tray-container');
  const levelNumEl = document.getElementById('level-num');
  const animalNameEl = document.getElementById('animal-name');
  const hintBar = document.getElementById('hint-bar');
  const animalsModal = document.getElementById('animals-modal');
  const animalsGrid = document.getElementById('animals-grid');
  const winModal = document.getElementById('win-modal');
  const winEmoji = document.getElementById('win-emoji');
  const winTitle = document.getElementById('win-title');
  const winTime = document.getElementById('win-time');

  function initAnimal(idx = currentIdx) {
    currentIdx = Math.max(0, Math.min(ANIMALS.length - 1, idx));
    const animal = ANIMALS[currentIdx];

    levelNumEl.textContent = animal.id;
    animalNameEl.textContent = animal.name.toUpperCase();
    selectedShapeId = null;
    placedShapes = new Set();
    isWon = false;
    startTime = Date.now();

    winModal.classList.remove('active');
    animalsModal.classList.remove('active');

    renderSVG(animal);
    renderTray(animal);
    updateHint('Drag shapes to the animal silhouette or tap to connect!');
  }

  function updateHint(text) {
    if (hintBar) hintBar.textContent = text;
  }

  function snapShape(shapeId) {
    const animal = ANIMALS[currentIdx];
    const shape = animal.shapes.find(s => s.id === shapeId);
    if (!shape || placedShapes.has(shapeId)) return;

    placedShapes.add(shapeId);
    selectedShapeId = null;
    playSound('snap');
    updateHint(`Great job! You placed the ${shape.name}! 🌟`);
    renderSVG(animal);
    renderTray(animal);
    checkWin();
  }

  function renderSVG(animal) {
    svgStage.innerHTML = '';

    // Render Slots / Shapes
    animal.shapes.forEach(shape => {
      let el;
      if (shape.type === 'circle') {
        el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        el.setAttribute('cx', shape.cx);
        el.setAttribute('cy', shape.cy);
        el.setAttribute('r', shape.r);
      } else {
        el = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        el.setAttribute('points', shape.points);
      }

      el.id = `slot-${shape.id}`;
      el.dataset.shapeId = shape.id;
      el.setAttribute('class', `target-slot ${placedShapes.has(shape.id) ? 'snapped-pop' : ''}`);
      el.setAttribute('fill', placedShapes.has(shape.id) ? shape.color : '#f3e8ff');
      el.setAttribute('stroke', placedShapes.has(shape.id) ? shape.border : '#c084fc');
      el.setAttribute('stroke-width', placedShapes.has(shape.id) ? '4' : '3');
      el.setAttribute('stroke-linejoin', 'round');
      el.setAttribute('stroke-dasharray', placedShapes.has(shape.id) ? 'none' : '6 6');

      // Click-to-place fallback
      el.addEventListener('click', () => {
        if (placedShapes.has(shape.id)) return;
        if (selectedShapeId === shape.id) {
          snapShape(shape.id);
        } else if (selectedShapeId) {
          updateHint('Oops! That shape does not fit here. Try the other silhouette spot!');
        } else {
          updateHint('Select a colorful shape from below first, or drag it here!');
        }
      });

      svgStage.appendChild(el);
    });

    // Render Details layer if all pieces placed (or show partial face)
    if (animal.details && placedShapes.size > 0) {
      const gDetails = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gDetails.innerHTML = animal.details;
      gDetails.style.pointerEvents = 'none';
      gDetails.style.transition = 'opacity 0.3s ease';
      gDetails.style.opacity = placedShapes.size === animal.shapes.length ? '1' : '0.4';
      svgStage.appendChild(gDetails);
    }
  }

  // Drag and Drop Engine
  let activeDragShape = null;
  let dragGhostEl = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let hasMoved = false;

  function renderTray(animal) {
    trayContainer.innerHTML = '';

    animal.shapes.forEach(shape => {
      const isUsed = placedShapes.has(shape.id);
      const isSelected = selectedShapeId === shape.id;

      const btn = document.createElement('button');
      btn.className = `shape-btn ${isSelected ? 'selected' : ''} ${isUsed ? 'used' : ''}`;
      btn.title = shape.name;
      btn.dataset.shapeId = shape.id;

      // Render miniature shape
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 240 240');
      svg.setAttribute('width', '52');
      svg.setAttribute('height', '52');

      let miniEl;
      if (shape.type === 'circle') {
        miniEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        miniEl.setAttribute('cx', shape.cx);
        miniEl.setAttribute('cy', shape.cy);
        miniEl.setAttribute('r', shape.r);
      } else {
        miniEl = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        miniEl.setAttribute('points', shape.points);
      }
      miniEl.setAttribute('fill', shape.color);
      miniEl.setAttribute('stroke', shape.border);
      miniEl.setAttribute('stroke-width', '6');
      svg.appendChild(miniEl);
      btn.appendChild(svg);

      if (!isUsed) {
        // Pointer drag & drop
        btn.addEventListener('pointerdown', (e) => {
          getAudioContext();
          activeDragShape = shape;
          dragStartX = e.clientX;
          dragStartY = e.clientY;
          hasMoved = false;

          btn.setPointerCapture(e.pointerId);

          // Create floating drag ghost
          dragGhostEl = document.createElement('div');
          dragGhostEl.className = 'shape-drag-ghost';
          dragGhostEl.style.width = '74px';
          dragGhostEl.style.height = '74px';
          dragGhostEl.style.left = `${e.clientX}px`;
          dragGhostEl.style.top = `${e.clientY}px`;

          const ghostSvg = svg.cloneNode(true);
          ghostSvg.setAttribute('width', '74');
          ghostSvg.setAttribute('height', '74');
          dragGhostEl.appendChild(ghostSvg);
          document.body.appendChild(dragGhostEl);

          btn.classList.add('dragging');
        });

        btn.addEventListener('pointermove', (e) => {
          if (!activeDragShape || activeDragShape.id !== shape.id || !dragGhostEl) return;
          if (Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY) > 5) {
            hasMoved = true;
          }
          dragGhostEl.style.left = `${e.clientX}px`;
          dragGhostEl.style.top = `${e.clientY}px`;

          // Test if hovering over the target slot
          const targetSlot = document.getElementById(`slot-${shape.id}`);
          if (targetSlot) {
            const rect = targetSlot.getBoundingClientRect();
            const isInside =
              e.clientX >= rect.left - 25 &&
              e.clientX <= rect.right + 25 &&
              e.clientY >= rect.top - 25 &&
              e.clientY <= rect.bottom + 25;
            if (isInside) {
              targetSlot.classList.add('hover-active');
            } else {
              targetSlot.classList.remove('hover-active');
            }
          }
        });

        const onPointerUp = (e) => {
          if (!activeDragShape || activeDragShape.id !== shape.id) return;
          btn.classList.remove('dragging');

          if (dragGhostEl && dragGhostEl.parentNode) {
            dragGhostEl.parentNode.removeChild(dragGhostEl);
            dragGhostEl = null;
          }

          const targetSlot = document.getElementById(`slot-${shape.id}`);
          if (targetSlot) targetSlot.classList.remove('hover-active');

          if (hasMoved) {
            // Check drop location near the target slot
            if (targetSlot && !placedShapes.has(shape.id)) {
              const rect = targetSlot.getBoundingClientRect();
              const isOverTarget =
                e.clientX >= rect.left - 30 &&
                e.clientX <= rect.right + 30 &&
                e.clientY >= rect.top - 30 &&
                e.clientY <= rect.bottom + 30;

              if (isOverTarget) {
                snapShape(shape.id);
              } else {
                updateHint('Try dropping it right on top of its matching spot!');
              }
            }
          } else {
            // Click / Tap Selection
            playSound('select');
            if (selectedShapeId === shape.id) {
              selectedShapeId = null;
              btn.classList.remove('selected');
              updateHint('Drag shapes to the animal silhouette or tap to connect!');
            } else {
              selectedShapeId = shape.id;
              document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('selected'));
              btn.classList.add('selected');
              updateHint(`"${shape.name}" selected! Tap its spot on the animal to place.`);
            }
          }

          activeDragShape = null;
        };

        btn.addEventListener('pointerup', onPointerUp);
        btn.addEventListener('pointercancel', onPointerUp);
      }

      trayContainer.appendChild(btn);
    });
  }

  function checkWin() {
    const animal = ANIMALS[currentIdx];
    if (placedShapes.size === animal.shapes.length && !isWon) {
      isWon = true;
      playSound('win');
      const elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
      updateHint(`🎉 Amazing! The ${animal.name} is completely assembled!`);

      try {
        if (typeof window.triggerPlatformWin === 'function') {
          window.triggerPlatformWin({ score: 100, level: animal.id, time: elapsed });
        }
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'win', level: animal.id, time: elapsed }, '*');
        }
      } catch (_) {}

      setTimeout(() => {
        winEmoji.textContent = `${animal.emoji}✨🎉`;
        winTitle.textContent = `${animal.name} Assembled!`;
        winTime.textContent = `${elapsed}s`;
        winModal.classList.add('active');
      }, 450);
    }
  }

  function openAnimalsModal() {
    animalsGrid.innerHTML = '';
    ANIMALS.forEach((animal, idx) => {
      const btn = document.createElement('button');
      btn.className = 'btn-tactile';
      btn.style.display = 'flex';
      btn.style.alignItems = 'center';
      btn.style.gap = '8px';
      btn.style.justifyContent = 'flex-start';
      btn.style.padding = '8px 12px';
      if (idx === currentIdx) {
        btn.style.background = '#c084fc';
        btn.style.color = '#ffffff';
      }
      btn.innerHTML = `<span style="font-size: 22px;">${animal.emoji}</span> <span style="font-weight: 800; font-size: 13px;">${animal.id}. ${animal.name}</span>`;
      btn.addEventListener('click', () => {
        initAnimal(idx);
      });
      animalsGrid.appendChild(btn);
    });
    animalsModal.classList.add('active');
  }

  // Buttons & Modals
  document.getElementById('btn-animals-modal').addEventListener('click', openAnimalsModal);
  document.getElementById('btn-close-animals').addEventListener('click', () => {
    animalsModal.classList.remove('active');
  });

  document.getElementById('btn-restart').addEventListener('click', () => initAnimal(currentIdx));
  document.getElementById('btn-play-again').addEventListener('click', () => initAnimal(currentIdx));
  document.getElementById('btn-next-animal').addEventListener('click', () => {
    initAnimal((currentIdx + 1) % ANIMALS.length);
  });

  const soundBtn = document.getElementById('btn-sound');
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
  });

  const howBtn = document.getElementById('btn-how');
  const howModal = document.getElementById('how-modal');
  const closeHowBtn = document.getElementById('btn-close-how');
  howBtn.addEventListener('click', () => howModal.classList.add('active'));
  closeHowBtn.addEventListener('click', () => howModal.classList.remove('active'));

  initAnimal(0);
})();
