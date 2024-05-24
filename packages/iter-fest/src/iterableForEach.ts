/**
 * Performs the specified action for each element in an iterable.
 *
 * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the iterable.
 *
 * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
 */
export function iterableForEach<T>(
  iterable: Iterable<T>,
  callbackfn: (value: T, index: number, iterable: Iterable<T>) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  thisArg?: any
): void {
  let index = 0;

  if (typeof callbackfn !== 'function') {
    throw new TypeError(`${callbackfn} is not a function`);
  }

  const boundCallbackfn = callbackfn.bind(thisArg);

  for (const value of iterable) {
    boundCallbackfn(value, index++, iterable);
  }
}
