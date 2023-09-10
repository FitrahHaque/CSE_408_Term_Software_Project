'use server'

import { firestore } from "@/firebase/firebase";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next"


type Data = {
    messgae: string;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === 'POST') {
        const { pid, uid, sid } = JSON.parse(req.body);
        const userRef = doc(firestore, "users", uid);
        await updateDoc(userRef, {
            solvedProblems: arrayUnion(pid),
        });
        const userDoc = await getDoc(userRef);
        if(userDoc.exists()) {
            const data = userDoc.data();
            const updatedPendingProblems = data.pendingProblems.filter((item:any) => item.pid !== pid || item.sid !== sid)
            await updateDoc(userRef, {
                pendingProblems: updatedPendingProblems,
            })
        }
        res.status(200).send({messgae:'ok'});
    }
    res.status(200).send({messgae:'not ok'});
}