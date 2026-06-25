"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DslParser = void 0;
const registries_collector_1 = require("../registries-collector");
const errors_collectror_1 = require("../errors-collectror");
const node_parser_1 = require("./node-parser");
const id_generator_1 = require("../id-generator");
const meta_parser_1 = require("./meta-parser");
const meta_reader_1 = require("../meta-reader");
const core_validator_1 = require("../validators/core-validator");
class DslParser {
    options;
    constructor(options) {
        this.options = options;
    }
    execute() {
        const errors = new errors_collectror_1.ErrorsCollector();
        const registries = new registries_collector_1.RegistriesCollector({
            registries: this.options.registries,
        });
        const idGenerator = new id_generator_1.IdGenerator(this.options.metadata.id);
        const metaReader = new meta_reader_1.MetaReader({
            tokens: this.options.tokens,
            startPosition: 0,
        }, {
            files: this.options.files,
        });
        const validator = new core_validator_1.CoreValidator({
            errors,
            registries,
        });
        const metaParser = new meta_parser_1.MetaParser({
            errors,
            idGenerator,
            metaReader,
            registries,
            validator,
            files: this.options.files,
        });
        const nodeParser = new node_parser_1.NodeParser({
            errors,
            idGenerator,
            metaParser,
            metaReader,
        }, {
            metadata: this.options.metadata,
        });
        return nodeParser.execute(this.options.file);
    }
}
exports.DslParser = DslParser;
//# sourceMappingURL=dsl-parser.js.map