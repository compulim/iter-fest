import { iterableAt } from 'iter-fest/iterableAt';
import { iterableConcat } from 'iter-fest/iterableConcat';
import { iterableEntries } from 'iter-fest/iterableEntries';
import { iterableEvery } from 'iter-fest/iterableEvery';
import { iterableFilter } from 'iter-fest/iterableFilter';
import { iterableFind } from 'iter-fest/iterableFind';
import { iterableFindIndex } from 'iter-fest/iterableFindIndex';
import { iterableFindLast } from 'iter-fest/iterableFindLast';
import { iterableFindLastIndex } from 'iter-fest/iterableFindLastIndex';
import { iterableForEach } from 'iter-fest/iterableForEach';
import { iterableIncludes } from 'iter-fest/iterableIncludes';
import { iterableIndexOf } from 'iter-fest/iterableIndexOf';
import { iterableJoin } from 'iter-fest/iterableJoin';
import { iterableKeys } from 'iter-fest/iterableKeys';
import { iterableMap } from 'iter-fest/iterableMap';
import { iterableReduce } from 'iter-fest/iterableReduce';
import { iterableSlice } from 'iter-fest/iterableSlice';
import { iterableSome } from 'iter-fest/iterableSome';
import { iterableToSpliced } from 'iter-fest/iterableToSpliced';
import { iterableToString } from 'iter-fest/iterableToString';
import { iteratorToIterable } from 'iter-fest/iteratorToIterable';
import { Observable } from 'iter-fest/observable';
import { SymbolObservable } from 'iter-fest/symbolObservable';

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
        ((): Iterator<number> => {
          let value = 0;

          return { next: () => (++value <= 3 ? { done: false, value } : { done: true, value: undefined }) };
        })()
      )
    )
  ).toEqual([1, 2, 3]));

test('Observable should work', () => {
  const next = jest.fn();
  const complete = jest.fn();

  const observable = new Observable(observer => {
    observer.next(1);
    observer.complete();
  });

  observable.subscribe({ complete, next });

  expect(next).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenNthCalledWith(1, 1);
  expect(complete).toHaveBeenCalledTimes(1);
});

test('SymbolObservable should work', () => {
  const observable = new Observable(() => {});

  expect(observable[SymbolObservable]()).toBe(observable);
});
