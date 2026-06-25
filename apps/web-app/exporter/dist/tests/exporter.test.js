"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_1 = require("../index");
const meta = {
    id: "test_scene",
    act: 1,
    chapter: 1,
    day: 1,
    order: 1,
    characters: [],
    dslVersion: "2.2",
};
(0, vitest_1.describe)("SceneExporter", () => {
    (0, vitest_1.it)("exports a minimal scene with metadata and nodes", () => {
        const scene = {
            metadata: {
                id: "test_scene",
                dslVersion: "2.2",
                chapter: 1,
                act: 2,
                day: 3,
                order: 1,
                characters: ["Ланлир", "Керинато"],
            },
            nodes: [],
            source: { file: "test.md", line: 1, column: 1 },
        };
        const exporter = new index_1.SceneExporter();
        const result = exporter.execute(scene);
        (0, vitest_1.expect)(result.metadata.id).toBe("test_scene");
        (0, vitest_1.expect)(result.metadata.dslVersion).toBe("2.2");
        (0, vitest_1.expect)(result.metadata.chapter).toBe(1);
        (0, vitest_1.expect)(result.metadata.act).toBe(2);
        (0, vitest_1.expect)(result.metadata.day).toBe(3);
        (0, vitest_1.expect)(result.metadata.characters).toEqual(["Ланлир", "Керинато"]);
        (0, vitest_1.expect)(result.nodes).toEqual([]);
    });
    (0, vitest_1.it)("exports an action node correctly", () => {
        const scene = {
            metadata: meta,
            source: { file: "test.md", line: 0, column: 0 },
            nodes: [
                {
                    id: "node1",
                    type: "action",
                    text: "Ланлир выходит из дома.",
                    source: { file: "test.md", line: 5, column: 3 },
                },
            ],
        };
        const exporter = new index_1.SceneExporter();
        const result = exporter.execute(scene);
        (0, vitest_1.expect)(result.nodes).toHaveLength(1);
        const node = result.nodes[0];
        (0, vitest_1.expect)(node.type).toBe("action");
        if (node.type !== "action") {
            throw new Error("Node type is not action");
        }
        (0, vitest_1.expect)(node.text).toBe("Ланлир выходит из дома.");
        (0, vitest_1.expect)(node.id).toBe("node1");
        (0, vitest_1.expect)(node.condition).toBeNull();
        (0, vitest_1.expect)(node.effects).toBeNull();
        (0, vitest_1.expect)(node.events).toBeNull();
    });
    (0, vitest_1.it)("exports a dialogue node with optional fields", () => {
        const scene = {
            metadata: meta,
            source: { file: "test.md", line: 0, column: 0 },
            nodes: [
                {
                    id: "node2",
                    type: "dialogue",
                    character: "Ланлир",
                    emotion: "напряженная",
                    text: "Привет!",
                    source: { file: "test.md", line: 10, column: 1 },
                    condition: undefined,
                    effects: undefined,
                    events: undefined,
                },
            ],
        };
        const exporter = new index_1.SceneExporter();
        const result = exporter.execute(scene);
        const node = result.nodes[0];
        (0, vitest_1.expect)(node.type).toBe("dialogue");
        if (node.type !== "dialogue") {
            throw new Error("Node type is not dialogue");
        }
        (0, vitest_1.expect)(node.character).toBe("Ланлир");
        (0, vitest_1.expect)(node.emotion).toBe("напряженная");
        (0, vitest_1.expect)(node.text).toBe("Привет!");
        (0, vitest_1.expect)(node.condition).toBeNull();
    });
    (0, vitest_1.it)("exports a choice node with nested options and sub-nodes", () => {
        const scene = {
            metadata: meta,
            source: { file: "test.md", line: 0, column: 0 },
            nodes: [
                {
                    id: "choice1",
                    type: "choice",
                    source: { file: "test.md", line: 20, column: 1 },
                    options: [
                        {
                            id: "opt1",
                            text: "Пойти налево",
                            nodes: [
                                {
                                    id: "sub1",
                                    type: "action",
                                    text: "Идёт налево",
                                    source: { file: "test.md", line: 21, column: 3 },
                                },
                            ],
                        },
                        {
                            id: "opt2",
                            text: "Пойти направо",
                            nodes: [],
                        },
                    ],
                },
            ],
        };
        const exporter = new index_1.SceneExporter();
        const result = exporter.execute(scene);
        const node = result.nodes[0];
        (0, vitest_1.expect)(node.type).toBe("choice");
        if (node.type !== "choice") {
            throw new Error("Node type is not choice");
        }
        (0, vitest_1.expect)(node.options).toHaveLength(2);
        (0, vitest_1.expect)(node.options[0].id).toBe("opt1");
        (0, vitest_1.expect)(node.options[0].text).toBe("Пойти налево");
        (0, vitest_1.expect)(node.options[0].nodes).toHaveLength(1);
        (0, vitest_1.expect)(node.options[0].nodes[0].type).toBe("action");
        (0, vitest_1.expect)(node.options[1].id).toBe("opt2");
        (0, vitest_1.expect)(node.options[1].nodes).toHaveLength(0);
    });
    (0, vitest_1.it)("exports expressions correctly", () => {
        const scene = {
            metadata: meta,
            source: { file: "test.md", line: 0, column: 0 },
            nodes: [
                {
                    id: "node3",
                    type: "action",
                    text: "Условное действие",
                    source: { file: "test.md", line: 25, column: 1 },
                    condition: {
                        type: "binary",
                        operator: ">=",
                        left: {
                            type: "variable_reference",
                            variable: "lanlir_control",
                        },
                        right: {
                            type: "literal",
                            value: 5,
                        },
                    },
                },
            ],
        };
        const exporter = new index_1.SceneExporter();
        const result = exporter.execute(scene);
        const condition = result.nodes[0].condition;
        if (!condition) {
            throw new Error("condition is not defined");
        }
        (0, vitest_1.expect)(condition.type).toBe("binary");
        if (condition.type !== "binary") {
            throw new Error("condition type is not binary");
        }
        (0, vitest_1.expect)(condition.operator).toBe(">=");
        (0, vitest_1.expect)(condition.left.type).toBe("variable_reference");
        if (condition.left.type !== "variable_reference") {
            throw new Error("Left condition type is not var ref");
        }
        (0, vitest_1.expect)(condition.left.variable).toBe("lanlir_control");
        (0, vitest_1.expect)(condition.right.type).toBe("literal");
        if (condition.right.type !== "literal") {
            throw new Error("Right condition type is not literal");
        }
        (0, vitest_1.expect)(condition.right.value).toBe(5);
    });
    (0, vitest_1.it)("exports effects and events", () => {
        const scene = {
            metadata: meta,
            source: { file: "test.md", line: 0, column: 0 },
            nodes: [
                {
                    id: "node4",
                    type: "dialogue",
                    character: "Керинато",
                    text: "Ты получил +1 контроль!",
                    source: { file: "test.md", line: 30, column: 1 },
                    effects: [
                        {
                            variable: "lanlir_control",
                            operator: "+=",
                            value: 1,
                        },
                    ],
                    events: [
                        {
                            id: "sfx_shoulder_clap",
                        },
                    ],
                },
            ],
        };
        const exporter = new index_1.SceneExporter();
        const result = exporter.execute(scene);
        const node = result.nodes[0];
        (0, vitest_1.expect)(node.effects).toHaveLength(1);
        (0, vitest_1.expect)(node.effects[0].variable).toBe("lanlir_control");
        (0, vitest_1.expect)(node.effects[0].operator).toBe("+=");
        (0, vitest_1.expect)(node.effects[0].value).toBe(1);
        (0, vitest_1.expect)(node.events).toHaveLength(1);
        (0, vitest_1.expect)(node.events[0].id).toBe("sfx_shoulder_clap");
        (0, vitest_1.expect)(node.events[0].arguments).toBeNull();
    });
    (0, vitest_1.it)("exports to JSON string", () => {
        const scene = {
            metadata: meta,
            source: { file: "test.md", line: 0, column: 0 },
            nodes: [],
        };
        const exporter = new index_1.SceneExporter();
        const json = exporter.exportToJson(scene);
        const parsed = JSON.parse(json);
        (0, vitest_1.expect)(parsed.metadata.id).toBe("test");
        (0, vitest_1.expect)(parsed.nodes).toEqual([]);
    });
});
//# sourceMappingURL=exporter.test.js.map