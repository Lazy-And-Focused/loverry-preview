import type { SerializedScenes } from "@/services/scenes.loader";
import type { SerializedSceneNode } from "@loverry/exporter";
import { ScenesService } from "@/services/scenes.service";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from "@angular/core";
import { Node } from "@/app/components/node/node.component";

@Component({
  selector: "scenes",
  templateUrl: "./scenes.html",
  imports: [CommonModule, FormsModule, Node],
})
export class ScenesComponent {
  private readonly scenesService = inject(ScenesService);

  @ViewChild("main", { read: ElementRef })
  public reference!: ElementRef<HTMLElement>;

  public readonly scenes = signal<SerializedScenes | null>(null);
  public readonly currentNodes = signal<SerializedSceneNode[]>([]);
  public readonly currentSceneId = signal<string>("scene_h1_a1_d1_o1");
  public readonly currentSceneIndex = signal<number>(0);
  public readonly sceneIds = signal<string[]>([]);

  public constructor() {}

  public ngOnInit() {
    const observable = this.scenesService.execute();
    observable.subscribe((scenes) => {
      this.scenes.set(scenes);
      this.sceneIds.set(Object.keys(scenes));
      this.currentNodes.set(scenes[this.currentSceneId()].nodes);
    });
  }

  public changeScene(target: string) {
    this.currentSceneId.set(target);
    this.currentSceneIndex.set(this.sceneIds().indexOf(target));
    this.currentNodes.set(this.scenes()![target].nodes);

    this.onSceneChange();
  }

  public select(event: Event) {
    const select = event.target as HTMLSelectElement;
    const target = select.value;
    this.changeScene(target);
  }

  public previousScene() {
    this.moveScene(-1);
  }

  public nextScene() {
    this.moveScene(1);
  }

  private moveScene(value: 1 | -1) {
    const currentIndex = this.currentSceneIndex();
    const sceneIds = this.sceneIds();
    const index = currentIndex + value;
    this.currentSceneIndex.set(index);

    const sceneId = sceneIds[index];
    this.currentSceneId.set(sceneId);
    this.currentNodes.set(this.scenes()![sceneId].nodes);

    this.onSceneChange();
  }

  private onSceneChange() {
    this.reference.nativeElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}
