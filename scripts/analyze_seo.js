const fs = require('fs');
const path = require('path');

const gamesFile = path.resolve(__dirname, 'src/data/games.ts');
const content = fs.readFileSync(gamesFile, 'utf8');

// Regex to capture keywords arrays
const kwRegex = /keywords:\s*\[([^\]]+)\]/g;
const tagRegex = /tags:\s*\[([^\]]+)\]/g;

const allKeywords = new Set();
let m;
while ((m = kwRegex.exec(content)) !== null) {
  const items = m[1].split(',').map(s => s.replace(/['"`]/g, '').trim().toLowerCase()).filter(Boolean);
  items.forEach(k => allKeywords.add(k));
}

while ((m = tagRegex.exec(content)) !== null) {
  const items = m[1].split(',').map(s => s.replace(/['"`]/g, '').trim().toLowerCase()).filter(Boolean);
  items.forEach(k => allKeywords.add(k));
}

// Titles
const titleRegex = /title:\s*['"`]([^'"`]+)['"`]/g;
const titles = [];
while ((m = titleRegex.exec(content)) !== null) {
  titles.push(m[1].trim());
}

// Prerendered pages
const distDir = path.resolve(__dirname, 'dist');
let totalDistFiles = 0;
function countHtml(dir) {
  if (!fs.existsSync(dir)) return;
  for (const item of fs.readdirSync(dir)) {
    const p = path.join(dir, item);
    if (fs.statSync(p).isDirectory()) {
      countHtml(p);
    } else if (item.endsWith('.html')) {
      totalDistFiles++;
    }
  }
}
countHtml(distDir);

console.log(JSON.stringify({
  uniqueKeywords: allKeywords.size,
  totalGames: titles.length,
  totalPrerenderedPages: totalDistFiles,
  topKeywordsSample: Array.from(allKeywords).slice(0, 30)
}, null, 2));
