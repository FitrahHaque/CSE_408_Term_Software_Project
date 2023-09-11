import { Sample } from "./sample";

//local problem data
export type ProblemDesc = {
    id: string;
    title: string;
    problemStatement: string;
    samples: Sample[];
    constraints: string;
    order: number;
    boilerplateCode: string;
    
    difficulty: string;
};

export type DBProblem = {
    id: string;
    title: string;
    category: string;
    difficulty: string;
    order: number;
    likes: number;
    dislikes: number;
    videoId: string;
    link: string;
    deadline: string;
    admin: string;
};