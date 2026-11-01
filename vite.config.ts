import { fileRoutes } from 'filesystem-routing/vite';
import { defineConfig } from 'vitest/config';
import solid from '@solidjs/vite-plugin';
import dts from 'vite-plugin-dts';

import path from 'node:path';
import fs from 'node:fs';


export default defineConfig({
  // Turnkey client mode: no index.html and no mount file — the plugin generates
  // the entries around src/App.tsx (wrapped in src/Document.tsx) and `vite build`
  // prerenders the shell into a purely static dist/client.
  plugins: [
    // `extensions` makes @solidjs/vite-plugin also compile the `?pick=` route
    // modules the fileRoutes plugin emits (their ids end in a query string).
    // solid({ start: true, extensions: ['.jsx', '.tsx'], diagnostics: true }), // add `ssr: true` for streaming SSR
    solid({ start: false, extensions: ['.jsx', '.tsx'], diagnostics: true }), // add `ssr: true` for streaming SSR
    // fileRoutes({ types: true }),
    {
      name: 'geojson-loader',
      transform(code, id) {
        if (id.endsWith('.geojson')) {
          // Wrap the raw GeoJSON content as a valid ES module export
          return {
            code: `export default ${code};`,
            map: null
          };
        }
      }
    },
    dts({ insertTypesEntry: true }),
    {
      name: 'vite-plugin-raw-base64',
      transform(_, id) {
        // Intercept imports ending with ?base64
        if (id.endsWith('?base64')) {
          const filePath = id.replace('?base64', '');
          const fileBuffer = fs.readFileSync(filePath);
          
          // Determine the correct mime type
          const ext = filePath.split('.').pop();
          const mimeType = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
          
          const base64 = fileBuffer.toString('base64');
          const dataUrl = `data:${mimeType};base64,${base64}`;
          
          return `export default ${JSON.stringify(dataUrl)}`;
        }
      }
    }
  ],
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./vitest-setup.ts'],
    // if you have few tests, try commenting this
    // out to improve performance:
    isolate: false,
  },
  build: {
    target: 'esnext',
    assetsInlineLimit: 0,
    lib: {
      entry: {
        'ownthehoutools--dpa--web': path.resolve(import.meta.dirname, 'src/tools/dpa/index.ts'),
        'ownthehoutools--dpa--solid': path.resolve(import.meta.dirname, 'src/tools/dpa/list.ts'),
      },
      name: 'ownthehou-dpa',
      fileName: (format) => `[name].${format}.js`,
      formats: ['es'],
    },
    rollupOptions: {
      external: ['solid-js', '@solidjs/element'],
      output: {
        globals: {
          'solid-js': 'Solid',
          '@solidjs/element': 'SolidElement'
        }
      },
    },
  },
  resolve: {
    // Adds custom tags to the default allowed list
    conditions: ['solid']
  }
});
