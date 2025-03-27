export default function abortSignalAsRejectedPromise(abortSignal: AbortSignal): Promise<never> {
  return new Promise((_, reject) => {
    if (abortSignal.aborted) {
      return reject(new Error('Aborted'));
    }

    abortSignal.addEventListener('abort', () => reject(new Error('Aborted')), { once: true });
  });
}
