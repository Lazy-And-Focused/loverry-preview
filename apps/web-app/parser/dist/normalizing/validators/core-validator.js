"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreValidator = void 0;
class CoreValidator {
    dependencies;
    constructor(dependencies) {
        this.dependencies = dependencies;
    }
    validateCharacter({ name, source, }) {
        if (!this.dependencies.registries.characters[name]) {
            this.dependencies.errors.add(`Unknown character "${name}"`, source);
            return null;
        }
        return name;
    }
    validateEmotion({ name, source, }) {
        if (!this.dependencies.registries.emotions[name]) {
            this.dependencies.errors.add(`Unknown emotion "${name}"`, source);
            return null;
        }
        return name;
    }
}
exports.CoreValidator = CoreValidator;
//# sourceMappingURL=core-validator.js.map