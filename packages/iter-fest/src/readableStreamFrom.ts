function isIterable(iterable: unknown): iterable is Iterable<unknown> {
  return !!(iterable && typeof iterable === 'object' && Symbol.iterator in iterable);
}

export function readableStreamFrom<T>(anyIterable: AsyncIterable<T> | Iterable<T>): ReadableStream<T> {
  const iterator = isIterable(anyIterable) ? anyIterable[Symbol.iterator]() : anyIterable[Symbol.asyncIterator]();

  return new ReadableStream({
    async pull(controller) {
      const result = await iterator.next();

      if (result.done) {
        controller.close();
      } else {
        controller.enqueue(result.value);
      }
    }
  });
}
