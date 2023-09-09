var child_process = require('child_process');
// var shell = require('shelljs');
// var fs = require('fs');
// const { type } = require('os');
// 
function execute(command:string) {
    /**
     * @param {Function} resolve A function that resolves the promise
     * @param {Function} reject A function that fails the promise
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
     */
    return new Promise(function(resolve, reject) {
      /**
       * @param {Error} error An error triggered during the execution of the childProcess.exec command
       * @param {string|Buffer} standardOutput The result of the shell command execution
       * @param {string|Buffer} standardError The error resulting of the shell command execution
       * @see https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
       */
      // console.log(command);
      child_process.exec(command, function(error:any, standardOutput:any, standardError:any) {
        if (error) {
        console.log(error);
          reject();
  
          return;
        }
  
        if (standardError) {
           console.log(standardError);
          reject(standardError);
  
          return;
        }
  
        resolve(standardOutput);
      });
    });
  }

const run_code_cpp = async function (filepath:string,
filename:string, testFilePathFull:string, testOutputFilePathFull:string){
    try{
        const compile = await execute(`g++ ${filepath}/${filename}.cpp -o ./src/judger/${filename}.exec`);
        console.log("Compilation Successful");
    }catch(error){
        console.log(error)
        console.log("Complilation Error");
        const res:boolean = false;
        const str:string = error as string;
        console.log("Error: ", str);
        return {res, str};
    }
    try{
        let pass = process.env.OS_PASS;
        
        const run = await execute(`echo ${pass} | sudo -S  ./src/judger/libjudger.so --max_cpu_time=100 --max_real_time=1000 --max_memory=130023424 --exe_path=./src/judger/${filename}.exec --input_path=${testFilePathFull} --output_path=./src/judger/${filename}.out --error_path=./src/judger/error.out`);
        console.log("Runtime successfull");

        const result = JSON.parse(run as string);
       
        if(result.result === 0){
            console.log(`./src/judger/compare.sh ${testOutputFilePathFull} ./src/judger/${filename}.out`);
            let checkR = await execute(`./src/judger/compare.sh ${testOutputFilePathFull} ./src/judger/${filename}.out`);
            console.log("checkR: ", checkR);
            if(parseInt(checkR as string) === 1){
                console.log("here");
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

export default run_code_cpp;