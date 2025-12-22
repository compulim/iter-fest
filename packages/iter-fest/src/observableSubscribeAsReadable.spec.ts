import { expect } from 'expect';
import { fn, type Mock } from 'jest-mock';
import { beforeEach, describe, test } from 'node:test';
import { Observable, type SubscriberFunction, type SubscriptionObserver } from './Observable.ts';
import { observableSubscribeAsReadable } from './observableSubscribeAsReadable.ts';
import hasResolvedOrRejected from './private/hasResolvedOrRejected.ts';

describe('comprehensive', () => {
  let observable: Observable<number>;
  let readable: ReadableStream<number>;
  let subscriberFunction: Mock<SubscriberFunction<number>>;
  let unsubscribeFunction: Mock<() => void>;

  beforeEach(() => {
    unsubscribeFunction = fn();
    subscriberFunction = fn<SubscriberFunction<number>>().mockImplementation(() => unsubscribeFunction);
    observable = new Observable(subscriberFunction);
    readable = observableSubscribeAsReadable(observable);
  });

  test('should subscribe', () => expect(subscriberFunction).toHaveBeenCalledTimes(1));
  test('should not call unsubscribe', () => expect(unsubscribeFunction).not.toHaveBeenCalled());

  describe('when read()', () => {
    let observer: SubscriptionObserver<number>;
    let reader: ReadableStreamDefaultReader<number>;
    let readPromise: Promise<ReadableStreamReadResult<number>>;

    beforeEach(() => {
      reader = readable.getReader();
      readPromise = reader.read();
      observer = subscriberFunction.mock.calls[0]![0];
    });

    test('should not resolve', () => expect(hasResolvedOrRejected(readPromise)).resolves.toBe(false));

    describe('when complete()', () => {
      beforeEach(() => observer.complete());

      test('should receive done', () => expect(readPromise).resolves.toEqual({ done: true }));
    });

    describe('when error()', () => {
      beforeEach(() => observer.error(new Error('artificial')));

      test('should reject', () => expect(readPromise).rejects.toThrow('artificial'));
    });

    describe('when next(1)', () => {
      beforeEach(() => observer.next(1));

      test('should receive a value', () => expect(readPromise).resolves.toEqual({ done: false, value: 1 }));
    });
  });

  describe('when cancel()', () => {
    beforeEach(() => readable.cancel());

    test('should unsubscribe', () => expect(unsubscribeFunction).toHaveBeenCalledTimes(1));
  });
});

test('all at once as AsyncIterableIterator', async () => {
  const observable = Observable.from([1, 2, 3]);
  const readable = observableSubscribeAsReadable(observable);
  const reader = readable.getReader();

  await expect(reader.read()).resolves.toEqual({ done: false, value: 1 });
  await expect(reader.read()).resolves.toEqual({ done: false, value: 2 });
  await expect(reader.read()).resolves.toEqual({ done: false, value: 3 });
  await expect(reader.read()).resolves.toEqual({ done: true });
});
