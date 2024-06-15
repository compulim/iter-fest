// @ts-expect-error core-js-pure is not typed.
import every from 'core-js-pure/full/iterator/every';

/**
 * Determines whether all the members of an iterator satisfy the specified test.
 *
 * @param predicate A function that accepts up to three arguments. The every method calls
 * the predicate function for each element in the iterator until the predicate returns a value
 * which is coercible to the Boolean value false, or until the end of the iterator.
 *
 * @link https://github.com/tc39/proposal-iterator-helpers/blob/main/README.md
 */
export function iteratorEvery<T, S extends T>(
  iterator: Iterator<T>,
  predicate: (value: T, index: number) => value is S
): iterator is Iterator<S>;

/**
 * Determines whether all the members of an iterator satisfy the specified test.
 *
 * @param predicate A function that accepts up to three arguments. The every method calls
 * the predicate function for each element in the iterator until the predicate returns a value
 * which is coercible to the Boolean value false, or until the end of the iterator.
 *
 * @param thisArg An object to which the this keyword can refer in the predicate function.
 * If thisArg is omitted, undefined is used as the this value.
 *
 * @link https://github.com/tc39/proposal-iterator-helpers/blob/main/README.md
 */
export function iteratorEvery<T>(iterator: Iterator<T>, predicate: (value: T, index: number) => unknown): boolean;

export function iteratorEvery<T>(iterator: Iterator<T>, predicate: (value: T, index: number) => unknown): boolean {
  return every(iterator, predicate);
}
