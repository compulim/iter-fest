import withResolvers from 'core-js-pure/full/promise/with-resolvers';
import {
  IterableWritableStream,
  Observable,
  SymbolObservable,
  asyncGeneratorWithLastValue,
  asyncIteratorToAsyncIterable,
  generatorWithLastValue,
  iterableJoin,
  iterableKeys,
  iterableSlice,
  iterableToSpliced,
  iterableToString,
  iteratorToIterable,
  observableFromAsync,
  observableSubscribeAsReadable,
  readableStreamFrom,
  readerValues
} from 'iter-fest';

test('asyncIteratorToIterable should work', async () => {
  const iterable = asyncIteratorToAsyncIterable(
    ((): AsyncIterator<number> => {
      let value = 0;

      return {
        next: () => Promise.resolve(++value <= 3 ? { done: false, value } : { done: true, value: undefined })
      };
    })()
  );

  const values: number[] = [];

  for await (const value of iterable) {
    values.push(value);
  }

  expect(values).toEqual([1, 2, 3]);
});

test('asyncGeneratorWithLastValue should work', async () => {
  const asyncGenerator = asyncGeneratorWithLastValue(
    (async function* () {
      yield 1;

      return 'end' as const;
    })()
  );

  for await (const value of asyncGenerator) {
    expect(value).toBe(1);
  }

  expect(asyncGenerator.lastValue()).toEqual('end');
});

test('generatorWithLastValue should work', () => {
  const generator = generatorWithLastValue(
    (function* () {
      yield 1;

      return 'end' as const;
    })()
  );

  for (const value of generator) {
    expect(value).toBe(1);
  }

  expect(generator.lastValue()).toEqual('end');
});

test('iterableJoin should work', () => expect(iterableJoin([1, 2, 3], ', ')).toBe('1, 2, 3'));

test('iterableKeys should work', () => expect(Array.from(iterableKeys(['A', 'B', 'C']))).toEqual([0, 1, 2]));

test('iterableSlice should work', () => expect(Array.from(iterableSlice([1, 2, 3, 4, 5], 1, 4))).toEqual([2, 3, 4]));

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
        ((): Iterator<number> => {
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

  await new Promise<void>(resolve => observable.subscribe({ complete: resolve, next }));

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
