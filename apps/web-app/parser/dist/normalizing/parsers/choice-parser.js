"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChoiceParser = void 0;
const enums_1 = require("@loverry/enums");
class ChoiceParser {
    dependencies;
    constructor(dependencies) {
        this.dependencies = dependencies;
    }
    async execute(file) {
        const meta = this.dependencies.metaReader;
        const token = meta.consume({
            expectedType: enums_1.TokenType.choice_line,
        });
        const source = meta.getSourceLocationFromToken(file, token);
        const options = [];
        const firstOption = await this.parseOption({ file, token });
        if (firstOption) {
            options.push(firstOption);
        }
        while (!meta.isEof() && meta.getToken()?.type === enums_1.TokenType.choice_line) {
            const token = meta.consume({ expectedType: enums_1.TokenType.choice_line });
            const option = await this.parseOption({ file, token });
            if (!option) {
                continue;
            }
            options.push(option);
        }
        const id = this.dependencies.idGenerator.execute("choice", source, JSON.stringify(options));
        return {
            id,
            type: "choice",
            options,
            source,
        };
    }
    async parseOption({ token, file, }) {
        const match = token.lowerValue.match(/\*\*выбор:\*\*\s*(.+)/);
        const text = match ? match[1].trim() : "";
        const meta = this.dependencies.metaReader.readLines();
        const source = this.dependencies.metaReader.getSourceLocationFromToken(file, token);
        const id = this.dependencies.idGenerator.execute("ChoiceOption", source, text);
        const [condition, effects, events] = this.dependencies.metaReader.readValues(meta, [
            enums_1.MetaKeys.condition,
            enums_1.MetaKeys.effects,
            enums_1.MetaKeys.events,
        ]);
        const nodes = [];
        while (!this.dependencies.metaReader.isEof()) {
            const nextToken = this.dependencies.metaReader.getToken();
            const nodeMeta = this.dependencies.metaReader.readLines();
            const nodeSource = this.dependencies.metaReader.getSourceLocationFromToken(file, nextToken);
            const node = await this[nextToken.type]({
                meta: nodeMeta,
                source: nodeSource,
                token: nextToken,
            });
            if (!node) {
                break;
            }
            nodes.push(node);
        }
        return {
            id,
            text,
            nodes,
            condition: await this.dependencies.metaParser[enums_1.MetaKeys.condition]({
                source,
                token,
                value: condition,
            }),
            effects: await this.dependencies.metaParser[enums_1.MetaKeys.effects]({
                source,
                token,
                value: effects,
            }),
            events: await this.dependencies.metaParser[enums_1.MetaKeys.events]({
                source,
                token,
                value: events,
            }),
        };
    }
    [enums_1.TokenType.meta_line] = this.emptyMethod;
    [enums_1.TokenType.ignored_line] = this.emptyMethod;
    [enums_1.TokenType.eof] = this.emptyMethod;
    [enums_1.TokenType.empty_line] = this.emptyMethod;
    [enums_1.TokenType.callout_background](parameters) {
        return this.dependencies.nodeParser.callout_background(parameters);
    }
    [enums_1.TokenType.callout_character](parameters) {
        return this.dependencies.nodeParser.callout_character(parameters);
    }
    [enums_1.TokenType.callout_effect](parameters) {
        return this.dependencies.nodeParser.callout_effect(parameters);
    }
    [enums_1.TokenType.callout_quote](parameters) {
        return this.dependencies.nodeParser.callout_quote(parameters);
    }
    [enums_1.TokenType.callout_info](parameters) {
        return this.dependencies.nodeParser.callout_info(parameters);
    }
    [enums_1.TokenType.action_line](parameters) {
        return this.dependencies.nodeParser.action_line(parameters);
    }
    [enums_1.TokenType.callout_system](parameters) {
        return this.dependencies.nodeParser.callout_system(parameters);
    }
    [enums_1.TokenType.callout_transition](parameters) {
        return this.dependencies.nodeParser.callout_transition(parameters);
    }
    [enums_1.TokenType.choice_line]({ source }) {
        this.dependencies.errors.add("Nested choice are not supported", source);
        this.dependencies.metaReader.consume({});
        return null;
    }
    emptyMethod() {
        return null;
    }
}
exports.ChoiceParser = ChoiceParser;
//# sourceMappingURL=choice-parser.js.map