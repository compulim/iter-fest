/**
 * Determines whether the specified callback function returns true for any element of an iterable.
 *
 * @param predicate
 * A function that accepts up to three arguments. The some method calls the predicate function for each element in the iterable until the predicate returns a value which is coercible to the Boolean value true, or until the end of the iterable.
 *
 * @param thisArg
 * An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
 */
export function iterableSome<T>(
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
    if (boundPredicate(value, index++, iterable)) {
      return true;
    }
  }

  return false;
}
