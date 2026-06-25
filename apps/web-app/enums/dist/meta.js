"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Properties = exports.PropertiesEnumeration = exports.MetaKeys = exports.MetaKeysEnum = void 0;
const utils_1 = require("@loverry/utils");
const MetaKeysDefenition = {
    animation: "анимация",
    condition: "условие",
    events: "событие",
    mode: "режим",
    format: "формат",
    effects: "эффект",
    target: "цель",
    transition: "переход",
    text: "текст",
    severity: "severity",
    action: "действие",
    character: "персонаж",
    sprite: "спрайт",
    file: "файл",
    hide: "спрятать",
    position: "положение",
    layer: "слой",
    emotion: "эмоция",
    intensity: "интенсивность",
    duration: "длительность",
};
exports.MetaKeysEnum = new utils_1.Enumeration(MetaKeysDefenition);
exports.MetaKeys = exports.MetaKeysEnum.enumeration;
exports.PropertiesEnumeration = exports.MetaKeysEnum.revert();
exports.Properties = exports.PropertiesEnumeration.enumeration;
//# sourceMappingURL=meta.js.map