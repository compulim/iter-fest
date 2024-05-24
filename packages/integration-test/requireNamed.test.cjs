const { iterableAt } = require('iterable-fest/iterableAt');
const { iterableConcat } = require('iterable-fest/iterableConcat');
const { iterableEvery } = require('iterable-fest/iterableEvery');
const { iterableFilter } = require('iterable-fest/iterableFilter');
const { iterableFind } = require('iterable-fest/iterableFind');
const { iterableFindIndex } = require('iterable-fest/iterableFindIndex');
const { iterableFindLast } = require('iterable-fest/iterableFindLast');
const { iterableFindLastIndex } = require('iterable-fest/iterableFindLastIndex');
const { iterableIncludes } = require('iterable-fest/iterableIncludes');
const { iterableIndexOf } = require('iterable-fest/iterableIndexOf');
const { iterableJoin } = require('iterable-fest/iterableJoin');
const { iterableReduce } = require('iterable-fest/iterableReduce');
const { iterableSlice } = require('iterable-fest/iterableSlice');
const { iterableSome } = require('iterable-fest/iterableSome');
const { iterableToSpliced } = require('iterable-fest/iterableToSpliced');
const { iterableToString } = require('iterable-fest/iterableToString');
const { iteratorToIterable } = require('iterable-fest/iteratorToIterable');

test('iterableAt should work', () => expect(iterableAt([1, 2, 3].values(), 1)).toBe(2));

test('iterableConcat should work', () =>
  expect(Array.from(iterableConcat([1, 2].values(), [3, 4].values()))).toEqual([1, 2, 3, 4]));

test('iterableEvery should work', () => expect(iterableEvery([1, 2, 3].values(), value => value)).toBe(true));

test('iterableFilter should work', () =>
  expect(Array.from(iterableFilter([1, 2, 3], value => value % 2))).toEqual([1, 3]));

test('iterableFind should work', () => expect(iterableFind([1, 2, 3], value => value % 2)).toBe(1));

test('iterableFindIndex should work', () => expect(iterableFindIndex([1, 2, 3], value => value % 2)).toBe(0));

test('iterableFindLast should work', () => expect(iterableFindLast([1, 2, 3], value => value % 2)).toBe(3));

test('iterableFindLastIndex should work', () => expect(iterableFindLastIndex([1, 2, 3], value => value % 2)).toBe(2));

test('iterableIncludes should work', () => expect(iterableIncludes([1, 2, 3], 2)).toBe(true));

test('iterableIndexOf should work', () => expect(iterableIndexOf([1, 2, 3], 2)).toBe(1));

test('iterableJoin should work', () => expect(iterableJoin([1, 2, 3], ', ')).toBe('1, 2, 3'));

test('iterableReduce should work', () =>
  expect(iterableReduce([1, 2, 3].values(), (previousValue, currentValue) => previousValue + currentValue, 0)).toBe(6));

test('iterableSlice should work', () => expect(Array.from(iterableSlice([1, 2, 3, 4, 5], 1, 4))).toEqual([2, 3, 4]));

test('iterableSome should work', () => expect(iterableSome([1, 2, 3].values(), value => value % 2)).toBe(true));

test('iterableToSpliced should work', () =>
  expect(Array.from(iterableToSpliced([1, 2, 3].values(), 1, 1, 9))).toEqual([1, 9, 3]));

test('iterableToString should work', () => expect(iterableToString([1, 2, 3])).toBe('1,2,3'));

test('iteratorToIterable should work', () =>
  expect(
    Array.from(
      iteratorToIterable(
        (function* () {
          yield 1;
          yield 2;
          yield 3;
        })()
      )
    )
  ).toEqual([1, 2, 3]));
