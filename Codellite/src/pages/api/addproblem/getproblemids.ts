'use server'

import { firestore } from "@/firebase/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { NextApiResponse } from "next";
import { NextApiRequestQuery } from "next/dist/server/api-utils";

type Data = {
    problemids: { id: string }[];
};

export default async function handler(req: NextApiRequestQuery, res: NextApiResponse<Data>) {
    const q = query(collection(firestore, "problemId"));
    const querySnapshot = await getDocs(q);
    const tmp: { id: string }[] = [];
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        tmp.push({ id: doc.data().id });
        // console.log("doc data :",doc.data());
    });
    console.log("tmp:", tmp)
    res.status(200).json({ problemids: tmp });
}