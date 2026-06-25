"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistryLoader = void 0;
const promises_1 = require("fs/promises");
const path_1 = require("path");
const yaml_1 = require("yaml");
const REGISTRIES = {
    variables: "Переменные",
    characterAnimations: "Персонажи_Анимации",
    characters: "Персонажи",
    events: "События",
    backgroundAnimations: "Фон_Анимации",
    emotions: "Эмоции",
    gameEffects: "Эффекты",
};
const TYPES = {
    variables: "variables",
    characterAnimations: "animations",
    characters: "characters",
    events: "events",
    backgroundAnimations: "animations",
    emotions: "emotions",
    gameEffects: "effects",
};
class RegistryLoader {
    _registry_path;
    constructor(registryPath) {
        this._registry_path = registryPath;
    }
    async loadAll() {
        const entriesPromise = Object.keys(REGISTRIES).map(async (r) => {
            const registry = r;
            const yaml = await this.execute(registry);
            return [registry, yaml];
        });
        const entries = await Promise.all(entriesPromise);
        return Object.fromEntries(entries);
    }
    async execute(registry) {
        return this.loadYaml(`${REGISTRIES[registry]}.yaml`, TYPES[registry]);
    }
    async loadYaml(fileName, type) {
        const filePath = (0, path_1.join)(this._registry_path, fileName);
        try {
            const content = await (0, promises_1.readFile)(filePath, "utf-8");
            const data = (0, yaml_1.parse)(content);
            return data[type];
        }
        catch (err) {
            throw new Error(`Failed to load registry ${fileName}: ${err}`);
        }
    }
}
exports.RegistryLoader = RegistryLoader;
//# sourceMappingURL=loader.js.map