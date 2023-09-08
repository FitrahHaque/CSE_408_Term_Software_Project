'use server'

import { firestore } from "@/firebase/firebase";
import { DBProblem } from "@/utils/types/problem"
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
    problem: DBProblem | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if(req.method === 'POST') {
        const { id } = JSON.parse(req.body);
        const userRef = doc(firestore, "problems", id);
        const userDoc = await getDoc(userRef);
        const tmp:DBProblem = {...userDoc.data()} as DBProblem;
        res.status(200).json({problem: tmp});
    }
    res.status(500).send({problem:null});
}