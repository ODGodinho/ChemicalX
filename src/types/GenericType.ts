export type FunctionReturnType<ReturnType> = () => ReturnType;

export type PromiseOrSyncType<T> = Promise<T> | T;

export type OptionalArray<T> = [] | [T, ...T[]];
