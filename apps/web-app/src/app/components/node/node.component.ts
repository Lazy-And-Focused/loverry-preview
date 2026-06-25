import { NgIf, NgTemplateOutlet } from "@angular/common";
import {
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  Signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from "@angular/core";
import {
  SerializedSceneNode,
  SerializedTransitionNode,
} from "@loverry/exporter";
import { Enumeration } from "@loverry/utils";

type Scenes = {
  [P in SerializedSceneNode["type"]]: P;
};

const { enumeration: SceneTypes, ...SceneTypesEnumeration } =
  new Enumeration<Scenes>({
    action: "action",
    background: "background",
    character: "character",
    choice: "choice",
    dialogue: "dialogue",
    effect: "effect",
    system: "system",
    thought: "thought",
    transition: "transition",
  });

type SceneTypes = typeof SceneTypesEnumeration.type;

@Component({
  selector: "scene-node",
  imports: [NgIf, NgTemplateOutlet],
  templateUrl: "./node.html",
})
export class Node {
  private neverTemplate = viewChild.required<TemplateRef<unknown>>("never");

  private actionTemplate = viewChild.required<TemplateRef<unknown>>(
    SceneTypes.action,
  );
  private dialogueTemplate = viewChild.required<TemplateRef<unknown>>(
    SceneTypes.dialogue,
  );
  private thoughtTemplate = viewChild.required<TemplateRef<unknown>>(
    SceneTypes.thought,
  );
  private choiceTemplate = viewChild.required<TemplateRef<unknown>>(
    SceneTypes.choice,
  );
  private transitionTemplate = viewChild.required<TemplateRef<unknown>>(
    SceneTypes.transition,
  );
  private backgroundTemplate = viewChild.required<TemplateRef<unknown>>(
    SceneTypes.background,
  );
  private characterTemplate = viewChild.required<TemplateRef<unknown>>(
    SceneTypes.character,
  );
  private effectTemplate = viewChild.required<TemplateRef<unknown>>(
    SceneTypes.effect,
  );
  private systemTemplate = viewChild.required<TemplateRef<unknown>>(
    SceneTypes.system,
  );

  private readonly templates: Record<
    SceneTypes,
    Signal<TemplateRef<any>> | undefined
  > = {
    action: this.actionTemplate,
    dialogue: this.dialogueTemplate,
    thought: this.thoughtTemplate,
    choice: this.choiceTemplate,
    transition: this.transitionTemplate,
    background: this.backgroundTemplate,
    character: this.characterTemplate,
    effect: this.effectTemplate,
    system: this.systemTemplate,
  };

  @Input({ required: true })
  public node!: SerializedSceneNode;

  @Output()
  public changeScene = new EventEmitter<string>();

  public constructor() {}

  public handleTransitionClick(node: SerializedTransitionNode) {
    this.changeScene.emit(node.target);
  }

  public content = computed(() => {
    const template = this.templates[this.node.type];
    if (!template) {
      return this.neverTemplate();
    }

    return template();
  });

  public formatText(value?: string | null): string {
    if (!value) {
      return "";
    }

    const content = value.replace(/[&<>]/g, (symbol) => {
      if (symbol === "&") return "&amp;";
      if (symbol === "<") return "&lt;";
      if (symbol === ">") return "&gt;";
      return symbol;
    });

    return this.avoidUndescore(content);
  }

  private avoidUndescore(text: string): string {
    const hasUnderscoreStart = text.startsWith("_");
    const hasUnderscoreEnd = text.endsWith("_");
    if (!hasUnderscoreStart && !hasUnderscoreEnd) {
      return text;
    }

    let content = `${text}`;
    if (hasUnderscoreStart) {
      content = content.slice(1);
    }

    if (hasUnderscoreEnd) {
      content = content.slice(0, text.length - 1);
    }

    return this.avoidUndescore(content);
  }
}
