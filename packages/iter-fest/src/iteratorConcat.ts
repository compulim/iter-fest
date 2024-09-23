import { iteratorToIterable } from './iteratorToIterable.ts';

function isIterator<T>(value: unknown): value is Iterator<T> {
  return !!value && typeof value === 'object' && Symbol.iterator in value;
}

/**
 * Combines two or more iterators.
 * This method returns a new iterator without modifying any existing iterators.
 *
 * @param items Additional iterators and/or items to add to the end of the iterator.
 */
export function iteratorConcat<T>(iterator: Iterator<T>, ...items: Iterator<T>[]): IterableIterator<T>;

/**
 * Combines two or more iterators.
 * This method returns a new iterator without modifying any existing iterators.
 *
 * @param items Additional iterators and/or items to add to the end of the iterator.
 */
export function iteratorConcat<T>(iterator: Iterator<T>, ...items: (T | Iterator<T>)[]): IterableIterator<T>;

export function* iteratorConcat<T>(iterator: Iterator<T>, ...items: (T | Iterator<T>)[]): IterableIterator<T> {
  yield* iteratorToIterable(iterator);

  for (const item of items) {
    if (isIterator(item)) {
      yield* iteratorToIterable(item);
    } else {
      yield item;
    }
  }
}
