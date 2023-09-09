'use server'

import run_code_cpp from "@/judger/judger";
import { NextApiRequest, NextApiResponse } from "next";

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');


type Data = {
    failedTestCaseIndex?: number;
    success: boolean;
    message: string;
}

export default async function handler(req: NextApiRequest, response: NextApiResponse<Data>) {
    if (req.method === 'POST') {
        const { uid, pid, testcases, code } = JSON.parse(req.body);
        const codeFileName = 'code.cpp';
        const codeDirectoryPath = `./src/submissions/${pid}/${uid}/`;
        const codeFileContent = code;
        console.log("code content:", code);
        let codeFilePath = await path.join(codeDirectoryPath, codeFileName);
        await fs.mkdir(codeDirectoryPath, { recursive: true }, (err: any) => {
            if (err) {
                console.error('Error creating directory:', err);
            } else {
                console.log('Directory created successfully:', codeDirectoryPath);
            }
        });
        await fs.writeFile(codeFilePath, codeFileContent, (err: any) => {
            if (err) {
                console.error('Error:', err);
            } else {
                console.log('File created successfully:');
            }
        });
        // for (let i = 0; i < testcases.length; i++) {
        //     const inputFileName = 'input.txt';
        //     const outputFileName = 'output.txt';
        //     const inputFileContent = testcases[i].inputText;
        //     const outputFileContent = testcases[i].outputText;
        //     let IOdirectoryPath = `./src/submissions/${pid}/${uid}/case-${i + 1}/`;
        //     await fs.mkdir(IOdirectoryPath, { recursive: true }, (err: any) => {
        //         if (err) {
        //             console.error('Error creating directory:', err);
        //         } else {
        //             console.log('Directory created successfully:', IOdirectoryPath);
        //         }
        //     });

        //     const inputFilePath = await path.join(IOdirectoryPath, inputFileName);
        //     await fs.writeFile(inputFilePath, inputFileContent, (err: any) => {
        //         if (err) {
        //             console.error('Error:', err);
        //         } else {
        //             console.log('File created successfully:');
        //         }
        //     });
        //     await fs.readFile(inputFilePath, 'utf8', (err: any, data: any) => {
        //         if (err) {
        //             console.error('Error reading file:', err);
        //         } else {
        //             console.log('input file:', data);
        //         }
        //     });

        //     const outputFilePath = await path.join(IOdirectoryPath, outputFileName);
        //     await fs.writeFile(outputFilePath, outputFileContent, (err: any) => {
        //         if (err) {
        //             console.error('Error:', err);
        //         } else {
        //             console.log('File created successfully:');
        //         }
        //     });
        //     await fs.readFile(outputFilePath, 'utf8', (err: any, data: any) => {
        //         if (err) {
        //             console.error('Error reading file:', err);
        //         } else {
        //             console.log('output file:', data);
        //         }
        //     });
        //     // const {res, str} = await run_code_cpp(codeDirectoryPath,'code', inputFilePath, outputFilePath);
        //     // if(res === false) {
        //         // clear(codeDirectoryPath);
        //     //     response.status(200).json({failedTestCaseIndex: i+1, success : false, message: str});
        //     // }
        // }
        // await clear(codeDirectoryPath);
        response.status(200).json({ success: true, message: "ok" })
    }
    response.status(200).send({ success: false, message: "Test Case Failed" });
}
// async function clear(directoryPath: string) {
//     await rimraf(directoryPath, (err: any) => {
//         if (err) {
//             console.error('Error deleting directory:', err);
//         } else {
//             console.log('Directory deleted successfully:', directoryPath);
//         }
//     });
// }