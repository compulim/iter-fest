import hasResolvedOrRejected from './private/hasResolvedOrRejected';
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

  test('iterable.next() should not resolve', () => expect(hasResolvedOrRejected(iterable.next())).resolves.toBe(false));

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

test('break in for-loop should continue where it break', async () => {
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
    break;
  }

  for await (const _ of readableStreamValues(readableStream)) {
    throw new Error('Should not iterate.');
  }
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

test('throw in for-loop should continue where it break', async () => {
  const readableStream = new ReadableStream({
    start(controller) {
      controller.enqueue(1);
      controller.enqueue(2);
      controller.close();
    }
  });

  try {
    for await (const value of readableStreamValues(readableStream)) {
      expect(value).toBe(1);
      throw new Error('artificial');
    }
  } catch {}

  try {
    for await (const value of readableStreamValues(readableStream)) {
      expect(value).toBe(2);
      throw new Error('artificial');
    }
  } catch {}

  for await (const _ of readableStreamValues(readableStream)) {
    throw new Error('Should not iterate.');
  }
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

describe('with signal', () => {
  let abortController: AbortController;
  let controller: ReadableStreamDefaultController<number>;
  let iterable: AsyncIterableIterator<number>;
  let readableStream: ReadableStream<number>;

  beforeEach(() => {
    abortController = new AbortController();

    readableStream = new ReadableStream({
      start(c) {
        controller = c;
      }
    });

    iterable = readableStreamValues(readableStream, { signal: abortController.signal });
  });

  describe('when enqueue(1) is called', () => {
    let nextPromise: Promise<IteratorResult<number>>;

    beforeEach(() => {
      nextPromise = iterable.next();
      controller.enqueue(1);
    });

    test('iterable.next() should resolve 1', () => expect(nextPromise).resolves.toEqual({ value: 1 }));

    describe('when abort() is called', () => {
      beforeEach(() => {
        nextPromise = iterable.next();
        nextPromise.catch(() => {});

        abortController.abort();
      });

      test('should throw', () => expect(nextPromise).rejects.toThrow('Aborted'));

      describe('when enqueue(2) is called', () => {
        beforeEach(() => {
          controller.enqueue(2);
        });

        describe('when iterate again', () => {
          beforeEach(() => {
            iterable = readableStreamValues(readableStream);
            nextPromise = iterable.next();
          });

          test('iterable.next() should resolve 2', () => expect(nextPromise).resolves.toEqual({ value: 2 }));
        });
      });
    });
  });
});
