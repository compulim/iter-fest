import {
  Observable,
  type CompleteFunction,
  type ErrorFunction,
  type NextFunction,
  type Observer,
  type StartFunction,
  type Subscription
} from './Observable.ts';
import type { JestMockOf } from './private/JestMockOf.js';

describe('comprehensive', () => {
  let complete: JestMockOf<CompleteFunction>;
  let error: JestMockOf<ErrorFunction>;
  let next: JestMockOf<NextFunction<number>>;
  let start: JestMockOf<StartFunction>;

  beforeEach(() => {
    complete = jest.fn();
    error = jest.fn();
    next = jest.fn();
    start = jest.fn();
  });

  describe.each([['from' as const], ['of' as const]])('Observable.%s()', type => {
    let observable: Observable<number>;

    beforeEach(() => {
      if (type === 'from') {
        observable = Observable.from<number>([1, 2, 3].values());
      } else if (type === 'of') {
        observable = Observable.of<number>(1, 2, 3);
      }
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

      test('subscription.closed should be true', () => expect(subscription).toHaveProperty('closed', true));

      describe('next() should been called', () => {
        test('3 times', () => expect(next).toHaveBeenCalledTimes(3));
        test('with values', () => {
          expect(next).toHaveBeenNthCalledWith(1, 1);
          expect(next).toHaveBeenNthCalledWith(2, 2);
          expect(next).toHaveBeenNthCalledWith(3, 3);
        });
      });

      test('complete() should have been called once', () => expect(complete).toHaveBeenCalledTimes(1));
    });
  });
});
