import { iteratorToIterable } from 'iter-fest/iteratorToIterable';
import { Observable } from 'iter-fest/observable';

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
