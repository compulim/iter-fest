export function asyncIteratorToAsyncIterable<T>(asyncIterator: AsyncIterator<T>): AsyncIterableIterator<T> {
  const asyncIterableIterator: AsyncIterableIterator<T> = {
    [Symbol.asyncIterator]: () => asyncIterableIterator,
    next: asyncIterator.next.bind(asyncIterator),
    ...(asyncIterator.return ? { return: asyncIterator.return.bind(asyncIterator) } : {}),
    ...(asyncIterator.throw ? { throw: asyncIterator.throw.bind(asyncIterator) } : {})
  };

  return asyncIterableIterator;
}
