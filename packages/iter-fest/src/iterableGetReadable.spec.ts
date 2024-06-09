import { iterableGetReadable } from './iterableGetReadable';
import type { JestMockOf } from './private/JestMockOf';
import hasResolved from './private/hasResolved';
import withResolvers from './private/withResolvers';

describe.each(['AsyncIterator' as const, 'Iterator' as const])('with %s', type => {
  let next: JestMockOf<() => unknown>;
  let readable: ReadableStream;
  let reader: ReadableStreamDefaultReader;

  beforeEach(() => {
    if (type === 'AsyncIterator') {
      const iterator: AsyncIterator<number> = {
        next: jest
          .fn()
          .mockImplementationOnce(() => Promise.resolve({ value: 1 }))
          .mockImplementationOnce(() => Promise.resolve({ done: true, value: undefined }))
      };

      next = iterator.next as JestMockOf<() => unknown>;

      readable = iterableGetReadable({
        [Symbol.asyncIterator]() {
          return iterator;
        }
      });
    } else {
      const iterator: Iterator<number> = {
        next: jest
          .fn()
          .mockImplementationOnce(() => ({ value: 1 }))
          .mockImplementationOnce(() => ({ done: true, value: undefined }))
      };

      next = iterator.next as JestMockOf<() => unknown>;

      readable = iterableGetReadable({
        [Symbol.iterator]() {
          return iterator;
        }
      });
    }

    reader = readable.getReader();
  });

  test('should have been called next() once', () => expect(next).toHaveBeenCalledTimes(1));

  describe('when call read()', () => {
    let readPromise: Promise<ReadableStreamReadResult<number>>;

    beforeEach(() => {
      readPromise = reader.read();
    });

    test('should read value 1', () => expect(readPromise).resolves.toEqual({ done: false, value: 1 }));
    test('should have been called next() twice', () => expect(next).toHaveBeenCalledTimes(2));

    describe('when call read() again', () => {
      let readPromise: Promise<ReadableStreamReadResult<number>>;

      beforeEach(() => {
        readPromise = reader.read();
      });

      test('should read value done', () => expect(readPromise).resolves.toEqual({ done: true, value: undefined }));
      test('should have been called next() twice', () => expect(next).toHaveBeenCalledTimes(2));
    });
  });
});

describe('comprehensive', () => {
  let next: JestMockOf<() => Promise<IteratorResult<number>>>;
  let readable: ReadableStream;
  let reader: ReadableStreamDefaultReader;
  let deferreds: PromiseWithResolvers<IteratorResult<number>>[];

  beforeEach(() => {
    deferreds = [];

    const iterator: AsyncIterator<number> = {
      next: jest.fn().mockImplementation(() => {
        const deferred = withResolvers<IteratorResult<number>>();

        deferreds.push(deferred);

        return deferred.promise;
      })
    };

    next = iterator.next as JestMockOf<() => Promise<IteratorResult<number>>>;

    readable = iterableGetReadable({
      [Symbol.asyncIterator]() {
        return iterator;
      }
    });

    reader = readable.getReader();
  });

  describe('when read() is called', () => {
    let readPromise: Promise<ReadableStreamReadResult<number>>;

    beforeEach(() => {
      readPromise = reader.read();
    });

    test('next() should have been called once', () => expect(next).toHaveBeenCalledTimes(1));
    test('read() should not have been resolved', () => expect(hasResolved(readPromise)).resolves.toBe(false));

    describe('when next() is resolved with 1', () => {
      beforeEach(() => deferreds[0]?.resolve({ value: 1 }));

      test('read() should have been resolved to 1', () =>
        expect(readPromise).resolves.toEqual({ done: false, value: 1 }));
      test('next() should have been called twice', () => expect(next).toHaveBeenCalledTimes(2));

      describe('when read() is called again', () => {
        let readPromise: Promise<ReadableStreamReadResult<number>>;

        beforeEach(() => {
          readPromise = reader.read();
        });

        test('next() should have been called twice', () => expect(next).toHaveBeenCalledTimes(2));
        test('read() should not have been resolved', () => expect(hasResolved(readPromise)).resolves.toBe(false));

        describe('when next() is resolved with done', () => {
          beforeEach(() => deferreds[1]?.resolve({ done: true, value: undefined }));

          test('read() should have been resolved to done', () =>
            expect(readPromise).resolves.toEqual({ done: true, value: undefined }));
          test('next() should have been called twice', () => expect(next).toHaveBeenCalledTimes(2));
        });
      });
    });
  });
});
