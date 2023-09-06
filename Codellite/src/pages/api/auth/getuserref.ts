'use server'

import { firestore } from "@/firebase/firebase";
import { DocumentData, DocumentReference, doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
// import { getCurrentUserRef } from "./getuser";
// import { getCurrentUserDoc } from "./auth/getuser";

type Data = {
    userRef : any
}
export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
	if(req.method === 'POST') {
		const { uid } = JSON.parse(req.body);
	// 	const data = doc(firestore, "users", uid);
	// // const userDoc = await getDoc(userRef);
        const data =  await getCurrentUserRef(uid)
        const userDoc = await getDoc(data);
        console.log("userDoc", userDoc.data())
	    res.status(200).json({ userRef : data});
	}
    res.status(500).send({userRef:null});
}

async function getCurrentUserRef(uid:string) {
    const userRef = doc(firestore, "users", uid);
    return userRef;
}