// @ts-expect-error core-js-pure is not typed.
import filter from 'core-js-pure/full/iterator/filter.js';

/**
 * Returns the elements of an iterator that meet the condition specified in a callback function.
 *
 * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the iterator.
 *
 * @link https://github.com/tc39/proposal-iterator-helpers/blob/main/README.md
 */
export function iteratorFilter<T, S extends T>(
  iterator: Iterator<T>,
  predicate: (value: T, index: number) => value is S
): IterableIterator<S>;

/**
 * Returns the elements of an iterator that meet the condition specified in a callback function.
 *
 * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the iterator.
 *
 * @link https://github.com/tc39/proposal-iterator-helpers/blob/main/README.md
 */
export function iteratorFilter<T>(
  iterator: Iterator<T>,
  predicate: (value: T, index: number) => unknown
): IterableIterator<T>;

export function iteratorFilter<T, S extends T>(
  iterator: Iterator<T>,
  predicate: (value: T, index: number) => unknown
): IterableIterator<S> {
  return filter(iterator, predicate);
}
