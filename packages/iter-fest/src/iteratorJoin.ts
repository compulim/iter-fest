import { iteratorToIterable } from './iteratorToIterable';

/**
 * Adds all the elements of an iterator into a string, separated by the specified separator string.
 *
 * @param separator A string used to separate one element of the iterator from the next in the resulting string. If omitted, the iterator elements are separated with a comma.
 */
export function iteratorJoin<T>(iterator: Iterator<T>, separator: string = ','): string {
  let index = 0;
  let result = '';

  for (const item of iteratorToIterable(iterator)) {
    if (index) {
      result += separator;
    }

    if (typeof item !== 'undefined' && item !== null) {
      result += item;
    }

    index++;
  }

  return result;
}
