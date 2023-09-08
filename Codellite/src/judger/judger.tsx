import { cat } from "shelljs";

var child_process = require('child_process');
var shell = require('shelljs');
var fs = require('fs');
const { type } = require('os');
async function run_code_cpp(filepath:string,
filename:string, testFilePath:string, testOutputFilePathFull:string){
    try{
        const compile = await execute('g++ ${filepath}/${filename}.cpp -o ${filename}.exec');
        console.log("Compilation Successful");
    }catch(error){
        console.log("Complilation Error");
        let res:boolean = false;
        let str:string = error as string;
        return {res, str};
    }
    try{
        let pass = process.env.OS_PASS;
        const run = await execute(`echo ${pass} | sudo -S  ./src/judger/libjudger.so --max_cpu_time=100 --max_real_time=1000 --max_memory=130023424
        --exe_path=./src/judger/${filename}.exec --input_path=${testFilePath} --output_path=./src/judger/${filename}.out --error_path=./src/judger/error.out`);
        console.log("Runtime successfull");

        const result = JSON.parse(run);
       
        if(result.result == 0){
            let checkR = await execute(`./src/judger/compare.sh ${testOutputFilePathFull} ./src/judger/output.out`);
            console.log("checkR: ", checkR);
            if(checkR == 0){
                let res:boolean = true;
                let str:string = "Success";
                return {res, str};
            }
            else{
                let res:boolean = false;
                let str:string = "Wrong Answer";
                return {res, str};
            }
        }
        else{
            console.log("result.result: ", result.result);
            let res:boolean = false;
            let str:string = "result.result is not 0";
            return {res, str};
            
        }
    }catch(error){
        console.log("Runtime Error");
        let res:boolean = false;
        let str:string = error as string;
        return {res, str};
    }

}