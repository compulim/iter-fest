import toIntegerOrInfinity from './private/toIntegerOrInfinity';

/**
 * Returns a copy of a section of an iterable.
 * For both start and end, a negative index can be used to indicate an offset from the end of the iterable.
 * For example, -2 refers to the second to last element of the iterable.
 *
 * @param start The beginning index of the specified portion of the iterable.
 * If start is undefined, then the slice begins at index 0.
 *
 * @param end The end index of the specified portion of the iterable. This is exclusive of the element at the index 'end'.
 * If end is undefined, then the slice extends to the end of the iterable.
 */
export function* iterableSlice<T>(iterable: Iterable<T>, start: number = 0, end: number = Infinity): Iterable<T> {
  let index = 0;

  start = toIntegerOrInfinity(start);
  start = start === -Infinity ? 0 : start;
  end = toIntegerOrInfinity(end);
  end = end === -Infinity ? 0 : end;

  if (start < 0) {
    throw new TypeError('start cannot be a negative finite number');
  }

  if (end < 0) {
    throw new TypeError('end cannot be a negative finite number');
  }

  if (start === Infinity) {
    return;
  }

  for (const item of iterable) {
    if (index >= start && index < end) {
      yield item;
    }

    index++;

    if (index > end) {
      break;
    }
  }
}
