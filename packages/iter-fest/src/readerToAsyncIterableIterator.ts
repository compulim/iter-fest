export function readerToAsyncIterableIterator<T>(reader: ReadableStreamDefaultReader<T>): AsyncIterableIterator<T> {
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
      reader.cancel();

      return { done: true, value: undefined };
    },
    async throw() {
      reader.cancel();

      return { done: true, value: undefined };
    }
  };

  return iterable;
}
