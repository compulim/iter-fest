export default function hasResolved(promise: Promise<unknown>): Promise<boolean> {
  return Promise.race([promise.then(() => true), Promise.resolve(false)]);
}
