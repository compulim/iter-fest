# `iterable-fest`

A collection of iterable utilities.

## Background

Iterables become more mainstream, however, traversing iterables are not as trivial as array.

In this package, we are building majority of `Array.prototype.*` functions to work with iterables.

## How to use

```sh
npm install iterable-fest
```

### `Array.prototype` ports

We ported majority of functions of `Array.prototype.*` to `iterable*`.

```ts
import { iterableIncludes, iterableReduce } from 'iterable-fest'; // Via default exports.
import { iterableSome } from 'iterable-fest/iterableSome'; // Via named exports.

const iterable: Iterable<number> = [1, 2, 3, 4, 5].values();

console.log(iterableIncludes(iterable, 3)); // Prints "true".
console.log(iterableReduce(iterable, (sum, value) => sum + value, 0)); // Prints "15".
console.log(iterableSome(iterable, value => value % 2)); // Prints "true".
```

### Converting an iterator to iterable

If you have an iterator or generator, you can use `iteratorToIterable` to convert it into `IterableIterator`.

Iterating a generator is generally not recommended. Please read [this section](#does-this-work-on-generator) to avoid pitfalls when iterating a generator.

```ts
const generateNumbers = function* () {
  yield 1;
  yield 2;
  yield 3;
};

const iterable = iteratorToIterable(generateNumbers());

for (const value of iterable) {
  console.log(value); // Prints "1", "2", "3".
}
```

## Behaviors

### Are there any differences between its counterparts in `Array.prototype`?

Majority of functions should work exactly the same way, except below:

- `findLast` and `findLastIndex`
  - Instead of iterating from the right side, iterables must start from left side
  - Thus, with an iterable of 5 items, `predicate` will be called exactly 5 times
  - In contrast, its counterpart in `Array` will be called between 1 and 5 times
- `includes` and `indexOf`
  - `fromIndex` cannot be negative finite number
    - Infinites, zeroes, and positive numbers are supported
    - This could be implemented in an efficient way, we welcome pull requests

### Why not porting `Array.prototype.push`?

Some functions that modify the array are not brought over, for example, `copyWithin`, `fill`, `pop`, `push`, `reverse`, `shift`, `splice`, `unshift`, etc. Iterables are read-only and we prefer to keep it that way.

Some functions that do not have actual functionality, such as, `entries`, `forEach`, `keys`, `values`, etc. are not ported.

Some functions that requires iterating from the right side or random access are not brought over, for example, `lastIndexOf`, `reduceRight`, `sort`, `toReversed`, `toSorted`, etc. This is because iterables must always start from left side. We will not emulate right side iteration if they would take more than `O(n)`.

If you think a specific function could be done in an `O(n)` way, please submit a pull request to us.

### How about asynchronous iterables?

Yes, this is in our roadmap. This will enable traverse iterables [across domains/workers via `MessagePort`](https://npmjs.com/package/message-port-rpc). We welcome pull requests.

### How about functions outside of `Array.prototype`?

Maybe. Please submit an issue and discuss with us.

### Does this work on generator?

Generator has more functionalities than iterator and array. It is not recommended to iterate a generator for some reasons:

- Generator can define the return value (the very last value)
  - `return { done: true, value: 'the very last value' }`
  - Iterating generator using for-loop will never get the value from `{ done: true }`
- Generator can receive feedback values from its iterator
  - `iterator.next('something')` will be printed assigned via `const feedback = yield;`
  - For-loop cannot send feedbacks to generator

## Contributions

Like us? [Star](https://github.com/compulim/iterable-fest/stargazers) us.

Want to make it better? [File](https://github.com/compulim/iterable-fest/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/iterable-fest/pulls) a pull request.
