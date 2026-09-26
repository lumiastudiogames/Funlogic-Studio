const fs = require('fs');
const path = require('path');

const gamesDir = path.resolve('dist/games');
const games = fs.readdirSync(gamesDir).filter(f => fs.statSync(path.join(gamesDir, f)).isDirectory());

const issues = [];

games.forEach(g => {
  const gPath = path.join(gamesDir, g);
  const indexPath = path.join(gPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    issues.push({ game: g, issue: 'No index.html' });
    return;
  }
  const html = fs.readFileSync(indexPath, 'utf8');

  // Check script tags
  const scriptRegex = /<script\s+[^>]*src=["']([^"']+)["']/gi;
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    const src = match[1];
    if (!src.startsWith('http') && !src.startsWith('//') && !src.startsWith('data:')) {
      // relative or absolute inside game folder
      const resolved = src.startsWith('/') ? path.join(path.resolve('dist'), src) : path.resolve(gPath, src);
      if (!fs.existsSync(resolved)) {
        issues.push({ game: g, issue: 'Missing script: ' + src });
      }
    }
  }

  // Check CSS links
  const cssRegex = /<link\s+[^>]*href=["']([^"']+\.css)["']/gi;
  while ((match = cssRegex.exec(html)) !== null) {
    const href = match[1];
    if (!href.startsWith('http') && !href.startsWith('//')) {
      const resolved = href.startsWith('/') ? path.join(path.resolve('dist'), href) : path.resolve(gPath, href);
      if (!fs.existsSync(resolved)) {
        issues.push({ game: g, issue: 'Missing CSS: ' + href });
      }
    }
  }

  // Check if initial modal blocks view
  if (html.includes('class="modal-overlay active"') || html.includes("class='modal-overlay active'")) {
    issues.push({ game: g, issue: 'Has blocking modal-overlay active in HTML' });
  }
});

console.log('Total games checked:', games.length);
console.log('Issues found:', issues.length);
if (issues.length > 0) {
  console.log(JSON.stringify(issues, null, 2));
}
