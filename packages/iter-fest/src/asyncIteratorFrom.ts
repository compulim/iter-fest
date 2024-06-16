// @ts-expect-error core-js-pure is not typed.
import from from 'core-js-pure/full/async-iterator/from';

/**
 * `.from` is a static method (unlike the others listed above) which takes an object as an argument. This method allows wrapping "iterator-like" objects with an iterator.
 *
 * @return Returns the object if it is already an iterator, returns a wrapping iterator if the passed object implements a callable @@iterator property.
 *
 * @link https://github.com/tc39/proposal-iterator-helpers/blob/main/README.md
 */
export function asyncIteratorFrom<T>(asyncIteratorLike: Pick<AsyncIterator<T>, 'next'>): AsyncIterator<T> {
  return from(asyncIteratorLike);
}
