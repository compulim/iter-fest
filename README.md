# `iterable-fest`

A collection of iterable utilities.

## Background

Iterables become mainstream. However, traversing iterables are not as trivial as array.

In this package, we are porting majority of `Array.prototype.*` functions to work with iterables. We also added some utility functions to assist iterable, iterator, and generator.

## How to use

```sh
npm install iterable-fest
```

### `Array.prototype` ports

We ported majority of functions from `Array.prototype.*` to `iterable*`.

```ts
import { iterableIncludes, iterableReduce } from 'iterable-fest'; // Via default exports.
import { iterableSome } from 'iterable-fest/iterableSome'; // Via named exports.

const iterable: Iterable<number> = [1, 2, 3, 4, 5].values();

console.log(iterableIncludes(iterable, 3)); // Prints "true".
console.log(iterableReduce(iterable, (sum, value) => sum + value, 0)); // Prints "15".
console.log(iterableSome(iterable, value => value % 2)); // Prints "true".
```

### Converting an iterator to iterable

`iteratorToIterable` converts iterator and generator into `IterableIterator` and enable for-loop iteration.

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

### What are the differences between `Array.prototype` and the ports?

Majority of functions should work the same way with same complexity and performance characteristics. If they return an array, in the port, they will be returning iterables instead.

There are minor differences on some functions:

- `findLast` and `findLastIndex`
  - Instead of iterating from the right side, iterables must start from left side
  - Thus, with an iterable of 5 items, `predicate` will be called exactly 5 times (`O(N)`)
  - In contrast, its counterpart in `Array` will be called between 1 and 5 times (`O(log N)`)
- `includes` and `indexOf`
  - `fromIndex` cannot be negative finite number
    - Infinites, zeroes, and positive numbers are supported
    - This could be implemented with same complexity, we welcome pull requests

### Why not porting `Array.prototype.push`?

Some functions that modify the array are not ported, such as, `copyWithin`, `fill`, `pop`, `push`, `reverse`, `shift`, `splice`, `unshift`, etc. Iterables are read-only and we prefer to keep it that way.

Some functions that do not have actual functionality in the iterable world are not ported, such as, `values`, etc.

Some functions that cannot not retains their complexity or performance characteristics are not ported. These functions usually iterate from the other end or requires random access, such as, `lastIndexOf`, `reduceRight`, `sort`, `toReversed`, `toSorted`, etc.

If you think a specific function should be ported, please submit a pull request to us.

### How about asynchronous iterables?

Yes, this is on our roadmap. This will enable traverse iterables [across domains/workers via `MessagePort`](https://npmjs.com/package/message-port-rpc). We welcome pull requests.

### How about functions outside of `Array.prototype`?

Maybe. Please submit an issue and discuss with us.

### Does this work on generator?

Generator has more functionalities than iterator and array. It is not recommended to iterate a generator for some reasons:

- Generator can define the return value (the very last value)
  - `return { done: true, value: 'the very last value' }`
  - Iterating generator using for-loop will never get the value from `{ done: true }`
- Generator can receive feedback values from its iterator
  - `generator.next('something')`, the feedback can be assigned to variable via `const feedback = yield;`
  - For-loop cannot send feedbacks to generator

### What is on the roadmap?

We are planning to bring iterables and alike together. This includes: `Iterable`/`AsyncIterable`, `Iterator`/`AsyncIterator`, `IterableIterator`/`AsyncIterableIterator`, `Generator`/`AsyncGenerator`, `ReadableStream`, and `Observable`.

## Contributions

Like us? [Star](https://github.com/compulim/iterable-fest/stargazers) us.

Want to make it better? [File](https://github.com/compulim/iterable-fest/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/iterable-fest/pulls) a pull request.
