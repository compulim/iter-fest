// @ts-expect-error core-js-pure is not typed.
import reduce from 'core-js-pure/full/async-iterator/reduce';

/**
 * Calls the specified callback function for all the elements in an iterator. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
 *
 * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the iterator.
 *
 * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an iterator value.
 *
 * @link https://github.com/tc39/proposal-iterator-helpers/blob/main/README.md
 */
export function asyncIteratorReduce<T>(
  asyncIterator: AsyncIterator<T>,
  callbackfn: (previousValue: T, currentValue: T, currentIndex: number) => Promise<T>
): Promise<T>;

export function asyncIteratorReduce<T>(
  asyncIterator: AsyncIterator<T>,
  callbackfn: (previousValue: T, currentValue: T, currentIndex: number) => Promise<T>,
  initialValue: T
): T;

/**
 * Calls the specified callback function for all the elements in an iterator. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
 *
 * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the iterator.
 *
 * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
 *
 * @link https://github.com/tc39/proposal-iterator-helpers/blob/main/README.md
 */
export function asyncIteratorReduce<T, U>(
  asyncIterator: AsyncIterator<T>,
  callbackfn: (previousValue: U, currentValue: T, currentIndex: number) => Promise<U>,
  initialValue: U
): U;

export function asyncIteratorReduce<T, U = undefined>(
  asyncIterator: AsyncIterator<T>,
  callbackfn: (previousValue: U | undefined, currentValue: T, currentIndex: number) => Promise<U>,
  initialValue?: U
): Promise<U | undefined> {
  return reduce(asyncIterator, callbackfn, initialValue);
}
