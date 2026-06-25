import type { EventId, RuntimeValue, SourceLocation, VariableId } from "@loverry/ast";
import type { Files } from "./dsl-parser";
import type { Token } from "@loverry/enums";
import { MetaKeys } from "@loverry/enums";
import { ErrorsCollector } from "../errors-collectror";
import { MetaReader } from "../meta-reader";
import { CoreValidator } from "../validators/core-validator";
import { RegistriesCollector } from "../registries-collector";
import { IdGenerator } from "../id-generator";
export type MetaParserBaseParseParameters = {
    readonly value: string | undefined;
    readonly source: SourceLocation;
};
export type MetaParserParseParameters = MetaParserBaseParseParameters & {
    readonly token: Token;
};
export type MetaParserType = {
    readonly [key in MetaKeys]: (parameters: MetaParserParseParameters) => unknown;
};
export interface MetaParserDependencies {
    readonly errors: ErrorsCollector;
    readonly metaReader: MetaReader;
    readonly validator: CoreValidator;
    readonly idGenerator: IdGenerator;
    readonly registries: RegistriesCollector;
    readonly files: Files;
}
export declare class MetaParser implements MetaParserType {
    private readonly dependencies;
    constructor(dependencies: MetaParserDependencies);
    execute<const Keys extends MetaKeys[]>({ token, meta, source, }: {
        token: Token;
        meta: Map<string, string>;
        source: SourceLocation;
    }, keys: Keys): Promise<{ [Key in Keys[number] as {
        readonly анимация: "animation";
        readonly условие: "condition";
        readonly событие: "events";
        readonly режим: "mode";
        readonly формат: "format";
        readonly эффект: "effects";
        readonly цель: "target";
        readonly переход: "transition";
        readonly текст: "text";
        readonly severity: "severity";
        readonly действие: "action";
        readonly персонаж: "character";
        readonly спрайт: "sprite";
        readonly файл: "file";
        readonly спрятать: "hide";
        readonly положение: "position";
        readonly слой: "layer";
        readonly эмоция: "emotion";
        readonly интенсивность: "intensity";
        readonly длительность: "duration";
    }[Key]]: ReturnType<this[Key]>; }>;
    [MetaKeys.target]({ value, source }: MetaParserParseParameters): Promise<string | undefined>;
    [MetaKeys.transition]({ value }: MetaParserParseParameters): Promise<string | undefined>;
    [MetaKeys.animation]({ value, source, token, }: MetaParserParseParameters): Promise<string | undefined>;
    [MetaKeys.condition]({ value, source, }: MetaParserParseParameters): Promise<import("@loverry/ast").Expression | undefined>;
    [MetaKeys.events]({ value, source }: MetaParserParseParameters): Promise<{
        id: EventId;
        arguments: RuntimeValue[];
    }[] | undefined>;
    [MetaKeys.mode]({ value }: MetaParserParseParameters): Promise<string | undefined>;
    [MetaKeys.effects]({ value, source, }: MetaParserParseParameters): Promise<{
        variable: VariableId;
        operator: "=" | "+=" | "-=";
        value: string | number | boolean;
        source: SourceLocation;
    }[] | undefined>;
    [MetaKeys.format]({ value }: MetaParserBaseParseParameters): Promise<string | undefined>;
    [MetaKeys.text]({ value }: MetaParserParseParameters): Promise<string>;
    [MetaKeys.severity]({ value }: MetaParserParseParameters): Promise<string | undefined>;
    [MetaKeys.action]({ value }: MetaParserParseParameters): Promise<string | undefined>;
    [MetaKeys.character]({ value, source, }: MetaParserParseParameters): Promise<string | undefined>;
    [MetaKeys.sprite]({ value, source }: MetaParserParseParameters): Promise<string | undefined>;
    [MetaKeys.file]({ value, source }: MetaParserParseParameters): Promise<string | undefined>;
    [MetaKeys.hide]({ value, source }: MetaParserParseParameters): Promise<boolean | undefined>;
    [MetaKeys.position]({ value, source, }: MetaParserParseParameters): Promise<number | "left" | "right" | "center" | undefined>;
    [MetaKeys.layer]({ value, source }: MetaParserParseParameters): Promise<number | undefined>;
    [MetaKeys.emotion]({ value, source, }: MetaParserParseParameters): Promise<string | undefined>;
    [MetaKeys.intensity]({ value, source, }: MetaParserParseParameters): Promise<number | undefined>;
    [MetaKeys.duration]({ value, source, }: MetaParserParseParameters): Promise<number | undefined>;
    private parseEventArgument;
    private parseRegistryValue;
    private getAnimationRegistry;
    private parseNumber;
}
//# sourceMappingURL=meta-parser.d.ts.map