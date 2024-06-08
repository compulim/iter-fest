// @ts-expect-error "core-js" is not typed.
import coreJSPromiseWithResolvers from 'core-js-pure/full/promise/with-resolvers';

export default function withResolvers<T>(): PromiseWithResolvers<T> {
  return coreJSPromiseWithResolvers();
}
