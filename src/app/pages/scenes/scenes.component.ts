import type { SerializedScene, SerializedSceneNode } from "@/types/exporter";
import { ScenesService } from "@/services/scenes.service";

import { Node } from "@/app/components/node/node.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from "@angular/core";
import { RegistriesService } from "@/services/registries.service";
import { Registries } from "@/utils/registries.loader";
import { EmotionsRegistry } from "@/types/registries";

@Component({
  selector: "scenes",
  templateUrl: "./scenes.html",
  imports: [CommonModule, FormsModule, Node],
})
export class ScenesComponent {
  private readonly scenesService = inject(ScenesService);
  private readonly registriesService = inject(RegistriesService);

  @ViewChild("main", { read: ElementRef })
  protected reference!: ElementRef<HTMLElement>;

  protected readonly currentNodes = signal<SerializedSceneNode[]>([]);
  protected readonly currentSceneId = signal<string>("scene_h1_a1_d1_o1");
  protected readonly currentSceneIndex = signal<number>(0);
  protected readonly cachedNextScene = signal<SerializedScene | null>(null);
  protected readonly sceneIds = signal<string[]>([]);

  protected readonly emotions = signal<EmotionsRegistry>({});

  public constructor() {}

  public ngOnInit() {
    const emotionsObservable = this.registriesService.execute("emotions");
    emotionsObservable.subscribe((emotions) => {
      this.emotions.set(emotions);
    });

    const scenesObservable = this.scenesService.fetcher.getAllScenesId();
    scenesObservable.subscribe((scenes) => {
      this.sceneIds.set(scenes);

      const id = this.currentSceneId();
      this.loadScene(id);
    });
  }

  public changeScene(scene: SerializedScene) {
    this.currentSceneId.set(scene.metadata.id);
    const scenesIds = this.sceneIds();
    const index = scenesIds.indexOf(scene.metadata.id);
    this.currentSceneIndex.set(index);
    this.currentNodes.set(scene.nodes);

    this.onSceneChange();
  }

  public select(event: Event) {
    const select = event.target as HTMLSelectElement;
    const target = select.value;
    
    return this.loadScene(target);
  }

  public previousScene() {
    this.moveScene(-1);
  }

  public nextScene() {
    return this.loadNextScene();
  }

  public loadScene(id: string) {
    const observable = this.scenesService.execute(id);
    const subscription = observable.subscribe((scene) => {
      return this.changeScene(scene);
    });
    
    return subscription;
  }

  private loadNextScene() {
    const cachedScene = this.cachedNextScene();
    if (cachedScene) {
      this.changeScene(cachedScene);
      return this.cacheNextScene();
    }

    const sceneId = this.getNextSceneId();
    const observable = this.scenesService.execute(sceneId);
    const subscription = observable.subscribe((scene) => {
      this.changeScene(scene);
      return this.cacheNextScene();
    });

    return subscription;
  }

  private cacheNextScene() {
    const sceneId = this.getNextSceneId();
    if (!sceneId) {
      this.cachedNextScene.set(null);
      return null;
    }

    const observable = this.scenesService.execute(sceneId);
    const subscription = observable.subscribe((scene) => {
      return this.cachedNextScene.set(scene);
    });

    return subscription;
  }

  private getNextSceneId() {
    const currentIndex = this.currentSceneIndex();
    const nextSceneId = this.sceneIds()[currentIndex+1];
    return nextSceneId;
  }

  private moveScene(value: 1 | -1) {
    const currentIndex = this.currentSceneIndex();
    const sceneIds = this.sceneIds();
    const index = currentIndex + value;
    this.currentSceneIndex.set(index);

    const sceneId = sceneIds[index];
    return this.loadScene(sceneId);
  }

  private onSceneChange() {
    this.reference?.nativeElement?.scrollIntoView?.({
      behavior: "smooth",
      block: "start",
    });
  }
}
