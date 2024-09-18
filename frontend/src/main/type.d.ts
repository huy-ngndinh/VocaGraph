import { ForceGraphMethods, GraphData, LinkObject, NodeObject } from "react-force-graph-2d";
export type dictionary = [
    {
        license: {
            name: string;
            url: string;
        };
        sourceUrls: string[];
        word: string;
        phonetic: string;
        phonetics: [
            {
                text: string;
                audio?: string;
            }
        ];
        origin: string;
        meanings: [
            {
                partOfSpeech: string;
                definitions: [
                    {
                        definition: string;
                        example: string;
                        synonyms: string[];
                        antonyms: string[];
                    }
                ];
            }
        ];
    }
];
export type GrapDataProps = GraphData<NodeObject<NodeObject<string & {
    id: string;
    name?: string | undefined;
    val?: number | undefined;
} & {
    id: string;
    name?: string | undefined;
    val?: number | undefined;
}>>, LinkObject<NodeObject<{
    id: string;
    name?: string | undefined;
    val?: number | undefined;
}>, LinkObject<NodeObject<{
    id: string;
    name?: string | undefined;
    val?: number | undefined;
}>, {
    source: string;
    target: string;
}>>>;
export type ForceGraphRefProps = ForceGraphMethods<NodeObject<string & {
    id: string;
    name?: string | undefined;
    val?: number | undefined;
} & {
    id: string;
    name?: string | undefined;
    val?: number | undefined;
}>, LinkObject<{
    id: string;
    name?: string | undefined;
    val?: number | undefined;
}, {
    source: string;
    target: string;
}>>;
export type LinkProps = LinkObject<NodeObject<{
    id: string;
    name?: string | undefined;
    val?: number | undefined;
}>, LinkObject<{
    id: string;
    name?: string | undefined;
    val?: number | undefined;
}, {
    source: string;
    target: string;
}>>;
export type NodeProps = NodeObject<NodeObject<string & {
    id: string;
    name?: string | undefined;
    val?: number | undefined;
} & {
    id: string;
    name?: string | undefined;
    val?: number | undefined;
}>>;
