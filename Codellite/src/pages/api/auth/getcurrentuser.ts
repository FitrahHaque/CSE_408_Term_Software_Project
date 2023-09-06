'use server'

import { firestore } from "@/firebase/firebase";
import { DBProblem } from "@/utils/types/problem";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { getCurrentUserDoc } from "./getuser";

type Data = {
    userInfo : any,
}
export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
	if(req.method === 'POST') {
		const { uid } = JSON.parse(req.body);
		const data = await getUserInfo(uid);
        console.log(data);
		res.status(200).json({ userInfo: data });
	}
    res.status(500).send({userInfo:[]});
}

async function getUserInfo(uid:string) {
    const userDoc = await getCurrentUserDoc(uid);
    if(userDoc.exists()){
        console.log("userDoc exists")
        const tmp = userDoc.data();
        console.log(tmp);
        return tmp;
    }
    console.log("getcurrentuser: ",userDoc.data());
    return userDoc.data();
}