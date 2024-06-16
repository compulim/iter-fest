// @ts-expect-error core-js-pure is not typed.
import filter from 'core-js-pure/full/async-iterator/filter';

/**
 * Returns the elements of an iterator that meet the condition specified in a callback function.
 *
 * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the iterator.
 *
 * @link https://github.com/tc39/proposal-iterator-helpers/blob/main/README.md
 */
export function asyncIteratorFilter<T, S extends T>(
  asyncIterator: AsyncIterator<T>,
  predicate: (value: T, index: number) => value is S
): AsyncIterableIterator<S>;

/**
 * Returns the elements of an iterator that meet the condition specified in a callback function.
 *
 * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the iterator.
 *
 * @link https://github.com/tc39/proposal-iterator-helpers/blob/main/README.md
 */
export function asyncIteratorFilter<T>(
  asyncIterator: AsyncIterator<T>,
  predicate: (value: T, index: number) => unknown
): AsyncIterableIterator<T>;

export function asyncIteratorFilter<T, S extends T>(
  asyncIterator: AsyncIterator<T>,
  predicate: (value: T, index: number) => unknown
): AsyncIterableIterator<S> {
  return filter(asyncIterator, predicate);
}
