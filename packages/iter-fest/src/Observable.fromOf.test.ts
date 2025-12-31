import { expect } from 'expect';
import { fn, type Mock } from 'jest-mock';
import { beforeEach, describe, test } from 'node:test';
import {
  Observable,
  type CompleteFunction,
  type ErrorFunction,
  type NextFunction,
  type Observer,
  type StartFunction,
  type Subscription
} from './Observable.ts';
import { describeEach } from './private/describeEach.ts';

describe('comprehensive', () => {
  let complete: Mock<CompleteFunction>;
  let error: Mock<ErrorFunction>;
  let next: Mock<NextFunction<number>>;
  let start: Mock<StartFunction>;

  beforeEach(() => {
    complete = fn();
    error = fn();
    next = fn();
    start = fn();
  });

  describeEach([['from' as const], ['of' as const]])('Observable.%s()', type => {
    let observable: Observable<number>;

    beforeEach(() => {
      if (type === 'from') {
        observable = Observable.from<number>([1, 2, 3].values());
      } else if (type === 'of') {
        observable = Observable.of<number>(1, 2, 3);
      }
    });

    describeEach([['interface' as const], ['functions' as const]])('subscribe via %s', type => {
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
