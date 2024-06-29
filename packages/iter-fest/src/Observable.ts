// @ts-expect-error core-js is not typed.
import CoreJSObservable from 'core-js-pure/full/observable/index.js';

import { SymbolObservable } from './SymbolObservable.js';

export interface SubscriptionObserver<T> {
  /** Sends the next value in the sequence */
  next(value: T): void;

  /** Sends the sequence error */
  error(errorValue: unknown): void;

  /** Sends the completion notification */
  complete(): void;

  /** A boolean value indicating whether the subscription is closed */
  get closed(): boolean;
}

export interface Subscription {
  /** Cancels the subscription */
  unsubscribe(): void;

  /** A boolean value indicating whether the subscription is closed */
  get closed(): boolean;
}

export type SubscriberFunction<T> = (observer: SubscriptionObserver<T>) => (() => void) | Subscription | void;

export type CompleteFunction = () => void;
export type ErrorFunction = (errorValue: unknown) => void;
export type NextFunction<T> = (value: T) => void;
export type StartFunction = (subscription: Subscription) => void;

export interface Observer<T> {
  /** Receives a completion notification */
  complete?(): void;

  /** Receives the sequence error */
  error?(errorValue: unknown): void;

  /** Receives the next value in the sequence */
  next?(value: T): void;

  /** Receives the subscription object when `subscribe` is called */
  start?(subscription: Subscription): void;
}

export class Observable<T> extends CoreJSObservable {
  constructor(subscriber: SubscriberFunction<T>) {
    super(subscriber);
  }

  /** Subscribes to the sequence with an observer */
  subscribe(observer: Observer<T>): Subscription;

  /** Subscribes to the sequence with callbacks */
  subscribe(
    onNext: NextFunction<T>,
    onError?: ErrorFunction | undefined,
    onComplete?: CompleteFunction | undefined
  ): Subscription;

  subscribe(
    observerOrOnNext: Observer<T> | NextFunction<T>,
    onError?: ErrorFunction | undefined,
    onComplete?: CompleteFunction | undefined
  ): Subscription {
    return super.subscribe(observerOrOnNext, onError, onComplete);
  }

  /** Returns itself */
  [SymbolObservable](): Observable<T> {
    return this;
  }

  /** Converts items to an Observable */
  static of<T>(...items: T[]): Observable<T> {
    return CoreJSObservable.of(...items);
  }

  /** Converts an iterable to an Observable */
  static from<T>(iterable: Iterable<T>): Observable<T>;

  /** Converts an observable to an Observable */
  static from<T>(observable: Observable<T>): Observable<T>;

  static from<T>(iterableOrObservable: Iterable<T> | Observable<T>): Observable<T> {
    return CoreJSObservable.from(iterableOrObservable);
  }
}
