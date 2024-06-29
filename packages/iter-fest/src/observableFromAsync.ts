import { Observable } from './Observable.js';

export function observableFromAsync<T>(iterable: AsyncIterable<T>): Observable<T> {
  return new Observable(subscriber => {
    let closed = false;

    (async function () {
      try {
        for await (const value of iterable) {
          if (closed) {
            break;
          }

          subscriber.next(value);
        }

        subscriber.complete();
      } catch (error) {
        subscriber.error(error);
      }
    })();

    return () => {
      closed = true;
    };
  });
}
