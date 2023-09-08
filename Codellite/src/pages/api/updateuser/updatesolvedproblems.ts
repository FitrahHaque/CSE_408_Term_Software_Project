'use server'

import { firestore } from "@/firebase/firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next"


type Data = {
    messgae: string;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === 'POST') {
        const { pid, uid } = JSON.parse(req.body);
        const userRef = doc(firestore, "users", uid);
        await updateDoc(userRef, {
            solvedProblems: arrayUnion(pid),
        });
        res.status(200).send({messgae:'ok'});
    }
    res.status(200).send({messgae:'not ok'});
}