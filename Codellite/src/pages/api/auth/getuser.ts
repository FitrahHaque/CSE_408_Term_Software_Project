'user server'

import { firestore } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next"

type Data = {
    userDoc: any,
}
export default async function handler(req:NextApiRequest, res: NextApiResponse<Data>) {
    // console.log("getuser", req.method)
    if(req.method === 'POST') {
        // console.log("POST--------------------------------")
        const { uid } = JSON.parse(req.body);
        // const userDoc = "hey"
        const userDoc = await getCurrentUser(uid);
        console.log("getuser:",uid)
        res.status(200).json({ userDoc : userDoc });
    }
    res.status(500).send({ userDoc : null });
}

export async function getCurrentUser(uid:string) {
    const userRef = doc(firestore, "users", uid);
	const userDoc = await getDoc(userRef);
    return userDoc;
}