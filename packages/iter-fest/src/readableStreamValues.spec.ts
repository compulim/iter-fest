import hasResolved from './private/hasResolved';
import { readableStreamValues } from './readableStreamValues';

describe('comprehensive', () => {
  let controller: ReadableStreamDefaultController<number>;
  let iterable: AsyncIterableIterator<number>;
  let readableStream: ReadableStream<number>;

  beforeEach(() => {
    readableStream = new ReadableStream({
      start(c) {
        controller = c;
      }
    });

    iterable = readableStreamValues(readableStream);
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

  for await (const value of readableStreamValues(readableStream)) {
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

  for await (const value of readableStreamValues(readableStream)) {
    expect(value).toBe(1);
    break;
  }

  for await (const value of readableStreamValues(readableStream)) {
    expect(value).toBe(2);
  }
});

test('break in for-loop should release', async () => {
  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(1);
      controller.enqueue(2);
      controller.close();
    }
  });

  for await (const _ of readableStreamValues(readableStream)) {
    expect(readableStream.locked).toBe(true);
    break;
  }

  expect(readableStream.locked).toBe(false);
});

test('throw in for-loop should release', async () => {
  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(1);
      controller.enqueue(2);
      controller.close();
    }
  });

  await (async () => {
    for await (const _ of readableStreamValues(readableStream)) {
      expect(readableStream.locked).toBe(true);

      throw new Error('artificial');
    }
  })().catch(() => {});

  expect(readableStream.locked).toBe(false);
});

test('pull-based reader', async () => {
  let index = 0;

  const readableStream = new ReadableStream({
    pull(controller) {
      controller.enqueue(++index);

      if (index >= 2) {
        controller.close();
      }
    }
  });

  const values: number[] = [];

  for await (const value of readableStreamValues(readableStream)) {
    values.push(value);
  }

  expect(values).toEqual([1, 2]);
});

test('mixed mode reader', async () => {
  const readableStream = new ReadableStream({
    pull(controller) {
      controller.enqueue(3);
      controller.close();
    },
    start(controller) {
      controller.enqueue(1);
      controller.enqueue(2);
    }
  });

  const values: number[] = [];

  for await (const value of readableStreamValues(readableStream)) {
    values.push(value);
  }

  expect(values).toEqual([1, 2, 3]);
});
