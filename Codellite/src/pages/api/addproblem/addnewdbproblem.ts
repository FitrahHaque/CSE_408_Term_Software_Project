'use server'

import { firestore } from "@/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { NextApiResponse } from "next";
import { NextApiRequestQuery } from "next/dist/server/api-utils";

type Data = {
    
};

export default async function handler(req: NextApiRequestQuery,res: NextApiResponse<Data>) {
    if(req.method === 'POST') {
        const { problem } = JSON.parse(req.body);
        await setDoc(doc(firestore,"problems",problem.id),problem);
        res.status(200).send({message:"ok"});
    }
    res.status(500).send({message:"not ok"});
}