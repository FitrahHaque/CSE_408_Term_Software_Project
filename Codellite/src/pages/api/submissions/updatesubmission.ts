'use server'

import { firestore } from "@/firebase/firebase";
import getCurrentDateAndTime from "@/utils/functions/dateTime";
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
    const { uid, pid, sid, status, checkedBy} = JSON.parse(req.body);
    console.log(uid, pid, sid, status, checkedBy)
    await setDoc(doc(firestore, "submissions", sid.toString()), {id: sid, pid: pid, uid: uid, status: status, createdAt: createdAt, checkedBy: checkedBy});
    if(status === 'pending') {
        await setDoc(doc(firestore, "pendingSubmissions", sid.toString()), {id: sid, pid: pid, uid: uid, status: status, createdAt: createdAt});
    }
    else if(status === 'solved') {
        await deleteDoc(doc(firestore, "pendingSubmissions", sid.toString()));
    }
    res.status(200).send({message: "ok"});
}