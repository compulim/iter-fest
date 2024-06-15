import { IterableWritableStream } from './iterableWritableStream';
import type { JestMockOf } from './private/JestMockOf';

describe('comprehensive', () => {
  let done: JestMockOf<() => void>;
  let values: number[];
  let writer: WritableStreamDefaultWriter<number>;

  beforeEach(() => {
    done = jest.fn();

    const iterable = new IterableWritableStream<number>();

    writer = iterable.getWriter();
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
    beforeEach(() => writer.write(1));

    test('should receive a value', () => expect(values).toEqual([1]));

    describe('when push(2) is called', () => {
      beforeEach(() => writer.write(2));

      test('should receive a value', () => expect(values).toEqual([1, 2]));
    });
  });

  describe('when close() is called', () => {
    beforeEach(() => writer.close());

    test('should completed the for-loop', () => expect(done).toHaveBeenCalledTimes(1));
  });
});

test('two serial iterations should continue where it left', async () => {
  const iterable = new IterableWritableStream<number>();
  const writer = iterable.getWriter();
  const getValuesUntil = async (until?: number | undefined) => {
    const values: number[] = [];

    for await (const value of iterable) {
      values.push(value);

      if (typeof until !== 'undefined' && value === until) {
        break;
      }
    }

    return values;
  };

  const promise1 = getValuesUntil(2);

  writer.write(1);
  writer.write(2);
  writer.write(3);
  writer.write(4);
  writer.close();

  await expect(promise1).resolves.toEqual([1, 2]);

  // Make sure there are enough time to idle before the next consumer begin.
  await undefined;

  const promise2 = getValuesUntil();

  await expect(promise2).resolves.toEqual([3, 4]);
});

test('two parallel iterations should round robin', async () => {
  const iterable = new IterableWritableStream<number>();
  const writer = iterable.getWriter();
  const getValues = async () => {
    const values: number[] = [];

    for await (const value of iterable) {
      values.push(value);

      if (value === 3) {
        break;
      }
    }

    return values;
  };

  const promise1 = getValues();
  const promise2 = getValues();

  writer.write(1);
  writer.write(2);
  writer.write(3);
  writer.write(4);
  writer.write(5);
  writer.close();

  await expect(promise1).resolves.toEqual([1, 3]);
  await expect(promise2).resolves.toEqual([2, 4, 5]);
});
