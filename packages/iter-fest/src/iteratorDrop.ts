// @ts-expect-error core-js-pure is not typed.
import drop from 'core-js-pure/full/iterator/drop.js';

/**
 * `drop` takes an integer as an argument. It skips the given number of elements produced by the underlying iterator before itself producing any remaining elements.
 *
 * @param limit
 *
 * @return Returns an iterator of items after the limit.
 *
 * @link https://github.com/tc39/proposal-iterator-helpers/blob/main/README.md
 */
export function iteratorDrop<T>(iterator: Iterator<T>, limit: number): Iterator<T> {
  return drop(iterator, limit);
}
