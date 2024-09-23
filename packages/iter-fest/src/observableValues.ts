import { type Observable } from './Observable.ts';
import { observableSubscribeAsReadable } from './observableSubscribeAsReadable.ts';
import { readableStreamValues } from './readableStreamValues.ts';

export function observableValues<T>(observable: Observable<T>): AsyncIterableIterator<T> {
  const readable = observableSubscribeAsReadable(observable);
  const iterable = readableStreamValues(readable);

  const cancellableIterable: AsyncIterableIterator<T> = {
    [Symbol.asyncIterator]() {
      return cancellableIterable;
    },
    next() {
      return iterable.next();
    },
    return() {
      try {
        return iterable.return?.() ?? Promise.resolve({ done: true, value: undefined });
      } finally {
        readable.cancel();
      }
    },
    throw(error) {
      return iterable.throw?.(error) ?? Promise.resolve({ done: true, value: undefined });
    }
  };

  return cancellableIterable;
}
