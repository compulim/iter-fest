import withResolvers from './private/withResolvers';

import { Observable } from './Observable';

const COMPLETE = Symbol('complete');
const NEXT = Symbol('next');
const THROW = Symbol('throw');

type Entry<T> = [typeof COMPLETE] | [typeof NEXT, T] | [typeof THROW, unknown];

export function observableValues<T>(observable: Observable<T>): AsyncIterableIterator<T> {
  const queue: Entry<T>[] = [];
  let deferred = withResolvers<Entry<T>>();

  const push = (entry: Entry<T>) => {
    queue.push(entry);
    deferred.resolve(entry);
    deferred = withResolvers();
  };

  const subscription = observable.subscribe({
    complete() {
      push([COMPLETE]);
    },
    error(err: unknown) {
      push([THROW, err]);
    },
    next(value: T) {
      push([NEXT, value]);
    }
  });

  const asyncIterableIterator: AsyncIterableIterator<T> = {
    [Symbol.asyncIterator]() {
      return this;
    },
    async next(): Promise<IteratorResult<T>> {
      let entry = queue.shift();

      if (!entry) {
        entry = await deferred.promise;
        queue.shift();
      }

      switch (entry[0]) {
        case COMPLETE:
          return { done: true, value: undefined };

        case THROW:
          throw entry[1];

        case NEXT:
          return { done: false, value: entry[1] };
      }
    },
    async return() {
      subscription.unsubscribe();

      return { done: true, value: undefined };
    },
    async throw() {
      subscription.unsubscribe();

      return { done: true, value: undefined };
    }
  };

  return asyncIterableIterator;
}
