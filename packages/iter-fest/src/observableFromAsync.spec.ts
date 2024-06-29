import type { CompleteFunction, ErrorFunction, NextFunction, Observable, StartFunction } from './Observable.ts';
import { observableFromAsync } from './observableFromAsync.ts';

import { type JestMockOf } from './private/JestMockOf.js';
import withResolvers from './private/withResolvers.ts';

describe('comprehensive', () => {
  let complete: JestMockOf<CompleteFunction>;
  let error: JestMockOf<ErrorFunction>;
  let iterable: AsyncIterableIterator<number>;
  let iterableNextReject: (error: unknown) => void;
  let iterableNextResolve: (result: IteratorResult<number>) => void;
  let next: JestMockOf<NextFunction<number>>;
  let observable: Observable<number>;
  let start: JestMockOf<StartFunction>;
  let iterableNextDeferred: PromiseWithResolvers<IteratorResult<number>>;

  beforeEach(() => {
    iterableNextDeferred = withResolvers();

    iterableNextReject = jest.fn().mockImplementation(error => {
      iterableNextDeferred.reject(error);
      iterableNextDeferred = withResolvers();
    });

    iterableNextResolve = jest.fn().mockImplementation(value => {
      iterableNextDeferred.resolve(value);
      iterableNextDeferred = withResolvers();
    });

    iterable = {
      [Symbol.asyncIterator]() {
        return iterable;
      },
      next() {
        return iterableNextDeferred.promise;
      }
    };

    complete = jest.fn();
    error = jest.fn();
    next = jest.fn();
    start = jest.fn();

    observable = observableFromAsync(iterable);

    observable.subscribe({ complete, error, next, start });
  });

  test('start() should have been called once', () => expect(start).toHaveBeenCalledTimes(1));

  describe('when iterable.next() is called with a value', () => {
    beforeEach(() => iterableNextResolve({ value: 1 }));

    describe('observable.next() should have been called', () => {
      test('once', () => expect(next).toHaveBeenCalledTimes(1));
      test('with value', () => expect(next).toHaveBeenNthCalledWith(1, 1));
    });
  });

  describe('when iterable.next() is called with completion', () => {
    beforeEach(() => iterableNextResolve({ done: true, value: undefined }));

    test('observable.complete() should have been called once', () => expect(complete).toHaveBeenCalledTimes(1));
  });

  describe('when iterable.next() is called with exception', () => {
    beforeEach(() => iterableNextReject(new Error('artificial')));

    describe('observable.error() should have been called', () => {
      test('once', () => expect(error).toHaveBeenCalledTimes(1));
      test('with the error', () =>
        expect(() => {
          throw error.mock.calls[0]?.[0];
        }).toThrow('artificial'));
    });
  });
});
