'user server'

import { firestore } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next"

type Data = {
    userDoc: any,
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    // console.log("getuser", req.method)
    if (req.method === 'POST') {
        const { uid } = JSON.parse(req.body);
        const userDoc = await getCurrentUserDoc(uid);
        console.log("getuser handler userDoc", userDoc.data()!.uid)
        res.status(200).json({ userDoc: userDoc });
    }
    res.status(500).json({ userDoc: null });
}

export async function getCurrentUserDoc(uid: string) {
    const userRef = doc(firestore, "users", uid);
    const userDoc = await getDoc(userRef);
    console.log(userDoc.data());
    return userDoc;
}

