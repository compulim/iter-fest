// @ts-expect-error core-js-pure is not typed.
import flatMap from 'core-js-pure/full/async-iterator/flat-map.js';

/**
 * `.flatMap` takes a mapping function as an argument. It returns an iterator that produces all elements of the iterators produced by applying the mapping function to the elements produced by the underlying iterator.
 *
 * @param mapperFn
 *
 * @return Returns an iterator of flat values.
 *
 * @link https://github.com/tc39/proposal-iterator-helpers/blob/main/README.md
 */
export function asyncIteratorFlatMap<T, U>(
  asyncIterator: AsyncIterator<T>,
  mapperFn: (value: T, index: number) => Promise<U>
): AsyncIterator<T> {
  return flatMap(asyncIterator, mapperFn);
}
