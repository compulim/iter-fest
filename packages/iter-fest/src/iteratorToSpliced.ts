import { iteratorToIterable } from './iteratorToIterable.ts';
import toIntegerOrInfinity from './private/toIntegerOrInfinity.ts';

/**
 * Copies an array and removes elements and, if necessary, inserts new elements in their place. Returns the copied array.
 * @param start The zero-based location in the array from which to start removing elements.
 * @param deleteCount The number of elements to remove.
 * @param items Elements to insert into the copied array in place of the deleted elements.
 * @returns The copied array.
 */
export function iteratorToSpliced<T>(
  iterator: Iterator<T>,
  start?: number | undefined,
  deleteCount?: number | undefined,
  ...items: T[]
): IterableIterator<T>;

/**
 * Copies an array and removes elements while returning the remaining elements.
 * @param start The zero-based location in the array from which to start removing elements.
 * @param deleteCount The number of elements to remove.
 * @returns A copy of the original array with the remaining elements.
 */
export function iteratorToSpliced<T>(
  iterator: Iterator<T>,
  start?: number | undefined,
  deleteCount?: number | undefined
): IterableIterator<T>;

export function* iteratorToSpliced<T>(
  iterator: Iterator<T>,
  start: number = 0,
  deleteCount: number = 0,
  ...items: T[]
): IterableIterator<T> {
  let index = 0;

  start = toIntegerOrInfinity(start);
  start = start === -Infinity ? 0 : start;

  if (start < 0) {
    throw new TypeError('start cannot be a negative finite number');
  }

  let inserted = false;

  for (const item of iteratorToIterable(iterator)) {
    if (index + 1 > start && !inserted) {
      yield* items;
      inserted = true;
    }

    if (index < start || index >= start + deleteCount) {
      yield item;
    }

    index++;
  }

  if (!inserted) {
    yield* items;
  }
}
