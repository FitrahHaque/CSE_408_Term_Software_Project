'use server'
import { firestore } from "@/firebase/firebase";
import { ProblemDesc } from "@/utils/types/problem";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
    problem: ProblemDesc | null,
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === 'POST') {
        const { id } = JSON.parse(req.body);
        const userRef = doc(firestore, "problemdesc", id);
        const userDoc = await getDoc(userRef);
        console.log("userDoc-> ",userDoc.data());
        const tmp:ProblemDesc = {...userDoc.data()} as ProblemDesc;
        res.status(200).json({problem: tmp});
    }
    res.status(500).send({problem:null});
}