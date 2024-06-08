const withResolvers = require('core-js-pure/full/promise/with-resolvers');

const {
  iterableAt,
  iterableConcat,
  iterableEntries,
  iterableEvery,
  iterableFilter,
  iterableFind,
  iterableFindIndex,
  iterableFindLast,
  iterableFindLastIndex,
  iterableForEach,
  iterableIncludes,
  iterableIndexOf,
  iterableJoin,
  iterableKeys,
  iterableMap,
  iterableReduce,
  iterableSlice,
  iterableSome,
  iterableToSpliced,
  iterableToString,
  iteratorToIterable,
  Observable,
  observableFromAsync,
  observableValues,
  PushAsyncIterableIterator,
  readerToAsyncIterableIterator,
  SymbolObservable
} = require('iter-fest');

test('iterableAt should work', () => expect(iterableAt([1, 2, 3].values(), 1)).toBe(2));

test('iterableConcat should work', () =>
  expect(Array.from(iterableConcat([1, 2].values(), [3, 4].values()))).toEqual([1, 2, 3, 4]));

test('iterableEntries should work', () =>
  expect(Array.from(iterableEntries(['A', 'B', 'C']))).toEqual([
    [0, 'A'],
    [1, 'B'],
    [2, 'C']
  ]));

test('iterableEvery should work', () => expect(iterableEvery([1, 2, 3].values(), value => value)).toBe(true));

test('iterableFilter should work', () =>
  expect(Array.from(iterableFilter([1, 2, 3], value => value % 2))).toEqual([1, 3]));

test('iterableFind should work', () => expect(iterableFind([1, 2, 3], value => value % 2)).toBe(1));

test('iterableFindIndex should work', () => expect(iterableFindIndex([1, 2, 3], value => value % 2)).toBe(0));

test('iterableFindLast should work', () => expect(iterableFindLast([1, 2, 3], value => value % 2)).toBe(3));

test('iterableFindLastIndex should work', () => expect(iterableFindLastIndex([1, 2, 3], value => value % 2)).toBe(2));

test('iterableForEach should work', () => {
  const callbackfn = jest.fn();

  iterableForEach([1, 2, 3], callbackfn);

  expect(callbackfn).toHaveBeenCalledTimes(3);
});

test('iterableIncludes should work', () => expect(iterableIncludes([1, 2, 3], 2)).toBe(true));

test('iterableIndexOf should work', () => expect(iterableIndexOf([1, 2, 3], 2)).toBe(1));

test('iterableJoin should work', () => expect(iterableJoin([1, 2, 3], ', ')).toBe('1, 2, 3'));

test('iterableKeys should work', () => expect(Array.from(iterableKeys(['A', 'B', 'C']))).toEqual([0, 1, 2]));

test('iterableMap should work', () =>
  expect(Array.from(iterableMap([1, 2, 3], value => String.fromCharCode(value + 64)))).toEqual(['A', 'B', 'C']));

test('iterableReduce should work', () =>
  expect(iterableReduce([1, 2, 3].values(), (previousValue, currentValue) => previousValue + currentValue, 0)).toBe(6));

test('iterableSlice should work', () => expect(Array.from(iterableSlice([1, 2, 3, 4, 5], 1, 4))).toEqual([2, 3, 4]));

test('iterableSome should work', () => expect(iterableSome([1, 2, 3].values(), value => value % 2)).toBe(true));

test('iterableToSpliced should work', () =>
  expect(Array.from(iterableToSpliced([1, 2, 3].values(), 1, 1, 9))).toEqual([1, 9, 3]));

test('iterableToString should work', () => expect(iterableToString([1, 2, 3])).toBe('1,2,3'));

test('iteratorToIterable should work', () =>
  expect(
    Array.from(
      iteratorToIterable(
        (() => {
          let value = 0;

          return { next: () => (++value <= 3 ? { done: false, value } : { done: true, value: undefined }) };
        })()
      )
    )
  ).toEqual([1, 2, 3]));

test('Observable should work', () => {
  const next = jest.fn();
  const complete = jest.fn();

  const observable = new Observable(observer => {
    observer.next(1);
    observer.complete();
  });

  observable.subscribe({ complete, next });

  expect(next).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenNthCalledWith(1, 1);
  expect(complete).toHaveBeenCalledTimes(1);
});

test('observableFromAsync should work', async () => {
  const observable = observableFromAsync(
    (async function* () {
      yield 1;
      yield 2;
      yield 3;
    })()
  );

  const next = jest.fn();

  await new Promise(resolve => observable.subscribe({ complete: resolve, next }));

  expect(next).toHaveBeenCalledTimes(3);
  expect(next).toHaveBeenNthCalledWith(1, 1);
  expect(next).toHaveBeenNthCalledWith(2, 2);
  expect(next).toHaveBeenNthCalledWith(3, 3);
});

test('observableValues should work', async () => {
  const observable = Observable.from([1, 2, 3]);
  const values = [];

  for await (const value of observableValues(observable)) {
    values.push(value);
  }

  expect(values).toEqual([1, 2, 3]);
});

test('PushAsyncIterableIterator should work', async () => {
  let deferred = withResolvers();
  const done = jest.fn();
  const iterable = new PushAsyncIterableIterator();
  const values = [];

  (async function () {
    for await (const value of iterable) {
      values.push(value);

      deferred.resolve();
      deferred = withResolvers();
    }

    done();
    deferred.resolve();
  })();

  expect(values).toEqual([]);
  expect(done).not.toHaveBeenCalled();

  iterable.push(1);
  await deferred.promise;
  expect(values).toEqual([1]);
  expect(done).not.toHaveBeenCalled();

  iterable.push(2);
  await deferred.promise;
  expect(values).toEqual([1, 2]);
  expect(done).not.toHaveBeenCalled();

  iterable.close();
  await deferred.promise;
  expect(done).toHaveBeenCalledTimes(1);
});

test('readerToAsyncIterableIterator should work', async () => {
  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(1);
      controller.enqueue(2);
      controller.close();
    }
  });

  const values = [];

  for await (const value of readerToAsyncIterableIterator(readableStream.getReader())) {
    values.push(value);
  }

  expect(values).toEqual([1, 2]);
});

test('SymbolObservable should work', () => {
  const observable = new Observable(() => {});

  expect(observable[SymbolObservable]()).toBe(observable);
});
