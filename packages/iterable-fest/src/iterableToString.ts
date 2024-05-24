import { iterableJoin } from './iterableJoin';

/**
 * Returns a string representation of an iterable.
 */
export function iterableToString<T>(iterable: Iterable<T>): string {
  return iterableJoin(iterable);
}
