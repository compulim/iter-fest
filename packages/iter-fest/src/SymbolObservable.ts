// @ts-expect-error core-js is not typed.
import CoreJSSymbolObservable from 'core-js-pure/features/symbol/observable';

const SymbolObservable: unique symbol = CoreJSSymbolObservable;

export { SymbolObservable };
