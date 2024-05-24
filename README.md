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

List of ported functions: [`at`](https://tc39.es/ecma262/#sec-array.prototype.at), [`concat`](https://tc39.es/ecma262/#sec-array.prototype.concat), [`entries`](https://tc39.es/ecma262/#sec-array.prototype.entries), [`every`](https://tc39.es/ecma262/#sec-array.prototype.every), [`filter`](https://tc39.es/ecma262/#sec-array.prototype.filter), [`find`](https://tc39.es/ecma262/#sec-array.prototype.find), [`findIndex`](https://tc39.es/ecma262/#sec-array.prototype.findindex), [`findLast`](https://tc39.es/ecma262/#sec-array.prototype.findlast), [`findLastIndex`](https://tc39.es/ecma262/#sec-array.prototype.findlastindex), [`forEach`](https://tc39.es/ecma262/#sec-array.prototype.foreach), [`includes`](https://tc39.es/ecma262/#sec-array.prototype.includes), [`indexOf`](https://tc39.es/ecma262/#sec-array.prototype.indexof), [`join`](https://tc39.es/ecma262/#sec-array.prototype.join), [`keys`](https://tc39.es/ecma262/#sec-array.prototype.keys), [`map`](https://tc39.es/ecma262/#sec-array.prototype.map), [`reduce`](https://tc39.es/ecma262/#sec-array.prototype.reduce), [`slice`](https://tc39.es/ecma262/#sec-array.prototype.slice), [`some`](https://tc39.es/ecma262/#sec-array.prototype.some), [`toSpliced`](https://tc39.es/ecma262/#sec-array.prototype.tospliced), and [`toString`](https://tc39.es/ecma262/#sec-array.prototype.tostring).

### Converting an iterator to iterable

`iteratorToIterable` converts a pure iterator into `IterableIterator` and enable for-loop iteration.

```ts
const iterate = (): Iterator<number> => {
  let value = 0;

  return {
    next: () => {
      if (++value <= 3) {
        return { done: false, value };
      }

      return { done: true, value: undefined };
    }
  };
};

for (const value of iteratorToIterable(iterate())) {
  console.log(value); // Prints "1", "2", "3".
}
```

## Behaviors

### What are the differences between `Array.prototype` and their ports?

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

### Why `Array.prototype.push` is not ported?

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

- Generator can define the return value
  - `return { done: true, value: 'the very last value' }`
  - Iterating generator using for-loop will not get any values from `{ done: true }`
- Generator can receive feedback values from its iterator
  - `generator.next('something')`, the feedback can be assigned to variable via `const feedback = yield;`
  - For-loop cannot send feedbacks to generator

### When should I use `Iterable`, `IterableIterator` and `Iterator`?

For best compatibility, you should generally follow this API signature: use `Iterable` for inputs, and use `IterableIterator` for outputs. You should avoid exporting pure `Iterator`.

```ts
function transform<T>(iterable: Iterable<T>): IterableIterator<T>;
```

### What is on the roadmap?

We are planning to bring iterables and its siblings together, including:

- `Iterable` and `AsyncIterable`
- `Iterator` and `AsyncIterator`
- `IterableIterator` and `AsyncIterableIterator`
- `Generator` and `AsyncGenerator`
- `ReadableStream`
- `Observable`

## Contributions

Like us? [Star](https://github.com/compulim/iterable-fest/stargazers) us.

Want to make it better? [File](https://github.com/compulim/iterable-fest/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/iterable-fest/pulls) a pull request.
