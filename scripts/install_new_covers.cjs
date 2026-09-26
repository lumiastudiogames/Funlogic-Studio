const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDir = path.resolve(__dirname, '../src/games');
const capasDir = 'C:\\Users\\User\\Downloads\\funlogic.games (2)\\novas_capas';

const MAP = {
  '01-murder-orient-express.jpg': '01-murder-orient-express',
  '02-baker-street-hound.jpg': '02-baker-street-hound',
  '06-blackwood-manor.jpg': '06-blackwood-manor',
  '10-curse-blackwood-abbey.jpg': '10-curse-blackwood-abbey',
  '12-venice-carnival-conspiracy.jpg': '12-venice-carnival-conspiracy',
  '14-arsenic-tea-morrington.jpg': '14-arsenic-tea-morrington',
  '16-phantom-opera-vaults.jpg': '16-phantom-opera-vaults',
  '18-fog-over-whitechapel.jpg': '18-fog-over-whitechapel',
  '20-lighthouse-enigma.jpg': '20-lighthouse-enigma',
  'animal-tictac-kids.jpg': 'kids/animal-tictac-kids',
  'campo-minado.jpg': 'campo-minado',
  'clock-gears.jpg': 'clock-gears---ratio-&-speed-challenge',
  'jogo-da-velha.jpg': 'jogo-da-velha',
  'mahjong-24-tiles.jpg': 'mahjong-24-tiles',
  'mahjong-solitaire.jpg': 'mahjong-solitaire',
  'mahjong-triple.jpg': 'mahjong-triple',
  'matchstick-logic.jpg': 'matchstick-logic',
  'sky-control.jpg': 'sky-control---air-traffic-collision-avoidance',
  'sort-water.jpg': 'sort-water',
  'test-tube-sort.jpg': 'test-tube-sort',
  'the-lost-keys.jpg': 'the-lost-keys---logic-puzzle',
  'water-puzzle.jpg': 'water-puzzle',
  'water-sort-100-levels.jpg': 'water-sort-100-levels',
  'water-sort-12-tubes.jpg': 'water-sort-12-tubes',
  'water-sort-5-colors.jpg': 'water-sort-5-colors'
};

async function installCovers() {
  console.log('Starting cover installation from:', capasDir);
  let count = 0;

  for (const [file, relDir] of Object.entries(MAP)) {
    const srcFile = path.join(capasDir, file);
    const destDir = path.join(srcDir, relDir);

    if (!fs.existsSync(srcFile)) {
      console.error('Source file not found:', srcFile);
      continue;
    }
    if (!fs.existsSync(destDir)) {
      console.error('Dest dir not found:', destDir);
      continue;
    }

    // 1. Copy original as cover.jpg
    const destJpg = path.join(destDir, 'cover.jpg');
    fs.copyFileSync(srcFile, destJpg);

    // 2. Generate cover.webp using sharp
    const destWebp = path.join(destDir, 'cover.webp');
    await sharp(srcFile)
      .webp({ quality: 90 })
      .toFile(destWebp);

    // 3. If cover.png exists, also update cover.png
    const destPng = path.join(destDir, 'cover.png');
    if (fs.existsSync(destPng)) {
      await sharp(srcFile)
        .png({ quality: 90 })
        .toFile(destPng);
    }

    count++;
    console.log(`[${count}/25] Updated: ${relDir} (cover.jpg, cover.webp)`);
  }

  console.log(`\nSuccessfully updated all ${count} covers!`);
}

installCovers().catch(err => {
  console.error('Error installing covers:', err);
  process.exit(1);
});
