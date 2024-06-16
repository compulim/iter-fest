// @ts-expect-error core-js-pure is not typed.
import toAsync from 'core-js-pure/full/iterator/to-async';

/**
 * Converts an iterator into async iterator.
 *
 * @return Returns an async iterator.
 *
 * @link https://github.com/tc39/proposal-async-iterator-helpers/blob/main/README.md
 */
export function iteratorToAsync<T>(iterator: Iterator<T>): AsyncIterator<T> {
  return toAsync(iterator);
}
