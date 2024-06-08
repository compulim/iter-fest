export function readerToAsyncIterableIterator<T>(reader: ReadableStreamDefaultReader<T>): AsyncIterableIterator<T> {
  const iterable = {
    [Symbol.asyncIterator]() {
      return iterable;
    },
    async next(): Promise<IteratorResult<T>> {
      const result = await Promise.race([reader.read(), reader.closed]);

      if (!result || result.done) {
        return { done: true, value: undefined };
      }

      return { value: result.value };
    }
  };

  return iterable;
}
