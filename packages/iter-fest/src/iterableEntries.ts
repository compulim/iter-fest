/**
 * Returns an iterable of key, value pairs for every entry in the iterable
 */
export function* iterableEntries<T>(iterable: Iterable<T>): IterableIterator<[number, T]> {
  let index = 0;

  for (const value of iterable) {
    yield [index++, value];
  }
}
