'use server'

import { firestore } from "@/firebase/firebase";
import getCurrentDateAndTime from "@/utils/functions/dateTime";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next"


type Data = {
   message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method !== 'POST') {
        return res.status(405).end(); // Method not allowed
    }
    const { uid, pid, sid } = JSON.parse(req.body);
    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, {
        pendingProblems: arrayUnion({ pid: pid, sid: sid}),
    })
    
    res.status(200).json({message: 'ok'});
}