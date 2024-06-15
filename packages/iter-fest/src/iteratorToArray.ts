// @ts-expect-error core-js-pure is not typed.
import toArray from 'core-js-pure/full/iterator/to-array';

type IteratorLike<T> = Pick<Iterator<T>, 'next'>;

/**
 * When you have a non-infinite iterator which you wish to transform into an array, you can do so with the builtin toArray method.
 *
 * @param limit
 *
 * @return Returns an Array containing the values from the iterator.
 *
 * @link https://github.com/tc39/proposal-iterator-helpers/blob/main/README.md
 */
export function iteratorToArray<T>(iteratorLike: IteratorLike<T>): T[] {
  return toArray(iteratorLike);
}
