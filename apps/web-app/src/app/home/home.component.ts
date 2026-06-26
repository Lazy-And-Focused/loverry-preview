import type { CharacterRegistry } from "@/types/ast";

import { Component, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Character } from "../components/modals/character/character.component";

import { CharactersService } from "@/services/characters.service";

@Component({
  selector: "home-component",
  templateUrl: "./home.html",
  styleUrl: "../../styles/base-host.style.css",
  imports: [RouterLink, Character],
})
export class Home {
  private readonly charactersService: CharactersService =
    inject(CharactersService);

  public characters = signal<CharacterRegistry[]>([]);
  public selectedCharacter = signal<CharacterRegistry | null>(null);
  public characterModalOpened = signal<boolean>(false);

  public constructor() {}

  public ngOnInit() {
    const observable = this.charactersService.execute();
    observable.subscribe((characters) => {
      this.characters.set(characters);
    });
  }

  public openCharacterModal(character: CharacterRegistry) {
    this.selectedCharacter.set(character);
    this.characterModalOpened.set(true);
  }

  public closeCharacterModal() {
    this.characterModalOpened.set(false);
    this.selectedCharacter.set(null);
  }
}
