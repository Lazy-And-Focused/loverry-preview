import type { Token } from "@loverry/enums";
import type { MetaParser } from "./meta-parser";
import type { ActionNode, BackgroundNode, CharacterNode, ChoiceNode, DialogueNode, EffectNode, SceneAst, SceneMetadata, SourceLocation, SystemNode, ThoughtNode, TransitionNode } from "@loverry/ast";
import { TokenType } from "@loverry/enums";
import { IdGenerator } from "../id-generator";
import { ChoiceParser } from "./choice-parser";
import { ErrorsCollector } from "../errors-collectror";
import { MetaReader } from "../meta-reader";
export interface NodeParserDependencies {
    readonly metaReader: MetaReader;
    readonly idGenerator: IdGenerator;
    readonly errors: ErrorsCollector;
    readonly metaParser: MetaParser;
}
export interface NodeParserOptions {
    readonly metadata: SceneMetadata;
}
export type NodeParserBaseParseParameters = {
    readonly meta: Map<string, string>;
    readonly source: SourceLocation;
};
export type NodeParserParseParameters = NodeParserBaseParseParameters & {
    readonly token: Token;
};
export type NodeParserType = {
    readonly [key in TokenType]: (parameters: NodeParserParseParameters) => unknown;
};
export declare class NodeParser implements NodeParserType {
    private readonly dependencies;
    private readonly options;
    readonly choiceParser: ChoiceParser;
    constructor(dependencies: NodeParserDependencies, options: NodeParserOptions);
    execute(file: string): Promise<SceneAst>;
    [TokenType.empty_line]: () => null;
    [TokenType.meta_line]: () => null;
    [TokenType.ignored_line]: () => null;
    [TokenType.eof]: () => null;
    [TokenType.action_line]({ token, source, }: NodeParserParseParameters): Promise<ActionNode | null>;
    [TokenType.callout_quote](parameters: NodeParserParseParameters): Promise<DialogueNode | null>;
    [TokenType.callout_info](parameters: NodeParserParseParameters): Promise<ThoughtNode | null>;
    [TokenType.callout_system](parameters: NodeParserParseParameters): Promise<SystemNode | null>;
    [TokenType.callout_transition](parameters: NodeParserParseParameters): Promise<TransitionNode | null>;
    [TokenType.choice_line](parameters: NodeParserParseParameters): Promise<ChoiceNode | null>;
    [TokenType.callout_background](parameters: NodeParserParseParameters): Promise<BackgroundNode | null>;
    [TokenType.callout_character](parameters: NodeParserParseParameters): Promise<CharacterNode | null>;
    [TokenType.callout_effect](parameters: NodeParserParseParameters): Promise<EffectNode | null>;
    private consume;
    private build;
}
//# sourceMappingURL=node-parser.d.ts.map