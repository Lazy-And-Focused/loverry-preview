import type { CharacterRegistry } from "@loverry/ast";

import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "modal-character",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./character.html",
})
export class Character {
  @Input({ required: true })
  public character!: CharacterRegistry;

  @Output()
  public close = new EventEmitter<void>();

  public onClose() {
    this.close.emit();
  }

  public onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
