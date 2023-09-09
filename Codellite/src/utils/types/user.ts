export type User = {
    uid: string,
    email: string | null,
    displayName: string,
    createdAt: number,
    updatedAt: number,
    likedProblems: string[],
    dislikedProblems: string[],
    solvedProblems: string[],
    starredProblems: string[],
    pendingProblems: string[],
    unsolvedProblems: string[],
    role: "admin" | "student",
}