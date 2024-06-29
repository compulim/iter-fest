// @ts-expect-error core-js-pure is not typed.
import find from 'core-js-pure/full/iterator/find.js';

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
export function iteratorFind<T, S extends T>(
  iterator: Iterator<T>,
  predicate: (value: T, index: number) => value is S
): S | undefined;

export function iteratorFind<T>(iterator: Iterator<T>, predicate: (value: T, index: number) => unknown): T | undefined;

export function iteratorFind<T, S extends T>(
  iterator: Iterator<T>,
  predicate: (value: T, index: number) => unknown
): S | undefined {
  return find(iterator, predicate);
}
