export default function isAbortError(error: unknown): error is Error & { name: 'AbortError' } {
  return (
    !!error &&
    typeof error === 'object' &&
    (typeof DOMException === 'undefined' ? error instanceof Error : error instanceof DOMException) &&
    'name' in error &&
    error.name === 'AbortError'
  );
}
