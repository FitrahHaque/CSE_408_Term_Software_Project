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
            solvedProblems: arrayUnion({ pid: pid, sid: sid}),
        });
        const userDoc = await getDoc(userRef);
        if(userDoc.exists()) {
            const data = userDoc.data();
            console.log("pendingProblems:", data.pendingProblems);
            const updatedPendingProblems = data.pendingProblems.filter((item:any) => item.pid !== pid || item.sid !== parseInt(sid))
            await updateDoc(userRef, {
                pendingProblems: updatedPendingProblems,
            })
            console.log("Updated pendingProblems:", data.pendingProblems);
        }
        res.status(200).send({messgae:'ok'});
    }
    res.status(200).send({messgae:'not ok'});
}