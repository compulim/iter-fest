import abortSignalAsRejectedPromise from './private/abortSignalAsRejectedPromise';

type Init = {
  signal?: AbortSignal | undefined;
};

export function readableStreamValues<T>(
  readable: ReadableStream<T>,
  init?: Init | undefined
): AsyncIterableIterator<T> {
  const reader = readable.getReader();

  const iterable: AsyncIterableIterator<T> = {
    [Symbol.asyncIterator]() {
      return iterable;
    },
    async next(): Promise<IteratorResult<T>> {
      const abortPromise = init?.signal && abortSignalAsRejectedPromise(init.signal);
      let result: ReadableStreamReadResult<T> | void;

      try {
        result = await Promise.race([reader.read(), reader.closed, ...(abortPromise ? [abortPromise] : [])]);
      } catch (error) {
        reader.releaseLock();

        throw error;
      }

      if (!result || result.done) {
        return { done: true, value: undefined };
      }

      return { value: result.value };
    },
    async return() {
      // Break/throw inside for-loop will trigger return().
      reader.releaseLock();

      return { done: true, value: undefined };
    }
  };

  return iterable;
}
