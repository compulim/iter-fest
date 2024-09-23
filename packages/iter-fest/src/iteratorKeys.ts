import { iteratorToIterable } from './iteratorToIterable.ts';

/**
 * Returns an iterator of keys in the iterator
 */
export function* iteratorKeys<T>(iterator: Iterator<T>): IterableIterator<number> {
  let index = 0;

  for (const _ of iteratorToIterable(iterator)) {
    yield index++;
  }
}
