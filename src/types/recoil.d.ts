import 'recoil';

declare module 'recoil' {
  export type Parameter =
    | void
    | null
    | boolean
    | number
    | string
    | Readonly<object>
    | ReadonlyArray<unknown>;

  export interface ReadOnlySelectorFamilyOptions<T, P extends Parameter> {
    key: string;
    get: (parameter: P) => ReadOnlySelectorOptions<T>['get'];
    dangerouslyAllowMutability?: boolean;
  }

  export interface ReadWriteSelectorFamilyOptions<T, P extends Parameter>
    extends ReadOnlySelectorFamilyOptions<T, P> {
    set: (parameter: P) => ReadWriteSelectorOptions<T>['set'];
  }

  export function selectorFamily<T, P extends Parameter>(
    options: ReadWriteSelectorFamilyOptions<T, P>
  ): (parameter: P) => RecoilState<T>;
  export function selectorFamily<T, P extends Parameter>(
    options: ReadOnlySelectorFamilyOptions<T, P>
  ): (parameter: P) => RecoilValueReadOnly<T>;
}
