export default function hasResolvedOrRejected<T>(promise: Promise<T>): Promise<boolean> {
  return Promise.race([promise.then(() => true), new Promise<false>(resolve => setTimeout(() => resolve(false), 0))]);
}
