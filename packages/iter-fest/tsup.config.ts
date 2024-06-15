import { defineConfig } from 'tsup';

export default defineConfig([
  {
    dts: true,
    entry: {
      'iter-fest': './src/index.ts',
      'iter-fest.asyncGeneratorWithLastValue': './src/asyncGeneratorWithLastValue.ts',
      'iter-fest.asyncIteratorToAsyncIterable': './src/asyncIteratorToAsyncIterable.ts',
      'iter-fest.generatorWithLastValue': './src/generatorWithLastValue.ts',
      'iter-fest.iterableFindIndex': './src/iterableFindIndex.ts',
      'iter-fest.iterableFindLast': './src/iterableFindLast.ts',
      'iter-fest.iterableFindLastIndex': './src/iterableFindLastIndex.ts',
      'iter-fest.iterableIncludes': './src/iterableIncludes.ts',
      'iter-fest.iterableIndexOf': './src/iterableIndexOf.ts',
      'iter-fest.iterableJoin': './src/iterableJoin.ts',
      'iter-fest.iterableKeys': './src/iterableKeys.ts',
      'iter-fest.iterableSlice': './src/iterableSlice.ts',
      'iter-fest.iterableToSpliced': './src/iterableToSpliced.ts',
      'iter-fest.iterableToString': './src/iterableToString.ts',
      'iter-fest.iterableWritableStream': './src/iterableWritableStream.ts',
      'iter-fest.iteratorAt': './src/iteratorAt.ts',
      'iter-fest.iteratorConcat': './src/iteratorConcat.ts',
      'iter-fest.iteratorDrop': './src/iteratorDrop.ts',
      'iter-fest.iteratorEntries': './src/iteratorEntries.ts',
      'iter-fest.iteratorEvery': './src/iteratorEvery.ts',
      'iter-fest.iteratorFilter': './src/iteratorFilter.ts',
      'iter-fest.iteratorFind': './src/iteratorFind.ts',
      'iter-fest.iteratorFlatMap': './src/iteratorFlatMap.ts',
      'iter-fest.iteratorForEach': './src/iteratorForEach.ts',
      'iter-fest.iteratorFrom': './src/iteratorFrom.ts',
      'iter-fest.iteratorMap': './src/iteratorMap.ts',
      'iter-fest.iteratorReduce': './src/iteratorReduce.ts',
      'iter-fest.iteratorSome': './src/iteratorSome.ts',
      'iter-fest.iteratorTake': './src/iteratorTake.ts',
      'iter-fest.iteratorToArray': './src/iteratorToArray.ts',
      'iter-fest.iteratorToIterable': './src/iteratorToIterable.ts',
      'iter-fest.observable': './src/Observable.ts',
      'iter-fest.observableFromAsync': './src/observableFromAsync.ts',
      'iter-fest.observableSubscribeAsReadable': './src/observableSubscribeAsReadable.ts',
      'iter-fest.readableStreamFrom': './src/readableStreamFrom.ts',
      'iter-fest.readerValues': './src/readerValues.ts',
      'iter-fest.symbolObservable': './src/SymbolObservable.ts'
    },
    format: ['cjs', 'esm'],
    sourcemap: true
  }
]);
