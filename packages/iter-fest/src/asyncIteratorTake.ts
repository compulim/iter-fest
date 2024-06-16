// @ts-expect-error core-js-pure is not typed.
import take from 'core-js-pure/full/async-iterator/take';

/**
 * `take` takes an integer as an argument. It returns an iterator that produces, at most, the given number of elements produced by the underlying iterator.
 *
 * @param limit
 *
 * @return Returns an iterator with items from the original iterator from 0 until the limit.
 *
 * @link https://github.com/tc39/proposal-iterator-helpers/blob/main/README.md
 */
export function asyncIteratorTake<T>(asyncIterator: AsyncIterator<T>, limit: number): AsyncIterator<T> {
  return take(asyncIterator, limit);
}
