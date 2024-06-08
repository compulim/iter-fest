import { PushAsyncIterableIterator } from './PushAsyncIterableIterator';
import type { JestMockOf } from './private/JestMockOf';

describe('comprehensive', () => {
  let done: JestMockOf<() => void>;
  let iterable: PushAsyncIterableIterator<number>;
  let values: number[];

  beforeEach(() => {
    done = jest.fn();
    iterable = new PushAsyncIterableIterator();
    values = [];

    (async () => {
      for await (const value of iterable) {
        values.push(value);
      }

      done();
    })();
  });

  test('should receive no values', () => expect(values).toEqual([]));
  test('should not completed the for-loop', () => expect(done).not.toHaveBeenCalled());

  describe('when push(1) is called', () => {
    beforeEach(() => iterable.push(1));

    test('should receive a value', () => expect(values).toEqual([1]));

    describe('when push(2) is called', () => {
      beforeEach(() => iterable.push(2));

      test('should receive a value', () => expect(values).toEqual([1, 2]));
    });
  });

  describe('when close() is called', () => {
    beforeEach(() => iterable.close());

    test('should completed the for-loop', () => expect(done).toHaveBeenCalledTimes(1));
  });
});

test('push after close should close the iterable', async () => {
  const iterable = new PushAsyncIterableIterator();

  iterable.close();
  await expect(iterable.next()).resolves.toEqual({ done: true, value: undefined });

  iterable.push(1);
  await expect(iterable.next()).resolves.toEqual({ done: true, value: undefined });
});
