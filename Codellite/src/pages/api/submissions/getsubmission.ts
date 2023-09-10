'use server'

import { firestore } from "@/firebase/firebase";
import getCurrentDateAndTime from "@/utils/functions/dateTime";
import { Submission } from "@/utils/types/submission";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";


type Data = {
    problem: Submission | null;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method !== 'POST') {
        return res.status(405).end(); // Method not allowed
    }
    const { id } = JSON.parse(req.body);
    // console.log("id->", id)
    const userRef = doc(firestore, "submissions", id.toString());
    const userDoc = await getDoc(userRef);
    // console.log(userDoc.data())
    const tmp:Submission = {...userDoc.data()} as Submission;
    res.status(200).json({problem: tmp});
}