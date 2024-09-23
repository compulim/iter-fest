import { iteratorToIterable } from './iteratorToIterable.ts';
import toIntegerOrInfinity from './private/toIntegerOrInfinity.ts';

/**
 * Returns the index of the first occurrence of a value in an iterator, or -1 if it is not present.
 *
 * @param searchElement The value to locate in the iterator.
 * @param fromIndex The iterator index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
 */
export function iteratorIndexOf<T>(iterator: Iterator<T>, searchElement: T, fromIndex: number = 0): number {
  let index = 0;

  fromIndex = toIntegerOrInfinity(fromIndex);

  if (fromIndex !== Infinity) {
    fromIndex = fromIndex === -Infinity ? 0 : fromIndex;

    if (fromIndex < 0) {
      // TODO: Support negative fromIndex.
      throw new TypeError('fromIndex cannot be a negative finite number');
    }

    for (const item of iteratorToIterable(iterator)) {
      if (index >= fromIndex && Object.is(item, searchElement)) {
        return index;
      }

      index++;
    }
  }

  return -1;
}
