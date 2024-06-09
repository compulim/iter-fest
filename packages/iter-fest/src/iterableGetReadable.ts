function isIterable(iterable: unknown): iterable is Iterable<unknown> {
  return !!(iterable && typeof iterable === 'object' && Symbol.iterator in iterable);
}

export function iterableGetReadable<T>(iterable: AsyncIterable<T> | Iterable<T>): ReadableStream<T> {
  const iterator = isIterable(iterable) ? iterable[Symbol.iterator]() : iterable[Symbol.asyncIterator]();

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
