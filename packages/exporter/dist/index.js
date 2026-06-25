"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneExporter = void 0;
__exportStar(require("./types"), exports);
class SceneExporter {
    execute(scene) {
        return this.serializeScene(scene);
    }
    exportToJson(scene) {
        return JSON.stringify(this.execute(scene), null, 2);
    }
    serializeScene(scene) {
        return {
            metadata: scene.metadata,
            nodes: scene.nodes.map((node) => this.serializeNode(node)),
        };
    }
    serializeNode(node) {
        const base = {
            id: node.id,
            type: node.type,
            action: node.action || null,
            condition: node.condition
                ? this.serializeExpression(node.condition)
                : null,
            effects: node.effects
                ? node.effects.map((e) => this.serializeEffect(e))
                : null,
            events: node.events
                ? node.events.map((e) => this.serializeEvent(e))
                : null,
        };
        switch (node.type) {
            case "action":
                return { ...base, type: "action", text: node.text };
            case "dialogue":
                return {
                    ...base,
                    type: "dialogue",
                    character: node.character,
                    emotion: node.emotion ?? null,
                    text: node.text,
                };
            case "thought":
                return {
                    ...base,
                    type: "thought",
                    character: node.character,
                    text: node.text,
                };
            case "system":
                return {
                    ...base,
                    type: "system",
                    text: node.text,
                    severity: node.severity ?? null,
                };
            case "transition":
                return {
                    ...base,
                    type: "transition",
                    target: node.target,
                    mode: node.mode ?? null,
                };
            case "choice":
                return {
                    ...base,
                    type: "choice",
                    options: node.options.map((opt) => this.serializeChoiceOption(opt)),
                };
            case "background": {
                const bgNode = node;
                const serialized = {
                    ...base,
                    type: "background",
                    file: bgNode.file,
                    transition: bgNode.transition,
                    animation: bgNode.animation,
                };
                return serialized;
            }
            case "character": {
                const chNode = node;
                const serialized = {
                    ...base,
                    type: "character",
                    character: chNode.character,
                    emotion: chNode.emotion,
                    sprite: chNode.sprite,
                    position: chNode.position,
                    animation: chNode.animation,
                    zIndex: chNode.zIndex,
                    hidden: chNode.hidden,
                };
                return serialized;
            }
            case "effect": {
                const effNode = node;
                const serialized = {
                    ...base,
                    type: "effect",
                    effect: effNode.effect,
                    intensity: effNode.intensity,
                    duration: effNode.duration,
                };
                return serialized;
            }
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }
    serializeChoiceOption(opt) {
        return {
            id: opt.id,
            text: opt.text,
            condition: opt.condition ? this.serializeExpression(opt.condition) : null,
            effects: opt.effects
                ? opt.effects.map((e) => this.serializeEffect(e))
                : null,
            events: opt.events ? opt.events.map((e) => this.serializeEvent(e)) : null,
            nodes: opt.nodes.map((n) => this.serializeNode(n)),
        };
    }
    serializeExpression(expr) {
        switch (expr.type) {
            case "literal":
                return {
                    type: "literal",
                    value: expr.value,
                };
            case "variable_reference":
                return {
                    type: "variable_reference",
                    variable: expr.variable,
                };
            case "binary":
                return {
                    type: "binary",
                    operator: expr.operator,
                    left: this.serializeExpression(expr.left),
                    right: this.serializeExpression(expr.right),
                };
            case "unary":
                return {
                    type: "unary",
                    operator: expr.operator,
                    operand: this.serializeExpression(expr.operand),
                };
            default:
                throw new Error(`Unknown expression type: ${expr.type}`);
        }
    }
    serializeEffect(effect) {
        return {
            variable: effect.variable,
            operator: effect.operator,
            value: effect.value,
        };
    }
    serializeEvent(event) {
        return {
            id: event.id,
            arguments: event.arguments ?? null,
        };
    }
}
exports.SceneExporter = SceneExporter;
//# sourceMappingURL=index.js.map