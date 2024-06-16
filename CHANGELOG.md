# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Breaking changes

- `iterable*` is now `iterator*` to align closer to TC39 iterator helper proposal

### Added

- Added typed `Observable` from `core-js-pure`, in PR [#8](https://github.com/compulim/iter-fest/pull/8)
- Added `observableFromAsync` to convert `AsyncIterable` into `Observable` in PR [#9](https://github.com/compulim/iter-fest/pull/9)
- Added `IterableWritableStream` in PR [#11](https://github.com/compulim/iter-fest/pull/11) and [#23](https://github.com/compulim/iter-fest/pull/23)
- Added `readableStreamValues` in PR [#12](https://github.com/compulim/iter-fest/pull/12), [#14](https://github.com/compulim/iter-fest/pull/14), and [#30](https://github.com/compulim/iter-fest/pull/30)
- Added `observableSubscribeAsReadable` in PR [#13](https://github.com/compulim/iter-fest/pull/13)
- Added `readableStreamFrom` in PR [#15](https://github.com/compulim/iter-fest/pull/15) and [#22](https://github.com/compulim/iter-fest/pull/22)
- Added `generatorWithLastValue`/`asyncGeneratorWithLastValue` in PR [#17](https://github.com/compulim/iter-fest/pull/17)
- Added `asyncIteratorToAsyncIterable` in PR [#18](https://github.com/compulim/iter-fest/pull/18)
- Added `iteratorDrop`, `iteratorFlatMap`, `iteratorFrom`, `iteratorTake`, `iteratorToArray` in PR [#24](https://github.com/compulim/iter-fest/pull/24) and [#25](https://github.com/compulim/iter-fest/pull/25)
- Added [Async Iterator Helpers](https://github.com/tc39/proposal-async-iterator-helpers) from `core-js-pure` as `asyncIterator*` in PR [#28](https://github.com/compulim/iter-fest/pull/28) and [#29](https://github.com/compulim/iter-fest/pull/29)

### Changed

- Following functions will be using ponyfill from `core-js-pure` with types, in PR [#24](https://github.com/compulim/iter-fest/pull/24) and [#25](https://github.com/compulim/iter-fest/pull/25)
   - `iteratorEvery`, `iteratorFilter`, `iteratorFind`, `iteratorForEach`, `iteratorMap`, `iteratorReduce`, `iteratorSome`
- `iterable*` is now `iterator*`, in PR [#26](https://github.com/compulim/iter-fest/pull/26)
- Bumped dependencies, in PR [#7](https://github.com/compulim/iter-fest/pull/7)
   - Development dependencies
      - [`@babel/preset-env@7.24.6`](https://npmjs.com/package/@babel/preset-env/v/7.24.6)
      - [`@babel/preset-typescript@7.24.6`](https://npmjs.com/package/@babel/preset-typescript/v/7.24.6)
      - [`@testing-library/react@15.0.7`](https://npmjs.com/package/@testing-library/react/v/15.0.7)
      - [`@tsconfig/recommended@1.0.6`](https://npmjs.com/package/@tsconfig/recommended/v/1.0.6)
      - [`@types/node@20.12.13`](https://npmjs.com/package/@types/node/v/20.12.13)
      - [`@types/react@18.3.3`](https://npmjs.com/package/@types/react/v/18.3.3)
      - [`@types/react-dom@18.3.0`](https://npmjs.com/package/@types/react-dom/v/18.3.0)
      - [`esbuild@0.21.4`](https://npmjs.com/package/esbuild/v/0.21.4)
      - [`react@18.3.1`](https://npmjs.com/package/react/v/18.3.1)
      - [`react-dom@18.3.1`](https://npmjs.com/package/react-dom/v/18.3.1)
      - [`typescript@5.4.5`](https://npmjs.com/package/typescript/v/5.4.5)

## [0.1.0] - 2024-05-25

- First public release

[0.1.0]: https://github.com/compulim/iter-fest/releases/tag/v0.1.0
