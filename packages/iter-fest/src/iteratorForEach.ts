// @ts-expect-error core-js-pure is not typed.
import forEach from 'core-js-pure/full/iterator/for-each.js';

/**
 * Performs the specified action for each element in an iterator.
 *
 * @param callbackfn A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the iterator.
 *
 * @link https://github.com/tc39/proposal-iterator-helpers/blob/main/README.md
 */
export function iteratorForEach<T>(iterator: Iterator<T>, callbackfn: (value: T, index: number) => void): void {
  forEach(iterator, callbackfn);
}
