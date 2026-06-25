import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Scenes } from "./scenes.component";

describe("Scenes", () => {
  let component: Scenes;
  let fixture: ComponentFixture<Scenes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Scenes],
    }).compileComponents();

    fixture = TestBed.createComponent(Scenes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
