"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistriesCollector = void 0;
class RegistriesCollector {
    options;
    constructor(options) {
        this.options = options;
    }
    get characters() {
        return this.options.registries.characters;
    }
    get emotions() {
        return this.options.registries.emotions;
    }
    get variables() {
        return this.options.registries.variables;
    }
    get events() {
        return this.options.registries.events;
    }
    get characterAnimations() {
        return this.options.registries.characterAnimations;
    }
    get backgroundAnimations() {
        return this.options.registries.backgroundAnimations;
    }
    get gameEffects() {
        return this.options.registries.gameEffects;
    }
}
exports.RegistriesCollector = RegistriesCollector;
//# sourceMappingURL=registries-collector.js.map