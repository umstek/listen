import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      // e.g.: util: 'rollup-plugin-node-polyfills/polyfills/util',
      // sys: 'util',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser window
      define: {
        global: 'window',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  plugins: [
    tsconfigPaths(),
    react(),
    { ...rollupNodePolyFill(), enforce: 'post' },
    splitVendorChunkPlugin(),
  ],
});
