/**
 * Determines whether all the members of an iterable satisfy the specified test.
 *
 * @param predicate A function that accepts up to three arguments. The every method calls
 * the predicate function for each element in the iterable until the predicate returns a value
 * which is coercible to the Boolean value false, or until the end of the iterable.
 *
 * @param thisArg An object to which the this keyword can refer in the predicate function.
 * If thisArg is omitted, undefined is used as the this value.
 */
export function iterableEvery<T, S extends T>(
  iterable: Iterable<T>,
  predicate: (value: T, index: number, iterable: Iterable<T>) => value is S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thisArg?: any
): iterable is S[];

/**
 * Determines whether all the members of an iterable satisfy the specified test.
 *
 * @param predicate A function that accepts up to three arguments. The every method calls
 * the predicate function for each element in the iterable until the predicate returns a value
 * which is coercible to the Boolean value false, or until the end of the iterable.
 *
 * @param thisArg An object to which the this keyword can refer in the predicate function.
 * If thisArg is omitted, undefined is used as the this value.
 */
export function iterableEvery<T>(
  iterable: Iterable<T>,
  predicate: (value: T, index: number, iterable: Iterable<T>) => unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thisArg?: any
): boolean;

export function iterableEvery<T>(
  iterable: Iterable<T>,
  predicate: (value: T, index: number, iterable: Iterable<T>) => unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thisArg: any = undefined
): boolean {
  let index = 0;

  if (typeof predicate !== 'function') {
    throw new TypeError(`${predicate} is not a function`);
  }

  const boundPredicate = predicate.bind(thisArg);

  for (const value of iterable) {
    if (!boundPredicate(value, index++, iterable)) {
      return false;
    }
  }

  return true;
}
