'use server'

import { firestore } from "@/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { NextApiResponse } from "next";
import { NextApiRequestQuery } from "next/dist/server/api-utils";

type Data = {
    
};

export default async function handler(req: NextApiRequestQuery,res: NextApiResponse<Data>) {
    if(req.method === 'POST') {
        console.log("POST request")
        const { pid } = JSON.parse(req.body);
        console.log("POST request: ", pid);
        await setDoc(doc(firestore,"problemId", pid), {id: pid});
        res.status(200).send({message:"ok"});
    }
    res.status(500).send({message:"not ok"});
}