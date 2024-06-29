// @ts-expect-error core-js-pure is not typed.
import map from 'core-js-pure/full/async-iterator/map.js';

/**
 * Calls a defined callback function on each element of an array, and returns an array that contains the results.
 *
 * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
 *
 * @link https://github.com/tc39/proposal-iterator-helpers/blob/main/README.md
 */
export function asyncIteratorMap<T, U>(
  asyncIterator: AsyncIterator<T>,
  callbackfn: (value: T, index: number) => U
): AsyncIterableIterator<U> {
  return map(asyncIterator, callbackfn);
}
