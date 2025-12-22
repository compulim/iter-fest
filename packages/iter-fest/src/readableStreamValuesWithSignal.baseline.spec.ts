import hasResolvedOrRejected from './private/hasResolvedOrRejected';
import ignoreUnhandledRejection from './private/ignoreUnhandledRejection';
import { type JestMockOf } from './private/JestMockOf';
import {
  readableStreamValuesWithSignal,
  type ReadableStreamIteratorWithSignalOptions
} from './readableStreamValuesWithSignal';

type T = number;

describe.each([
  [
    'native readableStream.values' as const,
    (
      stream: ReadableStream,
      options: ReadableStreamIteratorWithSignalOptions | undefined
    ): ReadableStreamAsyncIterator<T> => stream.values(options)
  ],
  [
    'readableStreamValuesWithSignal' as const,
    (
      stream: ReadableStream,
      options: ReadableStreamIteratorWithSignalOptions | undefined
    ): ReadableStreamAsyncIterator<T> => readableStreamValuesWithSignal(stream, options)
  ]
])('%s', (scenario, factory) => {
  describe('when [Symbol.asyncIterator]() is called', () => {
    let iterator: ReadableStreamAsyncIterator<T>;
    let result: ReadableStreamAsyncIterator<T>;

    beforeEach(() => {
      const readable = new ReadableStream();

      iterator = factory(readable, {});
      result = iterator[Symbol.asyncIterator]();
    });

    test('should return self', () => expect(result).toBe(iterator));
  });

  describe('when [Symbol.asyncDispose]() is called', () => {
    let iterator: ReadableStreamAsyncIterator<T>;

    beforeEach(async () => {
      const readable = new ReadableStream<number>({
        start(controller) {
          controller.enqueue(1);
        }
      });

      iterator = factory(readable, {});

      await iterator[Symbol.asyncDispose]?.();
    });

    test('when next() is called should resolve', () =>
      expect(iterator.next()).resolves.toEqual({ done: false, value: 1 }));
  });

  describe.each([
    ['without arguments', undefined],
    ['with { preventCancel: false }', { preventCancel: false }],
    ['with { preventCancel: true }', { preventCancel: true }]
  ])('%s', (_, options: ReadableStreamIteratorWithSignalOptions | undefined) => {
    let cancel: JestMockOf<Exclude<UnderlyingDefaultSource<T>['cancel'], undefined>>;
    let lastController: ReadableStreamDefaultController<T>;
    let start: JestMockOf<Exclude<UnderlyingDefaultSource<T>['start'], undefined>>;
    let stream: ReadableStream<T>;
    let values: ReadableStreamAsyncIterator<T>;

    beforeEach(() => {
      cancel = jest.fn(async () => {});
      start = jest.fn(controller => {
        lastController = controller;
      });
      stream = new ReadableStream({ cancel, start });
      values = factory(stream, options);
    });

    test('should lock initially', () => expect(stream.locked).toBe(true));
    test('should support return()', () => expect(values.return).not.toBeUndefined());
    test('should not support throw()', () => expect(values.throw).toBeUndefined());

    if (!options?.preventCancel) {
      describe('when return() with cancel() rejected', () => {
        let returnPromise: Promise<IteratorResult<T>>;

        beforeEach(() => {
          cancel.mockRejectedValueOnce(new Error('Something went wrong'));
          returnPromise = ignoreUnhandledRejection(values.return!('Cancellation reason'));
        });

        test('return() should throw', () => expect(returnPromise).rejects.toEqual(new Error('Something went wrong')));
        test('should unlock regardless', () => expect(stream).toHaveProperty('locked', false));
      });
    }

    describe(`when return('Cancellation reason')`, () => {
      let returnPromise: Promise<IteratorResult<T>>;

      beforeEach(() => {
        returnPromise = values.return!('Cancellation reason');
      });

      test('should be unlocked', () => expect(stream.locked).toBe(false));

      // --- Seems Node.js 22.14.0 implementation is different from W3C spec, see https://github.com/nodejs/node/issues/57681 ---
      // test('should resolve with undefined', () =>
      //   expect(returnPromise).resolves.toEqual({ done: true, value: undefined }));
      test(`should resolve with reason`, () =>
        expect(returnPromise).resolves.toEqual({ done: true, value: 'Cancellation reason' }));

      if (options?.preventCancel) {
        test('should not call cancel()', () => expect(cancel).not.toHaveBeenCalled());
      } else {
        describe(`should call cancel('Cancellation reason')`, () => {
          test('once', () => expect(cancel).toHaveBeenCalledTimes(1));
          test('with reason', () => expect(cancel).toHaveBeenNthCalledWith(1, 'Cancellation reason'));
        });
      }

      describe('when next() is called after return()', () => {
        let nextPromise: Promise<IteratorResult<T>>;

        beforeEach(() => {
          nextPromise = values.next();
        });

        test('should resolve undefined', () => expect(nextPromise).resolves.toEqual({ done: true, value: undefined }));
      });
    });

    describe('while next() is pending', () => {
      let nextPromise: Promise<IteratorResult<T>>;

      beforeEach(() => {
        nextPromise = values.next();
      });

      describe('when enqueue()', () => {
        beforeEach(() => lastController.enqueue(1));

        test('next() should resolve', () => expect(nextPromise).resolves.toEqual({ done: false, value: 1 }));
      });

      describe(`when return('Cancellation reason') is called while next() is pending`, () => {
        let returnPromise: Promise<IteratorResult<T>>;

        beforeEach(() => {
          returnPromise = values.return!('Cancellation reason');
        });

        test('return() should not resolve because next() is pending', () =>
          expect(hasResolvedOrRejected(returnPromise)).resolves.toBe(false));

        test('cancel() should not be called', () => expect(cancel).not.toHaveBeenCalled());

        describe('when enqueue()', () => {
          beforeEach(() => lastController.enqueue(2));

          test('next() should resolve', () => expect(nextPromise).resolves.toEqual({ done: false, value: 2 }));

          // --- Seems Node.js 22.14.0 implementation is different from W3C spec, see https://github.com/nodejs/node/issues/57681 ---
          // test('return() should resolve with undefined', () =>
          //   expect(returnPromise).resolves.toEqual({ done: true, value: undefined }));
          test('return() should resolve with reason', () =>
            expect(returnPromise).resolves.toEqual({ done: true, value: 'Cancellation reason' }));

          if (options?.preventCancel) {
            test('cancel() should not be called', () => expect(cancel).not.toHaveBeenCalled());
          } else {
            describe(`cancel('Cancellation reason') should be called`, () => {
              test('once', () => expect(cancel).toHaveBeenCalledTimes(1));
              test('with arguments', () => expect(cancel).toHaveBeenNthCalledWith(1, 'Cancellation reason'));
            });
          }

          test('stream should be unlocked', () => expect(stream).toHaveProperty('locked', false));
        });
      });

      describe(`when controller.close() is called`, () => {
        beforeEach(() => lastController.close());

        test('next() should resolve with undefined', () =>
          expect(nextPromise).resolves.toEqual({ done: true, value: undefined }));

        test('stream should be unlocked', () => expect(stream).toHaveProperty('locked', false));
      });

      describe(`when controller.error('Something is wrong') is called`, () => {
        beforeEach(() => {
          ignoreUnhandledRejection(nextPromise);
          lastController.error(new Error('Something is wrong'));
        });

        test('next() should rejects with the error', () =>
          expect(nextPromise).rejects.toEqual(new Error('Something is wrong')));

        test('stream should be unlocked', () => expect(stream).toHaveProperty('locked', false));
      });
    });

    describe('while one next() is resolved but another next() is pending', () => {
      let next1Promise: Promise<IteratorResult<T>>;
      let next2Promise: Promise<IteratorResult<T>>;

      beforeEach(() => {
        next1Promise = values.next();
        next2Promise = values.next();

        lastController.enqueue(1);
      });

      test('the first next() should have been resolved', () =>
        expect(next1Promise).resolves.toEqual({ done: false, value: 1 }));

      test('the second next() should be pending', () =>
        expect(hasResolvedOrRejected(next2Promise)).resolves.toBe(false));

      // --- Node.js 22.14.0 throws internal assertion error, see https://github.com/nodejs/node/issues/57679 ---
      if (scenario !== 'native readableStream.values') {
        describe('when return() is called', () => {
          let returnPromise: Promise<IteratorResult<T>>;

          beforeEach(() => {
            returnPromise = values.return!();
          });

          test('return() should not resolve', () => expect(hasResolvedOrRejected(returnPromise)).resolves.toBe(false));

          describe('when the second next() is resolved', () => {
            beforeEach(() => lastController.enqueue(2));

            test('the second next() should have been resolved', () =>
              expect(next2Promise).resolves.toEqual({ done: false, value: 2 }));

            test('return() should be resolved', () =>
              expect(returnPromise).resolves.toEqual({ done: true, value: undefined }));
          });
        });
      }
    });

    describe('when controller.close() is called', () => {
      beforeEach(() => lastController.close());

      test('stream should still be locked', () => expect(stream.locked).toBe(true));

      describe('when next() is called', () => {
        let nextPromise: Promise<IteratorResult<T>>;

        beforeEach(() => {
          nextPromise = values.next();
        });

        test('should resolve with undefined', () =>
          expect(nextPromise).resolves.toEqual({ done: true, value: undefined }));

        test('stream should be unlocked', () => expect(stream.locked).toBe(false));
      });

      describe(`when return('Cancellation reason') is called`, () => {
        let returnPromise: Promise<IteratorResult<T>>;

        beforeEach(() => {
          returnPromise = values.return!('Cancellation reason');
        });

        // --- Seems Node.js 22.14.0 implementation is different from W3C spec, see https://github.com/nodejs/node/issues/57681 ---
        // test('should resolve with undefined', () =>
        //   expect(returnPromise).resolves.toEqual({ done: true, value: undefined }));
        test('should resolve with reason', () =>
          expect(returnPromise).resolves.toEqual({ done: true, value: 'Cancellation reason' }));

        test('stream should be unlocked', () => expect(stream.locked).toBe(false));
      });
    });

    describe(`when controller.error('Something is wrong') is called`, () => {
      beforeEach(() => lastController.error(new Error('Something is wrong')));

      describe('when next() is called', () => {
        let nextPromise: Promise<IteratorResult<T>>;

        beforeEach(() => {
          nextPromise = ignoreUnhandledRejection(values.next());
        });

        test(`should reject with 'Something is wrong'`, () =>
          expect(nextPromise).rejects.toEqual(new Error('Something is wrong')));

        test('stream should be unlocked', () => expect(stream.locked).toBe(false));
      });

      describe(`when return('Cancellation reason') is called`, () => {
        let returnPromise: Promise<IteratorResult<T>>;

        beforeEach(() => {
          returnPromise = ignoreUnhandledRejection(values.return!('Cancellation reason'));
        });

        if (options?.preventCancel) {
          // --- Seems Node.js 22.14.0 implementation is different from W3C spec, see https://github.com/nodejs/node/issues/57681 ---
          // test('should resolve with undefined', () =>
          //   expect(returnPromise).resolves.toEqual({ done: true, value: undefined }));
          test(`should resolve with 'Cancellation reason'`, () =>
            expect(returnPromise).resolves.toEqual({ done: true, value: 'Cancellation reason' }));
        } else {
          test(`should reject with 'Something is wrong'`, () =>
            expect(returnPromise).rejects.toEqual(new Error('Something is wrong')));

          test('should not call cancel() because reader.cancel() had thrown', () =>
            expect(cancel).not.toHaveBeenCalled());
        }

        test('stream should be unlocked', () => expect(stream).toHaveProperty('locked', false));

        describe(`when return('Cancel again') is called again`, () => {
          let return2Promise: Promise<IteratorResult<T>>;

          beforeEach(() => {
            return2Promise = ignoreUnhandledRejection(values.return!('Cancel again'));
          });

          if (options?.preventCancel) {
            // --- Seems Node.js 22.14.0 implementation is different from W3C spec, see https://github.com/nodejs/node/issues/57681 ---
            // test('should resolve with undefined', () =>
            //   expect(return2Promise).resolves.toEqual({ done: true, value: undefined }));
            test(`should resolve with 'Cancel again'`, () =>
              expect(return2Promise).resolves.toEqual({ done: true, value: 'Cancel again' }));
          } else {
            // --- Seems Node.js 22.14.0 implementation is different from W3C spec ---
            // --- As it already throw on first return(), it should continue to throw on second return() ---
            // test(`should reject with 'Something is wrong'`, () =>
            //   expect(return2Promise).rejects.toEqual(new Error('Something is wrong')));
            test(`should resolve with 'Cancel again'`, () =>
              expect(return2Promise).resolves.toEqual({ done: true, value: 'Cancel again' }));
          }
        });
      });
    });
  });
});
