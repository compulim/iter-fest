import { iteratorToIterable } from './iteratorToIterable.ts';
import toIntegerOrInfinity from './private/toIntegerOrInfinity.ts';

/**
 * Returns a copy of a section of an iterator.
 * For both start and end, a negative index can be used to indicate an offset from the end of the iterator.
 * For example, -2 refers to the second to last element of the iterator.
 *
 * @param start The beginning index of the specified portion of the iterator.
 * If start is undefined, then the slice begins at index 0.
 *
 * @param end The end index of the specified portion of the iterator. This is exclusive of the element at the index 'end'.
 * If end is undefined, then the slice extends to the end of the iterator.
 */
export function* iteratorSlice<T>(
  iterator: Iterator<T>,
  start: number = 0,
  end: number = Infinity
): IterableIterator<T> {
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

  for (const item of iteratorToIterable(iterator)) {
    if (index >= start && index < end) {
      yield item;
    }

    index++;

    if (index > end) {
      break;
    }
  }
}
