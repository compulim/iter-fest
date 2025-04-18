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

## Conversions

| From                       | To                      | Function                                                                        |
| -------------------------- | ----------------------- | ------------------------------------------------------------------------------- |
| `Iterator`                 | `IterableIterator`      | [`iteratorToIterable`](#converting-an-iterator-to-iterable)                     |
| `AsyncIterator`            | `AsyncIterableIterator` | [`asyncIteratorToAsyncIterable`](#converting-an-iterator-to-iterable)           |
| `Observable`               | `ReadableStream`        | [`observableSubscribeAsReadable`](#converting-an-observable-to-readablestream)  |
| `AsyncIterable`            | `Observable`            | [`observableFromAsync`](#converting-an-asynciterable-to-observable)             |
| `AsyncIterable`/`Iterable` | `ReadableStream`        | [`readableStreamFrom`](#converting-an-asynciterableiterable-to-readablestream)  |
| `Observable`               | `AsyncIterableIterator` | [`observableValues`](#converting-an-observable-to-asynciterableiterator)        |

### Converting an iterator to iterable

```ts
function iteratorToIterable<T>(iterator: Iterator<T>): IterableIterator<T>;

function asyncIteratorToAsyncIterable<T>(asyncIterator: AsyncIterator<T>): AsyncIterableIterator<T>;
```

`iteratorToIterable` and `asyncIteratorToAsyncIterable` enable a [pure iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator) to be iterable using a for-loop statement.

```ts
const iterate = (): Iterator<number> => {
  let value = 0;

  return {
    next: () => {
      if (++value <= 3) {
        return { value };
      }

      return { done: true, value: undefined } satisfies IteratorResult<number>;
    }
  };
};

for (const value of iteratorToIterable(iterate())) {
  console.log(value); // Prints "1", "2", "3".
}
```

Note: calling `[Symbol.iterator]()` or `[Symbol.asyncIterator]()` will not restart the iteration. This is because iterator is an instance of iteration and is not restartable.

### Converting an `AsyncIterable` to `Observable`

```ts
function observableFromAsync<T>(iterable: AsyncIterable<T>): Observable<T>;
```

`Observable.from` converts `Iterable` into `Observable`. However, it does not convert `AsyncIterable`.

`observableFromAsync` will convert `AsyncIterable` into `Observable`. It will try to restart the iteration by calling `[Symbol.asyncIterator]()`.

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

Note: `observableFromAsync` will call `[Symbol.asyncIterator]()` initially to restart the iteration where possible.

Note: It is not recommended to convert `AsyncGenerator` to an `Observable`. `AsyncGenerator` has more functionalities and `Observable` does not support many of them.

### Converting an `Observable` to `ReadableStream`

```ts
function observableSubscribeAsReadable<T>(observable: Observable<T>): ReadableStream<T>;
```

`ReadableStream` is powerful for transforming and piping stream of data. It can be formed using data from both push-based and pull-based source with backpressuree.

Note: `Observable` is push-based and it does not support flow control. When converting to `ReadableStream`, the internal buffer could build up quickly.

```ts
const observable = Observable.from([1, 2, 3]);
const readable = observableSubscribeAsReadable(observable);

readable.pipeTo(stream.writable); // Will write 1, 2, 3.
```

### Converting a `ReadableStream` to `AsyncIterableIterator`

> This is deprecated and removed in favor of [native `ReadableStream.values()`](https://streams.spec.whatwg.org/#rs-asynciterator).

```ts
function readableStreamValues`<T>(
  readable: ReadableStream<T>
): AsyncIterableIterator<T>
```

### Converting an `AsyncIterable`/`Iterable` to `ReadableStream`

```ts
function readableStreamFrom<T>(anyIterable: AsyncIterable<T> | Iterable<T>): ReadableStream<T>;
```

> Notes: this feature is part of [Streams Standard](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/from_static).

```ts
const iterable = [1, 2, 3].values();
const readable = readableStreamFrom(iterable);

readable.pipeTo(stream.writable); // Will write 1, 2, 3.
```

Note: `readableStreamFrom()` will call `[Symbol.iterator]()` initially to restart the iteration where possible.

### Converting an `Observable` to `AsyncIterableIterator`

```ts
function observableValues<T>(observable: Observable<T>): AsyncIterableIterator<T>;
```

`Observable` can be converted to `AsyncIterableIterator` for easier consumption.

```ts
const observable = Observable.from([1, 2, 3]);
const iterable = observableValues(readable);

for await (const value of iterable) {
  console.log(value); // Prints "1", "2", "3".
}
```

Note: `Observable` is push-based and it does not support flow control. When converting to `AsyncIterableIterator`, the internal buffer could build up quickly.

Note: when the observable throw an exception via `observer.error()`, it will become rejection of `AsyncIterator.next()`. The exception will be hoisted back to the caller.

## Others

### Typed `Observable`

`Observable` and `Symbol.observable` is re-exported from `core-js-pure` with proper type definitions.

### Producer-consumer queue

`IterableWritableStream` is a push-based producer-consumer queue designed to decouple the flow between a producer and multiple consumers. The producer can push a new job at anytime. The consumer can pull a job at its own convenience via for-loop.

`IterableWritableStream` supports multiple consumers and continuation:

- Multiple consumers: when 2 or more consumers are active at the same time, jobs will be distributed across all consumers in a round robin fashion when possible
- Continuation: when the last consumer disconnected while producer keep pushing new jobs, the next consumer will pick up where the last consumer left

Compare to pull-based queue, a push-based queue is easy to use. However, pull-based queue offers better flow control as it will produce a job only if there is a consumer ready to consume.

```ts
const iterable = new IterableWritableStream();
const writer = iterable.getWriter();

(async function consumer() {
  for await (const value of iterable) {
    console.log(value);
  }

  console.log('Done');
})();

(async function producer() {
  writer.write(1);
  writer.write(2);
  writer.write(3);
  writer.close();
})();

// Prints "1", "2", "3", "Done".
```

### Using for-loop with generator

Compare to `Iterator`, `Generator` offers advanced capability.

When using for-loop with generator, the last value return from the generator is lost.

The `generatorWithLastValue()` and `asyncGeneratorWithLastValue()` helps bridge the for-loop usage by capturing the value returned as `{ done: true }` and make it accessible via `lastValue()`.

```ts
const generator = generatorWithLastValue(
  (function* () {
    yield 1; // { done: false, value: 1 }
    yield 2; // { done: false, value: 2 }
    yield 3; // { done: false, value: 3 }

    return 'end'; // { done: true, value: 'end' }
  })()
);

for (const value of generator) {
  console.log(value); // Prints "1", "2", "3".
}

console.log(generator.lastValue()); // Prints "end".
```

Note: `lastValue()` will throw if it is being called before end of iteration. Also, excessive calls to `next()` will return `{ done: true, value: undefined }`, thus, `lastValue()` could become `undefined` if `next()` is called after the end of iteration.

The value returned from `generatorWithLastValue()`/`asyncGeneratorWithLastValue()` will passthrough all function calls to original `Generator` with a minor difference. Calling `[Symbol.iterator]()`/`[Symbol.asyncIterator]()` on the returned generator will not start a fresh iteration. If a fresh iteration is required, create a new one before passing it to `generatorWithLastValue()`/`asyncGeneratorWithLastValue()`.

```ts
const generator = generatorWithLastValue(
  (function* () {
    // ...
  })()[Symbol.iterator]() // Creates a fresh iteration.
);
```

### Iterating `ReadableStream` with `AbortSignal`

> This is an unofficial extension to the [native `ReadableStream.values()`](https://streams.spec.whatwg.org/#rs-asynciterator).

```ts
function readableStreamValuesWithSignal`<T>(
  readable: ReadableStream<T>,
  options?: {
    preventCancel?: boolean | undefined;
    signal?: AbortSignal | undefined;
  } | undefined
): AsyncIterableIterator<T>
```

To break early without awaiting for the next value, pass an `AbortSignal` to `options.signal`. When the signal is aborted, all pending and future calls to `next()` and `return()` will reject with `DOMException` with name of `AbortError`.

> Notes: native `ReadableStreamAsyncIterator` does not support `throw()`.

```ts
const abortController = new AbortController();
const iterable = readableStreamValues(readable, { signal: abortController.signal });

setTimeout(() => {
  abortController.abort();
}, 100);

try {
  for await (const value of iterable) {
    console.log(value);
  }
} catch (error) {
  // On abort, will throw DOMException with name of "AbortError"
}
```

If `preventCancel` is `true`, the `ReadableStream` can be reopened and read by another reader.

## Adding types to `core-js-pure`

We added types to [Iterator Helpers](https://github.com/tc39/proposal-iterator-helpers) and [Async Iterator Helpers](https://github.com/tc39/proposal-async-iterator-helpers) implementation from `core-js-pure`:

- [`Iterator.drop`](https://tc39.es/ecma262/#sec-array.prototype.drop)
- [`Iterator.every`](https://tc39.es/ecma262/#sec-array.prototype.every)
- [`Iterator.filter`](https://tc39.es/ecma262/#sec-array.prototype.filter)
- [`Iterator.find`](https://tc39.es/ecma262/#sec-array.prototype.find)
- [`Iterator.flatMap`](https://tc39.es/ecma262/#sec-array.prototype.flatmap)
- [`Iterator.forEach`](https://tc39.es/ecma262/#sec-array.prototype.foreach)
- [`Iterator.from`](https://tc39.es/ecma262/#sec-array.prototype.from)
- [`Iterator.map`](https://tc39.es/ecma262/#sec-array.prototype.map)
- [`Iterator.reduce`](https://tc39.es/ecma262/#sec-array.prototype.reduce)
- [`Iterator.some`](https://tc39.es/ecma262/#sec-array.prototype.some)
- [`Iterator.take`](https://tc39.es/ecma262/#sec-array.prototype.take)
- [`Iterator.toArray`](https://tc39.es/ecma262/#sec-array.prototype.toarray)
- [`AsyncIterator.drop`](https://tc39.es/ecma262/#sec-array.prototype.drop)
- [`AsyncIterator.every`](https://tc39.es/ecma262/#sec-array.prototype.every)
- [`AsyncIterator.filter`](https://tc39.es/ecma262/#sec-array.prototype.filter)
- [`AsyncIterator.find`](https://tc39.es/ecma262/#sec-array.prototype.find)
- [`AsyncIterator.flatMap`](https://tc39.es/ecma262/#sec-array.prototype.flatmap)
- [`AsyncIterator.forEach`](https://tc39.es/ecma262/#sec-array.prototype.foreach)
- [`AsyncIterator.from`](https://tc39.es/ecma262/#sec-array.prototype.from)
- [`AsyncIterator.map`](https://tc39.es/ecma262/#sec-array.prototype.map)
- [`AsyncIterator.reduce`](https://tc39.es/ecma262/#sec-array.prototype.reduce)
- [`AsyncIterator.some`](https://tc39.es/ecma262/#sec-array.prototype.some)
- [`AsyncIterator.take`](https://tc39.es/ecma262/#sec-array.prototype.take)
- [`AsyncIterator.toArray`](https://tc39.es/ecma262/#sec-array.prototype.toarray)

## `Array.prototype` ports

We ported majority of functions from `Array.prototype.*` to `iterator*`.

```ts
import { iteratorIncludes, iteratorReduce } from 'iter-fest'; // Via default exports.
import { iteratorSome } from 'iter-fest/iteratorSome'; // Via named exports.

const iterator: iterator<number> = [1, 2, 3, 4, 5].values();

console.log(iteratorIncludes(iterator, 3)); // Prints "true".
console.log(iteratorReduce(iterator, (sum, value) => sum + value, 0)); // Prints "15".
console.log(iteratorSome(iterator, value => value % 2)); // Prints "true".
```

List of ported functions: [`at`](https://tc39.es/ecma262/#sec-array.prototype.at), [`concat`](https://tc39.es/ecma262/#sec-array.prototype.concat), [`entries`](https://tc39.es/ecma262/#sec-array.prototype.entries), [`findIndex`](https://tc39.es/ecma262/#sec-array.prototype.findindex), [`findLast`](https://tc39.es/ecma262/#sec-array.prototype.findlast), [`findLastIndex`](https://tc39.es/ecma262/#sec-array.prototype.findlastindex), [`includes`](https://tc39.es/ecma262/#sec-array.prototype.includes), [`indexOf`](https://tc39.es/ecma262/#sec-array.prototype.indexof), [`join`](https://tc39.es/ecma262/#sec-array.prototype.join), [`keys`](https://tc39.es/ecma262/#sec-array.prototype.keys), [`slice`](https://tc39.es/ecma262/#sec-array.prototype.slice), [`toSpliced`](https://tc39.es/ecma262/#sec-array.prototype.tospliced), and [`toString`](https://tc39.es/ecma262/#sec-array.prototype.tostring).

## Behaviors

### How this compares to the TC39 proposals?

Always use the [TC39](https://github.com/tc39/proposal-iterator-helpers) [version](https://github.com/tc39/proposal-async-iterator-helpers) when they are available in your environment. We will deprecate duplicated features when the proposal is shipped.

`iter-fest` also works with siblings of iterators such as `Generator`, [Streams](https://streams.spec.whatwg.org/) and `Observable`. `iter-fest` will evolve more around the whole iteration universe than focusing on `Iterator` alone.

### What are the differences between `Array.prototype` and their ports?

Majority of functions should work the same way with same complexity and performance characteristics. If they return an array, in the port, they will be returning iterables instead.

There are minor differences on some functions:

- `findLast` and `findLastIndex`
  - Instead of iterating from the right side, iterators must start from left side
  - Thus, with an iterator of 5 items, `predicate` will be called exactly 5 times with `O(N)` complexity
  - In contrast, its counterpart in `Array` will be called between 1 and 5 times with `O(log N)` complexity
- `at`, `includes`, `indexOf`, `slice`, and `toSpliced`
  - Index arguments cannot be negative finite number
    - Negative finite number means traversing from right side, which an iterator may not have an end
    - Infinites, zeroes, and positive numbers are supported

### Why `Array.prototype.push` is not ported?

Some functions that modify the array are not ported, such as, `copyWithin`, `fill`, `pop`, `push`, `reverse`, `shift`, `splice`, `unshift`, etc. Iterators are read-only and we prefer to keep it that way.

Some functions that do not have actual functionality in the iterator world are not ported, such as, `values`, etc.

Some functions that cannot not retains their complexity or performance characteristics are not ported. These functions usually iterate from the other end or requires random access, such as, `lastIndexOf`, `reduceRight`, `sort`, `toReversed`, `toSorted`, etc.

If you think a specific function should be ported, please submit a pull request to us.

### How about asynchronous iterators?

Yes, this is on our roadmap. This will enable traverse iterators [across domains/workers via `MessagePort`](https://npmjs.com/package/message-port-rpc). We welcome pull requests.

### How about functions outside of `Array.prototype`?

Possibly. Please submit an issue and discuss with us.

### Does this work on generator?

Generator has more functionalities than iterator and array. It is not recommended to iterate a generator for some reasons:

- Generator can define the return value
  - `return { done: true, value: 'the very last value' }`
  - Iterating generator using for-loop will not get any values from `{ done: true }`
  - The `generatorWithLastValue()` will help capturing and retrieving the last return value
- Generator can receive feedback values from its iterator
  - `generator.next('something')`, the feedback can be assigned to variable via `const feedback = yield;`
  - For-loop cannot send feedbacks to generator

### When should I use `Iterable`, `IterableIterator` and `Iterator`?

For best compatibility, you should generally follow this API signature: use `Iterable` for inputs, and use `IterableIterator` for outputs. You should avoid exporting pure `Iterator`. Sample function signature should looks below.

```ts
function myFunction<T>(input: Iterable<T>): IterableIterator<T>;
```

`IterableIterator` may opt to support restarting the iteration through `[Symbol.iterator]()`. When consuming an `IterableIterator`, you should call `[Symbol.iterator]()` to obtain a fresh iteration or use for-loop statement if possible. However, `[Symbol.iterator]()` is an opt-in feature and does not always guarantee a fresh iteration.

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
