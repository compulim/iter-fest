/**
 * Combines two or more iterables.
 * This method returns a new iterable without modifying any existing iterables.
 *
 * @param items Additional iterables and/or items to add to the end of the iterable.
 */
export function iterableConcat<T>(iterable: Iterable<T>, ...items: Iterable<T>[]): IterableIterator<T>;

/**
 * Combines two or more iterables.
 * This method returns a new iterable without modifying any existing iterables.
 *
 * @param items Additional iterables and/or items to add to the end of the iterable.
 */
export function iterableConcat<T>(iterable: Iterable<T>, ...items: (T | Iterable<T>)[]): IterableIterator<T>;

export function* iterableConcat<T>(iterable: Iterable<T>, ...items: (T | Iterable<T>)[]): IterableIterator<T> {
  yield* iterable;

  for (const item of items) {
    if (item && typeof item === 'object' && Symbol.iterator in item) {
      yield* item;
    } else {
      yield item;
    }
  }
}
