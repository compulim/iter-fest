import { iteratorToIterable } from './iteratorToIterable';

/**
 * Returns an iterator of key, value pairs for every entry in the iterator
 */
export function* iteratorEntries<T>(iterator: Iterator<T>): IterableIterator<[number, T]> {
  let index = 0;

  for (const value of iteratorToIterable(iterator)) {
    yield [index++, value];
  }
}
