export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type RequireAtLeast<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

// Set Required attributes
// type Foo = {
//   a?: number;
//   b: string;
//   c?: boolean;
// }
// type SomeRequired = SetRequired<Foo, 'b' | 'c'>;
export type SetRequired<
  BaseType,
  Keys extends keyof BaseType = keyof BaseType
> = Pick<BaseType, Exclude<keyof BaseType, Keys>> &
  Required<Pick<BaseType, Keys>> extends infer InferredType
  ? { [KeyType in keyof InferredType]: InferredType[KeyType] }
  : never
