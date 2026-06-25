export type Prettify<T> = {
    [P in keyof T]: T[P];
} & {};
type BaseEnum = Record<string, string>;
type ValueType<T extends Readonly<BaseEnum>> = Prettify<T[keyof T]>;
type KeyType<T extends Readonly<BaseEnum>> = Prettify<keyof T>;
type EntriesType<T extends BaseEnum> = Prettify<{
    [P in keyof T]: [P, T[P]];
}[keyof T][]>;
type GetKeyByValue<T extends BaseEnum, Value extends ValueType<T>> = {
    [K in keyof T]: T[K] extends Value ? K : never;
}[keyof T];
export declare class Enumeration<const T extends Readonly<BaseEnum>> {
    readonly enumeration: T;
    private readonly lazyValues;
    private _reverted?;
    readonly keys: readonly KeyType<T>[];
    readonly values: readonly ValueType<T>[];
    readonly entries: EntriesType<T>;
    readonly type: ValueType<T>;
    constructor(enumeration: T);
    isValidValue<P extends string>(value: P): P extends ValueType<T> ? true : false;
    isValidKey<P extends string>(key: P): P extends KeyType<T> ? true : false;
    getKey<P extends ValueType<T>>(value: P): GetKeyByValue<T, P>;
    revert(): Enumeration<{ [P_1 in keyof T as T[P_1]]: P_1; } extends infer T_1 ? { [P in keyof T_1]: T_1[P]; } : never>;
    private validateValuesUnique;
}
export {};
//# sourceMappingURL=enumeration.d.ts.map