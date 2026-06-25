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

type Revert<T extends BaseEnum> = Prettify<{
  [P in keyof T as T[P]]: P;
}>

export class Enumeration<const T extends Readonly<BaseEnum>> {
  private readonly lazyValues: string[];
  //@ts-expect-error
  private _reverted?: Enumeration<Revert<T>>;

  public readonly keys: readonly KeyType<T>[];
  public readonly values: readonly ValueType<T>[];
  public readonly entries: EntriesType<T>;
  public readonly type: ValueType<T>;

  public constructor(public readonly enumeration: T) {
    this.keys = Object.keys(this.enumeration) as readonly KeyType<T>[];
    this.lazyValues = Object.values(this.enumeration);
    //@ts-expect-error
    this.entries = Object.entries(this.enumeration);
    //@ts-expect-error
    this.values = this.lazyValues as readonly ValueType<T>[];
    //@ts-expect-error
    this.type = this.values[0];
  }

  public isValidValue<P extends string>(value: P): P extends ValueType<T> ? true : false {
    return this.lazyValues.includes(value) as any;
  }

  public isValidKey<P extends string>(key: P): P extends KeyType<T> ? true : false {
    return (key in this.enumeration) as any;
  }

  public getKey<P extends ValueType<T>>(value: P) {
    //@ts-expect-error
    const entry = this.entries.find(([, v]) => v === value);
    return entry![0] as GetKeyByValue<T, P>;
  }

  public revert() {
    this.validateValuesUnique();
    
    if (!this._reverted) {
      const entries = this.keys.map(key => [this.enumeration[key], key] as const);
      const record = Object.fromEntries(entries) as Revert<T>;
      //@ts-expect-error
      const enumeration = new Enumeration<Revert<T>>(record);
      this._reverted = enumeration;
      return enumeration;
    }
    
    return this._reverted;
  }

  private validateValuesUnique(): void {
    const unique = new Set(this.lazyValues);
    if (unique.size !== this.lazyValues.length) {
      const duplicates = this.lazyValues.filter((v, i, arr) => arr.indexOf(v) !== i);
      throw new Error(`Enum values must be unique. Duplicates: ${[...new Set(duplicates)].join(', ')}`);
    }
  }
}
