# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-04-02

### Added

- `generatorWithLastValue`/`asyncGeneratorWithLastValue` will passthrough function calls to underlying `Generator`/`AsyncGenerator`, in PR [#65](https://github.com/compulim/iter-fest/pull/65)
- ~`readableStreamValues` now allows early breakage via `AbortSignal`, in PR [#69](https://github.com/compulim/iter-fest/pull/69)~
- `readableStreamValuesWithSignal` extends `ReadableStream.values` to support early termination via `AbortSignal`, in PR [#71](https://github.com/compulim/iter-fest/pull/71)

### Changed

- Added [ESLint import/export syntax](https://npmjs.com/package/eslint-plugin-import), in PR [#43](https://github.com/compulim/iter-fest/pull/43)
- Added [`publint`](https://npmjs.com/package/publint), in PR [#45](https://github.com/compulim/iter-fest/pull/45)
- Bumped dependencies, in PR [#65](https://github.com/compulim/iter-fest/pull/65)
  - Development dependencies
    - [`@babel/preset-env@7.25.8`](https://npmjs.com/package/@babel/preset-env/v/7.25.8)
    - [`@babel/preset-typescript@7.25.7`](https://npmjs.com/package/@babel/preset-typescript/v/7.25.7)
    - [`@testing-library/react@16.0.1`](https://npmjs.com/package/@testing-library/react/v/16.0.1)
    - [`@tsconfig/recommended@1.0.7`](https://npmjs.com/package/@tsconfig/recommended/v/1.0.7)
    - [`@types/jest@29.5.13`](https://npmjs.com/package/@types/jest/v/29.5.13)
    - [`@types/node@22.7.5`](https://npmjs.com/package/@types/node/v/22.7.5)
    - [`@types/react@18.3.11`](https://npmjs.com/package/@types/react/v/18.3.11)
    - [`@types/react-dom@18.3.1`](https://npmjs.com/package/@types/react-dom/v/18.3.1)
    - [`@typescript-eslint/eslint-plugin@8.8.1`](https://npmjs.com/package/@typescript-eslint/eslint-plugin/v/8.8.1)
    - [`@typescript-eslint/parser@8.8.1`](https://npmjs.com/package/@typescript-eslint/parser/v/8.8.1)
    - [`core-js-pure@3.38.1`](https://npmjs.com/package/core-js-pure/v/3.38.1)
    - [`esbuild@0.24.0`](https://npmjs.com/package/esbuild/v/0.24.0)
    - [`eslint@9.12.0`](https://npmjs.com/package/eslint/v/9.12.0)
    - [`eslint-plugin-import@2.31.0`](https://npmjs.com/package/eslint-plugin-import/v/2.31.0)
    - [`eslint-plugin-prettier@5.2.1`](https://npmjs.com/package/eslint-plugin-prettier/v/5.2.1)
    - [`eslint-plugin-react@7.37.1`](https://npmjs.com/package/eslint-plugin-react/v/7.37.1)
    - [`mocha@10.7.3`](https://npmjs.com/package/mocha/v/10.7.3)
    - [`prettier@3.3.3`](https://npmjs.com/package/prettier/v/3.3.3)
    - [`sinon@19.0.2`](https://npmjs.com/package/sinon/v/19.0.2)
    - [`tsup@8.3.0`](https://npmjs.com/package/tsup/v/8.3.0)
    - [`typescript@5.6.3`](https://npmjs.com/package/typescript/v/5.6.3)

### Removed

- 💥 `readableStreamValues` is removed in favor of native [`ReadableStream.values`](https://streams.spec.whatwg.org/#rs-asynciterator), in PR [#71](https://github.com/compulim/iter-fest/pull/71)

## [0.2.1] - 2024-07-05

### Changed

- Bumped dependencies, in PR [#39](https://github.com/compulim/iter-fest/pull/39)
  - Development dependencies
    - [`@babel/preset-env@7.24.7`](https://npmjs.com/package/@babel/preset-env/v/7.24.7)
    - [`@babel/preset-typescript@7.24.7`](https://npmjs.com/package/@babel/preset-typescript/v/7.24.7)
    - [`@testing-library/react@16.0.0`](https://npmjs.com/package/@testing-library/react/v/16.0.0)
    - [`@types/node@20.14.9`](https://npmjs.com/package/@types/node/v/20.14.9)
    - [`esbuild@0.21.5`](https://npmjs.com/package/esbuild/v/0.21.5)
    - [`prettier@3.3.2`](https://npmjs.com/package/prettier/v/3.3.2)
    - [`tsup@8.1.0`](https://npmjs.com/package/tsup/v/8.1.0)
    - [`typescript@5.5.2`](https://npmjs.com/package/typescript/v/5.5.2)

### Fixed

- Fixed ESM imports under Node.js, in PR [#37](https://github.com/compulim/iter-fest/pull/37) and [#38](https://github.com/compulim/iter-fest/pull/38)

## [0.2.0] - 2024-06-16

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
- Added `observableValues` in PR [#30](https://github.com/compulim/iter-fest/pull/30)

### Changed

- 💥 `iterable*` is now `iterator*` to align closer to TC39 iterator helper proposal, in PR [#26](https://github.com/compulim/iter-fest/pull/26)
- Following functions will be using ponyfill from `core-js-pure` with types, in PR [#24](https://github.com/compulim/iter-fest/pull/24) and [#25](https://github.com/compulim/iter-fest/pull/25)
  - `iteratorEvery`, `iteratorFilter`, `iteratorFind`, `iteratorForEach`, `iteratorMap`, `iteratorReduce`, `iteratorSome`
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

[0.3.0]: https://github.com/compulim/iter-fest/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/compulim/iter-fest/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/compulim/iter-fest/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/compulim/iter-fest/releases/tag/v0.1.0
