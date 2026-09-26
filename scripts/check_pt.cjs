const fs = require('fs');
const path = require('path');

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      scanDir(full);
    } else if (f.endsWith('.ts') || f.endsWith('.html') || f.endsWith('.js')) {
      const txt = fs.readFileSync(full, 'utf8');
      const ptWords = ['buscar', 'pesquisar', 'jogo', 'jogos', 'jogar', 'categorias', 'regras', 'instruções', 'pontuação', 'vitória', 'carregando', 'concluir', 'vencer'];
      for (const w of ptWords) {
        const regex = new RegExp('\\b' + w + '\\b', 'gi');
        const matches = txt.match(regex);
        if (matches) {
          console.log(full.replace(process.cwd(), ''), 'matched:', w, matches.length);
        }
      }
    }
  }
}

scanDir(path.join(__dirname, '../src/components'));
scanDir(path.join(__dirname, '../src/views'));
scanDir(path.join(__dirname, '../src/data'));
scanDir(path.join(__dirname, '../src/utils'));
