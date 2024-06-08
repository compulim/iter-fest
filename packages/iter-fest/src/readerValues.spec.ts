import hasResolved from './private/hasResolved';
import { readerValues } from './readerValues';

describe('comprehensive', () => {
  let controller: ReadableStreamDefaultController<number>;
  let iterable: AsyncIterableIterator<number>;
  let reader: ReadableStreamDefaultReader<number>;
  let readableStream: ReadableStream<number>;

  beforeEach(() => {
    readableStream = new ReadableStream({
      start(c) {
        controller = c;
      }
    });

    reader = readableStream.getReader();

    iterable = readerValues(reader);
  });

  test('iterable.next() should not resolve', () => expect(hasResolved(iterable.next())).resolves.toBe(false));

  describe('when enqueue(1) is called', () => {
    let nextPromise: Promise<IteratorResult<number>>;

    beforeEach(() => {
      nextPromise = iterable.next();
      controller.enqueue(1);
    });

    test('iterable.next() should resolve 1', () => expect(nextPromise).resolves.toEqual({ value: 1 }));

    describe('when enqueue(2) is called', () => {
      let nextPromise: Promise<IteratorResult<number>>;

      beforeEach(() => {
        nextPromise = iterable.next();
        controller.enqueue(2);
      });

      test('iterable.next() should resolve 2', () => expect(nextPromise).resolves.toEqual({ value: 2 }));
    });
  });

  describe('when close() is called', () => {
    let nextPromise: Promise<IteratorResult<number>>;

    beforeEach(() => {
      nextPromise = iterable.next();
      controller.close();
    });

    test('iterable.next() should resolve done', () =>
      expect(nextPromise).resolves.toEqual({ done: true, value: undefined }));
  });
});

test('after close() should still read all', async () => {
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

test('release and create another reader', async () => {
  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(1);
      controller.enqueue(2);
      controller.close();
    }
  });

  const reader1 = readableStream.getReader();

  for await (const value of readerValues(reader1)) {
    expect(value).toBe(1);
    break;
  }

  reader1.releaseLock();

  const reader2 = readableStream.getReader();

  for await (const value of readerValues(reader2)) {
    expect(value).toBe(2);
  }
});

test('break in for-loop should cancel', async () => {
  const cancel = jest.fn();
  const readableStream = new ReadableStream({
    cancel,
    start(controller) {
      controller.enqueue(1);
      controller.enqueue(2);
      controller.close();
    }
  });

  for await (const _ of readerValues(readableStream.getReader())) {
    break;
  }

  expect(cancel).toHaveBeenCalledTimes(1);
});

test('throw in for-loop should cancel', async () => {
  const cancel = jest.fn();
  const readableStream = new ReadableStream({
    cancel,
    start(controller) {
      controller.enqueue(1);
      controller.enqueue(2);
      controller.close();
    }
  });

  await (async () => {
    for await (const _ of readerValues(readableStream.getReader())) {
      throw new Error('artificial');
    }
  })().catch(() => {});

  expect(cancel).toHaveBeenCalledTimes(1);
});
