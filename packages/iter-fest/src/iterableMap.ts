/**
 * Calls a defined callback function on each element of an array, and returns an array that contains the results.
 * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
 * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
 */
export function* iterableMap<T, U>(
  iterable: Iterable<T>,
  callbackfn: (value: T, index: number, array: Iterable<T>) => U,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thisArg?: any
): IterableIterator<U> {
  let index = 0;

  if (typeof callbackfn !== 'function') {
    throw new TypeError(`${callbackfn} is not a function`);
  }

  for (const value of iterable) {
    yield callbackfn.call(thisArg, value, index++, iterable);
  }
}
