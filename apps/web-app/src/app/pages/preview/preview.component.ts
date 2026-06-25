import { SerializedScenes } from "@/services/scenes.loader";
import { ScenesService } from "@/services/scenes.service";
import { Component, inject, signal } from "@angular/core";

import { SerializedSceneNode } from "@loverry/exporter";
import { Node } from "@/app/components/node/node.component";

@Component({
  selector: "preview",
  imports: [Node],
  templateUrl: "./preview.html",
  styleUrl: "../../../styles/base-host.style.css",
  host: {
    ngSkipHydration: "true",
  },
})
export class Preview {
  private readonly scenesService = inject(ScenesService);

  public readonly scenes = signal<SerializedScenes | null>(null);
  public readonly scenesIds = signal<string[]>([]);
  public readonly currentSceneIndex = signal<number>(0);

  public readonly currentNodes = signal<SerializedSceneNode[]>([]);
  public readonly nodesIds = signal<string[]>([]);
  public readonly currentNodeIndex = signal<number>(0);

  public constructor() {}

  public ngOnInit() {
    const observable = this.scenesService.execute();
    observable.subscribe((scenes) => {
      this.scenes.set(scenes);
      this.currentSceneIndex.set(0);

      const ids = Object.keys(scenes);
      this.scenesIds.set(ids);

      const sceneId = ids[0];
      const scene = scenes[sceneId];
      this.nodesIds.set(scene.nodes.map((node) => node.id));
      this.currentNodes.set(scene.nodes);
    });
  }

  public changeScene(id: string) {
    const index = this.scenesIds().indexOf(id);
    this.currentSceneIndex.set(index);
    const scene = this.scenes()![id];

    this.currentNodes.set(scene.nodes);
    this.nodesIds.set(scene.nodes.map((node) => node.id));
    this.currentNodeIndex.set(0);
  }

  public onNode(node: SerializedSceneNode) {
    console.log("bebebe");
  }

  public nextNode() {
    const index = this.currentNodeIndex();
    if (index === this.nodesIds().length - 1) {
      return this.nextScene();
    }

    return this.currentNodeIndex.set(index + 1);
  }

  public nextScene() {
    const index = this.currentSceneIndex();
    const id = this.scenesIds()[index + 1];
    if (!id) {
      return;
    }

    this.changeScene(id);
  }
}
