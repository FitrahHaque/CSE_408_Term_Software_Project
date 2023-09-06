'user server'

import { firestore } from "@/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next"

type Data = {
    message: string,
}

export default async function handler(req:NextApiRequest, res:NextApiResponse<Data>) {
    if(req.method === "POST") {
        const { userData } = JSON.parse(req.body);
        await setNewUser(userData);
        res.status(200).json({message:"ok"});
    }   
}

async function setNewUser(userData:any) {
    await setDoc(doc(firestore, "users", userData.uid), userData);
}