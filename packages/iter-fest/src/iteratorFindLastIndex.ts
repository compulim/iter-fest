import { iteratorToIterable } from './iteratorToIterable.ts';

/**
 * Returns the index of the last element in the iterator where predicate is true, and -1
 * otherwise.
 *
 * @param predicate findLastIndex calls predicate once for each element of the iterator, in descending
 * order, until it finds one where predicate returns true. If such an element is found,
 * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
 *
 * @param thisArg If provided, it will be used as the this value for each invocation of
 * predicate. If it is not provided, undefined is used instead.
 */
export function iteratorFindLastIndex<T>(
  iterator: Iterator<T>,
  predicate: (value: T, index: number, iterator: Iterator<T>) => unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thisArg?: any
): number {
  let index = 0;
  let lastIndex: number = -1;

  if (typeof predicate !== 'function') {
    throw new TypeError(`${predicate} is not a function`);
  }

  const boundPredicate = predicate.bind(thisArg);

  for (const value of iteratorToIterable(iterator)) {
    if (boundPredicate(value, index, iterator)) {
      lastIndex = index;
    }

    index++;
  }

  return lastIndex;
}
