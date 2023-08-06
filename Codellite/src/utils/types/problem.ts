import { Sample } from "./sample";

export type Problem = {
    id: string;
    title: string;
    problemStatement: string;
    samples: Sample[];
    constraints: string;
    order: number;
    boilerplateCode: string;
    onlineJudge: ((fn: any) => boolean) | string;
    starterFunctionName: string;
    difficulty: string;
};