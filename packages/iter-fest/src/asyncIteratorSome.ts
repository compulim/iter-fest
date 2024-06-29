// @ts-expect-error core-js-pure is not typed.
import some from 'core-js-pure/full/async-iterator/some.js';

/**
 * Determines whether the specified callback function returns true for any element of an iterable.
 *
 * @param predicate A function that accepts up to three arguments. The some method calls the predicate function for each element in the iterable until the predicate returns a value which is coercible to the Boolean value true, or until the end of the iterable.
 *
 * @link https://github.com/tc39/proposal-iterator-helpers/blob/main/README.md
 */
export function asyncIteratorSome<T>(
  asyncIterator: AsyncIterator<T>,
  predicate: (value: T, index: number) => Promise<unknown>
): Promise<boolean> {
  return some(asyncIterator, predicate);
}
