'use server'

import { firestore } from "@/firebase/firebase";
import { FirebaseApp } from "firebase/app";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
    solvedProblems : string[],
}
export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
    const { user } = JSON.parse(req.body);
    console.log("user: ", user)
	const data = await fetchSolvedProblems(user);
	res.status(200).json({ solvedProblems: data });
}

async function fetchSolvedProblems(user:any) {
	// const [user] = useAuthState(auth);
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