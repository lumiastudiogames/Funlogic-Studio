import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

function safeTailwindcss(): Plugin[] {
  const plugins = tailwindcss() as any[];
  return plugins.map((p: any) => {
    if (p.name === '@tailwindcss/vite:generate:serve' && p.hotUpdate) {
      const origHotUpdate = p.hotUpdate;
      return {
        ...p,
        hotUpdate(ctx: any) {
          if (!ctx?.server?.hot && !ctx?.server?.ws) {
            return [];
          }
          try {
            return origHotUpdate.call(this, ctx);
          } catch (e: any) {
            if (e?.message?.includes("reading 'send'")) {
              return [];
            }
            throw e;
          }
        },
      };
    }
    return p;
  });
}

function serveGamesPlugin(): Plugin {
    return {
      name: 'serve-games-plugin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const rawUrl = req.url?.split('?')[0] || '';
          const match = rawUrl.match(/^\/games\/([^/]+)\/(.*)$/);
          if (match) {
            const [, slug, subpath] = match;
            const candidateDirs = [
              path.resolve(__dirname, 'src/games', slug),
              path.resolve(__dirname, 'src/games/seniors', slug),
              path.resolve(__dirname, 'src/games/kids', slug),
            ];
            for (const dir of candidateDirs) {
              const filePath = path.join(dir, subpath || 'index.html');
              if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                const ext = path.extname(filePath);
                const mimeMap: Record<string, string> = {
                  '.html': 'text/html; charset=utf-8',
                  '.js': 'application/javascript; charset=utf-8',
                  '.css': 'text/css; charset=utf-8',
                  '.json': 'application/json; charset=utf-8',
                  '.svg': 'image/svg+xml',
                  '.png': 'image/png',
                  '.jpg': 'image/jpeg',
                  '.webp': 'image/webp',
                  '.mp3': 'audio/mpeg',
                  '.wav': 'audio/wav',
                };
                res.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
                return fs.createReadStream(filePath).pipe(res);
              }
            }
          }
          next();
        });
      }
    };
  }

  export default defineConfig(() => {
    return {
      base: process.env.GITHUB_ACTIONS === 'true' ? '/funlogic.games/' : '/',
      plugins: [
        safeTailwindcss(),
        serveGamesPlugin(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['icon.svg', 'icon-maskable.svg'],
          manifest: {
            id: './',
            name: 'FunLogic.games',
            short_name: 'FunLogic',
            description: 'FunLogic.games — International casual logic and reasoning game portal by Lumia Studio.',
            theme_color: '#58CC02',
            background_color: '#F8F6F0',
            display: 'standalone',
            start_url: './',
            scope: './',
            icons: [
              {
                src: 'icon.svg',
                sizes: '192x192',
                type: 'image/svg+xml',
                purpose: 'any',
              },
              {
                src: 'icon.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
                purpose: 'any',
              },
              {
                src: 'icon-maskable.svg',
                sizes: '192x192',
                type: 'image/svg+xml',
                purpose: 'maskable',
              },
              {
                src: 'icon-maskable.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
                purpose: 'maskable',
              }
            ],
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,woff,woff2}'],
            maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
          },
          devOptions: {
            enabled: false,
          },
        }),
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        },
      },
      server: {
        forwardConsole: false,
        // HMR can be disabled via DISABLE_HMR in constrained environments.
        // Do not modify—file watching is disabled to prevent flickering during agent edits.
        hmr: process.env.DISABLE_HMR !== 'true',
        // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
    };
  });
