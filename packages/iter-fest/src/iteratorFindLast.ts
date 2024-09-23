import { iteratorToIterable } from './iteratorToIterable.ts';

/**
 * Returns the value of the last element in the iterator where predicate is true, and undefined
 * otherwise.
 *
 * @param predicate findLast calls predicate once for each element of the iterator, in descending
 * order, until it finds one where predicate returns true. If such an element is found, findLast
 * immediately returns that element value. Otherwise, findLast returns undefined.
 *
 * @param thisArg If provided, it will be used as the this value for each invocation of
 * predicate. If it is not provided, undefined is used instead.
 */
export function iteratorFindLast<T, S extends T>(
  iterator: Iterator<T>,
  predicate: (value: T, index: number, iterator: Iterator<T>) => value is S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thisArg?: any
): S | undefined;

export function iteratorFindLast<T>(
  iterator: Iterator<T>,
  predicate: (value: T, index: number, iterator: Iterator<T>) => unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thisArg?: any
): T | undefined;

export function iteratorFindLast<T, S extends T>(
  iterator: Iterator<T>,
  predicate: (value: T, index: number, iterator: Iterator<T>) => unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thisArg?: any
): S | undefined {
  let index = 0;
  let last: S | undefined;

  if (typeof predicate !== 'function') {
    throw new TypeError(`${predicate} is not a function`);
  }

  const boundPredicate = predicate.bind(thisArg);

  for (const value of iteratorToIterable(iterator)) {
    if (boundPredicate(value, index++, iterator)) {
      last = value as S;
    }
  }

  return last;
}
