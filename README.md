# `iterable-fest`

A collection of iterable utilities.

## Background

Iterables become more mainstream, however, traversing iterables are not as trivial as array.

In this package, we are building majority of `Array.prototype.*` functions to work with iterables.

## How to use

```ts
import { iterableIncludes, iterableReduce } from 'iterable-fest'; // Via default exports.
import { iterableSome } from 'iterable-fest/iterableSome'; // Via named exports.

const iterable: Iterable<number> = [1, 2, 3, 4, 5].values();

console.log(iterableIncludes(iterable, 3)); // Prints "true".
console.log(iterableReduce(iterable, (sum, value) => sum + value, 0)); // Prints "15".
console.log(iterableSome(iterable, value => value % 2)); // Prints "true".
```

## Behaviors

### Are there any differences between its counterparts in `Array.prototype`?

Majority of functions should work exactly the same way, except below:

- `findLast` and `findLastIndex`
   - Instead of iterating from the right side, iterables must start from left side
   - Thus, with an iterable of 5 items, `predicate` will be called exactly 5 times
   - In contrast, its counterpart in `Array` may be called 1-5 times
- `includes` and `indexOf`
   - `fromIndex` cannot be negative finite number. Infinites, zeroes, and positive numbers are supported
      - This could be implemented in an efficient way, we welcome pull requests

### Why not porting `Array.prototype.push`?

Some functions that modify the array are not brought over, for example, `fill`, `pop`, `push`, `reverse`, `shift`, `unshift`, etc. Iterables are read-only and we prefer to keep it that way.

Some functions that works from the right side are not brought over, for example, `reduceRight`, etc. Iterables must always start from left side. Iterating from right side may not be efficient in some cases.

If you think a specific function could be done in an efficient way, please submit a pull request to us.

### How about asynchronous iterables?

Yes, this is in our roadmap. This will enable traverse iterables [across domains/workers via `MessagePort`](https://npmjs.com/package/message-port-rpc). We welcome pull requests.

### How about functions outside of `Array.prototype`?

Maybe. Please submit an issue and discuss with us.

## Contributions

Like us? [Star](https://github.com/compulim/iterable-fest/stargazers) us.

Want to make it better? [File](https://github.com/compulim/iterable-fest/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/iterable-fest/pulls) a pull request.