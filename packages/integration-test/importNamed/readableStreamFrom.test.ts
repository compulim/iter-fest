import { readableStreamFrom } from 'iter-fest/readableStreamFrom';

test('readableStreamFrom should work', async () => {
  const iterable = [1, 2, 3].values();

  const reader = readableStreamFrom(iterable).getReader();

  await expect(reader.read()).resolves.toEqual({ done: false, value: 1 });
  await expect(reader.read()).resolves.toEqual({ done: false, value: 2 });
  await expect(reader.read()).resolves.toEqual({ done: false, value: 3 });
  await expect(reader.read()).resolves.toEqual({ done: true, value: undefined });
});
