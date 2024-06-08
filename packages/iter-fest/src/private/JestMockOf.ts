// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JestMockOf<T extends (this: any, ...args: any[]) => any> = jest.Mock<
  ReturnType<T>,
  Parameters<T>,
  ThisParameterType<T>
>;
