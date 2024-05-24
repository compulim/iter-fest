/**
 * Returns an iterable of keys in the iterable
 */
export function* iterableKeys<T>(iterable: Iterable<T>): IterableIterator<number> {
  let index = 0;

  for (const _ of iterable) {
    yield index++;
  }
}
