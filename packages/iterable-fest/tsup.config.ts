import { defineConfig } from 'tsup';

export default defineConfig([
  {
    dts: true,
    entry: {
      'iterable-fest': './src/index.ts',
      'iterable-fest.iterableAt': './src/iterableAt.ts',
      'iterable-fest.iterableConcat': './src/iterableConcat.ts',
      'iterable-fest.iterableEvery': './src/iterableEvery.ts',
      'iterable-fest.iterableFilter': './src/iterableFilter.ts',
      'iterable-fest.iterableFind': './src/iterableFind.ts',
      'iterable-fest.iterableFindIndex': './src/iterableFindIndex.ts',
      'iterable-fest.iterableFindLast': './src/iterableFindLast.ts',
      'iterable-fest.iterableFindLastIndex': './src/iterableFindLastIndex.ts',
      'iterable-fest.iterableIncludes': './src/iterableIncludes.ts',
      'iterable-fest.iterableIndexOf': './src/iterableIndexOf.ts',
      'iterable-fest.iterableJoin': './src/iterableJoin.ts',
      'iterable-fest.iterableReduce': './src/iterableReduce.ts',
      'iterable-fest.iterableSlice': './src/iterableSlice.ts',
      'iterable-fest.iterableSome': './src/iterableSome.ts',
      'iterable-fest.iterableToSpliced': './src/iterableToSpliced.ts'
    },
    format: ['cjs', 'esm'],
    sourcemap: true
  }
]);
