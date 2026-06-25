import { Enumeration } from "@loverry/utils";

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
} as const;

export const MetaKeysEnum = new Enumeration(MetaKeysDefenition);
export const MetaKeys = MetaKeysEnum.enumeration;
export type MetaKeys = typeof MetaKeysEnum.type;

export const PropertiesEnumeration = MetaKeysEnum.revert();
export const Properties = PropertiesEnumeration.enumeration;
export type Properties = typeof PropertiesEnumeration.type;
