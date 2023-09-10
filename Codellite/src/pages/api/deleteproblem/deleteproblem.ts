'use server'

import { firestore } from "@/firebase/firebase";
import { arrayUnion, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next"


type Data = {
    message: string;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === 'POST') {
        const { pid } = JSON.parse(req.body);
        await deleteDoc(doc(firestore, "problemdesc", pid));
        await deleteDoc(doc(firestore, "problems", pid));
        await deleteDoc(doc(firestore, "problemId", pid));
        res.status(200).send({message:'ok'});
    }
    res.status(200).send({message:'not ok'});
}