'use server'

import { firestore } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { getCurrentUser } from "./auth/getuser";

type Data = {
    solvedProblems : string[],
}
export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
	if(req.method === 'POST') {
		const { uid } = JSON.parse(req.body);
		const data = await fetchSolvedProblems(uid);
		res.status(200).json({ solvedProblems: data });
	}
    res.status(500).send({solvedProblems:[]});
}

async function fetchSolvedProblems(uid:string) {
	console.log("solvedproblems:",uid)
	// let response = await fetch('/api/auth/getuser/getuser', {
	// 	method: 'POST',
	// 	body: JSON.stringify({
	// 		uid: uid,
	// 	})
	// });

	const userDoc = await getCurrentUser(uid);
	// console.log("solvedproblems response :",userDoc)
	
	const tmp: string[] = [];
	if (userDoc.exists()) {
		userDoc.data().solvedProblems.map((p:any) => {
			tmp.push(p as string);
		});
	}
	return tmp;
}