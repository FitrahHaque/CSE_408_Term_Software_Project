'use server'

import { firestore } from "@/firebase/firebase";
import { DBProblem } from "@/utils/types/problem";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  problems : DBProblem[],
}

export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
	const data = await fetchAllProblems();
	res.status(200).json({ problems: data });
}

async function fetchAllProblems() {
	const q = query(collection(firestore, "problems"), orderBy("order", "asc"));
	const querySnapshot = await getDocs(q);
	const tmp: DBProblem[] = [];
	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		tmp.push({ id: doc.id, ...doc.data() } as DBProblem);
	});
	return tmp;
}
