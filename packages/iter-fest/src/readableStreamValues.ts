/**
 * This is deprecated. You should use `ReadableStream.values` instead.
 *
 * @deprecated
 */
export function readableStreamValues<T>(
  readable: ReadableStream<T>,
  options?: ReadableStreamIteratorOptions | undefined
): AsyncIterableIterator<T> {
  return readable.values(options);
}
