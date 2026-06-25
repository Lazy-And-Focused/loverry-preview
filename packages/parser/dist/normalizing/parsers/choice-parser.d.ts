import type { ChoiceNode, SourceLocation } from "@loverry/ast";
import type { Token } from "@loverry/enums";
import type { NodeParser } from "./node-parser";
import type { MetaReader } from "../meta-reader";
import type { IdGenerator } from "../id-generator";
import type { ErrorsCollector } from "../errors-collectror";
import { TokenType } from "@loverry/enums";
import { MetaParser } from "./meta-parser";
export type ChoiceParserParseParameters = {
    readonly source: SourceLocation;
    readonly token: Token;
    readonly meta: Map<string, string>;
};
export interface ChoiceParserDependencies {
    readonly metaReader: MetaReader;
    readonly idGenerator: IdGenerator;
    readonly errors: ErrorsCollector;
    readonly nodeParser: NodeParser;
    readonly metaParser: MetaParser;
}
export declare class ChoiceParser {
    private readonly dependencies;
    constructor(dependencies: ChoiceParserDependencies);
    execute(file: string): Promise<ChoiceNode | null>;
    parseOption({ token, file, }: {
        token: Token;
        file: string;
    }): Promise<ChoiceNode["options"][number]>;
    [TokenType.meta_line]: () => null;
    [TokenType.ignored_line]: () => null;
    [TokenType.eof]: () => null;
    [TokenType.empty_line]: () => null;
    [TokenType.callout_background](parameters: ChoiceParserParseParameters): Promise<{
        id: import("@loverry/ast").NodeId;
        source: SourceLocation;
        action?: string | undefined | undefined;
        condition?: import("@loverry/ast").Expression | undefined;
        effects?: import("@loverry/ast").Effect[] | undefined | undefined;
        events?: import("@loverry/ast").Event[] | undefined | undefined;
        type: "background";
        file: string;
        transition?: string | undefined;
        animation?: string | undefined | undefined;
    } | null>;
    [TokenType.callout_character](parameters: ChoiceParserParseParameters): Promise<{
        id: import("@loverry/ast").NodeId;
        source: SourceLocation;
        action?: string | undefined | undefined;
        condition?: import("@loverry/ast").Expression | undefined;
        effects?: import("@loverry/ast").Effect[] | undefined | undefined;
        events?: import("@loverry/ast").Event[] | undefined | undefined;
        type: "character";
        character: import("@loverry/ast").CharacterId;
        emotion?: string | undefined;
        sprite?: string | undefined | undefined;
        position?: string | number | undefined | undefined;
        animation?: string | undefined | undefined;
        zIndex?: number | undefined | undefined;
        hidden?: boolean | undefined | undefined;
    } | null>;
    [TokenType.callout_effect](parameters: ChoiceParserParseParameters): Promise<{
        id: import("@loverry/ast").NodeId;
        source: SourceLocation;
        action?: string | undefined | undefined;
        condition?: import("@loverry/ast").Expression | undefined;
        effects?: import("@loverry/ast").Effect[] | undefined | undefined;
        events?: import("@loverry/ast").Event[] | undefined | undefined;
        type: "effect";
        effect?: string | undefined;
        intensity?: number | undefined | undefined;
        duration?: number | undefined | undefined;
    } | null>;
    [TokenType.callout_quote](parameters: ChoiceParserParseParameters): Promise<{
        id: import("@loverry/ast").NodeId;
        source: SourceLocation;
        action?: string | undefined | undefined;
        condition?: import("@loverry/ast").Expression | undefined;
        effects?: import("@loverry/ast").Effect[] | undefined | undefined;
        events?: import("@loverry/ast").Event[] | undefined | undefined;
        type: "dialogue";
        character: import("@loverry/ast").CharacterId;
        emotion?: string | undefined;
        format?: "text" | "real" | "voice" | undefined;
        text: string;
    } | null>;
    [TokenType.callout_info](parameters: ChoiceParserParseParameters): Promise<{
        id: import("@loverry/ast").NodeId;
        source: SourceLocation;
        action?: string | undefined | undefined;
        condition?: import("@loverry/ast").Expression | undefined;
        effects?: import("@loverry/ast").Effect[] | undefined | undefined;
        events?: import("@loverry/ast").Event[] | undefined | undefined;
        type: "thought";
        character: import("@loverry/ast").CharacterId;
        text: string;
    } | null>;
    [TokenType.action_line](parameters: ChoiceParserParseParameters): Promise<{
        id: import("@loverry/ast").NodeId;
        source: SourceLocation;
        action?: string | undefined | undefined;
        condition?: import("@loverry/ast").Expression | undefined;
        effects?: import("@loverry/ast").Effect[] | undefined | undefined;
        events?: import("@loverry/ast").Event[] | undefined | undefined;
        type: "action";
        text: string;
    } | null>;
    [TokenType.callout_system](parameters: ChoiceParserParseParameters): Promise<{
        id: import("@loverry/ast").NodeId;
        source: SourceLocation;
        action?: string | undefined | undefined;
        condition?: import("@loverry/ast").Expression | undefined;
        effects?: import("@loverry/ast").Effect[] | undefined | undefined;
        events?: import("@loverry/ast").Event[] | undefined | undefined;
        type: "system";
        text: string;
        severity?: "info" | "warning" | "error" | undefined;
    } | null>;
    [TokenType.callout_transition](parameters: ChoiceParserParseParameters): Promise<{
        id: import("@loverry/ast").NodeId;
        source: SourceLocation;
        action?: string | undefined | undefined;
        condition?: import("@loverry/ast").Expression | undefined;
        effects?: import("@loverry/ast").Effect[] | undefined | undefined;
        events?: import("@loverry/ast").Event[] | undefined | undefined;
        type: "transition";
        target: import("@loverry/ast").SceneId;
        mode?: "jump" | "call" | "return" | undefined;
    } | null>;
    [TokenType.choice_line]({ source }: ChoiceParserParseParameters): null;
    private emptyMethod;
}
//# sourceMappingURL=choice-parser.d.ts.map