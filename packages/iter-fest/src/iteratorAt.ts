import { iteratorToIterable } from './iteratorToIterable.ts';
import toIntegerOrInfinity from './private/toIntegerOrInfinity.ts';

/**
 * Returns the item located at the specified index.
 *
 * @param index The zero-based index of the desired code unit. A negative index will count back from the last item.
 */
export function iteratorAt<T>(iterator: Iterator<T>, index: number): T | undefined {
  let currentIndex = 0;

  index = toIntegerOrInfinity(index);

  if (!isFinite(index)) {
    return;
  }

  if (index < 0) {
    throw new TypeError('index cannot be a negative finite number');
  }

  for (const value of iteratorToIterable(iterator)) {
    if (currentIndex++ === index) {
      return value;
    }
  }

  return undefined;
}
