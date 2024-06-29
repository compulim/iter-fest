// @ts-expect-error core-js-pure is not typed.
import toArray from 'core-js-pure/full/iterator/to-array.js';

/**
 * When you have a non-infinite iterator which you wish to transform into an array, you can do so with the builtin toArray method.
 *
 * @return Returns an Array containing the values from the iterator.
 *
 * @link https://github.com/tc39/proposal-iterator-helpers/blob/main/README.md
 */
export function iteratorToArray<T>(iteratorLike: Pick<Iterator<T>, 'next'>): T[] {
  return toArray(iteratorLike);
}
