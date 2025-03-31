import { type Observable } from './Observable.ts';
import { observableSubscribeAsReadable } from './observableSubscribeAsReadable.ts';

export function observableValues<T>(observable: Observable<T>): AsyncIterableIterator<T> {
  return observableSubscribeAsReadable(observable).values();
}
