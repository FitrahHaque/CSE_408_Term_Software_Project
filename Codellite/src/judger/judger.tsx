var child_process = require('child_process');
// var shell = require('shelljs');
// var fs = require('fs');
// const { type } = require('os');
// 
function execute1(command:string) {
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
function gccparser(error:string){
    let s = error.indexOf("./src", 0);
    s = error.indexOf("./src", s + 1);
    let multi_error = "";
    let ns = error.indexOf("./src", s + 1);
    while(1)
    {
      s = ns;
      //console.log(error.slice(s, s + 40));
      if(s == -1) 
          break;

      let l = error.indexOf(".cpp:", s) + 5;
      //console.log(error.slice(l, l + 20));
      ns = error.indexOf("./src", s + 1);
      if(error[l] == " ")
      {
          l = error.indexOf("‘", l);
          let r = error.indexOf("’", l + 1);
          let function_name = error.slice(l + 1, r);
          console.log(function_name);
          multi_error = multi_error.concat("in function ", function_name, "\n");
          continue;
      }
      
      let r = error.indexOf(":", l);
      let line_no = error.slice(l, r);
      
      l = error.indexOf("error:", r + 1) + 6;

      if(ns == -1)
          r = error.length;
      else
          r = ns;

      let error_message = error.slice(l, r);
      multi_error = multi_error.concat("in line ", line_no, "\n", error_message, "\n");
    }
    return multi_error;
}
function execute(command:string) {
   
      let res:string = "unassigned";
      try{
       child_process.execSync(command, function(error:any, standardOutput:any, standardError:any) {
        
        if (error) {
            console.log("insid child");
            console.log(error);
            res = error.toString();
            console.log(res);
        //   reject();
  
          return;
        }
  
        if (standardError) {
            console.log(standardError);
        //   reject(standardError);
            console.log("standard error");
          return;
        }
        // resolve(standardOutput);
      });
      console.log("successfully compiled");
      res = "success";

    }catch(exception){
        console.log("here i am ");
        console.log("clog ", exception.toString());
        return gccparser(exception.toString()).toString();
    }
    return res;
  }
const run_code_cpp = async (filepath:string,filename:string, testFilePathFull:string, testOutputFilePathFull:string) => {
    let compile:any = "not assigned yet";
    try{
        if(filepath.endsWith("/") === false){
          filepath = filepath + "/";
          console.log("filepath: ", filepath);
        }
        compile = execute(`g++ ${filepath}${filename}.cpp -o ./src/judger/${filename}.exec`);
        if(compile != "success"){
            console.log(compile);
            console.log("Complilation Error");
            const res:boolean = false;
            const str:string = compile.toString();
            //console.log("Error: ", str);
            return {res, str};
        }
        else{
            console.log("Compilation Successful");
        }
    }catch(error){
        //console.log(error)
        console.log("Complilation Error here");
        const res:boolean = false;
        const str:string = compile;
        //console.log("Error: ", str);
        return {res, str};
    }
    try{
        let pass = process.env.OS_PASS;
        
        const run = await execute1(`echo ${pass} | sudo -S  ./src/judger/libjudger.so --max_cpu_time=100 --max_real_time=1000 --max_memory=130023424 --exe_path=./src/judger/${filename}.exec --input_path=${testFilePathFull} --output_path=./src/judger/${filename}.out --error_path=./src/judger/error.out`);
        console.log("Runtime successfull");
        console.log("run1 " , run);
        const result = JSON.parse(run as string);
       
        if(result.result === 0){
            console.log(`./src/judger/compare.sh ${testOutputFilePathFull} ./src/judger/${filename}.out`);
            let checkR = await execute1(`./src/judger/compare.sh ${testOutputFilePathFull} ./src/judger/${filename}.out`);
            console.log("checkR: ", checkR);
            if(parseInt(checkR as string) === 1){
                console.log("here");
                const res:boolean = true;
                const str:string = "Success";
                return {res, str};
            }
            else{
                const res:boolean = false;
                const str:string = "Wrong Answer";
                return {res, str};
            }
        }
        else{
            console.log("result.result: ", result.result);
            const res:boolean = false;
            const str:string = "result.result is not 0";
            return {res, str};
            
        }
    }catch(error){
        console.log("Runtime Error");
        const res:boolean = false;
        const str:string = error as string;
        return {res, str};
    }
}

export default run_code_cpp;