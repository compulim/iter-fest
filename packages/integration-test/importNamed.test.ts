import { iterableConcat } from 'iterable-fest/iterableConcat';
import { iterableEvery } from 'iterable-fest/iterableEvery';
import { iterableFilter } from 'iterable-fest/iterableFilter';
import { iterableFind } from 'iterable-fest/iterableFind';
import { iterableFindIndex } from 'iterable-fest/iterableFindIndex';
import { iterableFindLast } from 'iterable-fest/iterableFindLast';
import { iterableFindLastIndex } from 'iterable-fest/iterableFindLastIndex';
import { iterableIncludes } from 'iterable-fest/iterableIncludes';
import { iterableIndexOf } from 'iterable-fest/iterableIndexOf';
import { iterableReduce } from 'iterable-fest/iterableReduce';
import { iterableSlice } from 'iterable-fest/iterableSlice';
import { iterableSome } from 'iterable-fest/iterableSome';

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

test('iterableReduce should work', () =>
  expect(iterableReduce([1, 2, 3].values(), (previousValue, currentValue) => previousValue + currentValue, 0)).toBe(6));

test('iterableSlice should work', () => expect(Array.from(iterableSlice([1, 2, 3, 4, 5], 1, 4))).toEqual([2, 3, 4]));

test('iterableSome should work', () => expect(iterableSome([1, 2, 3].values(), value => value % 2)).toBe(true));
