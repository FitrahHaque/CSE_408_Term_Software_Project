'use server'

import { firestore } from "@/firebase/firebase";
import getCurrentDateAndTime from "@/utils/functions/dateTime";
import { Submission } from "@/utils/types/submission";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

//add or update a submission in the 'submissions' and 'pendings' collections

type Data = {
    message: string;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method !== 'POST') {
        return res.status(405).end(); // Method not allowed
    }
    const createdAt = getCurrentDateAndTime();
    // const { uid, pid, sid, status, checkedBy, marks, code } = JSON.parse(req.body);
    // console.log(uid, pid, sid, status, checkedBy)
    const {submission} = JSON.parse(req.body);
    const newSubmission: Submission = {
        ...submission,
        createdAt: createdAt, 
    }
    // console.log(newSubmission)
    await setDoc(doc(firestore, "submissions", newSubmission.id.toString()), newSubmission);
    if(newSubmission.status === 'pending') {
        await setDoc(doc(firestore, "pendingSubmissions", newSubmission.id.toString()), newSubmission);
    }
    else if(newSubmission.status === 'solved') {
        await deleteDoc(doc(firestore, "pendingSubmissions", newSubmission.id.toString()));
    }
    res.status(200).send({message: "ok"});
}