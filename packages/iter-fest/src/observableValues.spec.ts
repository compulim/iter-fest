import { Observable, type SubscriberFunction, type SubscriptionObserver } from './Observable';
import { observableValues } from './observableValues';
import type { JestMockOf } from './private/JestMockOf';

describe('comprehensive', () => {
  describe('step-by-step', () => {
    let closeFunction: JestMockOf<() => void>;
    let iterator: AsyncIterableIterator<number>;
    let observable: Observable<number>;
    let observer: SubscriptionObserver<number>;
    let subscriberFunction: JestMockOf<SubscriberFunction<number>>;

    beforeEach(() => {
      closeFunction = jest.fn();
      subscriberFunction = jest.fn().mockImplementation(o => {
        observer = o;

        return closeFunction;
      });

      observable = new Observable(subscriberFunction);
      iterator = observableValues(observable);
    });

    describe('when iterator.next() is called', () => {
      let promise: Promise<IteratorResult<number>>;

      beforeEach(() => {
        promise = iterator.next();
      });

      test('should not have resolved', () => expect(Promise.race([promise, false])).resolves.toBe(false));

      describe('when observer.complete() is called', () => {
        beforeEach(() => observer.complete());

        test('iterator.next() should return done', () =>
          expect(promise).resolves.toEqual({ done: true, value: undefined }));
      });

      describe('when observer.error() is called', () => {
        beforeEach(() => observer.error(new Error('artificial')));

        test('iterator.next() should throw', () => expect(promise).rejects.toThrow('artificial'));
      });

      describe('when observer.next(1) is called', () => {
        beforeEach(() => observer.next(1));

        test('iterator.next() should return 1', () => expect(promise).resolves.toEqual({ value: 1 }));
      });
    });
  });

  describe('iterate all at once', () => {
    let iterator: AsyncIterableIterator<number>;
    let observable: Observable<number>;

    beforeEach(() => {
      observable = Observable.from([1, 2, 3]);
      iterator = observableValues(observable);
    });

    describe('when iterate', () => {
      let values: number[];

      beforeEach(async () => {
        values = [];

        for await (const value of iterator) {
          values.push(value);
        }
      });

      test('should return all values', () => expect(values).toEqual([1, 2, 3]));
    });
  });

  test('when for-loop break should unsubscribe', async () => {
    const closeFunction = jest.fn();
    const subscriberFunction: JestMockOf<SubscriberFunction<number>> = jest.fn();
    let observer: SubscriptionObserver<number> | undefined;

    subscriberFunction.mockImplementation(target => {
      observer = target;

      return closeFunction;
    });

    const observable = new Observable<number>(subscriberFunction);
    const values: number[] = [];

    const promise = (async function () {
      const iterator = observableValues<number>(observable);

      for await (const value of iterator) {
        values.push(value);

        if (value === 2) {
          break;
        }
      }
    })();

    expect(observer).not.toBeFalsy();

    if (!observer) {
      throw new Error();
    }

    observer.next(1);

    expect(closeFunction).not.toHaveBeenCalled();

    observer.next(2);

    await promise;

    expect(closeFunction).toHaveBeenCalledTimes(1);
    expect(values).toEqual([1, 2]);
  });
});
