import {
  Observable,
  type CompleteFunction,
  type ErrorFunction,
  type NextFunction,
  type Observer,
  type StartFunction,
  type SubscriberFunction,
  type Subscription
} from './Observable.ts';
import { SymbolObservable } from './SymbolObservable.ts';
import type { JestMockOf } from './private/JestMockOf.js';

describe('comprehensive', () => {
  let complete: JestMockOf<CompleteFunction>;
  let error: JestMockOf<ErrorFunction>;
  let next: JestMockOf<NextFunction<number>>;
  let observable: Observable<number>;
  let start: JestMockOf<StartFunction>;
  let subscriberFunction: JestMockOf<SubscriberFunction<number>>;
  let closeSubscription: JestMockOf<() => void>;

  beforeEach(() => {
    closeSubscription = jest.fn();
    complete = jest.fn();
    error = jest.fn();
    next = jest.fn();
    start = jest.fn();
    subscriberFunction = jest.fn();
    subscriberFunction.mockImplementation(() => closeSubscription);

    observable = new Observable<number>(subscriberFunction);
  });

  describe.each([['interface' as const], ['functions' as const]])('subscribe via %s', type => {
    let subscription: Subscription;

    beforeEach(() => {
      if (type === 'functions') {
        subscription = observable.subscribe(next, error, complete);
      } else if (type === 'interface') {
        subscription = observable.subscribe({ complete, error, next, start } satisfies Observer<number>);
      }
    });

    if (type === 'interface') {
      test('start() should be called once', () => expect(start).toHaveBeenCalledTimes(1));
    }

    test('Symbol.observable should return self', () => expect(observable[SymbolObservable]()).toBe(observable));

    test('closeSubscription() should not be called', () => expect(closeSubscription).not.toHaveBeenCalled());
    test('subscriberFunction() should be called once', () => expect(subscriberFunction).toHaveBeenCalledTimes(1));
    test('subscription.closed should return false', () => expect(subscription).toHaveProperty('closed', false));

    describe('when subscription.unsubscribe() is called', () => {
      beforeEach(() => subscription.unsubscribe());

      test('closeSubscription() should be called once', () => expect(closeSubscription).toHaveBeenCalledTimes(1));
    });

    describe('when SubscriberFunction.complete() is called', () => {
      beforeEach(() => subscriberFunction.mock.calls[0]?.[0].complete());

      test('closeSubscription() should be called once', () => expect(closeSubscription).toHaveBeenCalledTimes(1));
      test('should call Observer.complete() once', () => expect(complete).toHaveBeenCalledTimes(1));
    });

    describe("when SubscriberFunction.error('artificial') is called", () => {
      beforeEach(() => subscriberFunction.mock.calls[0]?.[0].error('artificial'));

      describe('should call Observer.error(k)', () => {
        test('once', () => expect(error).toHaveBeenCalledTimes(1));
        test('with value "artificial"', () => expect(error).toHaveBeenNthCalledWith(1, 'artificial'));
      });
    });

    describe('when SubscriberFunction.next(1) is called', () => {
      beforeEach(() => subscriberFunction.mock.calls[0]?.[0].next(1));

      describe('should call Observer.next()', () => {
        test('once', () => expect(next).toHaveBeenCalledTimes(1));
        test('with value 1', () => expect(next).toHaveBeenNthCalledWith(1, 1));
      });
    });
  });

  describe('when call close() in SubscriberFunction immediately', () => {
    test('should call start() before complete()', () => {
      subscriberFunction.mockImplementation(({ complete }) => {
        expect(start).toHaveBeenCalledTimes(1);
        expect(complete).not.toHaveBeenCalled();

        complete();

        expect(complete).toHaveBeenCalledTimes(1);
        expect(complete).toHaveBeenNthCalledWith(1);

        return () => {};
      });

      observable.subscribe({ complete, error, next, start } satisfies Observer<number>);
    });
  });

  describe('when call next(1) in SubscriberFunction immediately', () => {
    test('should call start() before next()', () => {
      subscriberFunction.mockImplementation(({ next }) => {
        expect(start).toHaveBeenCalledTimes(1);
        expect(next).not.toHaveBeenCalled();

        next(1);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenNthCalledWith(1, 1);

        return () => {};
      });

      observable.subscribe({ complete, error, next, start } satisfies Observer<number>);
    });
  });

  describe('when throw in SubscribeFunction immediately', () => {
    beforeEach(() => {
      subscriberFunction.mockImplementation(() => {
        expect(start).toHaveBeenCalledTimes(1);
        expect(error).not.toHaveBeenCalled();

        throw new Error('artificial');
      });

      observable.subscribe({ complete, error, next, start } satisfies Observer<number>);
    });

    describe('should call error()', () => {
      test('once', () => expect(error).toHaveBeenCalledTimes(1));
      test('with the error', () =>
        expect(() => {
          throw error.mock.calls[0]?.[0];
        }).toThrow('artificial'));
    });
  });
});
