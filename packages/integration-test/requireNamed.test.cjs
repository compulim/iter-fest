const withResolvers = require('core-js-pure/full/promise/with-resolvers');

const { asyncGeneratorWithLastValue } = require('iter-fest/asyncGeneratorWithLastValue');
const { asyncIteratorToAsyncIterable } = require('iter-fest/asyncIteratorToAsyncIterable');
const { generatorWithLastValue } = require('iter-fest/generatorWithLastValue');
const { iterableAt } = require('iter-fest/iterableAt');
const { iterableConcat } = require('iter-fest/iterableConcat');
const { iterableEntries } = require('iter-fest/iterableEntries');
const { iterableEvery } = require('iter-fest/iterableEvery');
const { iterableFilter } = require('iter-fest/iterableFilter');
const { iterableFind } = require('iter-fest/iterableFind');
const { iterableFindIndex } = require('iter-fest/iterableFindIndex');
const { iterableFindLast } = require('iter-fest/iterableFindLast');
const { iterableFindLastIndex } = require('iter-fest/iterableFindLastIndex');
const { iterableForEach } = require('iter-fest/iterableForEach');
const { iterableIncludes } = require('iter-fest/iterableIncludes');
const { iterableIndexOf } = require('iter-fest/iterableIndexOf');
const { iterableJoin } = require('iter-fest/iterableJoin');
const { iterableKeys } = require('iter-fest/iterableKeys');
const { iterableMap } = require('iter-fest/iterableMap');
const { iterableReduce } = require('iter-fest/iterableReduce');
const { iterableSlice } = require('iter-fest/iterableSlice');
const { iterableSome } = require('iter-fest/iterableSome');
const { iterableToSpliced } = require('iter-fest/iterableToSpliced');
const { iterableToString } = require('iter-fest/iterableToString');
const { IterableWritableStream } = require('iter-fest/iterableWritableStream');
const { iteratorToIterable } = require('iter-fest/iteratorToIterable');
const { Observable } = require('iter-fest/observable');
const { observableFromAsync } = require('iter-fest/observableFromAsync');
const { observableSubscribeAsReadable } = require('iter-fest/observableSubscribeAsReadable');
const { readableStreamFrom } = require('iter-fest/readableStreamFrom');
const { readerValues } = require('iter-fest/readerValues');
const { SymbolObservable } = require('iter-fest/symbolObservable');

test('asyncGeneratorWithLastValue should work', async () => {
  const asyncGenerator = asyncGeneratorWithLastValue(
    (async function* () {
      yield 1;

      return 'end';
    })()
  );

  for await (const value of asyncGenerator) {
    expect(value).toBe(1);
  }

  expect(asyncGenerator.lastValue()).toEqual('end');
});

test('asyncIteratorToIterable should work', async () => {
  const iterable = asyncIteratorToAsyncIterable(
    (() => {
      let value = 0;

      return {
        next: () => Promise.resolve(++value <= 3 ? { done: false, value } : { done: true, value: undefined })
      };
    })()
  );

  const values = [];

  for await (const value of iterable) {
    values.push(value);
  }

  expect(values).toEqual([1, 2, 3]);
});

test('generatorWithLastValue should work', () => {
  const generator = generatorWithLastValue(
    (function* () {
      yield 1;

      return 'end';
    })()
  );

  for (const value of generator) {
    expect(value).toBe(1);
  }

  expect(generator.lastValue()).toEqual('end');
});

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

test('IterableWritableStream should work', async () => {
  let deferred = withResolvers();
  const done = jest.fn();
  const iterable = new IterableWritableStream();
  const writer = iterable.getWriter();
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

  writer.write(1);
  await deferred.promise;
  expect(values).toEqual([1]);
  expect(done).not.toHaveBeenCalled();

  writer.write(2);
  await deferred.promise;
  expect(values).toEqual([1, 2]);
  expect(done).not.toHaveBeenCalled();

  writer.close();
  await deferred.promise;
  expect(done).toHaveBeenCalledTimes(1);
});

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

test('observableSubscribeAsReadable should work', async () => {
  const stream = new TextDecoderStream();
  const observable = Observable.from([65, 66, 67]);
  const readable = observableSubscribeAsReadable(observable);
  const numberToInt8Array = new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(Int8Array.from([chunk]));
    }
  });

  readable.pipeThrough(numberToInt8Array).pipeTo(stream.writable);

  const reader = stream.readable.getReader();

  await expect(reader.read()).resolves.toEqual({ done: false, value: 'A' });
  await expect(reader.read()).resolves.toEqual({ done: false, value: 'B' });
  await expect(reader.read()).resolves.toEqual({ done: false, value: 'C' });
  await expect(reader.read()).resolves.toEqual({ done: true });
});

test('readableStreamFrom should work', async () => {
  const iterable = [1, 2, 3].values();

  const reader = readableStreamFrom(iterable).getReader();

  await expect(reader.read()).resolves.toEqual({ done: false, value: 1 });
  await expect(reader.read()).resolves.toEqual({ done: false, value: 2 });
  await expect(reader.read()).resolves.toEqual({ done: false, value: 3 });
  await expect(reader.read()).resolves.toEqual({ done: true, value: undefined });
});

test('readerValues should work', async () => {
  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(1);
      controller.enqueue(2);
      controller.close();
    }
  });

  const values = [];

  for await (const value of readerValues(readableStream.getReader())) {
    values.push(value);
  }

  expect(values).toEqual([1, 2]);
});

test('SymbolObservable should work', () => {
  const observable = new Observable(() => {});

  expect(observable[SymbolObservable]()).toBe(observable);
});
