import type {
  SceneAst,
  SceneNode,
  ActionNode,
  DialogueNode,
  ThoughtNode,
  SystemNode,
  TransitionNode,
  ChoiceNode,
  BackgroundNode,
  CharacterNode,
  EffectNode,
  Expression,
  LiteralExpression,
  VariableReferenceExpression,
  BinaryExpression,
  UnaryExpression,
  Effect,
  Event,
  EffectOperator,
} from "@loverry/ast";

import type {
  SerializedScene,
  SerializedSceneNode,
  SerializedExpression,
  SerializedEffect,
  SerializedEvent,
  SerializedChoiceOption,
  SerializedBackgroundNode,
  SerializedCharacterNode,
  SerializedEffectNode,
} from "./types";

export * from "./types";

export class SceneExporter {
  public execute(scene: SceneAst): SerializedScene {
    return this.serializeScene(scene);
  }

  public exportToJson(scene: SceneAst): string {
    return JSON.stringify(this.execute(scene), null, 2);
  }

  private serializeScene(scene: SceneAst): SerializedScene {
    return {
      metadata: scene.metadata,
      nodes: scene.nodes.map((node) => this.serializeNode(node)),
    };
  }

  private serializeNode(node: SceneNode): SerializedSceneNode {
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
        return { ...base, type: "action", text: (node as ActionNode).text };
      case "dialogue":
        return {
          ...base,
          type: "dialogue",
          character: (node as DialogueNode).character,
          emotion: (node as DialogueNode).emotion ?? null,
          text: (node as DialogueNode).text,
        };
      case "thought":
        return {
          ...base,
          type: "thought",
          character: (node as ThoughtNode).character,
          text: (node as ThoughtNode).text,
        };
      case "system":
        return {
          ...base,
          type: "system",
          text: (node as SystemNode).text,
          severity: (node as SystemNode).severity ?? null,
        };
      case "transition":
        return {
          ...base,
          type: "transition",
          target: (node as TransitionNode).target,
          mode: (node as TransitionNode).mode ?? null,
        };
      case "choice":
        return {
          ...base,
          type: "choice",
          options: (node as ChoiceNode).options.map((opt) =>
            this.serializeChoiceOption(opt),
          ),
        };
      case "background": {
        const bgNode = node as BackgroundNode;
        const serialized: SerializedBackgroundNode = {
          ...base,
          type: "background",
          file: bgNode.file,
          transition: bgNode.transition,
          animation: bgNode.animation,
        };
        return serialized;
      }
      case "character": {
        const chNode = node as CharacterNode;
        const serialized: SerializedCharacterNode = {
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
        const effNode = node as EffectNode;
        const serialized: SerializedEffectNode = {
          ...base,
          type: "effect",
          effect: effNode.effect,
          intensity: effNode.intensity,
          duration: effNode.duration,
        };
        return serialized;
      }
      default:
        throw new Error(`Unknown node type: ${(node as any).type}`);
    }
  }

  private serializeChoiceOption(
    opt: ChoiceNode["options"][0],
  ): SerializedChoiceOption {
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

  private serializeExpression(expr: Expression): SerializedExpression {
    switch (expr.type) {
      case "literal":
        return {
          type: "literal",
          value: (expr as LiteralExpression).value,
        };
      case "variable_reference":
        return {
          type: "variable_reference",
          variable: (expr as VariableReferenceExpression).variable,
        };
      case "binary":
        return {
          type: "binary",
          operator: (expr as BinaryExpression).operator,
          left: this.serializeExpression((expr as BinaryExpression).left),
          right: this.serializeExpression((expr as BinaryExpression).right),
        };
      case "unary":
        return {
          type: "unary",
          operator: (expr as UnaryExpression).operator,
          operand: this.serializeExpression((expr as UnaryExpression).operand),
        };
      default:
        throw new Error(`Unknown expression type: ${(expr as any).type}`);
    }
  }

  private serializeEffect(effect: Effect): SerializedEffect {
    return {
      variable: effect.variable,
      operator: effect.operator as EffectOperator,
      value: effect.value,
    };
  }

  private serializeEvent(event: Event): SerializedEvent {
    return {
      id: event.id,
      arguments: event.arguments ?? null,
    };
  }
}
