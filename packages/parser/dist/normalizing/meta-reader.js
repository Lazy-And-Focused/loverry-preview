"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaReader = void 0;
const enums_1 = require("@loverry/enums");
const node_path_1 = require("node:path");
const yaml_1 = require("yaml");
class MetaReader {
    options;
    dependencies;
    _position;
    constructor(options, dependencies) {
        this.options = options;
        this.dependencies = dependencies;
        this._position = options.startPosition;
    }
    async extractIdFromTarget({ directory, target, }) {
        const link = target.split("|")[0];
        const path = this.dependencies.files.normilizePath((0, node_path_1.join)(directory, `${link}.md`));
        const file = await this.dependencies.files.readFile(path);
        const metadata = this.extractFrontmatter(file);
        if ("id" in metadata) {
            return metadata.id;
        }
        return target;
    }
    getSourceLocation(file, source) {
        return { file, line: source.line + 1, column: source.column + 1 };
    }
    getSourceLocationFromToken(file, token) {
        return { file, line: token.line + 1, column: token.column + 1 };
    }
    readLines() {
        const metaMap = new Map();
        while (!this.isEof() && this.getToken()?.type === enums_1.TokenType.meta_line) {
            const token = this.consume({
                expectedType: enums_1.TokenType.meta_line,
            });
            const line = token.value.trim();
            const match = line.match(/^>\s*\*\*([^:]+):\*\*\s*(.*)$/);
            if (!match) {
                console.warn(`Failed to parse meta line: "${line}"`);
                continue;
            }
            const key = match[1].trim().toLowerCase();
            const value = match[2].trim();
            metaMap.set(key, value);
        }
        return metaMap;
    }
    readValues(meta, keys) {
        return keys.map((key) => meta.get(key));
    }
    getToken(position = this._position) {
        return this.options.tokens[position] || null;
    }
    consume({ expectedType }) {
        const token = this.getToken();
        if (!token) {
            throw new Error("Unexpected end of file");
        }
        if (expectedType !== undefined && token.type !== expectedType) {
            throw new Error(`Expected token type ${expectedType}, got ${token.type} at line ${token.line}`);
        }
        this._position++;
        return token;
    }
    isEof(position = this._position) {
        return this.getToken(position)?.type === enums_1.TokenType.eof;
    }
    extractFrontmatter(content) {
        const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
        if (!match) {
            return null;
        }
        try {
            return (0, yaml_1.parse)(match[1]);
        }
        catch {
            return null;
        }
    }
}
exports.MetaReader = MetaReader;
//# sourceMappingURL=meta-reader.js.map