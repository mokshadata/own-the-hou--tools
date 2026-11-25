import { fileRoutes } from 'filesystem-routing/vite';
import solid from '@solidjs/vite-plugin';
import dts from 'vite-plugin-dts';

import { build } from 'vite';

import path from 'node:path';
import fs from 'node:fs';

const excludeSolidRollupOptions = {
  external: ['solid-js', '@solidjs/element'],
  output: {
    globals: {
      'solid-js': 'Solid',
      '@solidjs/element': 'SolidElement'
    }
  },
}

const plugins =  [
    // `extensions` makes @solidjs/vite-plugin also compile the `?pick=` route
    // modules the fileRoutes plugin emits (their ids end in a query string).
    // solid({ start: true, extensions: ['.jsx', '.tsx'], diagnostics: true }), // add `ssr: true` for streaming SSR
    // solid({ start: true, extensions: ['.jsx', '.tsx'], diagnostics: true }), // add `ssr: true` for streaming SSR
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
  ]

const entries = {
  'ownthehoutools--dpa-program-list--web': path.resolve(import.meta.dirname, 'src/tools/dpa/web/list.ts'),
  'ownthehoutools--dpa-tool--web': path.resolve(import.meta.dirname, 'src/tools/dpa/web/tool.ts'),
  'ownthehoutools--dpa--solid': path.resolve(import.meta.dirname, 'src/tools/dpa/component.ts'),
}


async function buildAll() {
  for (const [key, item] of Object.entries(entries)) {
    await build({
      configFile: false,
      plugins,
      build: {
        emptyOutDir: false,
        target: 'esnext',
        assetsInlineLimit: 0,
        lib: {
          entry: {
            [key]: item,
          },
          name: 'ownthehou-dpa',
          fileName: (format) => `[name].${format}.js`,
          formats: ['es'],
        },
        rollupOptions: key.includes('solid') && excludeSolidRollupOptions || null,
      },
      resolve: key.includes('solid') && {
        // Adds custom tags to the default allowed list
        conditions: ['solid']
      } || null,
    })
  }
}

buildAll()