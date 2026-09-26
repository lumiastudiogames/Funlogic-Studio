const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../src/data/canonicalGames.ts'), 'utf8');
const slugs = [...content.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);
console.log('Total in CANONICAL_103_GAMES list:', slugs.length);

const gamesDir = path.join(__dirname, '../src/games');
const items = fs.readdirSync(gamesDir);
const dirs = items.filter(i => fs.statSync(path.join(gamesDir, i)).isDirectory() && !['kids', 'seniors'].includes(i));
const kidsDirs = fs.existsSync(path.join(gamesDir, 'kids')) ? fs.readdirSync(path.join(gamesDir, 'kids')).filter(i => fs.statSync(path.join(gamesDir, 'kids', i)).isDirectory()) : [];
const seniorsDirs = fs.existsSync(path.join(gamesDir, 'seniors')) ? fs.readdirSync(path.join(gamesDir, 'seniors')).filter(i => fs.statSync(path.join(gamesDir, 'seniors', i)).isDirectory()) : [];
const allFolderSlugs = new Set([...dirs, ...kidsDirs, ...seniorsDirs]);

console.log('Total game folders in src/games/ (incl. kids & seniors):', allFolderSlugs.size);

const missingInFolders = slugs.filter(s => !allFolderSlugs.has(s));
const missingInList = [...allFolderSlugs].filter(s => !slugs.includes(s));

console.log('In list but no folder:', missingInFolders);
console.log('In folders but not in list:', missingInList);
