export function readableStreamValues<T>(readable: ReadableStream<T>): AsyncIterableIterator<T> {
  const reader = readable.getReader();

  const iterable: AsyncIterableIterator<T> = {
    [Symbol.asyncIterator]() {
      return iterable;
    },
    async next(): Promise<IteratorResult<T>> {
      const result = await Promise.race([reader.read(), reader.closed]);

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
