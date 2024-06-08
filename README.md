# `iter-fest`

A collection of utilities for iterations.

## Background

Iterators become mainstream. However, traversing iterables are not as trivial as array.

In this package, we are porting majority of `Array.prototype.*` functions to work with iterables. We also added some utility functions to assist iterable, iterator, and generator.

Iterables can contains infinite number of items, please use this package responsibly.

## How to use

```sh
npm install iter-fest
```

### `Array.prototype` ports

We ported majority of functions from `Array.prototype.*` to `iterable*`.

```ts
import { iterableIncludes, iterableReduce } from 'iter-fest'; // Via default exports.
import { iterableSome } from 'iter-fest/iterableSome'; // Via named exports.

const iterable: Iterable<number> = [1, 2, 3, 4, 5].values();

console.log(iterableIncludes(iterable, 3)); // Prints "true".
console.log(iterableReduce(iterable, (sum, value) => sum + value, 0)); // Prints "15".
console.log(iterableSome(iterable, value => value % 2)); // Prints "true".
```

List of ported functions: [`at`](https://tc39.es/ecma262/#sec-array.prototype.at), [`concat`](https://tc39.es/ecma262/#sec-array.prototype.concat), [`entries`](https://tc39.es/ecma262/#sec-array.prototype.entries), [`every`](https://tc39.es/ecma262/#sec-array.prototype.every), [`filter`](https://tc39.es/ecma262/#sec-array.prototype.filter), [`find`](https://tc39.es/ecma262/#sec-array.prototype.find), [`findIndex`](https://tc39.es/ecma262/#sec-array.prototype.findindex), [`findLast`](https://tc39.es/ecma262/#sec-array.prototype.findlast), [`findLastIndex`](https://tc39.es/ecma262/#sec-array.prototype.findlastindex), [`forEach`](https://tc39.es/ecma262/#sec-array.prototype.foreach), [`includes`](https://tc39.es/ecma262/#sec-array.prototype.includes), [`indexOf`](https://tc39.es/ecma262/#sec-array.prototype.indexof), [`join`](https://tc39.es/ecma262/#sec-array.prototype.join), [`keys`](https://tc39.es/ecma262/#sec-array.prototype.keys), [`map`](https://tc39.es/ecma262/#sec-array.prototype.map), [`reduce`](https://tc39.es/ecma262/#sec-array.prototype.reduce), [`slice`](https://tc39.es/ecma262/#sec-array.prototype.slice), [`some`](https://tc39.es/ecma262/#sec-array.prototype.some), [`toSpliced`](https://tc39.es/ecma262/#sec-array.prototype.tospliced), and [`toString`](https://tc39.es/ecma262/#sec-array.prototype.tostring).

### Converting an iterator to iterable

`iteratorToIterable` converts a pure iterator to `IterableIterator` and enable for-loop iteration.

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

### Typed `Observable`

`Observable` and `Symbol.observable` is re-exported from `core-js-pure` with proper type definitions.

### Converting an `Observable` to `AsyncIterableIterator`

`observableValues` subscribes to an `Observable` and return as `AsyncIterableIterator`.

`Observable` is push-based and `AsyncIterableIterator` is pull-based. Values from `Observable` may push continuously and will be buffered internally. When for-loop break or complete, the iterator will unsubscribe from the `Observable`.

```ts
const observable = Observable.from([1, 2, 3]);

for await (const value of observableValues(observable)) {
  console.log(value); // Prints "1", "2", "3".
}
```

### Converting an `AsyncIterable` to `Observable`

`Observable.from` converts `Iterable` into `Observable`. However, it does not convert `AsyncIterable`.

`observableFromAsync` will convert `AsyncIterable` into `Observable`.

```ts
async function* generate() {
  yield 1;
  yield 2;
  yield 3;
}

const observable = observableFromAsync(generate());
const next = value => console.log(value);

observable.subscribe({ next }); // Prints "1", "2", "3".
```

### Producer-consumer queue

`PushAsyncIterableIterator` is a simple push-based producer-consumer queue. The producer can push a new job at anytime. The consumer will wait for jobs to be available.

A push-based queue is easier to use than a pull-based queue. However, pull-based queue offers better flow control. For a full-featured producer-consumer queue that supports flow control, use `ReadableStream` instead.

```ts
const iterable = new PushAsyncIterableIterator();

(async function consumer() {
  for await (const value of iterable) {
    console.log(value);
  }

  console.log('Done');
})();

(async function producer() {
  iterable.push(1);
  iterable.push(2);
  iterable.push(3);
  iterable.close();
})();

// Prints "1", "2", "3", "Done".
```

### Iterating `ReadableStreamDefaultReader`

`readerToAsyncIterableIterator` will convert default reader of `ReadableStream` into an `AsyncIterableIterator` to use in for-loop.

```ts
const readableStream = new ReadableStream({
  start(controller) {
    controller.enqueue(1);
    controller.enqueue(2);
    controller.close();
  }
});

for await (const value of readerToAsyncIterableIterator(readableStream.getReader())) {
  console.log(value); // Prints "1", "2", "3".
}
```

## Converts `Observable` into `ReadableStream`

```ts
const observable = Observable.from([1, 2, 3]);
const readable = observableSubscribeAsReadable(observable);
const reader = readable.getReader();

readable.pipeTo(stream.writable); // Will write 1, 2, 3.
```

## Behaviors

### How this compares to the TC39 proposals?

Always use the [TC39](https://github.com/tc39/proposal-iterator-helpers) [version](https://github.com/tc39/proposal-async-iterator-helpers) when they are available in your environment. We will deprecate duplicated features when the proposal is shipped.

`iter-fest` also works with siblings of iterators such as `Generator`, [Streams](https://streams.spec.whatwg.org/) and `Observable`. `iter-fest` will evolve more around the whole iteration universe than focusing on `Iterator` alone.

### What are the differences between `Array.prototype` and their ports?

Majority of functions should work the same way with same complexity and performance characteristics. If they return an array, in the port, they will be returning iterables instead.

There are minor differences on some functions:

- `findLast` and `findLastIndex`
  - Instead of iterating from the right side, iterables must start from left side
  - Thus, with an iterable of 5 items, `predicate` will be called exactly 5 times with `O(N)` complexity
  - In contrast, its counterpart in `Array` will be called between 1 and 5 times with `O(log N)` complexity
- `at`, `includes`, `indexOf`, `slice`, and `toSpliced`
  - Index arguments cannot be negative finite number
    - Negative finite number means traversing from right side, which an iterator/iterable may not have an end
    - Infinites, zeroes, and positive numbers are supported

### Why `Array.prototype.push` is not ported?

Some functions that modify the array are not ported, such as, `copyWithin`, `fill`, `pop`, `push`, `reverse`, `shift`, `splice`, `unshift`, etc. Iterables are read-only and we prefer to keep it that way.

Some functions that do not have actual functionality in the iterable world are not ported, such as, `values`, etc.

Some functions that cannot not retains their complexity or performance characteristics are not ported. These functions usually iterate from the other end or requires random access, such as, `lastIndexOf`, `reduceRight`, `sort`, `toReversed`, `toSorted`, etc.

If you think a specific function should be ported, please submit a pull request to us.

### How about asynchronous iterables?

Yes, this is on our roadmap. This will enable traverse iterables [across domains/workers via `MessagePort`](https://npmjs.com/package/message-port-rpc). We welcome pull requests.

### How about functions outside of `Array.prototype`?

Possibly. Please submit an issue and discuss with us.

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

Like us? [Star](https://github.com/compulim/iter-fest/stargazers) us.

Want to make it better? [File](https://github.com/compulim/iter-fest/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/iter-fest/pulls) a pull request.
