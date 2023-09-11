'use server'

import { firestore } from "@/firebase/firebase";
import { Submission } from "@/utils/types/submission";
import { collection, getDocs, query } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  problems : Submission[],
}

export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
	if(req.method === 'GET') {
		const data = await fetchAllSubmissionProblems();
		res.status(200).json({ problems: data });
	}
	res.status(200).json({ problems: [] });
}

async function fetchAllSubmissionProblems() {
	console.log('fetch')
	const q = query(collection(firestore, "submissions"));
	const querySnapshot = await getDocs(q);
	const tmp: Submission[] = [];
	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		tmp.push({ id: doc.id, ...doc.data() } as Submission);
	});
	console.log("tmp->", tmp)
	return tmp;
}
