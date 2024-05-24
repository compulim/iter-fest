/**
 * Returns the index of the last element in the iterable where predicate is true, and -1
 * otherwise.
 *
 * @param predicate findLastIndex calls predicate once for each element of the iterable, in descending
 * order, until it finds one where predicate returns true. If such an element is found,
 * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
 *
 * @param thisArg If provided, it will be used as the this value for each invocation of
 * predicate. If it is not provided, undefined is used instead.
 */
export function iterableFindLastIndex<T>(
  iterable: Iterable<T>,
  predicate: (value: T, index: number, iterable: Iterable<T>) => unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thisArg?: any
): number {
  let index = 0;
  let lastIndex: number = -1;

  if (typeof predicate !== 'function') {
    throw new TypeError(`${predicate} is not a function`);
  }

  const boundPredicate = predicate.bind(thisArg);

  for (const value of iterable) {
    if (boundPredicate(value, index, iterable)) {
      lastIndex = index;
    }

    index++;
  }

  return lastIndex;
}
