export type Submission = {
    id: string,
    pid: string,
    uid: string,
    status: string,
    createdAt: {
        year: number,
        month: number,
        hours: number,
        minute: number,
        second: number,
    },
    checkedBy: string,
    marks: number,
    code: string
}