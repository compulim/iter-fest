// @ts-expect-error core-js-pure is not typed.
import map from 'core-js-pure/full/iterator/map';

/**
 * Calls a defined callback function on each element of an array, and returns an array that contains the results.
 *
 * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
 *
 * @link https://github.com/tc39/proposal-iterator-helpers/blob/main/README.md
 */
export function iteratorMap<T, U>(
  iterator: Iterator<T>,
  callbackfn: (value: T, index: number) => U
): IterableIterator<U> {
  return map(iterator, callbackfn);
}
