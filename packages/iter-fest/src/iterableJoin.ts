/**
 * Adds all the elements of an iterable into a string, separated by the specified separator string.
 *
 * @param separator A string used to separate one element of the iterable from the next in the resulting string. If omitted, the iterable elements are separated with a comma.
 */
export function iterableJoin<T>(iterable: Iterable<T>, separator: string = ','): string {
  let index = 0;
  let result = '';

  for (const item of iterable) {
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
