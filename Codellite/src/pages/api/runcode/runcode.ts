'use server'

import run_code_cpp from "@/judger/judger";
import { NextApiRequest, NextApiResponse } from "next";


type Data = {
    success: boolean;
    message: string;
}

export default async function handler(req: NextApiRequest,response: NextApiResponse<Data>) {
    const {res, str} = await run_code_cpp('./src/submissions/','code', './src/submissions/input.txt','./src/submissions/output.txt');
    console.log('res', res);
    console.log('str', str);
    response.status(200).json({success: res, message: str});
}