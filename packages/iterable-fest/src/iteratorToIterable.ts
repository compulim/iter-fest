export function iteratorToIterable<T>(iterator: Iterator<T>): IterableIterator<T> {
  const iterableIterator: IterableIterator<T> = {
    [Symbol.iterator]: () => iterableIterator,
    next: iterator.next.bind(iterator),
    ...(iterator.return ? { return: iterator.return.bind(iterator) } : {}),
    ...(iterator.throw ? { throw: iterator.throw.bind(iterator) } : {})
  };

  return iterableIterator;
}
