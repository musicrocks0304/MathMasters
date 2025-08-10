import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createViteProxy(app) {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    root: path.resolve(__dirname, '../client'),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../client/src'),
      },
    },
  });

  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);
}