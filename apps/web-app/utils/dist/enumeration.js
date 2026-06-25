"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enumeration = void 0;
class Enumeration {
    enumeration;
    lazyValues;
    //@ts-expect-error
    _reverted;
    keys;
    values;
    entries;
    type;
    constructor(enumeration) {
        this.enumeration = enumeration;
        this.keys = Object.keys(this.enumeration);
        this.lazyValues = Object.values(this.enumeration);
        //@ts-expect-error
        this.entries = Object.entries(this.enumeration);
        //@ts-expect-error
        this.values = this.lazyValues;
        //@ts-expect-error
        this.type = this.values[0];
    }
    isValidValue(value) {
        return this.lazyValues.includes(value);
    }
    isValidKey(key) {
        return (key in this.enumeration);
    }
    getKey(value) {
        //@ts-expect-error
        const entry = this.entries.find(([, v]) => v === value);
        return entry[0];
    }
    revert() {
        this.validateValuesUnique();
        if (!this._reverted) {
            const entries = this.keys.map(key => [this.enumeration[key], key]);
            const record = Object.fromEntries(entries);
            //@ts-expect-error
            const enumeration = new Enumeration(record);
            this._reverted = enumeration;
            return enumeration;
        }
        return this._reverted;
    }
    validateValuesUnique() {
        const unique = new Set(this.lazyValues);
        if (unique.size !== this.lazyValues.length) {
            const duplicates = this.lazyValues.filter((v, i, arr) => arr.indexOf(v) !== i);
            throw new Error(`Enum values must be unique. Duplicates: ${[...new Set(duplicates)].join(', ')}`);
        }
    }
}
exports.Enumeration = Enumeration;
//# sourceMappingURL=enumeration.js.map