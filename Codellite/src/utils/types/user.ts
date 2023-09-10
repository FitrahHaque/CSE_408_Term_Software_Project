export type User = {
    uid: string,
    role: "admin" | "student",
    email: string | null,
    displayName: string,
    createdAt: number,
    updatedAt: number,
    likedProblems: string[],
    dislikedProblems: string[],
    starredProblems: string[],
    solvedProblems: {pid: string, sid: string, createdAt: number}[],
    pendingProblems: {pid:string, sid: string, createdAt: number}[],
}