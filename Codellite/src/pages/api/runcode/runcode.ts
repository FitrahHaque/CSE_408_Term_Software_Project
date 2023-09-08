'use server'

import run_code_cpp from "@/judger/judger";
import { NextApiRequest, NextApiResponse } from "next";


type Data = {
    success: boolean;
    message: string;
}

export default async function handler(req: NextApiRequest,res: NextApiResponse<Data>) {
    const {suc, mes} = await run_code_cpp('./src/submissions/','code', './src/submissions/input.txt','./src/submissions/output.txt');
    console.log('suc', suc);
    console.log('mes', mes);
    res.status(200).json({success: suc, message: mes});
}