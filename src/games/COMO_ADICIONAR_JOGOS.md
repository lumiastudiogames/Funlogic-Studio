# Como adicionar um Jogo em Pasta (meta.json + Auto-Detecção + Full Screen)

Basta criar ou colar a pasta do seu jogo em `/src/games/<nome-do-jogo>/` ou `/src/games/<categoria>/<nome-do-jogo>/`!

### Estrutura recomendada da pasta do jogo:
```
src/games/
└── water-sort-lab/             <-- Nome da pasta vira o ID do jogo
    ├── meta.json               <-- Dados do jogo (Título, Categoria, FAQs, Keywords, Descrição)
    ├── index.html ou index.js  <-- Código do jogo em Vanilla JS/HTML5 (Abre em Full Screen!)
    ├── cover.svg / cover.png   <-- (Opcional) Capa ou imagem ilustrativa
    └── assets/                 <-- (Opcional) Sprites, áudios, imagens
```

---

### Exemplo de `meta.json` Completo:
```json
{
  "id": "water-sort-lab",
  "title": "Water Sort Lab",
  "categoryId": "water-sort",
  "shortDesc": "Separe os líquidos coloridos entre os tubos de ensaio.",
  "description": "Water Sort Lab é um jogo de lógica relaxante. Despeje as cores entre os tubos até que cada tubo contenha apenas uma cor sólida.",
  "instructions": "Toque no tubo de origem e depois no de destino para transferir o líquido da mesma cor.",
  "tags": ["water-sort", "puzzle", "tubes", "color-sort", "liquid"],
  "keywords": "water sort, water sort puzzle, color sort, tube sort, ball sort online",
  "faqs": [
    {
      "q": "Como jogar Water Sort?",
      "a": "Selecione um tubo e toque em outro tubo com espaço livre para despejar a mesma cor."
    },
    {
      "q": "Tem limite de tempo?",
      "a": "Não, você pode jogar com calma no seu próprio ritmo."
    }
  ],
  "coverBg": "#E0F2FE",
  "playsCount": "48.6k",
  "isTrending": true
}
```

---

### As 12 Categorias Principais Suportadas:
1. `all-brain` (Brain & Logic - Master #1)
2. `all-puzzle` (Puzzle Games - Master #2)
3. `mahjong` (Mahjong & Solitaire Tiles)
4. `water-sort` (Water & Ball Sort)
5. `numbers` (2048, Sudoku, Math)
6. `logicgrid` (Logic Grids, Liar Logic, Detective)
7. `sokoban` (Sokoban & Box Push)
8. `pipe` (Pipe Connect & Flow)
9. `mazes` (Mazes & Labyrinths)
10. `memory` (Memory, Sequences & Pairs)
11. `problemsolving` (Balance, Bridge & Physics)
12. `puzzle` (Geometric, Shadow, Cut & Tangram)

---

### O que o sistema faz automaticamente:
1. **Lê o `meta.json`**: extrai título, categoria, descrição, FAQs, tags e keywords para SEO e exibições.
2. **Exibe o jogo na Grid e na Categoria**: com contagem de jogadas, selo, badges e busca integrada.
3. **Abre em Full Screen**: carrega o `index.html` ou `index.js` sem bordas, com controles de reiniciar e tela cheia nativa.
4. **Painel de Info & FAQ**: os jogadores e robôs de busca podem consultar FAQs e instruções diretamente.
