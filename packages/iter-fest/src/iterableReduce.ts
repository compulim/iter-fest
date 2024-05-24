/**
 * Calls the specified callback function for all the elements in an iterable. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
 *
 * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the iterable.
 *
 * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an iterable value.
 */
export function iterableReduce<T>(
  iterable: Iterable<T>,
  callbackfn: (previousValue: T, currentValue: T, currentIndex: number, iterable: Iterable<T>) => T
): T;

export function iterableReduce<T>(
  iterable: Iterable<T>,
  callbackfn: (previousValue: T, currentValue: T, currentIndex: number, iterable: Iterable<T>) => T,
  initialValue: T
): T;

/**
 * Calls the specified callback function for all the elements in an iterable. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
 *
 * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the iterable.
 *
 * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
 */

export function iterableReduce<T, U>(
  iterable: Iterable<T>,
  callbackfn: (previousValue: U, currentValue: T, currentIndex: number, iterable: Iterable<T>) => U,
  initialValue: U
): U;

export function iterableReduce<T, U = undefined>(
  iterable: Iterable<T>,
  callbackfn: (previousValue: U | undefined, currentValue: T, currentIndex: number, iterable: Iterable<T>) => U,
  initialValue?: U
): U | undefined {
  let index = 0;
  let previousValue: U | undefined = initialValue;

  if (typeof callbackfn !== 'function') {
    throw new TypeError(`${callbackfn} is not a function`);
  }

  for (const currentValue of iterable) {
    previousValue = callbackfn(previousValue, currentValue, index++, iterable);
  }

  return previousValue;
}
