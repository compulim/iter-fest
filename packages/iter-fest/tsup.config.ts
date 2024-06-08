import { defineConfig } from 'tsup';

export default defineConfig([
  {
    dts: true,
    entry: {
      'iter-fest': './src/index.ts',
      'iter-fest.iterableAt': './src/iterableAt.ts',
      'iter-fest.iterableConcat': './src/iterableConcat.ts',
      'iter-fest.iterableEntries': './src/iterableEntries.ts',
      'iter-fest.iterableEvery': './src/iterableEvery.ts',
      'iter-fest.iterableFilter': './src/iterableFilter.ts',
      'iter-fest.iterableFind': './src/iterableFind.ts',
      'iter-fest.iterableFindIndex': './src/iterableFindIndex.ts',
      'iter-fest.iterableFindLast': './src/iterableFindLast.ts',
      'iter-fest.iterableFindLastIndex': './src/iterableFindLastIndex.ts',
      'iter-fest.iterableForEach': './src/iterableForEach.ts',
      'iter-fest.iterableIncludes': './src/iterableIncludes.ts',
      'iter-fest.iterableIndexOf': './src/iterableIndexOf.ts',
      'iter-fest.iterableJoin': './src/iterableJoin.ts',
      'iter-fest.iterableKeys': './src/iterableKeys.ts',
      'iter-fest.iterableMap': './src/iterableMap.ts',
      'iter-fest.iterableReduce': './src/iterableReduce.ts',
      'iter-fest.iterableSlice': './src/iterableSlice.ts',
      'iter-fest.iterableSome': './src/iterableSome.ts',
      'iter-fest.iterableToSpliced': './src/iterableToSpliced.ts',
      'iter-fest.iterableToString': './src/iterableToString.ts',
      'iter-fest.iteratorToIterable': './src/iteratorToIterable.ts',
      'iter-fest.observable': './src/Observable.ts',
      'iter-fest.observableFromAsync': './src/observableFromAsync.ts',
      'iter-fest.observableValues': './src/observableValues.ts',
      'iter-fest.pushAsyncIterableIterator': './src/PushAsyncIterableIterator.ts',
      'iter-fest.readerToAsyncIterableIterator': './src/readerToAsyncIterableIterator.ts',
      'iter-fest.symbolObservable': './src/SymbolObservable.ts'
    },
    format: ['cjs', 'esm'],
    sourcemap: true
  }
]);
