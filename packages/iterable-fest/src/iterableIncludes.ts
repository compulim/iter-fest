import toIntegerOrInfinity from './private/toIntegerOrInfinity';

/**
 * Determines whether an iterable includes a certain element, returning true or false as appropriate.
 *
 * @param searchElement The element to search for.
 * @param fromIndex The position in this iterable at which to begin searching for searchElement.
 */
export function iterableIncludes<T>(iterable: Iterable<T>, searchElement: T, fromIndex: number = 0): boolean {
  let index = 0;

  fromIndex = toIntegerOrInfinity(fromIndex);

  if (fromIndex !== Infinity) {
    fromIndex = fromIndex === -Infinity ? 0 : fromIndex;

    if (fromIndex < 0) {
      // TODO: Support negative fromIndex.
      throw new TypeError('fromIndex cannot be a negative finite number');
    }

    for (const item of iterable) {
      if (index++ >= fromIndex && Object.is(item, searchElement)) {
        return true;
      }
    }
  }

  return false;
}
