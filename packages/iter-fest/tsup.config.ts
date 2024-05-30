import { defineConfig } from 'tsup';

export default defineConfig([
  {
    dts: true,
    entry: {
      'iter-fest': './src/index.ts'
    },
    format: ['cjs', 'esm'],
    sourcemap: true
  }
]);
