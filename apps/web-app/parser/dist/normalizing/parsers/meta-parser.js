"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaParser = void 0;
const expressions_1 = require("@loverry/expressions");
const enums_1 = require("@loverry/enums");
const node_path_1 = require("node:path");
class MetaParser {
    dependencies;
    constructor(dependencies) {
        this.dependencies = dependencies;
    }
    async execute({ token, meta, source, }, keys) {
        const values = this.dependencies.metaReader.readValues(meta, keys);
        const object = {};
        for (const index in keys) {
            const key = keys[index];
            const value = values[index];
            const data = (await this[key]({ value, source, token }));
            const property = enums_1.Properties[key];
            object[property] = data;
        }
        return object;
    }
    async [enums_1.MetaKeys.target]({ value, source }) {
        if (!value) {
            this.dependencies.errors.add("Target is not defined in file", source);
            return undefined;
        }
        const target = (() => {
            const match = value.match(/\[\[(.*?)\]\]/);
            if (!match) {
                return value;
            }
            return match[1];
        })();
        const targetId = await this.dependencies.metaReader.extractIdFromTarget({
            directory: this.dependencies.files.normilizePath((0, node_path_1.join)(source.file, "..")),
            target,
        });
        return targetId;
    }
    async [enums_1.MetaKeys.transition]({ value }) {
        return value;
    }
    async [enums_1.MetaKeys.animation]({ value, source, token, }) {
        if (!value)
            return undefined;
        const registry = this.getAnimationRegistry(token);
        if (!registry[value]) {
            this.dependencies.errors.add(`Unknown animation "${value}"`, source);
            return undefined;
        }
        return value;
    }
    async [enums_1.MetaKeys.condition]({ value, source, }) {
        if (!value)
            return undefined;
        try {
            return expressions_1.Parser.execute(value);
        }
        catch (err) {
            this.dependencies.errors.add(`Failed to parse condition "${value}": ${err}`, source);
            return undefined;
        }
    }
    async [enums_1.MetaKeys.events]({ value, source }) {
        if (!value)
            return undefined;
        const parts = value.trim().split(/\s+/);
        const id = parts[0];
        if (!this.dependencies.registries.events[id]) {
            this.dependencies.errors.add(`Unknown event "${id}"`, source);
            return undefined;
        }
        const args = parts.slice(1).map((a) => this.parseEventArgument(a));
        return [{ id: id, arguments: args }];
    }
    async [enums_1.MetaKeys.mode]({ value }) {
        if (!value)
            return undefined;
        return ["jump", "call", "return"].includes(value) ? value : undefined;
    }
    async [enums_1.MetaKeys.effects]({ value, source, }) {
        if (!value)
            return undefined;
        const match = value.match(/^(\w+)\s*([+\-]?=)\s*(.+)$/);
        if (!match) {
            this.dependencies.errors.add(`Invalid effect syntax: "${value}"`, source);
            return undefined;
        }
        const variable = match[1];
        const operator = match[2];
        const valueString = match[3].trim();
        if (!this.dependencies.registries.variables[variable]) {
            this.dependencies.errors.add(`Unknown variable "${variable}"`, source);
            return undefined;
        }
        let runtimeValue;
        if (/^-?\d+(\.\d+)?$/.test(valueString)) {
            runtimeValue = parseFloat(valueString);
        }
        else if (valueString === "true") {
            runtimeValue = true;
        }
        else if (valueString === "false") {
            runtimeValue = false;
        }
        else {
            runtimeValue = valueString;
        }
        return [
            {
                variable: variable,
                operator,
                value: runtimeValue,
                source,
            },
        ];
    }
    async [enums_1.MetaKeys.format]({ value }) {
        if (!value) {
            return "real";
        }
        return ["real", "text", "voice"].includes(value) ? value : undefined;
    }
    async [enums_1.MetaKeys.text]({ value }) {
        return value || "";
    }
    async [enums_1.MetaKeys.severity]({ value }) {
        if (!value)
            return undefined;
        return ["info", "warning", "error"].includes(value) ? value : undefined;
    }
    async [enums_1.MetaKeys.action]({ value }) {
        return value;
    }
    async [enums_1.MetaKeys.character]({ value, source, }) {
        return this.parseRegistryValue({ value, source }, {
            name: "character",
            registry: this.dependencies.registries.characters,
            isOption: false,
        });
    }
    async [enums_1.MetaKeys.sprite]({ value, source }) {
        if (!value) {
            this.dependencies.errors.add("Sprite missing file", source);
            return undefined;
        }
        return value;
    }
    async [enums_1.MetaKeys.file]({ value, source }) {
        if (!value) {
            this.dependencies.errors.add("Background missing file", source);
            return undefined;
        }
        return value;
    }
    async [enums_1.MetaKeys.hide]({ value, source }) {
        if (!value)
            return undefined;
        const lower = value.toLowerCase();
        if (["t", "д", "да", "true"].includes(lower))
            return true;
        if (["f", "н", "нет", "false"].includes(lower))
            return false;
        this.dependencies.errors.add(`Invalid hide value: "${value}". Use true/false`, source);
        return undefined;
    }
    async [enums_1.MetaKeys.position]({ value, source, }) {
        if (!value)
            return undefined;
        const num = Number(value);
        if (!isNaN(num))
            return num;
        const normalized = value.toLowerCase();
        if (["left", "center", "right"].includes(normalized)) {
            return normalized;
        }
        this.dependencies.errors.add(`Invalid position: "${value}". Allowed: left, center, right`, source);
        return undefined;
    }
    async [enums_1.MetaKeys.layer]({ value, source }) {
        if (!value)
            return undefined;
        return this.parseNumber({ value, source });
    }
    async [enums_1.MetaKeys.emotion]({ value, source, }) {
        return this.parseRegistryValue({ value, source }, {
            name: "emotion",
            registry: this.dependencies.registries.emotions,
            isOption: true,
        });
    }
    async [enums_1.MetaKeys.intensity]({ value, source, }) {
        if (!value)
            return undefined;
        const intensity = this.parseNumber({ value, source });
        if (intensity === undefined)
            return undefined;
        if (intensity < 0 || intensity > 1) {
            this.dependencies.errors.add(`Intensity must be between 0 and 1, got ${intensity}`, source);
            return undefined;
        }
        return intensity;
    }
    async [enums_1.MetaKeys.duration]({ value, source, }) {
        if (!value)
            return undefined;
        const duration = this.parseNumber({ value, source });
        if (duration === undefined)
            return undefined;
        if (duration <= 0) {
            this.dependencies.errors.add(`Duration must be positive, got ${duration}`, source);
            return undefined;
        }
        return duration;
    }
    parseEventArgument(argument) {
        if (/^-?\d+(\.\d+)?$/.test(argument))
            return parseFloat(argument);
        if (argument === "true")
            return true;
        if (argument === "false")
            return false;
        return argument;
    }
    async parseRegistryValue({ value, source }, options) {
        if (!options.isOption && !value) {
            this.dependencies.errors.add(`${options.name} missing`, source);
            return undefined;
        }
        if (!value)
            return undefined;
        if (!options.registry[value]) {
            this.dependencies.errors.add(`Unknown ${options.name} "${value}"`, source);
            return undefined;
        }
        return value;
    }
    getAnimationRegistry(token) {
        if (token.type === enums_1.TokenType.callout_background) {
            return this.dependencies.registries.backgroundAnimations;
        }
        if (token.type === enums_1.TokenType.callout_character) {
            return this.dependencies.registries.characterAnimations;
        }
        throw new Error("Bad token type");
    }
    parseNumber({ value, source }) {
        const number = Number(value);
        if (isNaN(number)) {
            this.dependencies.errors.add(`"${value}" is not a number`, source);
            return undefined;
        }
        return number;
    }
}
exports.MetaParser = MetaParser;
//# sourceMappingURL=meta-parser.js.map