// @ts-expect-error core-js-pure is not typed.
import find from 'core-js-pure/full/async-iterator/find';

/**
 * Returns the value of the first element in the iterator where predicate is true, and undefined
 * otherwise.
 *
 * @param predicate find calls predicate once for each element of the iterator, in ascending
 * order, until it finds one where predicate returns true. If such an element is found, find
 * immediately returns that element value. Otherwise, find returns undefined.
 *
 * @link https://github.com/tc39/proposal-iterator-helpers/blob/main/README.md
 */
export function asyncIteratorFind<T, S extends T>(
  asyncIterator: AsyncIterator<T>,
  predicate: (value: T, index: number) => Promise<boolean>
): Promise<S | undefined>;

export function asyncIteratorFind<T>(
  asyncIterator: AsyncIterator<T>,
  predicate: (value: T, index: number) => Promise<unknown>
): Promise<T | undefined>;

export function asyncIteratorFind<T, S extends T>(
  asyncIterator: AsyncIterator<T>,
  predicate: (value: T, index: number) => Promise<unknown>
): Promise<S | undefined> {
  return find(asyncIterator, predicate);
}
