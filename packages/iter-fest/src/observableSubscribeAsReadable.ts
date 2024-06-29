import type { Observable, Subscription } from './Observable.js';

export function observableSubscribeAsReadable<T>(observable: Observable<T>): ReadableStream<T> {
  let subscription: Subscription;

  return new ReadableStream<T>({
    cancel() {
      subscription.unsubscribe();
    },
    start(controller) {
      subscription = observable.subscribe({
        complete() {
          controller.close();
        },
        error(err: unknown) {
          controller.error(err);
        },
        next(value) {
          controller.enqueue(value);
        }
      });
    }
  });
}
