import createAbortError from './private/createAbortError';
import hasResolvedOrRejected from './private/hasResolvedOrRejected';
import ignoreUnhandledRejection from './private/ignoreUnhandledRejection';
import isAbortError from './private/isAbortError';
import { type JestMockOf } from './private/JestMockOf';
import {
  readableStreamValuesWithSignal,
  type ReadableStreamIteratorWithSignalOptions
} from './readableStreamValuesWithSignal';

type T = number;

describe.each([
  ['without arguments', undefined],
  ['with { preventCancel: false }', { preventCancel: false }],
  ['with { preventCancel: true }', { preventCancel: true }]
])('%s', (_, options: ReadableStreamIteratorWithSignalOptions | undefined) => {
  let abortController: AbortController;
  let cancel: JestMockOf<Exclude<UnderlyingDefaultSource<T>['cancel'], undefined>>;
  let lastController: ReadableStreamDefaultController<T>;
  let start: JestMockOf<Exclude<UnderlyingDefaultSource<T>['start'], undefined>>;
  let stream: ReadableStream<T>;
  let values: ReadableStreamAsyncIterator<T>;

  beforeEach(() => {
    abortController = new AbortController();
    cancel = jest.fn(async () => {});
    start = jest.fn(controller => {
      lastController = controller;
    });
    stream = new ReadableStream({ cancel, start });
    values = readableStreamValuesWithSignal(stream, { ...options, signal: abortController.signal });
  });

  describe('when next() is called and pending', () => {
    let nextPromise: Promise<IteratorResult<T>>;

    beforeEach(() => {
      nextPromise = ignoreUnhandledRejection(values.next());
    });

    describe('when signal is aborted', () => {
      beforeEach(() => abortController.abort());

      test('next() should reject with AbortError', () =>
        expect(nextPromise).rejects.toThrow(new DOMException('The operation is aborted', 'AbortError')));

      if (options?.preventCancel) {
        test('cancel() should not have been called', () => expect(cancel).not.toHaveBeenCalled());
      } else {
        describe('cancel() should be called', () => {
          test('once', () => expect(cancel).toHaveBeenCalledTimes(1));
          test('with reason of AbortError', () => expect(isAbortError(cancel.mock.calls[0]?.[0])).toBe(true));
        });
      }

      test('stream should be unlocked', () => expect(stream).toHaveProperty('locked', false));

      describe('when next() is called again', () => {
        let next2Promise: Promise<IteratorResult<T>>;

        beforeEach(() => {
          next2Promise = values.next();
        });

        test('next() should reject with AbortError', () =>
          expect(next2Promise).rejects.toThrow(new DOMException('The operation is aborted', 'AbortError')));
      });

      if (options?.preventCancel) {
        describe('when stream enqueued a value while no reader is attached', () => {
          beforeEach(() => lastController.enqueue(2));

          describe('when another reader is attached', () => {
            let reader: ReadableStreamDefaultReader<T>;

            beforeEach(() => {
              reader = stream.getReader();
            });

            test('should continue where it left', () =>
              expect(reader.read()).resolves.toEqual({ done: false, value: 2 }));
          });
        });
      }
    });
  });

  describe(`when return('Cancellation reason') is pending due to ongoing next()`, () => {
    let nextPromise: Promise<IteratorResult<T>>;
    let returnPromise: Promise<IteratorResult<T>>;

    beforeEach(() => {
      nextPromise = ignoreUnhandledRejection(values.next());
      returnPromise = ignoreUnhandledRejection(values.return!('Cancellation reason'));
    });

    test('next() is pending', () => expect(hasResolvedOrRejected(nextPromise)).resolves.toBe(false));
    test('return() is pending', () => expect(hasResolvedOrRejected(returnPromise)).resolves.toBe(false));

    describe('when signal is aborted', () => {
      beforeEach(() => abortController.abort());

      // After aborted, all calls to next()/return() will reject with AbortError.
      test('next() should reject with AbortError', () => expect(nextPromise).rejects.toEqual(createAbortError()));
      test(`return() should reject with AbortError`, () => expect(returnPromise).rejects.toEqual(createAbortError()));

      if (options?.preventCancel) {
        test('cancel() should not be called', () => expect(cancel).not.toHaveBeenCalled());
      } else {
        describe('cancel() should be called', () => {
          test('once', () => expect(cancel).toHaveBeenCalledTimes(1));
          test('with AbortError', () => expect(cancel).toHaveBeenNthCalledWith(1, createAbortError()));
        });
      }
    });
  });

  describe('when signal is aborted', () => {
    beforeEach(() => abortController.abort());

    test('next() should reject with AbortError', () => expect(values.next()).rejects.toEqual(createAbortError()));

    test(`return('Return after abort') should reject with AbortError`, () =>
      expect(values.return!('Return after abort')).rejects.toEqual(createAbortError()));

    if (options?.preventCancel) {
      test('cancel() should not be called', () => expect(cancel).not.toHaveBeenCalled());
    } else {
      describe('cancel() should be called', () => {
        test('once', () => expect(cancel).toHaveBeenCalledTimes(1));
        test('with AbortError', () => expect(cancel).toHaveBeenNthCalledWith(1, createAbortError()));
      });
    }
  });
});

test('Scenario: without preventDefault, abort during for-loop should reject', async () => {
  const abortController = new AbortController();
  const stream = new ReadableStream<number>({
    start(controller) {
      controller.enqueue(1);
      controller.enqueue(2);
      controller.enqueue(3);
    }
  });

  const values: number[] = [];

  // If cancelled, should not throw but just return { done: true, value: undefined }.
  await expect(async () => {
    for await (const value of readableStreamValuesWithSignal(stream, { signal: abortController.signal })) {
      values.push(value);

      if (value === 3) {
        abortController.abort();
      }
    }
  }).rejects.toEqual(createAbortError());

  expect(values).toEqual([1, 2, 3]);
});

test('Scenario: with preventDefault, abort during for-loop should reject', async () => {
  const abortController = new AbortController();
  const stream = new ReadableStream<number>({
    start(controller) {
      controller.enqueue(1);
      controller.enqueue(2);
      controller.enqueue(3);
    }
  });

  const values: number[] = [];

  // If lock is released, should throw AbortError.
  await expect(async () => {
    for await (const value of readableStreamValuesWithSignal(stream, {
      preventCancel: true,
      signal: abortController.signal
    })) {
      values.push(value);

      if (value === 3) {
        abortController.abort();
      }
    }
  }).rejects.toEqual(createAbortError());

  expect(values).toEqual([1, 2, 3]);
});

test('Scenario: without preventDefault, abort() before for-loop should reject immediately', async () => {
  const abortController = new AbortController();
  const stream = new ReadableStream<number>();
  const iteration = jest.fn();

  abortController.abort();

  await expect(async () => {
    for await (const _ of readableStreamValuesWithSignal(stream, { signal: abortController.signal })) {
      iteration();
    }
  }).rejects.toEqual(createAbortError());

  expect(iteration).not.toHaveBeenCalled();
});

test('Scenario: Array.fromAsync() is pending but aborted should reject', async () => {
  const abortController = new AbortController();
  const stream = new ReadableStream();

  const arrayFromAsyncPromise = Array.fromAsync(
    readableStreamValuesWithSignal(stream, { signal: abortController.signal })
  );

  abortController.abort();

  expect(arrayFromAsyncPromise).rejects.toThrow(createAbortError());
});
