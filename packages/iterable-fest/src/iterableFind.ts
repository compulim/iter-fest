/**
 * Returns the value of the first element in the iterable where predicate is true, and undefined
 * otherwise.
 *
 * @param predicate find calls predicate once for each element of the iterable, in ascending
 * order, until it finds one where predicate returns true. If such an element is found, find
 * immediately returns that element value. Otherwise, find returns undefined.
 *
 * @param thisArg If provided, it will be used as the this value for each invocation of
 * predicate. If it is not provided, undefined is used instead.
 */
export function iterableFind<T, S extends T>(
  iterable: Iterable<T>,
  predicate: (value: T, index: number, obj: Iterable<T>) => value is S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thisArg?: any
): S | undefined;

export function iterableFind<T>(
  iterable: Iterable<T>,
  predicate: (value: T, index: number, obj: Iterable<T>) => unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thisArg?: any
): T | undefined;

export function iterableFind<T, S extends T>(
  iterable: Iterable<T>,
  predicate: (value: T, index: number, obj: Iterable<T>) => unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thisArg?: any
): S | undefined {
  let index = 0;

  if (typeof predicate !== 'function') {
    throw new TypeError(`${predicate} is not a function`);
  }

  const boundPredicate = predicate.bind(thisArg);

  for (const value of iterable) {
    if (boundPredicate(value, index++, iterable)) {
      return value as S;
    }
  }

  return undefined;
}
