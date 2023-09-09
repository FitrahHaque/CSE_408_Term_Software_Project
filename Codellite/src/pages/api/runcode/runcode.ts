'use server'

import run_code_cpp from "@/judger/judger";
import { NextApiRequest, NextApiResponse } from "next";


type Data = {
    success: boolean;
    message: string;
}

export default async function handler(req: NextApiRequest,response: NextApiResponse<Data>) {
    // const {res, str} = await run_code_cpp('./src/submissions/','code', './src/submissions/input.txt','./src/submissions/output.txt');
    if(req.method === 'POST') {
        const { testCases, userCode } = JSON.parse(req.body);
        // console.log("testCases: ", testCases.length);
        // console.log("userCode: ", userCode);
        response.status(200).json({success : true, message: "RAN"})
    }
    response.status(200).send({success: false, message: "Test Case Failed"});
}