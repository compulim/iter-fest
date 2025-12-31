import { expect } from 'expect';
import { beforeEach, describe, test } from 'node:test';
import hasResolvedOrRejected from './hasResolvedOrRejected.ts';

describe('when resolved', () => {
  let hasResolvedOrRejectedPromise: Promise<boolean>;
  let promise: Promise<number>;

  beforeEach(() => {
    promise = Promise.resolve(1);

    hasResolvedOrRejectedPromise = hasResolvedOrRejected(promise);
  });

  test('should return true', () => expect(hasResolvedOrRejectedPromise).resolves.toBe(true));
});

describe('when not resolved', () => {
  let hasResolvedOrRejectedPromise: Promise<boolean>;
  let promise: Promise<number>;

  beforeEach(() => {
    promise = new Promise(() => {});

    hasResolvedOrRejectedPromise = hasResolvedOrRejected(promise);
  });

  test('should return false', () => expect(hasResolvedOrRejectedPromise).resolves.toBe(false));
});

describe('when rejected', () => {
  let hasResolvedOrRejectedPromise: Promise<boolean>;
  let promise: Promise<number>;

  beforeEach(() => {
    promise = Promise.reject(new Error('Something went wrong'));

    hasResolvedOrRejectedPromise = hasResolvedOrRejected(promise);
  });

  test('should reject', () => expect(hasResolvedOrRejectedPromise).rejects.toThrow('Something went wrong'));
});
