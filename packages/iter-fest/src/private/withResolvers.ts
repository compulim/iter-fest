// @ts-expect-error "core-js" is not typed.
import coreJSPromiseWithResolvers from 'core-js-pure/full/promise/with-resolvers.js';

export default function withResolvers<T>(): PromiseWithResolvers<T> {
  return coreJSPromiseWithResolvers();
}
