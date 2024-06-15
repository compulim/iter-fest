import { iteratorJoin } from './iteratorJoin';

/**
 * Returns a string representation of an iterator.
 */
export function iteratorToString<T>(iterator: Iterator<T>): string {
  return iteratorJoin(iterator);
}
