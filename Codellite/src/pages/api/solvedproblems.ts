'use server'

import { firestore } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
    solvedProblems : string[],
}
export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
	if(req.method === 'POST') {
		const { user } = JSON.parse(req.body);
		const data = await fetchSolvedProblems(user);
		res.status(200).json({ solvedProblems: data });
	}
    res.status(500).send({solvedProblems:[]});
}

async function fetchSolvedProblems(user:any) {
	const userRef = doc(firestore, "users", user!.uid);
	const userDoc = await getDoc(userRef);
	const tmp: string[] = [];
	if (userDoc.exists()) {
		userDoc.data().solvedProblems.map((p:any) => {
			tmp.push(p as string);
		});
	}
	return tmp;
}