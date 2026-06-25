"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeParser = void 0;
const enums_1 = require("@loverry/enums");
const choice_parser_1 = require("./choice-parser");
class NodeParser {
    dependencies;
    options;
    choiceParser;
    constructor(dependencies, options) {
        this.dependencies = dependencies;
        this.options = options;
        this.choiceParser = new choice_parser_1.ChoiceParser({
            ...dependencies,
            nodeParser: this,
        });
    }
    async execute(file) {
        const nodes = [];
        const metaReader = this.dependencies.metaReader;
        while (!metaReader.isEof()) {
            const token = metaReader.getToken();
            const meta = metaReader.readLines();
            const source = metaReader.getSourceLocationFromToken(file, token);
            if (!this[token.type]) {
                this.dependencies.errors.add(`Unexpected token ${token.type}`, source);
                this.consume();
                continue;
            }
            const method = this[token.type];
            const node = await method.call(this, {
                meta,
                source,
                token,
            });
            if (!node) {
                continue;
            }
            nodes.push(node);
        }
        if (this.dependencies.errors.hasErrors()) {
            const errors = this.dependencies.errors
                .getErrors()
                .map((error) => {
                return `[${error.file}:${error.line}:${error.column}] ${error.message}`;
            })
                .join("\n");
            throw new Error(`Normalization failed:\n${errors}`);
        }
        return {
            metadata: this.options.metadata,
            nodes: nodes,
            source: this.dependencies.metaReader.getSourceLocation(file, {
                line: 0,
                column: 0,
            }),
        };
    }
    [enums_1.TokenType.empty_line] = this.consume;
    [enums_1.TokenType.meta_line] = this.consume;
    [enums_1.TokenType.ignored_line] = this.consume;
    [enums_1.TokenType.eof] = () => null;
    async [enums_1.TokenType.action_line]({ token, source, }) {
        this.dependencies.metaReader.consume({
            expectedType: enums_1.TokenType.action_line,
        });
        const text = token.value.replace(/^>\s?/, "").trim();
        const id = this.dependencies.idGenerator.execute("action", source, text);
        return {
            id,
            type: "action",
            text,
            source,
        };
    }
    async [enums_1.TokenType.callout_quote](parameters) {
        this.dependencies.metaReader.consume({
            expectedType: enums_1.TokenType.callout_quote,
        });
        return this.build([
            enums_1.MetaKeys.character,
            enums_1.MetaKeys.emotion,
            enums_1.MetaKeys.condition,
            enums_1.MetaKeys.action,
            enums_1.MetaKeys.effects,
            enums_1.MetaKeys.events,
            enums_1.MetaKeys.text,
        ], parameters, "dialogue", [enums_1.MetaKeys.character]);
    }
    async [enums_1.TokenType.callout_info](parameters) {
        this.dependencies.metaReader.consume({
            expectedType: enums_1.TokenType.callout_info,
        });
        return this.build([
            enums_1.MetaKeys.character,
            enums_1.MetaKeys.condition,
            enums_1.MetaKeys.action,
            enums_1.MetaKeys.effects,
            enums_1.MetaKeys.events,
            enums_1.MetaKeys.text,
        ], parameters, "thought", [enums_1.MetaKeys.character]);
    }
    async [enums_1.TokenType.callout_system](parameters) {
        this.dependencies.metaReader.consume({
            expectedType: enums_1.TokenType.callout_system,
        });
        return this.build([
            enums_1.MetaKeys.severity,
            enums_1.MetaKeys.condition,
            enums_1.MetaKeys.effects,
            enums_1.MetaKeys.events,
            enums_1.MetaKeys.text,
        ], parameters, "system", []);
    }
    async [enums_1.TokenType.callout_transition](parameters) {
        this.dependencies.metaReader.consume({
            expectedType: enums_1.TokenType.callout_transition,
        });
        return this.build([
            enums_1.MetaKeys.target,
            enums_1.MetaKeys.mode,
            enums_1.MetaKeys.condition,
            enums_1.MetaKeys.effects,
            enums_1.MetaKeys.events,
        ], parameters, "transition", []);
    }
    async [enums_1.TokenType.choice_line](parameters) {
        return this.choiceParser.execute(parameters.source.file);
    }
    async [enums_1.TokenType.callout_background](parameters) {
        this.dependencies.metaReader.consume({
            expectedType: enums_1.TokenType.callout_background,
        });
        return this.build([
            enums_1.MetaKeys.file,
            enums_1.MetaKeys.transition,
            enums_1.MetaKeys.animation,
            enums_1.MetaKeys.condition,
        ], parameters, "background", [enums_1.MetaKeys.file]);
    }
    async [enums_1.TokenType.callout_character](parameters) {
        this.dependencies.metaReader.consume({
            expectedType: enums_1.TokenType.callout_character,
        });
        return this.build([
            enums_1.MetaKeys.character,
            enums_1.MetaKeys.sprite,
            enums_1.MetaKeys.position,
            enums_1.MetaKeys.layer,
            enums_1.MetaKeys.hide,
            enums_1.MetaKeys.animation,
            enums_1.MetaKeys.condition,
            enums_1.MetaKeys.emotion,
        ], parameters, "character", [enums_1.MetaKeys.character, enums_1.MetaKeys.sprite, enums_1.MetaKeys.position]);
    }
    async [enums_1.TokenType.callout_effect](parameters) {
        this.dependencies.metaReader.consume({
            expectedType: enums_1.TokenType.callout_effect,
        });
        return this.build([
            enums_1.MetaKeys.effects,
            enums_1.MetaKeys.intensity,
            enums_1.MetaKeys.duration,
            enums_1.MetaKeys.condition,
        ], parameters, "effect", [enums_1.MetaKeys.effects]);
    }
    consume() {
        this.dependencies.metaReader.consume({});
        return null;
    }
    async build(keys, parameters, type, required) {
        const meta = this.dependencies.metaReader.readLines();
        const data = await this.dependencies.metaParser.execute({
            ...parameters,
            meta,
        }, keys);
        const isNull = required.some((key) => {
            const property = enums_1.Properties[key];
            const propertyExists = property in data;
            if (!propertyExists) {
                return false;
            }
            const dataValue = data[property];
            if (!dataValue) {
                this.dependencies.errors.add(`Missing ${property} in "${type}"-token`, parameters.source);
            }
            return !dataValue;
        });
        if (isNull) {
            return null;
        }
        const id = this.dependencies.idGenerator.execute(type, parameters.source, JSON.stringify(data));
        return {
            id,
            type,
            ...data,
        };
    }
}
exports.NodeParser = NodeParser;
//# sourceMappingURL=node-parser.js.map