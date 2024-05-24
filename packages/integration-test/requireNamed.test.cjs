const { iterableAt } = require('iter-fest/iterableAt');
const { iterableConcat } = require('iter-fest/iterableConcat');
const { iterableEntries } = require('iter-fest/iterableEntries');
const { iterableEvery } = require('iter-fest/iterableEvery');
const { iterableFilter } = require('iter-fest/iterableFilter');
const { iterableFind } = require('iter-fest/iterableFind');
const { iterableFindIndex } = require('iter-fest/iterableFindIndex');
const { iterableFindLast } = require('iter-fest/iterableFindLast');
const { iterableFindLastIndex } = require('iter-fest/iterableFindLastIndex');
const { iterableForEach } = require('iter-fest/iterableForEach');
const { iterableIncludes } = require('iter-fest/iterableIncludes');
const { iterableIndexOf } = require('iter-fest/iterableIndexOf');
const { iterableJoin } = require('iter-fest/iterableJoin');
const { iterableKeys } = require('iter-fest/iterableKeys');
const { iterableMap } = require('iter-fest/iterableMap');
const { iterableReduce } = require('iter-fest/iterableReduce');
const { iterableSlice } = require('iter-fest/iterableSlice');
const { iterableSome } = require('iter-fest/iterableSome');
const { iterableToSpliced } = require('iter-fest/iterableToSpliced');
const { iterableToString } = require('iter-fest/iterableToString');
const { iteratorToIterable } = require('iter-fest/iteratorToIterable');

test('iterableAt should work', () => expect(iterableAt([1, 2, 3].values(), 1)).toBe(2));

test('iterableConcat should work', () =>
  expect(Array.from(iterableConcat([1, 2].values(), [3, 4].values()))).toEqual([1, 2, 3, 4]));

test('iterableEntries should work', () =>
  expect(Array.from(iterableEntries(['A', 'B', 'C']))).toEqual([
    [0, 'A'],
    [1, 'B'],
    [2, 'C']
  ]));

test('iterableEvery should work', () => expect(iterableEvery([1, 2, 3].values(), value => value)).toBe(true));

test('iterableFilter should work', () =>
  expect(Array.from(iterableFilter([1, 2, 3], value => value % 2))).toEqual([1, 3]));

test('iterableFind should work', () => expect(iterableFind([1, 2, 3], value => value % 2)).toBe(1));

test('iterableFindIndex should work', () => expect(iterableFindIndex([1, 2, 3], value => value % 2)).toBe(0));

test('iterableFindLast should work', () => expect(iterableFindLast([1, 2, 3], value => value % 2)).toBe(3));

test('iterableFindLastIndex should work', () => expect(iterableFindLastIndex([1, 2, 3], value => value % 2)).toBe(2));

test('iterableForEach should work', () => {
  const callbackfn = jest.fn();

  iterableForEach([1, 2, 3], callbackfn);

  expect(callbackfn).toHaveBeenCalledTimes(3);
});

test('iterableIncludes should work', () => expect(iterableIncludes([1, 2, 3], 2)).toBe(true));

test('iterableIndexOf should work', () => expect(iterableIndexOf([1, 2, 3], 2)).toBe(1));

test('iterableJoin should work', () => expect(iterableJoin([1, 2, 3], ', ')).toBe('1, 2, 3'));

test('iterableKeys should work', () => expect(Array.from(iterableKeys(['A', 'B', 'C']))).toEqual([0, 1, 2]));

test('iterableMap should work', () =>
  expect(Array.from(iterableMap([1, 2, 3], value => String.fromCharCode(value + 64)))).toEqual(['A', 'B', 'C']));

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
        (() => {
          let value = 0;

          return { next: () => (++value <= 3 ? { done: false, value } : { done: true, value: undefined }) };
        })()
      )
    )
  ).toEqual([1, 2, 3]));
