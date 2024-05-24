/**
 * Returns the elements of an iterable that meet the condition specified in a callback function.
 *
 * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the iterable.
 * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
 */
export function iterableFilter<T, S extends T>(
  iterable: Iterable<T>,
  predicate: (value: T, index: number, iterable: Iterable<T>) => value is S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thisArg?: unknown
): IterableIterator<S>;

/**
 * Returns the elements of an iterable that meet the condition specified in a callback function.
 *
 * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the iterable.
 * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
 */
export function iterableFilter<T>(
  iterable: Iterable<T>,
  predicate: (value: T, index: number, iterable: Iterable<T>) => unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thisArg?: any
): IterableIterator<T>;

export function* iterableFilter<T, S extends T>(
  iterable: Iterable<T>,
  predicate: (value: T, index: number, iterable: Iterable<T>) => unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thisArg?: unknown
): IterableIterator<S> {
  let index = 0;

  if (typeof predicate !== 'function') {
    throw new TypeError(`${predicate} is not a function`);
  }

  const boundPredicate = predicate.bind(thisArg);

  for (const value of iterable) {
    if (boundPredicate(value, index++, iterable)) {
      yield value as S;
    }
  }
}
