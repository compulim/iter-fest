import toIntegerOrInfinity from './private/toIntegerOrInfinity';

/**
 * Returns the index of the first occurrence of a value in an iterable, or -1 if it is not present.
 *
 * @param searchElement The value to locate in the iterable.
 * @param fromIndex The iterable index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
 */
export function iterableIndexOf<T>(iterable: Iterable<T>, searchElement: T, fromIndex: number = 0): number {
  let index = 0;

  fromIndex = toIntegerOrInfinity(fromIndex);

  if (fromIndex !== Infinity) {
    fromIndex = fromIndex === -Infinity ? 0 : fromIndex;

    if (fromIndex < 0) {
      // TODO: Support negative fromIndex.
      throw new TypeError('fromIndex cannot be a negative finite number');
    }

    for (const item of iterable) {
      if (index >= fromIndex && Object.is(item, searchElement)) {
        return index;
      }

      index++;
    }
  }

  return -1;
}
